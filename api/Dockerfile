# Dockerfile for Django API/Worker
FROM ghcr.io/astral-sh/uv:python3.13-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

# Install curl
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Copy the project into the image
ADD . /app
RUN uv sync --locked

RUN uv run python manage.py collectstatic --noinput

RUN chmod +x run.sh

CMD ["./run.sh"]
