---
title: "Docker for Web Developers"
date: "2024-02-09"
excerpt: "Learn how to use Docker to containerize and deploy web applications"
imageUrl: "/images/docker.jpg"
---

# Docker for Web Developers

Docker has become an essential tool for modern web development. Let's explore how to use it effectively.

## Basic Concepts

Understanding Docker fundamentals:

```bash
# Basic Docker commands
docker --version                  # Check Docker version
docker ps                        # List running containers
docker images                    # List available images
docker build -t myapp .         # Build an image
docker run -p 3000:3000 myapp   # Run a container
```

## Dockerfile

Create a Dockerfile for a Node.js application:

```dockerfile
# Dockerfile
# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

## Docker Compose

Set up multiple services with Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Development Environment

Configure a development environment:

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install development dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Start development server
CMD ["npm", "run", "dev"]
```

Development-specific compose file:

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
```

## Multi-Stage Builds

Optimize production builds:

```dockerfile
# Dockerfile.prod
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]
```

## Testing in Docker

Run tests in a containerized environment:

```dockerfile
# Dockerfile.test
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "test"]
```

Test configuration:

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=test
      - JEST_JUNIT_OUTPUT_DIR=/app/test-results
```

## Database Management

Handle database migrations and backups:

```yaml
# docker-compose.db.yml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
```

Database backup script:

```bash
#!/bin/bash
# backup-db.sh

# Get current date
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
docker exec -t db pg_dump -U $DB_USER $DB_NAME > ./backups/backup_$DATE.sql

# Keep only last 7 backups
ls -t ./backups/backup_*.sql | tail -n +8 | xargs rm -f
```

## Continuous Integration

GitHub Actions workflow with Docker:

```yaml
# .github/workflows/docker-ci.yml
name: Docker CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build test image
      run: docker build -t myapp-test -f Dockerfile.test .
      
    - name: Run tests
      run: docker run myapp-test
      
    - name: Build production image
      run: docker build -t myapp-prod -f Dockerfile.prod .
      
    - name: Login to Docker Hub
      if: github.ref == 'refs/heads/main'
      uses: docker/login-action@v1
      with:
        username: ${{ secrets.DOCKER_HUB_USERNAME }}
        password: ${{ secrets.DOCKER_HUB_TOKEN }}
        
    - name: Push to Docker Hub
      if: github.ref == 'refs/heads/main'
      run: |
        docker tag myapp-prod ${{ secrets.DOCKER_HUB_USERNAME }}/myapp:latest
        docker push ${{ secrets.DOCKER_HUB_USERNAME }}/myapp:latest
```

## Best Practices

1. **Image Optimization**
   - Use multi-stage builds
   - Minimize layer size
   - Leverage build cache

2. **Security**
   - Use official base images
   - Run as non-root user
   - Scan for vulnerabilities

```dockerfile
# Example of security best practices
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy app files
COPY --chown=appuser:appgroup . .

# Install dependencies
RUN npm ci --only=production

# Use non-root user
USER appuser

# Start app
CMD ["npm", "start"]
```

3. **Development Workflow**
   - Use volumes for hot reloading
   - Separate dev and prod configs
   - Implement health checks

## Debugging

Debug containerized applications:

```yaml
# docker-compose.debug.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
      - "9229:9229"
    command: ["npm", "run", "debug"]
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

## Conclusion

Docker provides a powerful platform for developing, testing, and deploying web applications. By following these patterns and best practices, you can create consistent and reliable development environments while streamlining your deployment process. 