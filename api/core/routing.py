from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"^ws/context/(?P<context_id>[0-9a-f\-]+)/$", consumers.ContextConsumer.as_asgi()),
]
