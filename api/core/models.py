import uuid

from django.db import models
from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
)

class BaseModel(models.Model):
    """
    Abstract base model that provides common fields for all models.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="A unique identifier for the record.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="The date and time when the record was created.")
    updated_at = models.DateTimeField(auto_now=True, help_text="The date and time when the record was last updated.")

    class Meta:
        abstract = True
        ordering = ['-created_at']  # Default ordering by creation date descending

class Organization(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, email, password=None, organization=None):
        """Create a new user profile"""
        if not email:
            raise ValueError("User must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, password=password)
        
        if not organization:
            # If no organization is provided, create a default one
            organization = Organization.objects.create(name="Default Organization")
        user.organization = organization

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, organization=None):
        """Create a new superuser profile"""
        user = self.create_user(email, password, organization)
        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user

class UserProfile(AbstractUser, BaseModel):
    """Database model for users in the system"""

    username = None
    email = models.EmailField(max_length=255, unique=True)

    objects = UserProfileManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        """Return string representation of our user"""
        return self.email
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='users')
    
    # Add role field if needed
    # role = models.CharField(max_length=64)
    

class Entity(BaseModel):
    class EntityType(models.TextChoices):
        STARTUP = 'startup', 'Startup'
        MENTOR = 'mentor', 'Mentor'
    
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=64, choices=EntityType.choices)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='entities')

    def __str__(self):
        return f"{self.name} ({self.type})"
    
    class Meta:
        verbose_name_plural = "entities"

class Context(BaseModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='contexts', null=True)
    name = models.CharField(max_length=255)
    prompt = models.TextField()
    entities = models.ManyToManyField(Entity, related_name='contexts')

    def __str__(self):
        return self.name

class Match(BaseModel):
    class MatchScore(models.TextChoices):
        POOR = 'poor', 'Poor'
        FAIR = 'fair', 'Fair'
        GOOD = 'good', 'Good'
        EXCELLENT = 'excellent', 'Excellent'
    
    context = models.ForeignKey(Context, on_delete=models.CASCADE, related_name='matches')
    startup = models.ForeignKey(Entity, on_delete=models.CASCADE, related_name='startup_matches')
    mentor = models.ForeignKey(Entity, on_delete=models.CASCADE, related_name='mentor_matches')
    
    # Uncomment if you want to store scores and justifications
    score = models.CharField(choices=MatchScore.choices, max_length=10, null=True)
    reasoning = models.TextField(null=True)

class Message(BaseModel):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='messages')
    timestamp = models.DateTimeField()
    sender = models.CharField(max_length=64)  # e.g. 'system', 'llm'
    content = models.TextField()

class Document(BaseModel):
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE, related_name='documents')
    type = models.CharField(max_length=64)  # e.g. 'transcript', 'pdf'
    content = models.TextField()

class Chunk(BaseModel):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    content = models.TextField()

class Embedding(BaseModel):
    vector = models.JSONField()  # array<float>
    chunk = models.OneToOneField(Chunk, on_delete=models.CASCADE, related_name='embedding')

class StatusUpdate(BaseModel):
    task_id = models.CharField(max_length=255, help_text="Identifiant de la tâche associée à la mise à jour de statut.")
    status_data = models.JSONField(help_text="Données de statut stockées au format JSON.")

    def __str__(self):
        return f"StatusUpdate(task_id={self.task_id}, created_at={self.created_at})"