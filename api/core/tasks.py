import json

from django.conf import settings
from celery import shared_task
from mistralai import Mistral
from .models import Context, Entity, Match
from channels.layers import get_channel_layer
import logging
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)


SYSTEM_PROMPT_MATCH = """Your task is to match Mentors and Startups. This is part of an accelerator program in which we need to pair startups with the right mentors to set them up for success.

You're going to receive the transcript of an interview with the mentor and also a transcript with the interview with startup.

Please make sure you follow the following format for your response:
```
{
   "score": "poor" | "fair" | "good" | "excellent", # based on how good a match the mentor and the startup are: poor < fair < good < excellent
   "reasoning": "excerpt of why the value of match was chosen", # provide a brief justification of why is a good match, no more than 20 words
}
```"""


@shared_task
def match_entities(context_id: str):
    # send message using context_update_message group send
    group_name = f"context_{context_id}"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(group_name, {"type": "context_update_message", "status": "info", "message": "Matching entities..."})


    context = Context.objects.get(id=context_id)
    context_by_type = {}
    for entity in context.entities.all():
        if entity.type not in context_by_type:
            context_by_type[entity.type] = []
        context_by_type[entity.type].append(entity)
    
    assert "mentor" in context_by_type and "startup" in context_by_type, "Context must have exactly two entity types (mentor and startup)"
    
    mentors = context_by_type["mentor"]
    startups = context_by_type["startup"]
    assert len(mentors) > 0 and len(startups) > 0, "Context must have at least one mentor and one startup"
    
    for mentor in mentors:
        for startup in startups:
            # Call the matching function with the mentor and startup
            match_two_entities.delay(str(context.id), str(mentor.id), str(startup.id))
    
def parse_response_json(content: str):
    json_attempt = ""
    start = False
    for c in content:
        if c == '{':
            start = True
        if start:
            json_attempt += c
        if c == '}':
            break
        
    return json.loads(json_attempt.strip().replace('\n', '').replace('\t', ''))
    
from mistralai.models.sdkerror import SDKError
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=5)
def match_two_entities(self, context_id: str, mentor_id: str, startup_id: str):
    mentor = Entity.objects.get(id=mentor_id)
    startup_id = Entity.objects.get(id=startup_id)
    context = Context.objects.get(id=context_id)

    channel_layer = get_channel_layer()
    group_name = f"context_{context_id}"
    async_to_sync(channel_layer.group_send)(group_name, {"type": "context_update_message", "status": "info", "message": f"Testing match between mentor {mentor.name} and startup {startup_id.name}"})
    
    if Match.objects.filter(
        mentor=mentor,
        startup=startup_id,
        context=context
    ).exists():
        logger.info(f"Match already exists for mentor {mentor.name} and startup {startup_id.name} in context {context.name}")
        return

    try:
        with Mistral(api_key=settings.MISTRAL_API_KEY) as mistral:
            response = mistral.chat.complete(
                model="mistral-medium-2505",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT_MATCH},
                    {"role": "user", "content": f"Mentor: {mentor.name}\nTranscript: `{mentor.documents.first().content}`\n\nStartup: {startup_id.name}\nTranscript: `{startup_id.documents.first().content}`"}
                ],
                max_tokens=100,
                temperature=0.2,
            )
    except SDKError as exc:
        logger.error(
            f"SDKError occurred in match_two_entities: status_code={getattr(exc, 'status_code', None)}, "
            f"message={getattr(exc, 'message', str(exc))}, body={getattr(exc, 'body', None)}"
        )
        if getattr(exc, "status_code", None) == 429:
            delay = min(2 ** self.request.retries, 60)
            logger.warning(f"Rate limit hit. Retrying in {delay}s (attempt {self.request.retries + 1})")
            raise self.retry(exc=exc, countdown=delay)
        else:
            import traceback
            logger.error("Unexpected SDKError traceback:\n" + traceback.format_exc())
            raise
    
    response_content = response.choices[0].message.content
    parsed_response = parse_response_json(response_content)
    score = parsed_response["score"]
    reasoning = parsed_response["reasoning"]
    match = Match.objects.create(
        context=context,
        mentor=mentor,
        startup=startup_id,
        score=score,
        reasoning=reasoning
    )
    async_to_sync(channel_layer.group_send)(group_name, {"type": "context_update_message", "status": "info", "message": f"Match between mentor {mentor.name} and startup {startup_id.name} created with score {score}. Reason: \n{reasoning}", "match_id": str(match.id)})
