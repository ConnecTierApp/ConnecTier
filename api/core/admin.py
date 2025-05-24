from django.contrib import admin
from .models import UserProfile, Organization, Entity

class UserProfileAdmin(admin.ModelAdmin):
    search_fields = ['email', 'first_name', 'last_name']

class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ['name']

class EntityAdmin(admin.ModelAdmin):
    search_fields = ['name', 'type']

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Entity, EntityAdmin)
