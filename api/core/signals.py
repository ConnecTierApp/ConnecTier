from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import StatusUpdate
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=StatusUpdate)
def send_status_update_to_channel(sender, instance, created, **kwargs):
    if created:
        # Use task_id as group name, or customize as needed
        group_name = f"task_{instance.task_id}"
        channel_layer = get_channel_layer()
        message = {
            "type": "context_update_message",
            "status": "info",
            "message": instance.status_data,
            "task_id": instance.task_id,
            "created_at": instance.created_at.isoformat(),
        }
        try:
            async_to_sync(channel_layer.group_send)(group_name, message)
            logger.info(f"Sent status update to group {group_name}: {message}")
        except Exception as e:
            logger.error(f"Failed to send status update to group {group_name}: {e}")
