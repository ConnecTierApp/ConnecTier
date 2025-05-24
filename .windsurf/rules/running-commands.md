---
trigger: always_on
---

Whenever you run commands for this project, run them in the relevant docker containers.

i.e. if you need to install a new package, use `docker compose -f ./compose.local.yaml run --rm` to install. Feel free to use volume mounts to persist the results, change the entrypoint, etc. Anything you need to. But the commands and deps need to work in the containerized environment, which is why I'm going to require you to work this way.

If you are making directories DO NOT USE the docker command above. That is likely unnecessary/overkill and you can run mkdir directly without docker.

The reason we run other commands (that depend on CLIs etc.) in Docker is to make sure we have the necessary dependencies installed in there, or that things that get installed are compatible with the dockerized environment. Directories and files don't require that.