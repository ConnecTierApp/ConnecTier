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
from functools import wraps

logger = logging.getLogger(__name__)

def login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return JsonResponse({'error': 'Authentication required.'}, status=401)
        return view_func(self, request, *args, **kwargs)
    return _wrapped_view

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
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required.'}, status=400)
        user = authenticate(request, email=email, password=password)
        if user is None:
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)
        user.last_login = datetime.utcnow()
        user.save()
        expiration_time = datetime.utcnow() + timedelta(days=7)  # Token valid for 7 days
        payload = {
            'user_id': str(user.id),
            'email': user.email,
            'exp': expiration_time,
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response = JsonResponse({'success': True, 'token': token})
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            samesite='Lax',
            expires=expiration_time,
            secure=(not settings.DEBUG),
        )
        return response

@method_decorator(csrf_exempt, name='dispatch')
class OrganizationUpdateView(View):
    @login_required
    def put(self, request, org_id, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        new_name = data.get('organization_name')
        if not new_name:
            return JsonResponse({'error': 'organization_name is required.'}, status=400)
        if len(new_name) > 255:
            return JsonResponse({'error': 'organization_name must be 255 characters or less.'}, status=400)
        # Only allow update if user belongs to the org
        if str(user.organization.id) != org_id:
            return JsonResponse({'error': 'Not found.'}, status=404)
        org = user.organization
        org.name = new_name
        org.save()
        return JsonResponse({'success': True, 'organization_id': str(org.id), 'organization_name': org.name})

