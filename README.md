# CastilSec App

A web application for information security management.

## Getting Started

1. **Install Dependencies**:
   ```bash
   deno install
   ```

2. **Start Development**:
   ```bash
   # Start backend
   deno task backend:start

   # Start ui
   deno task ui:start
   ```

## Using Docker

Build image from the Dockerfile:

docker build . -t castilsec-app

Run the container:

docker run -p 8001:8001 --name frontend_castilsec-app castilsec-app

Run stack with docker compose:

docker compose up --build
