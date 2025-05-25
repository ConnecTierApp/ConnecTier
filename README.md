# ConnectTier

# ATTENTION JUDGES: YOU CAN USE THESE CREDENTIALS TO LOGIN TO THE APP AND TRY IT

 - Username: `user1@example.com`
 - Password: `Potatoes!1`
 - URL: `https://connectier.app`


<a href="https://connectier.app" target="_blank">
    <img src="./assets/logo.png" alt="logo" width="180" height="180" />
</a>

## Stack

- Next.js - for the frontend
- Django - for the backend
- PostgreSQL - for the database
- Redis - for caching
- Celery - for background tasks
- Mistral - for AI
- Docker - for local development
- Defang.io - to deploy to AWS
- AWS - for hosting

## Description

ConnecTier is a match-making system for startups, where founders and mentors can be matched based on their qualifications and interest.

Normally this is a painful process with a lot of trial and error, ConnecTier offers an AI-based matching system that will speedup finding good matches and ensure that both teams and mentors are happy.

## Running Locally

To run the project locally, use Docker Compose:

```sh
docker compose -f compose.local.yaml up -d
```

This will start all required services in the background.

- API can be accessed via http://localhost:8000
- UI can be accessed via http://localhost:3000

## Deployment

This project is deployed to AWS using Defang CLI to generate ECS containers. Deployment is handled automatically via CI/CD on GitHub.

## Load transcripts

To load the transcripts execute the local script:

```bash
$ uv run scripts/load_transcripts.py <host> <username> <password>
```

This will create the mentors and startups and load their transcripts as seen in `test/transcripts/*`.
