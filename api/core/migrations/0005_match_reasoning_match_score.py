# Generated by Django 4.2.21 on 2025-05-24 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_entity_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='reasoning',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='match',
            name='score',
            field=models.CharField(choices=[('poor', 'Poor'), ('fair', 'Fair'), ('good', 'Good'), ('excellent', 'Excellent')], max_length=10, null=True),
        ),
    ]
