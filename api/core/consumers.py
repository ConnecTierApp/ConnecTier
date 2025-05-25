import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from core.models import Context  # Import models for org check

logger = logging.getLogger(__name__)

class ContextConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        context_id = self.scope['url_route']['kwargs'].get('context_id')
        user = self.scope.get('user')
        logger.error(f"[WS] User {user} connecting to context {context_id}")

        if not user or not user.is_authenticated:
            logger.warning("[WS] User not authenticated, closing with code 4001")
            await self.close(code=4001)
            return
        # Try to find the context and check org
        try:
            user_org = await sync_to_async(lambda: user.organization)()
            user_org_id = str(user_org.id)
            context = await sync_to_async(Context.objects.prefetch_related('organization').get)(id=context_id)
            context_org = await sync_to_async(lambda: context.organization)()
            context_org_id = str(context_org.id) if context_org else None
            if not user_org or not context_org_id or user_org_id != context_org_id:
                logger.warning(f"[WS] User org mismatch: user.org={user.organization.id}, context.org={context_org_id}. Closing with 4003.")
                await self.close(code=4003)
                return
        except Context.DoesNotExist:
            logger.error(f"[WS] Context with id={context_id} does not exist. Closing with 4040.")
            await self.close(code=4040)
            return
        except Exception as e:
            logger.exception(f"[WS] Exception while fetching context: {e}. Closing with 4000.")
            await self.close(code=4000)
            return
        # Generate a safe, unique group name for this connection
        self.group_name = f"context_{context_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        group_name = getattr(self, 'group_name', None)
        if group_name is not None:
            await self.channel_layer.group_discard(group_name, self.channel_name)
            logger.info(f"[WS] Disconnected channel {self.channel_name} from group {group_name}")
        else:
            logger.warning(f"[WS] disconnect() called but self.group_name is not set! Channel: {self.channel_name}")


    async def context_update_message(self, event):
        """
        Used to send messages about any updates related to the context. 

        event is a dict.

        Event should include status, message, type, and
        potentially match_id if the event is related to a match.
        """
        logger.error(f"[WS] Sending event: {event}")
        await self.send(text_data=json.dumps(event))
