import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from django.conf import settings
from core.models import Context, Entity  # Import models for org check
from django.db.models import Q
import uuid

class ContextConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get context_id from URL
        context_id = self.scope['url_route']['kwargs'].get('context_id')
        user = self.scope.get('user')
        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return
        # Try to find the context and check org
        try:
            # Get the context and prefetch entities and their organizations
            context = await async_to_sync(Context.objects.prefetch_related('entities').get)(id=context_id)
            # Get all organizations for entities in this context
            entity_org_ids = set()
            for entity in context.entities.all():
                entity_org_ids.add(str(entity.organization_id))
            # User must own the org of all entities (or at least one, depending on your policy)
            if str(user.organization_id) not in entity_org_ids:
                await self.close(code=4003)
                return
        except Context.DoesNotExist:
            await self.close(code=4040)
            return
        except Exception as e:
            await self.close(code=4000)
            return
        # Generate a safe, unique group name for this connection
        self.group_name = f"context_{context_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        text = data.get("text", "")
        # Send to celery task (fire and forget)
        await self.send(text_data=json.dumps({"status": "starting", "message": f"Received: {text[:10]}..."}))

    async def stream_message(self, event):
        # Called by celery worker through channel layer
        await self.send(text_data=json.dumps({"status": event["status"], "message": event["message"]}))
