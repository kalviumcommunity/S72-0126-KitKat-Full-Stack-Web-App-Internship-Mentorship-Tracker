# UIMP Backend Cloud Deployment Guide

## Overview

This guide covers deploying the UIMP backend to various cloud platforms with SSL certificates and custom domain configuration. We'll cover multiple deployment strategies from simple to production-ready setups.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Deployment](#aws-deployment)
3. [Google Cloud Platform](#google-cloud-platform)
4. [Microsoft Azure](#microsoft-azure)
5. [DigitalOcean](#digitalocean)
6. [Heroku](#heroku)
7. [Railway](#railway)
8. [SSL Certificate Setup](#ssl-certificate-setup)
9. [Domain Configuration](#domain-configuration)
10. [Environment Variables](#environment-variables)
11. [Database Setup](#database-setup)
12. [Monitoring & Logging](#monitoring--logging)
13. [CI/CD Pipeline](#cicd-pipeline)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Docker and Docker Compose installed
- ✅ Cloud provider account (AWS, GCP, Azure, etc.)
- ✅ Domain name registered
- ✅ SSL certificate (Let's Encrypt or purchased)
- ✅ Environment variables configured
- ✅ Database setup (PostgreSQL)

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=pdf,jpg,jpeg,png,doc,docx

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (optional, for sessions)
REDIS_URL=redis://localhost:6379
```

---

## AWS Deployment

### Option 1: AWS ECS with Fargate (Recommended)

#### 1. Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository --repository-name uimp-backend --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push image
docker build -t uimp-backend .
docker tag uimp-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/uimp-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/uimp-backend:latest
```

#### 2. Create ECS Task Definition

Create `aws/task-definition.json`:

```json
{
  "family": "uimp-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "uimp-backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/uimp-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3001"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:uimp/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:uimp/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/uimp-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:3001/api/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### 3. Create ECS Service

```bash
# Create cluster
aws ecs create-cluster --cluster-name uimp-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://aws/task-definition.json

# Create service
aws ecs create-service \
  --cluster uimp-cluster \
  --service-name uimp-backend-service \
  --task-definition uimp-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/uimp-backend-tg/1234567890,containerName=uimp-backend,containerPort=3001
```

#### 4. Application Load Balancer Setup

Create `aws/alb-setup.sh`:

```bash
#!/bin/bash

# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name uimp-backend-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345 \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Create target group
aws elbv2 create-target-group \
  --name uimp-backend-tg \
  --protocol HTTP \
  --port 3001 \
  --vpc-id vpc-12345 \
  --target-type ip \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create HTTPS listener (requires SSL certificate)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:<account-id>:loadbalancer/app/uimp-backend-alb/1234567890 \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:<account-id>:certificate/12345678-1234-1234-1234-123456789012 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/uimp-backend-tg/1234567890

# Redirect HTTP to HTTPS
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:<account-id>:loadbalancer/app/uimp-backend-alb/1234567890 \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

### Option 2: AWS EC2 with Docker

#### 1. Launch EC2 Instance

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-12345 \
  --subnet-id subnet-12345 \
  --user-data file://aws/user-data.sh
```

#### 2. User Data Script

Create `aws/user-data.sh`:

```bash
#!/bin/bash
yum update -y
yum install -y docker

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/uimp
cd /opt/uimp

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/uimp-backend:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped
EOF

# Create nginx configuration
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3001;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name api.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/health {
            proxy_pass http://backend/api/health;
            access_log off;
        }
    }
}
EOF

# Start services
docker-compose up -d
```

---

## Google Cloud Platform

### Option 1: Cloud Run (Serverless)

#### 1. Build and Deploy

```bash
# Set project
gcloud config set project your-project-id

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Build and deploy
gcloud run deploy uimp-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,PORT=3001 \
  --set-secrets DATABASE_URL=uimp-database-url:latest,JWT_SECRET=uimp-jwt-secret:latest
```

#### 2. Custom Domain Setup

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service uimp-backend \
  --domain api.yourdomain.com \
  --region us-central1
```

### Option 2: Google Kubernetes Engine (GKE)

#### 1. Create GKE Cluster

```bash
# Create cluster
gcloud container clusters create uimp-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 5 \
  --machine-type e2-medium

# Get credentials
gcloud container clusters get-credentials uimp-cluster --zone us-central1-a
```

#### 2. Kubernetes Manifests

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uimp-backend
  labels:
    app: uimp-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: uimp-backend
  template:
    metadata:
      labels:
        app: uimp-backend
    spec:
      containers:
      - name: uimp-backend
        image: gcr.io/your-project-id/uimp-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3001"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: uimp-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: uimp-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: uimp-backend-service
spec:
  selector:
    app: uimp-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: LoadBalancer
```

Create `k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: uimp-backend-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: uimp-ip
    networking.gke.io/managed-certificates: uimp-ssl-cert
    kubernetes.io/ingress.class: "gce"
spec:
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /*
        pathType: ImplementationSpecific
        backend:
          service:
            name: uimp-backend-service
            port:
              number: 80
---
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: uimp-ssl-cert
spec:
  domains:
    - api.yourdomain.com
```

#### 3. Deploy to GKE

```bash
# Create secrets
kubectl create secret generic uimp-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=jwt-secret="your-jwt-secret"

# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods
kubectl get services
kubectl get ingress
```

---

## Microsoft Azure

### Option 1: Azure Container Instances

#### 1. Create Resource Group

```bash
# Create resource group
az group create --name uimp-rg --location eastus

# Create container registry
az acr create --resource-group uimp-rg --name uimpregistry --sku Basic --admin-enabled true

# Build and push image
az acr build --registry uimpregistry --image uimp-backend:latest .
```

#### 2. Deploy Container Instance

```bash
# Get ACR credentials
ACR_SERVER=$(az acr show --name uimpregistry --query loginServer --output tsv)
ACR_USERNAME=$(az acr credential show --name uimpregistry --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name uimpregistry --query passwords[0].value --output tsv)

# Create container instance
az container create \
  --resource-group uimp-rg \
  --name uimp-backend \
  --image $ACR_SERVER/uimp-backend:latest \
  --registry-login-server $ACR_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label uimp-backend \
  --ports 3001 \
  --environment-variables NODE_ENV=production PORT=3001 \
  --secure-environment-variables DATABASE_URL="postgresql://..." JWT_SECRET="your-jwt-secret" \
  --cpu 1 \
  --memory 2
```

### Option 2: Azure App Service

#### 1. Create App Service Plan

```bash
# Create App Service plan
az appservice plan create \
  --name uimp-plan \
  --resource-group uimp-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group uimp-rg \
  --plan uimp-plan \
  --name uimp-backend-app \
  --deployment-container-image-name $ACR_SERVER/uimp-backend:latest
```

#### 2. Configure App Settings

```bash
# Configure container registry
az webapp config container set \
  --name uimp-backend-app \
  --resource-group uimp-rg \
  --docker-custom-image-name $ACR_SERVER/uimp-backend:latest \
  --docker-registry-server-url https://$ACR_SERVER \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

# Set environment variables
az webapp config appsettings set \
  --resource-group uimp-rg \
  --name uimp-backend-app \
  --settings NODE_ENV=production PORT=3001 DATABASE_URL="postgresql://..." JWT_SECRET="your-jwt-secret"

# Configure custom domain
az webapp config hostname add \
  --webapp-name uimp-backend-app \
  --resource-group uimp-rg \
  --hostname api.yourdomain.com
```

---

## DigitalOcean

### Option 1: App Platform

#### 1. Create App Spec

Create `.do/app.yaml`:

```yaml
name: uimp-backend
services:
- name: api
  source_dir: /
  github:
    repo: your-username/uimp-backend
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  health_check:
    http_path: /api/health
  envs:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "3001"
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
    type: SECRET
  - key: JWT_SECRET
    value: your-jwt-secret
    type: SECRET

databases:
- name: db
  engine: PG
  version: "13"
  size: db-s-dev-database
```

#### 2. Deploy App

```bash
# Install doctl
curl -sL https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz | tar -xzv
sudo mv doctl /usr/local/bin

# Authenticate
doctl auth init

# Create app
doctl apps create .do/app.yaml

# Get app info
doctl apps list
```

### Option 2: Droplet with Docker

#### 1. Create Droplet

```bash
# Create droplet
doctl compute droplet create uimp-backend \
  --size s-2vcpu-2gb \
  --image docker-20-04 \
  --region nyc1 \
  --ssh-keys your-ssh-key-id
```

#### 2. Setup Docker Compose

```bash
# SSH to droplet
ssh root@your-droplet-ip

# Create application directory
mkdir -p /opt/uimp
cd /opt/uimp

# Create docker-compose.yml (same as AWS EC2 example above)
# Create .env file with your environment variables

# Start services
docker-compose up -d

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

---

## Heroku

### Simple Heroku Deployment

#### 1. Prepare Application

Create `Procfile`:

```
web: npm start
```

Create `heroku.yml`:

```yaml
build:
  docker:
    web: Dockerfile
run:
  web: npm start
```

#### 2. Deploy to Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create uimp-backend-app

# Set stack to container
heroku stack:set container -a uimp-backend-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev -a uimp-backend-app

# Set environment variables
heroku config:set NODE_ENV=production -a uimp-backend-app
heroku config:set JWT_SECRET=your-jwt-secret -a uimp-backend-app
heroku config:set PORT=3001 -a uimp-backend-app

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Add custom domain
heroku domains:add api.yourdomain.com -a uimp-backend-app

# Enable SSL
heroku certs:auto:enable -a uimp-backend-app
```

---

## Railway

### Railway Deployment

#### 1. Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-jwt-secret
railway variables set DATABASE_URL=postgresql://...

# Add custom domain
railway domain add api.yourdomain.com
```

#### 2. Railway Configuration

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## SSL Certificate Setup

### Option 1: Let's Encrypt (Free)

#### 1. Install Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### 2. Generate Certificate

```bash
# Generate certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Option 2: AWS Certificate Manager

```bash
# Request certificate
aws acm request-certificate \
  --domain-name api.yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# Describe certificate (get validation records)
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:account:certificate/certificate-id
```

### Option 3: Cloudflare SSL

1. Add your domain to Cloudflare
2. Update nameservers to Cloudflare
3. Enable SSL/TLS encryption mode: "Full (strict)"
4. Enable "Always Use HTTPS"
5. Configure SSL/TLS settings

---

## Domain Configuration

### DNS Records Setup

#### A Records (for IP-based deployments)
```
Type: A
Name: api
Value: your-server-ip
TTL: 300
```

#### CNAME Records (for cloud services)
```
Type: CNAME
Name: api
Value: your-cloud-service-url
TTL: 300
```

#### Example DNS Configuration

```bash
# For AWS ALB
api.yourdomain.com. 300 IN CNAME uimp-backend-alb-123456789.us-east-1.elb.amazonaws.com.

# For Google Cloud Run
api.yourdomain.com. 300 IN CNAME ghs.googlehosted.com.

# For Azure App Service
api.yourdomain.com. 300 IN CNAME uimp-backend-app.azurewebsites.net.

# For DigitalOcean App Platform
api.yourdomain.com. 300 IN CNAME uimp-backend-app.ondigitalocean.app.
```

### Subdomain Configuration

Create additional subdomains for different environments:

```bash
# Production
api.yourdomain.com

# Staging
api-staging.yourdomain.com

# Development
api-dev.yourdomain.com
```

---

## Environment Variables

### Production Environment Variables

Create `.env.production`:

```bash
# Application
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name
DATABASE_SSL=true
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=pdf,jpg,jpeg,png,doc,docx
UPLOAD_DESTINATION=uploads/
AWS_S3_BUCKET=uimp-uploads
AWS_S3_REGION=us-east-1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=UIMP Platform

# Redis (for sessions/caching)
REDIS_URL=redis://username:password@host:6379
REDIS_TTL=3600

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key
HELMET_ENABLED=true
```

### Environment-Specific Configurations

#### Staging Environment
```bash
NODE_ENV=staging
DATABASE_URL=postgresql://staging-db-url
CORS_ORIGIN=https://staging.yourdomain.com
LOG_LEVEL=debug
```

#### Development Environment
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/uimp_dev
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
JWT_EXPIRES_IN=1d
```

---

## Database Setup

### PostgreSQL on AWS RDS

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier uimp-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 13.7 \
  --master-username uimpuser \
  --master-user-password your-secure-password \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-12345 \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --storage-encrypted \
  --deletion-protection
```

### PostgreSQL on Google Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create uimp-postgres \
  --database-version=POSTGRES_13 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --deletion-protection

# Create database
gcloud sql databases create uimp --instance=uimp-postgres

# Create user
gcloud sql users create uimpuser \
  --instance=uimp-postgres \
  --password=your-secure-password
```

### Database Migration

Create `scripts/migrate.sh`:

```bash
#!/bin/bash

# Run Prisma migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

---

## Monitoring & Logging

### Application Monitoring

#### 1. Health Check Endpoint

The backend includes a health check endpoint at `/api/health`:

```typescript
// Already implemented in the backend
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // Check database connection
    version: process.env.npm_package_version
  });
});
```

#### 2. Application Metrics

Add monitoring with Prometheus:

```typescript
// Add to your backend
import prometheus from 'prom-client';

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

### Logging Configuration

#### 1. Winston Logger Setup

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'uimp-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

#### 2. Request Logging Middleware

```typescript
import morgan from 'morgan';

// Custom token for user ID
morgan.token('user', (req: any) => {
  return req.user ? req.user.id : 'anonymous';
});

// Custom format
const logFormat = ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

app.use(morgan(logFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
```

### Error Tracking

#### Sentry Integration

```bash
npm install @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// Request handler must be the first middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());
```

---

## CI/CD Pipeline

### GitHub Actions for Multi-Cloud Deployment

Create `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'
        type: choice
        options:
        - production
        - staging

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: server/package-lock.json
    
    - name: Install dependencies
      run: |
        cd server
        npm ci
    
    - name: Run tests
      run: |
        cd server
        npm test
    
    - name: Run linting
      run: |
        cd server
        npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: |
          ghcr.io/${{ github.repository }}/backend
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v5
      with:
        context: ./server
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-aws:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Update ECS service
      run: |
        aws ecs update-service \
          --cluster uimp-cluster \
          --service uimp-backend-service \
          --force-new-deployment

  deploy-gcp:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - name: Setup Google Cloud CLI
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT_ID }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy uimp-backend \
          --image ${{ needs.build.outputs.image-tag }} \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated

  deploy-azure:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Deploy to Azure Container Instances
      run: |
        az container restart \
          --resource-group uimp-rg \
          --name uimp-backend

  notify:
    needs: [deploy-aws, deploy-gcp, deploy-azure]
    runs-on: ubuntu-latest
    if: always()
    steps:
    - name: Notify deployment status
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Deployment Scripts

Create `scripts/deploy.sh`:

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-production}
CLOUD_PROVIDER=${2:-aws}

echo "🚀 Deploying UIMP Backend to $CLOUD_PROVIDER ($ENVIRONMENT)"

# Build Docker image
echo "📦 Building Docker image..."
docker build -t uimp-backend:latest ./server

# Deploy based on cloud provider
case $CLOUD_PROVIDER in
  "aws")
    echo "☁️ Deploying to AWS..."
    ./scripts/deploy-aws.sh $ENVIRONMENT
    ;;
  "gcp")
    echo "☁️ Deploying to Google Cloud..."
    ./scripts/deploy-gcp.sh $ENVIRONMENT
    ;;
  "azure")
    echo "☁️ Deploying to Azure..."
    ./scripts/deploy-azure.sh $ENVIRONMENT
    ;;
  "digitalocean")
    echo "☁️ Deploying to DigitalOcean..."
    ./scripts/deploy-do.sh $ENVIRONMENT
    ;;
  *)
    echo "❌ Unknown cloud provider: $CLOUD_PROVIDER"
    exit 1
    ;;
esac

echo "✅ Deployment completed successfully!"
```

---

## Security Checklist

### Pre-Deployment Security

- [ ] Environment variables are properly secured
- [ ] Database credentials are encrypted
- [ ] JWT secrets are strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] SQL injection protection is active
- [ ] XSS protection is enabled
- [ ] HTTPS is enforced
- [ ] Security headers are configured

### Post-Deployment Security

- [ ] SSL certificate is valid and auto-renewing
- [ ] Firewall rules are properly configured
- [ ] Database access is restricted
- [ ] Monitoring and alerting are active
- [ ] Backup strategy is implemented
- [ ] Incident response plan is ready
- [ ] Security scanning is scheduled
- [ ] Access logs are monitored

---

## Troubleshooting

### Common Issues

#### 1. SSL Certificate Issues
```bash
# Check certificate status
openssl s_client -connect api.yourdomain.com:443 -servername api.yourdomain.com

# Verify certificate chain
curl -vI https://api.yourdomain.com/api/health
```

#### 2. Database Connection Issues
```bash
# Test database connection
psql "postgresql://username:password@host:5432/database_name" -c "SELECT version();"

# Check connection pool
curl https://api.yourdomain.com/api/health
```

#### 3. Load Balancer Health Checks
```bash
# Check health endpoint
curl -f https://api.yourdomain.com/api/health

# Check logs
docker logs container_name
kubectl logs deployment/uimp-backend
```

### Performance Optimization

#### 1. Database Optimization
- Enable connection pooling
- Add database indexes
- Optimize queries
- Enable query caching

#### 2. Application Optimization
- Enable gzip compression
- Implement caching
- Optimize Docker image size
- Use CDN for static assets

#### 3. Infrastructure Optimization
- Auto-scaling configuration
- Load balancer optimization
- CDN configuration
- Monitoring and alerting

---

This comprehensive guide covers deploying the UIMP backend to major cloud platforms with proper SSL and domain configuration. Choose the deployment strategy that best fits your needs, budget, and technical requirements.