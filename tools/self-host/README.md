# PowerSync Self-Hosted Example

This is an example self-hosted project using the PowerSync Open Edition version
of the [PowerSync Service](https://github.com/powersync-ja/powersync-service),
which is published to Docker Hub as `journeyapps/powersync-service`.

This example uses Docker Compose to define and run the containers.

Learn more about self-hosting PowerSync
[here](https://docs.powersync.com/self-hosting/getting-started).

# Cleanup

If you want to start from a fresh start:

- Delete the Docker volumes `mongo_storage` and `db_data` Their full names might
  vary depending on the directory where the `docker-compose` command was
  executed.
- Delete the service Docker containers.
