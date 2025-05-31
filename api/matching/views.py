from rest_framework import viewsets
from .models import Tenant, EntityType, Context, Entity, Document, Chunk
from .serializers import TenantSerializer, EntityTypeSerializer, ContextSerializer, EntitySerializer, DocumentSerializer, ChunkSerializer


class TenantViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Tenant model operations.
    
    Provides complete CRUD operations for Tenants:
    - list: GET /api/tenants/
    - retrieve: GET /api/tenants/{id}/
    - create: POST /api/tenants/
    - update: PUT /api/tenants/{id}/
    - partial_update: PATCH /api/tenants/{id}/
    - delete: DELETE /api/tenants/{id}/
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class EntityTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for EntityType model operations.
    
    Provides complete CRUD operations for EntityTypes:
    - list: GET /api/entity-types/
    - retrieve: GET /api/entity-types/{id}/
    - create: POST /api/entity-types/
    - update: PUT /api/entity-types/{id}/
    - partial_update: PATCH /api/entity-types/{id}/
    - delete: DELETE /api/entity-types/{id}/
    
    EntityTypes represent categories of entities (e.g., "startup", "investor")
    within a specific tenant.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = EntityType.objects.all()
    serializer_class = EntityTypeSerializer


class ContextViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Context model operations.
    
    Provides complete CRUD operations for Contexts:
    - list: GET /api/contexts-api/
    - retrieve: GET /api/contexts-api/{id}/
    - create: POST /api/contexts-api/
    - update: PUT /api/contexts-api/{id}/
    - partial_update: PATCH /api/contexts-api/{id}/
    - delete: DELETE /api/contexts-api/{id}/
    
    Contexts define matching scenarios with entity types and roles,
    including the prompt used to guide the matching process.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Context.objects.all()
    serializer_class = ContextSerializer


class EntityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Entity model operations.
    
    Provides complete CRUD operations for Entities:
    - list: GET /api/entities-api/
    - retrieve: GET /api/entities-api/{id}/
    - create: POST /api/entities-api/
    - update: PUT /api/entities-api/{id}/
    - partial_update: PATCH /api/entities-api/{id}/
    - delete: DELETE /api/entities-api/{id}/
    
    Entities are specific instances of EntityTypes within a Context
    that can be matched with other entities.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer


class DocumentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Document model operations.
    
    Provides complete CRUD operations for Documents:
    - list: GET /api/documents-api/
    - retrieve: GET /api/documents-api/{id}/
    - create: POST /api/documents-api/
    - update: PUT /api/documents-api/{id}/
    - partial_update: PATCH /api/documents-api/{id}/
    - delete: DELETE /api/documents-api/{id}/
    
    Documents contain textual information about entities and are
    segmented into chunks for embedding and semantic analysis.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class ChunkViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Chunk model operations.
    
    Provides complete CRUD operations for Chunks:
    - list: GET /api/chunks/
    - retrieve: GET /api/chunks/{id}/
    - create: POST /api/chunks/
    - update: PUT /api/chunks/{id}/
    - partial_update: PATCH /api/chunks/{id}/
    - delete: DELETE /api/chunks/{id}/
    
    Chunks are segments of document text with associated embedding vectors
    generated using the Mistral AI embed model with 1024 dimensions.
    These vectors enable semantic similarity matching between entities.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Chunk.objects.all()
    serializer_class = ChunkSerializer
