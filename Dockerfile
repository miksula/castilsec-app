FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Install dependencies and setup the monorepo
RUN deno install

# Build the app
RUN deno task build

# Run the api
CMD ["deno", "run", "--allow-net", "apps/api/index.ts"]
