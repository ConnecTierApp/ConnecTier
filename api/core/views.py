from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
import json
from core.models import UserProfile, Organization, Entity, Context, Document
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

@method_decorator(csrf_exempt, name='dispatch')
class EntityCreateView(View):
    @login_required
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        name = data.get('name')
        entity_type = data.get('type')
        if not isinstance(name, str) or not (1 <= len(name) <= 255):
            return JsonResponse({'error': 'name must be a non-empty string up to 255 characters.'}, status=400)
        if not isinstance(entity_type, str) or not (1 <= len(entity_type) <= 64):
            return JsonResponse({'error': 'type must be a non-empty string up to 64 characters.'}, status=400)
        
        # Validate that the entity type is one of the allowed choices
        allowed_types = [choice[0] for choice in Entity.EntityType.choices]
        if entity_type not in allowed_types:
            return JsonResponse({'error': f'type must be one of {allowed_types}.'}, status=400)
        
        entity = Entity.objects.create(
            name=name,
            type=entity_type,
            organization=user.organization
        )
        return JsonResponse({
            'success': True,
            'entity_id': str(entity.id),
            'name': entity.name,
            'type': entity.type,
            'organization_id': str(entity.organization.id)
        }, status=201)

@method_decorator(csrf_exempt, name='dispatch')
class EntityListView(View):
    @login_required
    def get(self, request, *args, **kwargs):
        user = request.user
        entities = Entity.objects.filter(organization=user.organization)

        # Filtering by created_after
        created_after = request.GET.get('created_after')
        if created_after:
            try:
                from django.utils.dateparse import parse_datetime
                created_after_dt = parse_datetime(created_after)
                if created_after_dt:
                    entities = entities.filter(created_at__gt=created_after_dt)
            except Exception:
                pass  # Ignore invalid date

        # Filtering by type
        entity_type = request.GET.get('type')
        if entity_type in dict(Entity.EntityType.choices):
            entities = entities.filter(type=entity_type)

        # Filtering by name (case-insensitive contains)
        name = request.GET.get('name', '')
        if name:
            entities = entities.filter(name__icontains=name)

        results = [
            {
                'entity_id': str(e.id),
                'name': e.name,
                'type': e.type,
                'organization_id': str(e.organization.id),
                'created_at': e.created_at.isoformat(),
            }
            for e in entities.order_by('-created_at')
        ]
        return JsonResponse({'results': results}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class ContextCreateView(View):
    @login_required
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        name = data.get('name')
        prompt = data.get('prompt')
        entity_ids = data.get('entity_ids', [])
        if not isinstance(name, str) or not name:
            return JsonResponse({'error': 'name is required.'}, status=400)
        if not isinstance(prompt, str) or not prompt:
            return JsonResponse({'error': 'prompt is required.'}, status=400)
        if not isinstance(entity_ids, list) or not entity_ids:
            return JsonResponse({'error': 'entity_ids must be a non-empty list.'}, status=400)
        # Fetch entities and check organization
        entities = list(Entity.objects.filter(id__in=entity_ids, organization=user.organization))
        if len(entities) != len(entity_ids):
            return JsonResponse({'error': 'Some of the provided entities were not found in our records.'}, status=404)
        # Check at least 1 of each type
        types = set(e.type for e in entities)
        if 'startup' not in types or 'mentor' not in types:
            return JsonResponse({'error': 'At least one entity of each type (startup and mentor) is required.'}, status=400)
        context = Context.objects.create(name=name, prompt=prompt)
        context.entities.set(entities)
        return JsonResponse({'success': True, 'context_id': str(context.id)}, status=201)

@method_decorator(csrf_exempt, name='dispatch')
class ContextListView(View):
    @login_required
    def get(self, request, *args, **kwargs):
        user = request.user
        contexts = Context.objects.filter(entities__organization=user.organization).distinct().order_by('-created_at')
        results = [
            {
                'name': c.name,
                'created_at': c.created_at.isoformat(),
            }
            for c in contexts
        ]
        return JsonResponse({'results': results}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class ContextDetailView(View):
    @login_required
    def get(self, request, context_id, *args, **kwargs):
        user = request.user
        context = Context.objects.filter(id=context_id, entities__organization=user.organization).distinct().first()
        if not context:
            return JsonResponse({'error': 'Not found.'}, status=404)
        return JsonResponse({
            'context_id': str(context.id),
            'name': context.name,
            'prompt': context.prompt,
            'created_at': context.created_at.isoformat(),
            'entities': [
                {
                    'entity_id': str(e.id),
                    'name': e.name,
                    'type': e.type,
                } for e in context.entities.all()
            ]
        }, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class EntityDetailView(View):
    @login_required
    def get(self, request, entity_id, *args, **kwargs):
        user = request.user
        entity = Entity.objects.filter(id=entity_id, organization=user.organization).first()
        if not entity:
            return JsonResponse({'error': 'Not found.'}, status=404)
        return JsonResponse({
            'entity_id': str(entity.id),
            'name': entity.name,
            'type': entity.type,
            'organization_id': str(entity.organization.id),
            'document_ids': [str(doc.id) for doc in entity.documents.all()],
            'created_at': entity.created_at.isoformat(),
        }, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class ProfileView(View):
    @login_required
    def get(self, request, *args, **kwargs):
        user = request.user
        return JsonResponse({
            'user_id': str(user.id),
            'email': user.email,
            'organization_id': str(user.organization.id) if user.organization else None,
            'organization_name': user.organization.name if user.organization else None,
            'created_at': user.created_at.isoformat() if hasattr(user, 'created_at') else None,
        }, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class DocumentCreateView(View):
    @login_required
    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body.decode('utf-8'))
        entity_id = data.get('entity_id')
        doc_type = data.get('type')
        content = data.get('content')
        if not entity_id or not isinstance(entity_id, str):
            return JsonResponse({'error': 'entity_id is required.'}, status=400)
        if doc_type != 'transcript':
            return JsonResponse({'error': 'Only type "transcript" is allowed.'}, status=400)
        if not isinstance(content, str) or not content:
            return JsonResponse({'error': 'content is required.'}, status=400)
        entity = Entity.objects.filter(id=entity_id, organization=user.organization).first()
        if not entity:
            return JsonResponse({'error': 'Entity not found or not in your organization.'}, status=404)
        document = Document.objects.create(entity=entity, type=doc_type, content=content)
        return JsonResponse({
            'success': True,
            'document_id': str(document.id),
            'entity_id': str(entity.id),
            'type': document.type,
            'content': document.content,
            'created_at': document.created_at.isoformat(),
        }, status=201)

@method_decorator(csrf_exempt, name='dispatch')
class DocumentDetailView(View):
    @login_required
    def get(self, request, document_id, *args, **kwargs):
        user = request.user
        document = Document.objects.filter(id=document_id, entity__organization=user.organization).first()
        if not document:
            return JsonResponse({'error': 'Not found.'}, status=404)
        return JsonResponse({
            'document_id': str(document.id),
            'entity_id': str(document.entity.id),
            'type': document.type,
            'content': document.content,
            'created_at': document.created_at.isoformat(),
        }, status=200)
