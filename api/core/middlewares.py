import jwt
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
import logging
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            logger.info("No JWT token found in cookies.")
            return

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        User = get_user_model()
        user = User.objects.get(id=user_id)
        request.user = user

@database_sync_to_async
def get_user(user_id):
    try:
        User = get_user_model()
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class AsgiJWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # If the user is already authenticated (e.g. via session), don't override
        if "user" in scope and scope["user"].is_authenticated:
            return await self.inner(scope, receive, send)

        headers = dict(scope["headers"])  # lower-case bytes
        cookies = headers.get(b'cookie', b'').decode()
        jwt_token = None

        for cookie in cookies.split(';'):
            if cookie.strip().startswith("jwt="):
                jwt_token = cookie.strip()[4:]
                break

        if jwt_token:
            try:
                payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                scope["user"] = await get_user(user_id)
            except jwt.PyJWTError:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)