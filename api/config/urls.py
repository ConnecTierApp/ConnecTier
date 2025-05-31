"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from core.views import RegisterView, LoginView, OrganizationUpdateView, EntityCreateView, EntityListView, ContextCreateView, ContextListView, ContextDetailView, EntityDetailView, EntityTranscribeView, ProfileView, DocumentCreateView, DocumentDetailView, ContextMatchesListView, ContextStatusUpdatesListView
from django.http import HttpResponse
from rest_framework import routers
from matching.views import TenantViewSet, EntityTypeViewSet, ContextViewSet, EntityViewSet, DocumentViewSet, ChunkViewSet, MatchViewSet, StatusUpdateViewSet, FeedbackViewSet

# Create DRF router for matching app
router = routers.DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'entity-types', EntityTypeViewSet)
router.register(r'contexts-api', ContextViewSet)
router.register(r'entities-api', EntityViewSet)
router.register(r'documents-api', DocumentViewSet)
router.register(r'chunks', ChunkViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'status-updates', StatusUpdateViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('', lambda request: HttpResponse("OK", status=200)),
    path('health/', lambda request: HttpResponse("OK", status=200)),
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('organization/<str:org_id>', OrganizationUpdateView.as_view(), name='organization_update'),
    path('entity/', EntityCreateView.as_view(), name='entity_create'),
    path('entities/', EntityListView.as_view(), name='entity_list'),
    path('context/', ContextCreateView.as_view(), name='context_create'),
    path('contexts/', ContextListView.as_view(), name='context_list'),
    path('context/<uuid:context_id>', ContextDetailView.as_view(), name='context_detail'),
    path('contexts/<uuid:context_id>/matches/', ContextMatchesListView.as_view(), name='context_matches_list'),
    path('contexts/<uuid:context_id>/status-updates/', ContextStatusUpdatesListView.as_view(), name='context_status_updates_list'),
    path('entity/<uuid:entity_id>', EntityDetailView.as_view(), name='entity_detail'),
    path('entity/<uuid:entity_id>/transcribe/', EntityTranscribeView.as_view(), name='entity_transcribe'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('document/', DocumentCreateView.as_view(), name='document_create'),
    path('document/<uuid:document_id>', DocumentDetailView.as_view(), name='document_detail'),
    
    # DRF router for the matching app
    path('api/', include(router.urls)),
]
