# ConnectTier

<a href="https://connectier.app" target="_blank">
    <img src="./assets/logo.png" alt="logo" width="180" height="180" />
</a>

ConnecTier is a match-making system for startups, where founders and mentors can be matched based on their qualifications and interest.

Normally this is a painful process with a lot of trial and error, ConnecTier offers an AI-based matching system that will speedup finding good matches and ensure that both teams and mentors are happy.

## Running Locally

To run the project locally, use Docker Compose:

```sh
docker compose -f compose.local.yaml up -d
```

This will start all required services in the background.

## Deployment

This project is deployed to AWS using Defang CLI to generate ECS containers. Deployment is handled automatically via CI/CD on GitHub.
