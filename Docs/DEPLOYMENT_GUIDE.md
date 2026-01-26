# UIMP Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Unified Internship & Mentorship Portal (UIMP) to a production environment. The deployment includes frontend, backend, database, caching, monitoring, and security configurations.

## Prerequisites

### System Requirements

- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **CPU**: Minimum 4 cores (8 cores recommended)
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: Minimum 50GB SSD (100GB+ recommended)
- **Network**: Static IP address with ports 80, 443, 22 accessible

### Software Requirements

- Docker 20.10+
- Docker Compose 2.0+
- Git
- SSL certificates (Let's Encrypt recommended)
- Domain name with DNS access

### Cloud Services (Optional but Recommended)

- **File Storage**: AWS S3 or Azure Blob Storage
- **Email Service**: AWS SES, SendGrid, or SMTP server
- **Monitoring**: External monitoring service
- **Backup Storage**: Cloud storage for automated backups

## Pre-Deployment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
sudo apt install -y git curl wget htop nginx-utils
```

### 2. Clone Repository

```bash
# Clone the repository
git clone <repository-url> uimp-production
cd uimp-production

# Switch to main branch
git checkout main
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.production.example .env.production

# Edit environment variables
nano .env.production
```

**Critical Environment Variables to Configure:**

```bash
# Database
POSTGRES_DB=uimp_production
POSTGRES_USER=uimp_prod_user
POSTGRES_PASSWORD=<secure-password>

# Security
JWT_SECRET=<32-character-secure-key>
REDIS_PASSWORD=<secure-password>

# Domain Configuration
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
S3_BUCKET_NAME=uimp-production-uploads

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=<your-email>
SMTP_PASS=<app-password>
```

### 4. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com -d monitoring.yourdomain.com

# Copy certificates to project
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/private.key
sudo chown -R $USER:$USER nginx/ssl
```

#### Option B: Self-Signed (Development/Testing)

```bash
# Generate self-signed certificates
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/private.key \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### 5. DNS Configuration

Configure your DNS provider to point to your server:

```
A     yourdomain.com          -> YOUR_SERVER_IP
A     api.yourdomain.com      -> YOUR_SERVER_IP
A     monitoring.yourdomain.com -> YOUR_SERVER_IP
CNAME www.yourdomain.com      -> yourdomain.com
```

## Deployment Process

### 1. Automated Deployment (Recommended)

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

### 2. Manual Deployment

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml --env-file .env.production down --remove-orphans
docker-compose -f docker-compose.prod.yml --env-file .env.production build --no-cache
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml --env-file .env.production exec backend npx prisma migrate deploy

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
```

## Post-Deployment Configuration

### 1. Health Checks

```bash
# Run comprehensive health check
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

### 2. Monitoring Setup

Access monitoring dashboard:
- **Grafana**: https://monitoring.yourdomain.com
- **Prometheus**: http://your-server-ip:9090

Default Grafana credentials:
- Username: `admin`
- Password: Set in `GRAFANA_PASSWORD` environment variable

### 3. Backup Configuration

```bash
# Set up automated backups
chmod +x scripts/backup.sh

# Test backup
./scripts/backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/uimp-production/scripts/backup.sh
```

### 4. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw status
```

## Service Management

### Starting Services

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### Stopping Services

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production down
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Scaling Services

```bash
# Scale backend instances
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --scale backend=3

# Scale frontend instances
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --scale frontend=2
```

## Maintenance

### 1. Updates and Upgrades

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.prod.yml --env-file .env.production down
docker-compose -f docker-compose.prod.yml --env-file .env.production build --no-cache
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Run migrations if needed
docker-compose -f docker-compose.prod.yml --env-file .env.production exec backend npx prisma migrate deploy
```

### 2. Database Maintenance

```bash
# Database backup
./scripts/backup.sh --skip-redis --skip-uploads --skip-config

# Database restore (if needed)
docker exec -i uimp-postgres-prod psql -U $POSTGRES_USER -d $POSTGRES_DB < backup.sql
```

### 3. SSL Certificate Renewal

```bash
# Renew Let's Encrypt certificates
sudo certbot renew

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/private.key

# Restart Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## Troubleshooting

### Common Issues

#### 1. Services Not Starting

```bash
# Check Docker daemon
sudo systemctl status docker

# Check container logs
docker-compose -f docker-compose.prod.yml logs <service-name>

# Check resource usage
docker stats
```

#### 2. Database Connection Issues

```bash
# Check PostgreSQL container
docker exec uimp-postgres-prod pg_isready -U $POSTGRES_USER -d $POSTGRES_DB

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

#### 3. SSL/HTTPS Issues

```bash
# Test SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check Nginx configuration
docker exec uimp-nginx-prod nginx -t
```

#### 4. Performance Issues

```bash
# Monitor resource usage
htop
docker stats

# Check application metrics
curl http://localhost:3001/api/metrics
```

### Log Locations

- **Application Logs**: `docker-compose logs`
- **Nginx Logs**: Inside nginx container at `/var/log/nginx/`
- **Deployment Logs**: `./deployment.log`
- **Health Check Logs**: `./health-check.log`
- **Backup Logs**: `./backup.log`

## Security Considerations

### 1. Network Security

- Use firewall to restrict access to necessary ports only
- Implement fail2ban for SSH protection
- Use VPN for administrative access
- Regular security updates

### 2. Application Security

- Strong passwords for all services
- Regular security audits
- HTTPS enforcement
- Security headers configured in Nginx
- Rate limiting enabled

### 3. Data Security

- Encrypted database connections
- Regular automated backups
- Backup encryption
- Access logging and monitoring

## Performance Optimization

### 1. Database Optimization

```bash
# Database performance tuning
docker exec uimp-postgres-prod psql -U $POSTGRES_USER -d $POSTGRES_DB -c "
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
"
```

### 2. Caching Configuration

- Redis configured for session storage
- Nginx caching for static assets
- Application-level caching implemented

### 3. Monitoring and Alerting

- Prometheus metrics collection
- Grafana dashboards
- Alert rules configured
- Health check automation

## Support and Maintenance

### Regular Tasks

- **Daily**: Monitor application health and performance
- **Weekly**: Review logs and security alerts
- **Monthly**: Update system packages and security patches
- **Quarterly**: Review and update SSL certificates
- **Annually**: Security audit and penetration testing

### Emergency Procedures

1. **Service Outage**: Use health check script to identify issues
2. **Data Loss**: Restore from automated backups
3. **Security Breach**: Follow incident response plan
4. **Performance Issues**: Scale services horizontally

## Conclusion

This deployment guide provides a comprehensive approach to deploying UIMP in a production environment. Follow the steps carefully and ensure all security measures are in place before going live.

For additional support or questions, refer to the project documentation or contact the development team.