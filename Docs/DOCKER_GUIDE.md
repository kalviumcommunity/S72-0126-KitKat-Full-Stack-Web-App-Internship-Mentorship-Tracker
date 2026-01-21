# Docker Build and Deployment Guide

This guide covers the Docker build and deployment pipeline for the UIMP application.

## Overview

The UIMP application uses a multi-service Docker architecture with:
- **Frontend**: Next.js application (client/)
- **Backend**: Node.js API server (server/)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Reverse Proxy**: Nginx

## Docker Workflows

### 1. Automated CI/CD Pipeline (`ci.yml`)
- Triggers on push to `main` and `develop` branches
- Runs tests, builds images, and pushes to GitHub Container Registry
- Includes security scanning with Trivy
- Supports multi-architecture builds (AMD64, ARM64)

### 2. Dedicated Docker Build Pipeline (`docker-build-push.yml`)
- Focused Docker build and push workflow
- Matrix strategy for building multiple services
- Advanced caching and optimization
- Security scanning and vulnerability assessment
- Multi-architecture manifest creation

### 3. Manual Deployment Workflow (`manual-docker-deploy.yml`)
- On-demand deployment with custom parameters
- Environment selection (staging/production)
- Service selection (frontend, backend, or both)
- Optional test execution
- Force rebuild capability

## Quick Start

### Local Development

1. **Using Docker Compose:**
   ```bash
   # Start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

2. **Using Build Scripts:**
   
   **Linux/macOS:**
   ```bash
   # Build all services locally
   ./scripts/docker-build.sh
   
   # Build specific service
   ./scripts/docker-build.sh -s frontend
   
   # Build and push to registry
   ./scripts/docker-build.sh -p -t v1.0.0
   ```
   
   **Windows:**
   ```powershell
   # Build all services locally
   .\scripts\docker-build.ps1
   
   # Build specific service
   .\scripts\docker-build.ps1 -Service frontend
   
   # Build and push to registry
   .\scripts\docker-build.ps1 -Push -Tag v1.0.0
   ```

### Production Deployment

1. **Staging Environment:**
   ```bash
   # Deploy to staging
   docker-compose -f docker-compose.staging.yml up -d
   ```

2. **Production Environment:**
   ```bash
   # Deploy to production
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Image Registry

Images are stored in GitHub Container Registry (GHCR):
- **Frontend**: `ghcr.io/your-org/uimp/frontend:tag`
- **Backend**: `ghcr.io/your-org/uimp/backend:tag`

### Image Tags

- `latest` - Latest stable release (main branch)
- `develop` - Latest development build (develop branch)
- `v1.0.0` - Semantic version tags
- `main-abc123` - Branch with commit SHA
- `pr-123` - Pull request builds

## Environment Configuration

### Development (.env.development)
```env
NODE_ENV=development
DATABASE_URL=postgresql://uimp_user:uimp_password@localhost:5432/uimp_dev
REDIS_URL=redis://:redis_password@localhost:6379
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Staging (.env.staging)
```env
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db:5432/uimp_staging
REDIS_URL=redis://:pass@staging-redis:6379
NEXT_PUBLIC_API_URL=https://api-staging.uimp.com
```

### Production (.env.production)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/uimp_prod
REDIS_URL=redis://:pass@prod-redis:6379
NEXT_PUBLIC_API_URL=https://api.uimp.com
```

## Build Optimization

### Multi-stage Builds
Both frontend and backend use multi-stage Docker builds:
1. **Dependencies stage**: Install production dependencies
2. **Builder stage**: Build the application
3. **Runner stage**: Minimal runtime image

### Build Cache
- GitHub Actions cache for faster builds
- Local cache in `/tmp/.buildx-cache-*`
- Layer caching with BuildKit

### Security Features
- Non-root user execution
- Minimal base images (Alpine Linux)
- Security scanning with Trivy
- Dependency vulnerability checks

## Monitoring and Health Checks

### Health Check Endpoints
- Frontend: `http://localhost:3000/api/health`
- Backend: `http://localhost:3001/api/health`

### Docker Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### Monitoring Stack (Production)
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Nginx**: Load balancing and caching

## Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear build cache
   docker builder prune -a
   
   # Rebuild without cache
   ./scripts/docker-build.sh --no-cache
   ```

2. **Registry Authentication:**
   ```bash
   # Login to GitHub Container Registry
   echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin
   ```

3. **Multi-architecture Issues:**
   ```bash
   # Setup buildx
   docker buildx create --name multiarch --use
   docker buildx inspect --bootstrap
   ```

4. **Permission Issues (Linux):**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x scripts/docker-build.sh
   ```

### Debug Commands

```bash
# View running containers
docker ps

# Check container logs
docker logs <container-name>

# Execute commands in container
docker exec -it <container-name> /bin/sh

# Inspect image
docker inspect <image-name>

# View build history
docker history <image-name>
```

## GitHub Actions Secrets

Required secrets for CI/CD:

### Registry Access
- `GITHUB_TOKEN` - Automatically provided by GitHub

### Deployment
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Notifications
- `SLACK_WEBHOOK` - Slack webhook URL for notifications

### Environment Variables
- `PRODUCTION_API_URL` - Production API URL
- `STAGING_API_URL` - Staging API URL
- `ANALYTICS_ID` - Analytics tracking ID

## Best Practices

### Image Optimization
1. Use multi-stage builds
2. Minimize layer count
3. Use .dockerignore files
4. Choose appropriate base images
5. Remove unnecessary dependencies

### Security
1. Run as non-root user
2. Scan for vulnerabilities
3. Use specific image tags
4. Keep base images updated
5. Minimize attack surface

### CI/CD
1. Test before deployment
2. Use semantic versioning
3. Implement rollback strategies
4. Monitor deployment health
5. Automate security checks

## Advanced Configuration

### Custom Build Arguments
```bash
# Build with custom Node.js version
./scripts/docker-build.sh --build-arg NODE_VERSION=20

# Build with production optimizations
./scripts/docker-build.sh --build-arg NODE_ENV=production
```

### Multi-environment Deployment
```yaml
# GitHub Actions matrix strategy
strategy:
  matrix:
    environment: [staging, production]
    service: [frontend, backend]
```

### Resource Limits
```yaml
# docker-compose.prod.yml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
    reservations:
      memory: 256M
      cpus: '0.25'
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Check container logs
4. Create an issue in the repository

## Related Documentation

- [API Documentation](./API_DOCUMENTATION_COMPLETE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Development Standards](./DEVELOPMENT_STANDARDS.md)
- [Testing Guide](./TESTING_COMPLETE_GUIDE.md)