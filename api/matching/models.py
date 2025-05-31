from django.db import models
from pgvector.django import VectorField
from django.utils import timezone


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


class Match(models.Model):
    """
    Represents a pairing between a seeker entity and a resource entity in a specific context.
    
    Matches are versioned using a self-referential parent field. When feedback is submitted,
    a new version of the match may be created, linking to the prior version.
    
    This allows tracking the evolution of matches over time and understanding how
    matching decisions change based on feedback and system iterations.
    """
    # The context in which this match was created
    context = models.ForeignKey(
        Context,
        on_delete=models.CASCADE,
        related_name='matches',
        help_text="The context in which this match was created"
    )
    
    # The seeker entity (the one looking for resources)
    seeker = models.ForeignKey(
        Entity,
        on_delete=models.CASCADE,
        related_name='seeker_matches',
        help_text="The entity seeking resources or assistance"
    )
    
    # The resource entity (the one providing value to the seeker)
    resource = models.ForeignKey(
        Entity,
        on_delete=models.CASCADE,
        related_name='resource_matches',
        help_text="The entity providing resources or assistance"
    )
    
    # Optional reference to a previous version of this match (for versioning)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='versions',
        help_text="Reference to a previous version of this match"
    )
    
    # Optional similarity score or ranking
    score = models.FloatField(
        null=True,
        blank=True,
        help_text="Similarity score or ranking value"
    )
    
    # Optional notes, summary or explanation of the match
    notes = models.TextField(
        null=True,
        blank=True,
        help_text="Summary or explanation of why this match was made"
    )
    
    # Timestamp when this match was created
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When this match was created"
    )
    
    def __str__(self):
        """Returns a string representation with context and entities."""
        return f"Match {self.id}: {self.seeker} → {self.resource} in {self.context.name}"
    
    class Meta:
        verbose_name_plural = "matches"
        ordering = ['-created_at']


class StatusUpdate(models.Model):
    """
    Represents a status update, log entry, or reasoning step in the matching process.
    
    StatusUpdates can be associated with a context, a specific match, or both.
    They provide a timeline of actions, decisions, and reasoning during the matching process.
    Updates can come from different sources: system processes, LLM reasoning, or human input.
    """
    # Source options for status updates
    SOURCE_CHOICES = [
        ('system', 'System'),
        ('llm', 'Language Model'),
        ('human', 'Human'),
    ]
    
    # The context this update relates to
    context = models.ForeignKey(
        Context,
        on_delete=models.CASCADE,
        related_name='status_updates',
        help_text="The context this update relates to"
    )
    
    # Optional match this update relates to (may be a general context update)
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='status_updates',
        help_text="Specific match this update relates to (if any)"
    )
    
    # Entities involved in this update
    entities = models.ManyToManyField(
        Entity,
        blank=True,
        related_name='status_updates',
        help_text="Entities involved in this status update"
    )
    
    # The actual message content
    message = models.TextField(
        help_text="The content of this status update"
    )
    
    # Source of this update (system, llm, or human)
    source = models.CharField(
        max_length=10,
        choices=SOURCE_CHOICES,
        default='system',
        help_text="Source of this status update"
    )
    
    # Timestamp when this update was created
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When this status update was created"
    )
    
    def __str__(self):
        """Returns a string representation with source and timestamp."""
        match_str = f" for Match {self.match.id}" if self.match else ""
        return f"{self.source.capitalize()} update{match_str} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['-created_at']


class Feedback(models.Model):
    """
    Represents user feedback on a context or specific match.
    
    Feedback can be attached to a specific match or generally to a context.
    When feedback is submitted on a match, it may result in a new version
    being created with improvements based on the feedback.
    """
    # The context this feedback relates to
    context = models.ForeignKey(
        Context,
        on_delete=models.CASCADE,
        related_name='feedback',
        help_text="The context this feedback relates to"
    )
    
    # Optional match this feedback relates to
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='feedback',
        help_text="Specific match this feedback relates to (if any)"
    )
    
    # The feedback content
    text = models.TextField(
        help_text="The content of the feedback"
    )
    
    # Timestamp when this feedback was created
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When this feedback was submitted"
    )
    
    def __str__(self):
        """Returns a string representation with context and optional match."""
        match_str = f" for Match {self.match.id}" if self.match else ""
        return f"Feedback on {self.context.name}{match_str} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        verbose_name_plural = "feedback"
        ordering = ['-created_at']
