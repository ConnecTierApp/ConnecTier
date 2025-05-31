from django.contrib import admin
from .models import Tenant, EntityType, Context, Entity, Document, Chunk


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Tenant model.
    
    Provides a clean interface for managing tenant organizations in the Django admin.
    Displays the tenant name and ID in the list view.
    """
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(EntityType)
class EntityTypeAdmin(admin.ModelAdmin):
    """
    Admin configuration for the EntityType model.
    
    Provides an interface for managing entity types within the matching system.
    Displays tenant relationship and allows filtering by tenant.
    """
    list_display = ('id', 'name', 'tenant')
    list_filter = ('tenant',)
    search_fields = ('name',)
    ordering = ('tenant', 'name')


@admin.register(Context)
class ContextAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Context model.
    
    Provides an interface for managing matching contexts, including their
    association with tenants, entity types, seeker, and resource roles.
    """
    list_display = ('id', 'name', 'tenant')
    list_filter = ('tenant',)
    search_fields = ('name', 'prompt')
    filter_horizontal = ('entity_types',)
    ordering = ('tenant', 'name')


@admin.register(Entity)
class EntityAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Entity model.
    
    Provides an interface for managing entities within the matching system.
    Displays relationships to tenant, context, and entity type with appropriate filtering.
    """
    list_display = ('id', 'entity_type', 'context', 'tenant')
    list_filter = ('tenant', 'context', 'entity_type')
    ordering = ('tenant', 'context', 'entity_type')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Document model.
    
    Provides an interface for managing documents associated with entities.
    Displays title and entity relationship with filtering options.
    """
    list_display = ('id', 'title', 'entity')
    list_filter = ('entity__entity_type', 'entity__context', 'entity__tenant')
    search_fields = ('title', 'text')
    ordering = ('entity', 'title')


@admin.register(Chunk)
class ChunkAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Chunk model.
    
    Provides an interface for managing text chunks with embeddings.
    Note: The embedding field (vector data) is not directly editable
    in the admin interface due to its specialized nature.
    """
    list_display = ('id', 'document')
    list_filter = ('document__entity__entity_type', 'document__entity__context')
    search_fields = ('text',)
    readonly_fields = ('embedding',)  # Vector field is read-only in admin
    ordering = ('document', 'id')
