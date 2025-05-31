from django.db import models
from pgvector.django import VectorField


class Tenant(models.Model):
    """
    Represents an organization or company in a multi-tenant system.
    
    All other models in the matching system are scoped to a tenant, ensuring
    proper data isolation between different organizations using the platform.
    """
    # The name of the tenant organization
    name = models.CharField(max_length=255)
    
    def __str__(self):
        """Returns a string representation of the tenant."""
        return self.name


class EntityType(models.Model):
    """
    Defines categories or roles for entities within a specific tenant.
    
    Examples include "startup", "investor", "mentor", etc. Each entity type
    is associated with a tenant and can be used in multiple contexts.
    """
    # The tenant this entity type belongs to
    tenant = models.ForeignKey(
        Tenant, 
        on_delete=models.CASCADE, 
        related_name='entity_types',
        help_text="The tenant this entity type belongs to"
    )
    
    # The name of this entity type (e.g., "startup", "investor")
    name = models.CharField(max_length=255)
    
    def __str__(self):
        """Returns a string representation with both name and tenant."""
        return f"{self.name} ({self.tenant.name})"


class Context(models.Model):
    """
    Specifies a matching scenario with associated entity types and roles.
    
    A context defines the matching environment, including which entity types
    participate and which specific roles they play (seeker or resource).
    It includes a prompt that guides the matching process.
    """
    # The tenant this context belongs to
    tenant = models.ForeignKey(
        Tenant, 
        on_delete=models.CASCADE, 
        related_name='contexts',
        help_text="The tenant this context belongs to"
    )
    
    # The name of this matching context
    name = models.CharField(max_length=255)
    
    # The prompt text used for this matching context
    prompt = models.TextField(help_text="Instructions used for the matching process")
    
    # Many-to-many relationship with EntityType - which types can participate
    # Seeker/Resource roles are the primary types. This is anticipating a future
    # where we can have more complex matching scenarios with multiple roles.
    entity_types = models.ManyToManyField(
        EntityType, 
        related_name='contexts',
        help_text="Entity types that can participate in this context"
    )
    
    # The entity type that seeks resources (e.g., startups seeking investors)
    seeker = models.ForeignKey(
        EntityType, 
        on_delete=models.CASCADE, 
        related_name='seeker_contexts',
        help_text="The entity type that is seeking matches (e.g., 'startup')"
    )
    
    # The entity type that provides resources (e.g., investors providing funding)
    resource = models.ForeignKey(
        EntityType, 
        on_delete=models.CASCADE, 
        related_name='resource_contexts',
        help_text="The entity type that is being sought (e.g., 'investor')"
    )
    
    def __str__(self):
        """Returns a string representation with name and tenant."""
        return f"{self.name} ({self.tenant.name})"


class Entity(models.Model):
    """
    Represents a participant in the matching system.
    
    An entity is a specific instance of an EntityType within a Context, such as
    a specific startup or investor. Entities are the primary objects being matched.
    """
    # The tenant this entity belongs to
    tenant = models.ForeignKey(
        Tenant, 
        on_delete=models.CASCADE, 
        related_name='entities',
        help_text="The tenant this entity belongs to"
    )
    
    # The context this entity participates in
    context = models.ForeignKey(
        Context, 
        on_delete=models.CASCADE, 
        related_name='entities',
        help_text="The matching context this entity belongs to"
    )
    
    # The type of this entity (e.g., startup, investor)
    entity_type = models.ForeignKey(
        EntityType, 
        on_delete=models.CASCADE, 
        related_name='entities',
        help_text="The type of this entity (e.g., 'startup', 'investor')"
    )
    
    def __str__(self):
        """Returns a string representation with ID, type and context."""
        return f"Entity {self.id} - {self.entity_type.name} ({self.context.name})"


class Document(models.Model):
    """
    Contains textual information related to an entity.
    
    Documents hold content like transcripts, descriptions, or any text that describes
    or relates to an entity. These are broken down into chunks for embedding.
    """
    # The entity this document belongs to
    entity = models.ForeignKey(
        Entity, 
        on_delete=models.CASCADE, 
        related_name='documents',
        help_text="The entity this document describes"
    )
    
    # Optional title for the document
    title = models.CharField(
        max_length=255, 
        null=True, 
        blank=True,
        help_text="Optional title for the document"
    )
    
    # The full text content of the document
    text = models.TextField(help_text="The complete text content of the document")
    
    def __str__(self):
        """Returns a string representation, using title if available."""
        if self.title:
            return f"{self.title} (Document {self.id})"
        return f"Document {self.id} for {self.entity}"


class Chunk(models.Model):
    """
    Represents a segment of a document with an associated embedding vector.
    
    Chunks are smaller sections of documents that have been processed to generate
    embedding vectors. These vectors capture the semantic meaning of the text and
    are used for similarity matching using the Mistral AI embedding model.
    """
    # The document this chunk belongs to
    document = models.ForeignKey(
        Document, 
        on_delete=models.CASCADE, 
        related_name='chunks',
        help_text="The document this chunk is extracted from"
    )
    
    # The text content of this chunk
    text = models.TextField(help_text="The text content of this chunk")
    
    # Vector embedding for semantic similarity (using Mistral AI embed model)
    embedding = VectorField(
        dimensions=1024,  # Mistral AI embedding dimension
        help_text="Vector embedding generated by Mistral AI embed model"
    )
    
    def __str__(self):
        """Returns a string representation with chunk ID and document reference."""
        return f"Chunk {self.id} for {self.document}"
