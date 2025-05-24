from celery import shared_task
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


@shared_task
def crewai_hello_task(text: str, group_name: str):
    channel_layer = get_channel_layer()
    # This will use CrewAI
    async_to_sync(channel_layer.group_send)(group_name, {"type": "stream_message", "message": result.raw, "status": "done"})
