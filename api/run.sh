#!/bin/sh

# set -euo pipefail

# Wait for the database to be ready
# until uv run python manage.py migrate --check; do
#   echo "Waiting for database to be ready..."
#   sleep 2
#   # Optionally, add a timeout or a check for container health
#   # You can also use: python manage.py wait_for_db
#   # Or: nc -z $DB_HOST $DB_PORT
#   # But migrate --check is simple and robust for Django
#   # If you want to be more explicit, use: python manage.py check --database default
#   # Or: python manage.py wait_for_db (if you have a custom command)
# done

# Run migrations
uv run python manage.py migrate --noinput
uv run python manage.py create_initial_superuser

# Start Daphne server
exec uv run daphne -b 0.0.0.0 -p 8000 config.asgi:application
