from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Creates a superuser with email "admin@connectier.app" and password "password" if one does not already exist.'

    def handle(self, *args, **options):
        User = get_user_model()
        password = 'password'
        email = 'admin@connectier.app'

        if not User.objects.filter(email=email).exists():
            self.stdout.write(f'Creating superuser: {email}')
            User.objects.create_superuser(email, password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser {email} already exists.'))
