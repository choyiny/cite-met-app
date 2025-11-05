FROM docker.io/cloudflare/sandbox:0.4.15

ENV COMMAND_TIMEOUT_MS=300000

# Set workdir for app
WORKDIR /app

# Copy only frontend package manifest first for better layer caching
COPY cite-met-app-frontend/package.json /app/cite-met-app-frontend/package.json

# Install frontend dependencies
WORKDIR /app/cite-met-app-frontend
RUN npm install --legacy-peer-deps

# Return to root workdir and copy rest of app (optional future step)
WORKDIR /app