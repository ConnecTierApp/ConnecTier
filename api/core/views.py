from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
import json
from core.models import UserProfile, Organization
from django.contrib.auth import authenticate
import jwt
from django.conf import settings
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
            org_name = data.get('organization_name', None)
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)

            # Create organization
            if org_name:
                organization = Organization.objects.create(name=org_name)
            else:
                organization = Organization.objects.create(name=f"Org for {email}")

            # Create user
            user = UserProfile.objects.create_user(email=email, password=password, organization=organization)
            logger.info(f"User {email} registered successfully with organization {organization.name}")
        except Exception as e:
            logger.error(f"Error in RegisterView: {str(e)}")
            
        return JsonResponse({}, status=202)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)
            user = authenticate(request, email=email, password=password)
            if user is None:
                return JsonResponse({'error': 'Invalid credentials.'}, status=401)
            payload = {
                'user_id': str(user.id),
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(days=7),
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            response = JsonResponse({'success': True, 'token': token})
            response.set_cookie(
                key='jwt',
                value=token,
                httponly=True,
                samesite='Lax',
                secure=False  # Set to True in production with HTTPS
            )
            return response
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
