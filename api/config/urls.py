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
from django.urls import path
from core.views import RegisterView, LoginView, OrganizationUpdateView, EntityCreateView, EntityListView, ContextCreateView, ContextListView, ContextDetailView, EntityDetailView, ProfileView, DocumentCreateView, DocumentDetailView
from django.http import HttpResponse

urlpatterns = [
    path('', lambda request: HttpResponse("OK", status=200)),
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('organization/<str:org_id>', OrganizationUpdateView.as_view(), name='organization_update'),
    path('entity/', EntityCreateView.as_view(), name='entity_create'),
    path('entities/', EntityListView.as_view(), name='entity_list'),
    path('context/', ContextCreateView.as_view(), name='context_create'),
    path('contexts/', ContextListView.as_view(), name='context_list'),
    path('context/<uuid:context_id>', ContextDetailView.as_view(), name='context_detail'),
    path('entity/<uuid:entity_id>', EntityDetailView.as_view(), name='entity_detail'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('document/', DocumentCreateView.as_view(), name='document_create'),
    path('document/<uuid:document_id>', DocumentDetailView.as_view(), name='document_detail'),
]
