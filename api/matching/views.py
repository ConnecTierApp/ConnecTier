from rest_framework import viewsets
from .models import Tenant, EntityType, Context, Entity, Document, Chunk, Match, StatusUpdate, Feedback
from .serializers import TenantSerializer, EntityTypeSerializer, ContextSerializer, EntitySerializer, DocumentSerializer, ChunkSerializer, MatchSerializer, StatusUpdateSerializer, FeedbackSerializer


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


class MatchViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Match model operations.
    
    Provides complete CRUD operations for Matches:
    - list: GET /api/matches/
    - retrieve: GET /api/matches/{id}/
    - create: POST /api/matches/
    - update: PUT /api/matches/{id}/
    - partial_update: PATCH /api/matches/{id}/
    - delete: DELETE /api/matches/{id}/
    
    Matches represent pairings between seeker and resource entities within a context.
    The model supports versioning through a self-referential parent field, which enables
    tracking how matches evolve over time in response to feedback.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class StatusUpdateViewSet(viewsets.ModelViewSet):
    """
    API endpoint for StatusUpdate model operations.
    
    Provides complete CRUD operations for StatusUpdates:
    - list: GET /api/status-updates/
    - retrieve: GET /api/status-updates/{id}/
    - create: POST /api/status-updates/
    - update: PUT /api/status-updates/{id}/
    - partial_update: PATCH /api/status-updates/{id}/
    - delete: DELETE /api/status-updates/{id}/
    
    StatusUpdates track system actions, intermediate evaluations, or reasoning steps
    during the matching process. They can come from the system, language models,
    or human input, and may be associated with a context, a specific match, or both.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = StatusUpdate.objects.all()
    serializer_class = StatusUpdateSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Feedback model operations.
    
    Provides complete CRUD operations for Feedback:
    - list: GET /api/feedback/
    - retrieve: GET /api/feedback/{id}/
    - create: POST /api/feedback/
    - update: PUT /api/feedback/{id}/
    - partial_update: PATCH /api/feedback/{id}/
    - delete: DELETE /api/feedback/{id}/
    
    Feedback contains user or reviewer input on contexts or specific matches.
    This feedback can lead to new versioned matches being created with
    improvements based on the feedback provided.
    
    Currently no permissions are applied - all endpoints are publicly accessible.
    """
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
