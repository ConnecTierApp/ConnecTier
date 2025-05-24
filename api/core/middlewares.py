import jwt
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            request.user = None
            return
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            User = get_user_model()
            user = User.objects.get(id=user_id)
            request.user = user
        except Exception:
            request.user = None
