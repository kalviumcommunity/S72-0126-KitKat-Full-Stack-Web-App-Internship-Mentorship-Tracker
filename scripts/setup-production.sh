#!/bin/bash

# UIMP Backend Production Setup Script
# This script sets up everything needed for production deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN_NAME=${1:-"api.yourdomain.com"}
ADMIN_EMAIL=${2:-"admin@yourdomain.com"}
CLOUD_PROVIDER=${3:-"docker"}

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                UIMP Backend Production Setup                ║"
echo "║              Complete Environment Configuration              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}🚀 Setting up UIMP Backend for production deployment${NC}"
echo -e "${YELLOW}Domain: ${DOMAIN_NAME}${NC}"
echo -e "${YELLOW}Admin Email: ${ADMIN_EMAIL}${NC}"
echo -e "${YELLOW}Cloud Provider: ${CLOUD_PROVIDER}${NC}"

# Step 1: Create necessary directories
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
mkdir -p {logs,uploads,nginx/ssl,monitoring/grafana/{dashboards,datasources},aws,gcp,azure}

# Step 2: Generate secure secrets
echo -e "${YELLOW}🔐 Generating secure secrets...${NC}"

generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

JWT_SECRET=$(generate_secret)
SESSION_SECRET=$(generate_secret)
POSTGRES_PASSWORD=$(generate_secret)
REDIS_PASSWORD=$(generate_secret)
GRAFANA_PASSWORD=$(generate_secret)

echo -e "${GREEN}✅ Secrets generated${NC}"

# Step 3: Create production environment file
echo -e "${YELLOW}📝 Creating production environment file...${NC}"

cat > .env.production << EOF
# UIMP Backend Production Environment
# Generated on $(date)

# Application
NODE_ENV=production
PORT=3001
DOMAIN_NAME=${DOMAIN_NAME}
FRONTEND_URL=https://${DOMAIN_NAME/api./}

# Database
DATABASE_URL=postgresql://uimpuser:${POSTGRES_PASSWORD}@postgres:5432/uimp
POSTGRES_DB=uimp
POSTGRES_USER=uimpuser
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# CORS
CORS_ORIGIN=https://${DOMAIN_NAME/api./},https://www.${DOMAIN_NAME/api./}

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${ADMIN_EMAIL}
SMTP_PASS=your-app-password-here
FROM_EMAIL=noreply@${DOMAIN_NAME/api./}

# Monitoring
GRAFANA_PASSWORD=${GRAFANA_PASSWORD}

# Security
SESSION_SECRET=${SESSION_SECRET}
BCRYPT_ROUNDS=12
EOF

echo -e "${GREEN}✅ Environment file created: .env.production${NC}"

# Step 4: Set up SSL certificates directory
echo -e "${YELLOW}🔒 Setting up SSL certificate structure...${NC}"

# Create SSL directory structure
mkdir -p nginx/ssl

# Create placeholder certificate files (will be replaced by real certificates)
cat > nginx/ssl/README.md << EOF
# SSL Certificates

This directory contains SSL certificates for the UIMP Backend.

## Files:
- \`fullchain.pem\`: Full certificate chain
- \`privkey.pem\`: Private key

## Setup:
Run the SSL setup script to generate or install certificates:
\`\`\`bash
./scripts/setup-ssl.sh ${DOMAIN_NAME} ${ADMIN_EMAIL} letsencrypt
\`\`\`

## Certificate Methods:
- **Let's Encrypt**: Free, auto-renewing certificates
- **Custom**: Your own purchased certificates
- **Cloudflare**: Origin certificates from Cloudflare
EOF

# Step 5: Create monitoring configuration
echo -e "${YELLOW}📊 Setting up monitoring configuration...${NC}"

# Grafana datasources
cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Grafana dashboard provisioning
cat > monitoring/grafana/dashboards/dashboard.yml << EOF
apiVersion: 1

providers:
  - name: 'UIMP Dashboards'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Step 6: Create backup scripts
echo -e "${YELLOW}💾 Creating backup scripts...${NC}"

cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash

# Database backup script

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="uimp_backup_${DATE}.sql"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Create database backup
docker-compose exec -T postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > ${BACKUP_DIR}/${BACKUP_FILE}

# Compress backup
gzip ${BACKUP_DIR}/${BACKUP_FILE}

echo "✅ Database backup created: ${BACKUP_DIR}/${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
find ${BACKUP_DIR} -name "uimp_backup_*.sql.gz" -mtime +7 -delete

echo "✅ Old backups cleaned up"
EOF

chmod +x scripts/backup-database.sh

# Step 7: Create health check script
echo -e "${YELLOW}🏥 Creating health check script...${NC}"

cat > scripts/health-check.sh << EOF
#!/bin/bash

# Health check script for UIMP Backend

set -e

DOMAIN="${DOMAIN_NAME}"
PROTOCOL="https"

# If running locally, use http and localhost
if [[ "\${DOMAIN}" == *"localhost"* ]] || [[ "\${DOMAIN}" == *"127.0.0.1"* ]]; then
    PROTOCOL="http"
fi

URL="\${PROTOCOL}://\${DOMAIN}/api/health"

echo "🏥 Checking health of UIMP Backend..."
echo "URL: \${URL}"

# Perform health check
RESPONSE=\$(curl -s -w "%{http_code}" "\${URL}" -o /tmp/health_response.json)
HTTP_CODE=\${RESPONSE: -3}

if [ "\${HTTP_CODE}" = "200" ]; then
    echo "✅ Health check passed"
    
    # Show health details
    if command -v jq >/dev/null 2>&1; then
        echo "📋 Health Details:"
        cat /tmp/health_response.json | jq .
    else
        echo "📋 Health Response:"
        cat /tmp/health_response.json
    fi
    
    rm -f /tmp/health_response.json
    exit 0
else
    echo "❌ Health check failed (HTTP \${HTTP_CODE})"
    cat /tmp/health_response.json
    rm -f /tmp/health_response.json
    exit 1
fi
EOF

chmod +x scripts/health-check.sh

# Step 8: Create log rotation configuration
echo -e "${YELLOW}📜 Setting up log rotation...${NC}"

cat > logrotate.conf << EOF
./logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart backend
    endscript
}
EOF

# Step 9: Create systemd service file (for Linux servers)
echo -e "${YELLOW}⚙️  Creating systemd service file...${NC}"

cat > uimp-backend.service << EOF
[Unit]
Description=UIMP Backend Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Step 10: Create deployment checklist
echo -e "${YELLOW}📋 Creating deployment checklist...${NC}"

cat > DEPLOYMENT_CHECKLIST.md << EOF
# UIMP Backend Deployment Checklist

## Pre-Deployment
- [ ] Domain name registered and DNS configured
- [ ] SSL certificate obtained or Let's Encrypt configured
- [ ] Environment variables configured in \`.env.production\`
- [ ] Database server set up and accessible
- [ ] Email SMTP credentials configured
- [ ] Cloud provider account and CLI tools set up

## Security
- [ ] Strong passwords generated for all services
- [ ] JWT secret is secure and unique
- [ ] Database credentials are secure
- [ ] Firewall rules configured
- [ ] SSL/TLS certificates are valid
- [ ] CORS origins are properly configured

## Infrastructure
- [ ] Server resources adequate (CPU, RAM, disk)
- [ ] Load balancer configured (if applicable)
- [ ] CDN configured (if applicable)
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Log rotation configured

## Application
- [ ] All tests passing
- [ ] Database migrations applied
- [ ] Health check endpoint working
- [ ] API endpoints tested
- [ ] File upload functionality tested
- [ ] Email notifications working

## Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring dashboards configured
- [ ] Alerts configured and tested
- [ ] Backup process tested
- [ ] Documentation updated
- [ ] Team notified of deployment

## Rollback Plan
- [ ] Previous version tagged and available
- [ ] Database rollback procedure documented
- [ ] Rollback script tested
- [ ] Monitoring for rollback triggers configured

## Maintenance
- [ ] Update schedule planned
- [ ] Security patch process defined
- [ ] Certificate renewal automated
- [ ] Backup verification scheduled
EOF

# Step 11: Create quick start guide
echo -e "${YELLOW}📖 Creating quick start guide...${NC}"

cat > QUICK_START.md << EOF
# UIMP Backend Quick Start Guide

## Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (or Let's Encrypt setup)

## Quick Deployment

### 1. Clone and Setup
\`\`\`bash
git clone <repository-url>
cd uimp-backend
./scripts/setup-production.sh ${DOMAIN_NAME} ${ADMIN_EMAIL}
\`\`\`

### 2. Configure Environment
Edit \`.env.production\` with your specific values:
- Database credentials
- Email SMTP settings
- Domain configuration

### 3. Setup SSL Certificate
\`\`\`bash
./scripts/setup-ssl.sh ${DOMAIN_NAME} ${ADMIN_EMAIL} letsencrypt
\`\`\`

### 4. Deploy Application
\`\`\`bash
./scripts/deploy-production.sh docker production ${DOMAIN_NAME}
\`\`\`

### 5. Verify Deployment
\`\`\`bash
./scripts/health-check.sh
\`\`\`

## Cloud Deployment

### AWS
\`\`\`bash
./scripts/deploy-production.sh aws production ${DOMAIN_NAME}
\`\`\`

### Google Cloud
\`\`\`bash
./scripts/deploy-production.sh gcp production ${DOMAIN_NAME}
\`\`\`

### Heroku
\`\`\`bash
./scripts/deploy-production.sh heroku production ${DOMAIN_NAME}
\`\`\`

## Monitoring
- Grafana: http://localhost:3000 (admin/${GRAFANA_PASSWORD})
- Prometheus: http://localhost:9090
- Application: https://${DOMAIN_NAME}

## Maintenance Commands

### View Logs
\`\`\`bash
docker-compose -f docker-compose.production.yml logs -f backend
\`\`\`

### Backup Database
\`\`\`bash
./scripts/backup-database.sh
\`\`\`

### Update Application
\`\`\`bash
git pull
docker-compose -f docker-compose.production.yml up -d --build
\`\`\`

### Restart Services
\`\`\`bash
docker-compose -f docker-compose.production.yml restart
\`\`\`
EOF

# Step 12: Set permissions
echo -e "${YELLOW}🔧 Setting file permissions...${NC}"
find scripts/ -name "*.sh" -exec chmod +x {} \;

# Step 13: Create summary
echo -e "${GREEN}🎉 Production setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Setup Summary:${NC}"
echo -e "  ✅ Directory structure created"
echo -e "  ✅ Secure secrets generated"
echo -e "  ✅ Environment configuration created"
echo -e "  ✅ SSL certificate structure prepared"
echo -e "  ✅ Monitoring configuration created"
echo -e "  ✅ Backup scripts created"
echo -e "  ✅ Health check script created"
echo -e "  ✅ Documentation created"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "  1. Review and update .env.production with your specific values"
echo -e "  2. Set up SSL certificates: ./scripts/setup-ssl.sh ${DOMAIN_NAME} ${ADMIN_EMAIL} letsencrypt"
echo -e "  3. Deploy the application: ./scripts/deploy-production.sh docker production ${DOMAIN_NAME}"
echo -e "  4. Verify deployment: ./scripts/health-check.sh"
echo -e "  5. Set up monitoring and alerting"
echo ""
echo -e "${GREEN}🔗 Important Files Created:${NC}"
echo -e "  📄 .env.production - Environment configuration"
echo -e "  📄 DEPLOYMENT_CHECKLIST.md - Pre/post deployment checklist"
echo -e "  📄 QUICK_START.md - Quick deployment guide"
echo -e "  📄 scripts/deploy-production.sh - Main deployment script"
echo -e "  📄 scripts/setup-ssl.sh - SSL certificate setup"
echo -e "  📄 scripts/health-check.sh - Health monitoring"
echo ""
echo -e "${BLUE}🔐 Generated Secrets (save these securely):${NC}"
echo -e "  JWT Secret: ${JWT_SECRET}"
echo -e "  Database Password: ${POSTGRES_PASSWORD}"
echo -e "  Redis Password: ${REDIS_PASSWORD}"
echo -e "  Grafana Password: ${GRAFANA_PASSWORD}"
echo ""
echo -e "${RED}⚠️  Important Security Notes:${NC}"
echo -e "  • Change default passwords in .env.production"
echo -e "  • Set up proper firewall rules"
echo -e "  • Configure SSL certificates before going live"
echo -e "  • Review CORS origins in environment file"
echo -e "  • Set up monitoring and alerting"