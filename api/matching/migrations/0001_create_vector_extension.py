from django.db import migrations
from django.contrib.postgres.operations import CreateExtension

class Migration(migrations.Migration):
    """
    Initial migration to enable the PostgreSQL 'vector' extension.
    
    This migration must be executed before any models using the VectorField can be created.
    The pgvector extension provides support for vector similarity search operations in PostgreSQL,
    which is essential for the embedding-based semantic matching functionality in this app.
    
    Prerequisites:
    - PostgreSQL database with pgvector extension installed (typically using pgvector/pgvector image)
    - Database user with permissions to create extensions
    
    Note: This migration must run before creating tables that use the VectorField type.
    """
    
    # Explicitly setting dependencies to empty ensures this runs first
    dependencies = []
    
    operations = [
        # Enable the 'vector' extension in PostgreSQL
        CreateExtension('vector'),
    ]
