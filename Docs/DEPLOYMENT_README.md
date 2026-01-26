# UIMP Backend - Production Deployment Guide

## 🚀 Quick Start

### One-Command Setup
```bash
# Complete production setup
./scripts/setup-production.sh api.yourdomain.com admin@yourdomain.com docker

# Setup SSL certificates
./scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com letsencrypt

# Deploy to production
./scripts/deploy-production.sh docker production api.yourdomain.com
```

## 📋 Deployment Options

### 1. Docker Compose (Recommended for VPS/Dedicated Servers)
```bash
# Full stack with PostgreSQL, Redis, Nginx, Monitoring
./scripts/deploy-production.sh docker production api.yourdomain.com
```

### 2. AWS ECS with Fargate
```bash
# Serverless container deployment
export AWS_REGION=us-east-1
export CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
./scripts/deploy-production.sh aws production api.yourdomain.com
```

### 3. Google Cloud Run
```bash
# Serverless deployment
export PROJECT_ID=your-project-id
export DATABASE_URL=postgresql://user:pass@host:5432/db
./scripts/deploy-production.sh gcp production api.yourdomain.com
```

### 4. Heroku
```bash
# Simple PaaS deployment
./scripts/deploy-production.sh heroku production api.yourdomain.com
```

## 🔧 Configuration Files Created

| File | Purpose |
|------|---------|
| `.env.production` | Production environment variables |
| `docker-compose.production.yml` | Full production stack |
| `nginx/nginx.conf` | Reverse proxy with SSL |
| `monitoring/prometheus.yml` | Metrics collection |
| `scripts/setup-ssl.sh` | SSL certificate automation |
| `scripts/deploy-production.sh` | Multi-cloud deployment |
| `scripts/health-check.sh` | Health monitoring |

## 🔐 Security Features

- ✅ **SSL/TLS Encryption** - Let's Encrypt or custom certificates
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **CORS Configuration** - Cross-origin request control
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Security Headers** - Helmet.js security middleware
- ✅ **Database Security** - Connection pooling and SSL

## 📊 Monitoring Stack

- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards
- **Health Checks** - Application health monitoring
- **Log Aggregation** - Centralized logging
- **Alerting** - Email/Slack notifications

## 🌐 SSL Certificate Options

### Let's Encrypt (Free, Auto-Renewing)
```bash
./scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com letsencrypt
```

### Custom Certificate
```bash
# Place your certificates in nginx/ssl/
# - fullchain.pem
# - privkey.pem
./scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com custom
```

### Cloudflare Origin Certificate
```bash
./scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com cloudflare
```

## 🔄 CI/CD Integration

### GitHub Actions
The repository includes comprehensive GitHub Actions workflows:
- **Automated Testing** - Run tests on every push
- **Docker Build** - Multi-architecture container builds
- **Multi-Cloud Deploy** - Deploy to AWS, GCP, Azure
- **Security Scanning** - Vulnerability detection

### Manual Deployment
```bash
# Build and test
cd server && npm test && npm run build

# Deploy to your chosen platform
./scripts/deploy-production.sh <provider> production <domain>
```

## 📈 Scaling Options

### Horizontal Scaling
- **Docker Compose**: Increase replica count
- **AWS ECS**: Auto-scaling groups
- **Google Cloud Run**: Automatic scaling
- **Kubernetes**: HPA (Horizontal Pod Autoscaler)

### Vertical Scaling
- **Memory**: Increase container memory limits
- **CPU**: Increase CPU allocation
- **Database**: Scale database instance

## 🔍 Health Monitoring

### Health Check Endpoints
- `GET /api/health` - Basic health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Monitoring Script
```bash
# Check application health
./scripts/health-check.sh

# View logs
docker-compose -f docker-compose.production.yml logs -f backend
```

## 💾 Backup Strategy

### Database Backups
```bash
# Manual backup
./scripts/backup-database.sh

# Automated backups (cron job)
0 2 * * * /path/to/scripts/backup-database.sh
```

### File Backups
- Upload directory: `./uploads`
- SSL certificates: `./nginx/ssl`
- Configuration: `.env.production`

## 🚨 Troubleshooting

### Common Issues

#### SSL Certificate Problems
```bash
# Check certificate validity
openssl x509 -in nginx/ssl/fullchain.pem -text -noout

# Test SSL connection
openssl s_client -connect api.yourdomain.com:443
```

#### Database Connection Issues
```bash
# Test database connection
psql "$DATABASE_URL" -c "SELECT version();"

# Check database logs
docker-compose logs postgres
```

#### Application Not Starting
```bash
# Check application logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep -E "(DATABASE_URL|JWT_SECRET)"
```

### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check application metrics
curl https://api.yourdomain.com/metrics
```

## 🔄 Updates and Maintenance

### Application Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build
```

### SSL Certificate Renewal
```bash
# Let's Encrypt auto-renewal (automated via cron)
./scripts/renew-ssl.sh

# Manual certificate update
./scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com letsencrypt
```

### Database Maintenance
```bash
# Run database migrations
docker-compose exec backend npm run migrate

# Optimize database
docker-compose exec postgres psql -U uimpuser -d uimp -c "VACUUM ANALYZE;"
```

## 📞 Support and Documentation

### Additional Resources
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Cloud Deployment Guide](./docs/CLOUD_DEPLOYMENT.md)
- [Docker Guide](./docs/DOCKER_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

### Getting Help
1. Check the health endpoint: `https://api.yourdomain.com/api/health`
2. Review application logs: `docker-compose logs backend`
3. Verify configuration: Check `.env.production`
4. Test database connection: `psql "$DATABASE_URL" -c "SELECT 1;"`

## 🎯 Production Checklist

Before going live, ensure:

- [ ] Domain DNS configured
- [ ] SSL certificate installed and valid
- [ ] Environment variables configured
- [ ] Database accessible and migrated
- [ ] Email SMTP configured and tested
- [ ] Health checks passing
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS origins configured
- [ ] Firewall rules configured
- [ ] Load balancer configured (if applicable)
- [ ] CDN configured (if applicable)

---

## 🚀 Ready to Deploy?

1. **Setup**: `./scripts/setup-production.sh api.yourdomain.com admin@yourdomain.com`
2. **Configure**: Edit `.env.production` with your values
3. **SSL**: `./scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com letsencrypt`
4. **Deploy**: `./scripts/deploy-production.sh docker production api.yourdomain.com`
5. **Verify**: `./scripts/health-check.sh`

Your UIMP Backend will be live at `https://api.yourdomain.com`! 🎉