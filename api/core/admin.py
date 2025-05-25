from django.contrib import admin
from .models import UserProfile, Organization, Entity, Context, Match, StatusUpdate

class UserProfileAdmin(admin.ModelAdmin):
    search_fields = ['email', 'first_name', 'last_name']

class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ['name']

class EntityAdmin(admin.ModelAdmin):
    search_fields = ['name', 'type']

class ContextAdmin(admin.ModelAdmin):
    search_fields = ['name', 'prompt']

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Entity, EntityAdmin)
admin.site.register(Context, ContextAdmin)

class MatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'context', 'startup', 'mentor', 'score', 'created_at')
    search_fields = ['id', 'score', 'reasoning', 'startup__name', 'mentor__name', 'context__name']
    list_filter = ('score', 'context', 'startup', 'mentor')

admin.site.register(Match, MatchAdmin)

class StatusUpdateAdmin(admin.ModelAdmin):
    list_display = ('id', 'context', 'the_match', 'created_at')
    search_fields = ['id', 'context__name', 'the_match__id']
    list_filter = ('context', 'the_match')

admin.site.register(StatusUpdate, StatusUpdateAdmin)
