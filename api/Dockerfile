# Dockerfile for Django API/Worker
FROM ghcr.io/astral-sh/uv:python3.13-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

# Copy the project into the image
ADD . /app
RUN uv sync --locked

RUN chmod +x run.sh

CMD ["./run.sh"]
