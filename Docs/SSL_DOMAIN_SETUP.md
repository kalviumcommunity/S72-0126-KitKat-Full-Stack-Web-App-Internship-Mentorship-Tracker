# SSL Certificate and Domain Configuration Guide

## Overview

This guide provides detailed instructions for setting up SSL certificates and configuring custom domains for the UIMP backend across different hosting platforms and scenarios.

## Table of Contents

1. [SSL Certificate Types](#ssl-certificate-types)
2. [Let's Encrypt (Free SSL)](#lets-encrypt-free-ssl)
3. [Commercial SSL Certificates](#commercial-ssl-certificates)
4. [Cloud Provider SSL](#cloud-provider-ssl)
5. [Reverse Proxy SSL](#reverse-proxy-ssl)
6. [Domain Configuration](#domain-configuration)
7. [DNS Management](#dns-management)
8. [SSL Automation](#ssl-automation)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## SSL Certificate Types

### 1. Domain Validated (DV) Certificates
- **Cost**: Free (Let's Encrypt) or $10-50/year
- **Validation**: Domain ownership only
- **Use Case**: Most web applications
- **Trust Level**: Basic encryption

### 2. Organization Validated (OV) Certificates
- **Cost**: $50-200/year
- **Validation**: Domain + organization verification
- **Use Case**: Business websites
- **Trust Level**: Higher trust, shows organization name

### 3. Extended Validation (EV) Certificates
- **Cost**: $200-1000/year
- **Validation**: Extensive organization verification
- **Use Case**: E-commerce, banking
- **Trust Level**: Highest trust, green address bar

### 4. Wildcard Certificates
- **Cost**: $100-300/year
- **Coverage**: *.yourdomain.com
- **Use Case**: Multiple subdomains
- **Benefit**: Single certificate for all subdomains

---

## Let's Encrypt (Free SSL)

### Method 1: Certbot (Recommended)

#### Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

**CentOS/RHEL:**
```bash
sudo yum install epel-release
sudo yum install certbot python3-certbot-nginx
```

**macOS:**
```bash
brew install certbot
```

#### Generate Certificate

**Standalone Mode (No Web Server Running):**
```bash
sudo certbot certonly --standalone -d api.yourdomain.com
```

**Webroot Mode (Web Server Running):**
```bash
sudo certbot certonly --webroot -w /var/www/html -d api.yourdomain.com
```

**Nginx Plugin (Automatic Configuration):**
```bash
sudo certbot --nginx -d api.yourdomain.com
```

**Apache Plugin (Automatic Configuration):**
```bash
sudo certbot --apache -d api.yourdomain.com
```

#### Multiple Domains
```bash
sudo certbot certonly --standalone \
  -d api.yourdomain.com \
  -d api-staging.yourdomain.com \
  -d api-dev.yourdomain.com
```

#### Wildcard Certificate
```bash
sudo certbot certonly --manual \
  --preferred-challenges=dns \
  -d yourdomain.com \
  -d *.yourdomain.com
```

### Method 2: ACME.sh (Alternative)

#### Installation
```bash
curl https://get.acme.sh | sh -s email=your-email@example.com
source ~/.bashrc
```

#### Generate Certificate
```bash
# Standalone mode
acme.sh --issue --standalone -d api.yourdomain.com

# Webroot mode
acme.sh --issue -d api.yourdomain.com -w /var/www/html

# DNS mode (for wildcard)
acme.sh --issue --dns dns_cf -d yourdomain.com -d *.yourdomain.com
```

#### Install Certificate
```bash
acme.sh --install-cert -d api.yourdomain.com \
  --key-file /etc/nginx/ssl/privkey.pem \
  --fullchain-file /etc/nginx/ssl/fullchain.pem \
  --reloadcmd "systemctl reload nginx"
```

### Auto-Renewal Setup

#### Certbot Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Or use systemd timer (Ubuntu 18.04+)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### ACME.sh Auto-Renewal
```bash
# ACME.sh automatically sets up cron job during installation
# Check cron job
crontab -l | grep acme.sh

# Manual renewal test
acme.sh --renew -d api.yourdomain.com --force
```

---

## Commercial SSL Certificates

### Popular SSL Providers

1. **DigiCert** - Premium certificates
2. **Sectigo (Comodo)** - Affordable options
3. **GlobalSign** - Business certificates
4. **GoDaddy** - Budget-friendly
5. **Namecheap** - Competitive pricing

### Certificate Purchase Process

#### 1. Generate Certificate Signing Request (CSR)
```bash
# Generate private key
openssl genrsa -out api.yourdomain.com.key 2048

# Generate CSR
openssl req -new -key api.yourdomain.com.key -out api.yourdomain.com.csr

# Fill in the details:
# Country Name: US
# State: California
# City: San Francisco
# Organization: Your Company
# Organizational Unit: IT Department
# Common Name: api.yourdomain.com
# Email: admin@yourdomain.com
# Challenge password: (leave blank)
# Optional company name: (leave blank)
```

#### 2. Submit CSR to Certificate Authority
- Copy the CSR content
- Submit to your chosen SSL provider
- Complete domain validation
- Download the certificate files

#### 3. Install Certificate
```bash
# You'll receive these files:
# - api_yourdomain_com.crt (your certificate)
# - intermediate.crt (intermediate certificate)
# - root.crt (root certificate)

# Create certificate bundle
cat api_yourdomain_com.crt intermediate.crt root.crt > fullchain.pem

# Set proper permissions
chmod 600 api.yourdomain.com.key
chmod 644 fullchain.pem
```

---

## Cloud Provider SSL

### AWS Certificate Manager (ACM)

#### Request Certificate
```bash
# Request certificate
aws acm request-certificate \
  --domain-name api.yourdomain.com \
  --subject-alternative-names "*.yourdomain.com" \
  --validation-method DNS \
  --region us-east-1

# Get certificate details
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

#### DNS Validation
```bash
# Add CNAME records to your DNS
# Name: _acme-challenge.api.yourdomain.com
# Value: (provided by ACM)
```

#### Use with Load Balancer
```bash
# Create HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188 \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/my-targets/73e2d6bc24d8a067
```

### Google Cloud SSL

#### Managed SSL Certificate
```bash
# Create managed certificate
gcloud compute ssl-certificates create uimp-ssl-cert \
  --domains api.yourdomain.com \
  --global

# Check status
gcloud compute ssl-certificates describe uimp-ssl-cert --global
```

#### Self-Managed Certificate
```bash
# Upload your certificate
gcloud compute ssl-certificates create uimp-ssl-cert \
  --certificate /path/to/fullchain.pem \
  --private-key /path/to/privkey.pem \
  --global
```

### Azure SSL

#### App Service Certificate
```bash
# Create App Service Certificate
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1

# Bind SSL certificate
az webapp config ssl bind \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI \
  --name myWebApp \
  --resource-group myResourceGroup
```

#### Key Vault Certificate
```bash
# Import certificate to Key Vault
az keyvault certificate import \
  --vault-name myKeyVault \
  --name myCertificate \
  --file /path/to/certificate.pfx \
  --password <password>
```

---

## Reverse Proxy SSL

### Nginx SSL Configuration

#### Basic SSL Setup
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ssl/fullchain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Health check endpoint (no logging)
    location /api/health {
        proxy_pass http://localhost:3001/api/health;
        access_log off;
    }
}
```

#### Advanced SSL Configuration
```nginx
# /etc/nginx/conf.d/ssl.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# DH Parameters
ssl_dhparam /etc/nginx/ssl/dhparam.pem;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

#### Generate DH Parameters
```bash
sudo openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

### Apache SSL Configuration

#### Virtual Host Configuration
```apache
<VirtualHost *:80>
    ServerName api.yourdomain.com
    Redirect permanent / https://api.yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName api.yourdomain.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/apache2/ssl/fullchain.pem
    SSLCertificateKeyFile /etc/apache2/ssl/privkey.pem
    
    # SSL Security
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384
    SSLHonorCipherOrder off
    SSLCompression off
    SSLSessionTickets off
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Proxy Configuration
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3001/$1" [P,L]
</VirtualHost>
```

### Traefik SSL Configuration

#### Docker Compose with Traefik
```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=your-email@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.dashboard.tls=true"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"

  backend:
    image: uimp-backend:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.yourdomain.com`)"
      - "traefik.http.routers.backend.tls=true"
      - "traefik.http.routers.backend.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend.loadbalancer.server.port=3001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
```

---

## Domain Configuration

### DNS Record Types

#### A Record (IPv4)
```
Type: A
Name: api
Value: 192.168.1.100
TTL: 300
```

#### AAAA Record (IPv6)
```
Type: AAAA
Name: api
Value: 2001:db8::1
TTL: 300
```

#### CNAME Record
```
Type: CNAME
Name: api
Value: server.yourdomain.com
TTL: 300
```

#### MX Record (Email)
```
Type: MX
Name: @
Value: 10 mail.yourdomain.com
TTL: 300
```

#### TXT Record (Verification)
```
Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"
TTL: 300
```

### Subdomain Strategy

#### Environment-Based Subdomains
```
# Production
api.yourdomain.com

# Staging
api-staging.yourdomain.com
staging-api.yourdomain.com

# Development
api-dev.yourdomain.com
dev-api.yourdomain.com

# Testing
api-test.yourdomain.com
test-api.yourdomain.com
```

#### Service-Based Subdomains
```
# Main API
api.yourdomain.com

# Authentication service
auth.yourdomain.com

# File upload service
uploads.yourdomain.com

# WebSocket service
ws.yourdomain.com

# Admin panel
admin.yourdomain.com
```

### Domain Validation

#### HTTP Validation
```bash
# Create validation file
mkdir -p /var/www/html/.well-known/acme-challenge/
echo "validation-token" > /var/www/html/.well-known/acme-challenge/token

# Test validation
curl http://api.yourdomain.com/.well-known/acme-challenge/token
```

#### DNS Validation
```bash
# Add TXT record
dig TXT _acme-challenge.api.yourdomain.com

# Verify record propagation
nslookup -type=TXT _acme-challenge.api.yourdomain.com 8.8.8.8
```

---

## DNS Management

### Popular DNS Providers

1. **Cloudflare** - Free tier, great performance
2. **Route 53 (AWS)** - Integrated with AWS services
3. **Google Cloud DNS** - Integrated with GCP
4. **Namecheap** - Affordable, user-friendly
5. **DNSimple** - Developer-focused

### Cloudflare Setup

#### 1. Add Domain to Cloudflare
```bash
# Using Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones" \
  -H "X-Auth-Email: your-email@example.com" \
  -H "X-Auth-Key: your-api-key" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "yourdomain.com",
    "account": {
      "id": "your-account-id"
    }
  }'
```

#### 2. Configure DNS Records
```bash
# Add A record
curl -X POST "https://api.cloudflare.com/client/v4/zones/zone-id/dns_records" \
  -H "X-Auth-Email: your-email@example.com" \
  -H "X-Auth-Key: your-api-key" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "api",
    "content": "192.168.1.100",
    "ttl": 300
  }'

# Add CNAME record
curl -X POST "https://api.cloudflare.com/client/v4/zones/zone-id/dns_records" \
  -H "X-Auth-Email: your-email@example.com" \
  -H "X-Auth-Key: your-api-key" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "api-staging",
    "content": "api.yourdomain.com",
    "ttl": 300
  }'
```

#### 3. SSL/TLS Settings
```bash
# Set SSL mode to Full (Strict)
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/zone-id/settings/ssl" \
  -H "X-Auth-Email: your-email@example.com" \
  -H "X-Auth-Key: your-api-key" \
  -H "Content-Type: application/json" \
  --data '{
    "value": "full"
  }'

# Enable Always Use HTTPS
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/zone-id/settings/always_use_https" \
  -H "X-Auth-Email: your-email@example.com" \
  -H "X-Auth-Key: your-api-key" \
  -H "Content-Type: application/json" \
  --data '{
    "value": "on"
  }'
```

### AWS Route 53 Setup

#### 1. Create Hosted Zone
```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name yourdomain.com \
  --caller-reference $(date +%s)

# Get name servers
aws route53 get-hosted-zone --id /hostedzone/Z123456789
```

#### 2. Create DNS Records
```bash
# Create A record
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789 \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.yourdomain.com",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [{"Value": "192.168.1.100"}]
      }
    }]
  }'

# Create CNAME record
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789 \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api-staging.yourdomain.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "api.yourdomain.com"}]
      }
    }]
  }'
```

### DNS Propagation Check

#### Check DNS Propagation
```bash
# Check from multiple locations
dig @8.8.8.8 api.yourdomain.com
dig @1.1.1.1 api.yourdomain.com
dig @208.67.222.222 api.yourdomain.com

# Check propagation worldwide
curl "https://www.whatsmydns.net/api/details?server=world&type=A&query=api.yourdomain.com"
```

#### DNS Troubleshooting
```bash
# Trace DNS resolution
dig +trace api.yourdomain.com

# Check specific record types
dig TXT api.yourdomain.com
dig MX yourdomain.com
dig NS yourdomain.com

# Check reverse DNS
dig -x 192.168.1.100
```

---

## SSL Automation

### Automated Certificate Management

#### 1. Docker-based Automation
```yaml
# docker-compose.yml
version: '3.8'

services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot -w /var/www/certbot --email your-email@example.com --agree-tos --no-eff-email -d api.yourdomain.com

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - certbot
```

#### 2. Kubernetes CertManager
```yaml
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx

---
# Create Certificate
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: uimp-tls
  namespace: default
spec:
  secretName: uimp-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - api.yourdomain.com
```

#### 3. Terraform Automation
```hcl
# main.tf
resource "aws_acm_certificate" "uimp_cert" {
  domain_name       = "api.yourdomain.com"
  validation_method = "DNS"

  subject_alternative_names = [
    "*.yourdomain.com"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "uimp_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.uimp_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "uimp_cert" {
  certificate_arn         = aws_acm_certificate.uimp_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.uimp_cert_validation : record.fqdn]
}
```

### Certificate Monitoring

#### 1. SSL Certificate Expiry Check
```bash
#!/bin/bash
# ssl-check.sh

DOMAIN="api.yourdomain.com"
THRESHOLD=30  # Days before expiry to alert

# Get certificate expiry date
EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)

# Convert to epoch time
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)

# Calculate days until expiry
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))

echo "Certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days"

if [ $DAYS_UNTIL_EXPIRY -lt $THRESHOLD ]; then
    echo "WARNING: Certificate expires soon!"
    # Send alert (email, Slack, etc.)
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days!\"}" \
        $SLACK_WEBHOOK_URL
fi
```

#### 2. Automated Monitoring with Cron
```bash
# Add to crontab
0 6 * * * /path/to/ssl-check.sh

# Or use systemd timer
# /etc/systemd/system/ssl-check.service
[Unit]
Description=SSL Certificate Check
After=network.target

[Service]
Type=oneshot
ExecStart=/path/to/ssl-check.sh

# /etc/systemd/system/ssl-check.timer
[Unit]
Description=Run SSL Certificate Check daily
Requires=ssl-check.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

---

## Security Best Practices

### SSL/TLS Configuration

#### 1. Strong Cipher Suites
```nginx
# Modern configuration (2023)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
```

#### 2. Security Headers
```nginx
# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Prevent clickjacking
add_header X-Frame-Options DENY always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options nosniff always;

# XSS Protection
add_header X-XSS-Protection "1; mode=block" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';" always;
```

#### 3. OCSP Stapling
```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/fullchain.pem;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

### Certificate Security

#### 1. Private Key Security
```bash
# Generate secure private key
openssl genrsa -out privkey.pem 4096

# Set proper permissions
chmod 600 privkey.pem
chown root:root privkey.pem

# Store in secure location
mv privkey.pem /etc/ssl/private/
```

#### 2. Certificate Transparency
```bash
# Check certificate transparency logs
curl -s "https://crt.sh/?q=yourdomain.com&output=json" | jq '.[].name_value' | sort -u
```

#### 3. HPKP (HTTP Public Key Pinning) - Deprecated but educational
```nginx
# Note: HPKP is deprecated, use Certificate Transparency instead
# add_header Public-Key-Pins 'pin-sha256="base64+primary=="; pin-sha256="base64+backup=="; max-age=5184000; includeSubDomains';
```

---

## Troubleshooting

### Common SSL Issues

#### 1. Certificate Chain Issues
```bash
# Check certificate chain
openssl s_client -connect api.yourdomain.com:443 -servername api.yourdomain.com

# Verify certificate chain
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt /path/to/fullchain.pem
```

#### 2. Mixed Content Issues
```bash
# Check for mixed content
curl -s https://api.yourdomain.com | grep -i "http://"

# Fix mixed content in nginx
location / {
    proxy_pass http://localhost:3001;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect http:// https://;
}
```

#### 3. SSL Handshake Failures
```bash
# Test SSL handshake
openssl s_client -connect api.yourdomain.com:443 -servername api.yourdomain.com -debug

# Check supported protocols
nmap --script ssl-enum-ciphers -p 443 api.yourdomain.com
```

### DNS Issues

#### 1. DNS Propagation Problems
```bash
# Check DNS propagation
dig @8.8.8.8 api.yourdomain.com
dig @1.1.1.1 api.yourdomain.com

# Flush DNS cache (various systems)
sudo systemctl flush-dns          # systemd-resolved
sudo dscacheutil -flushcache      # macOS
ipconfig /flushdns                 # Windows
```

#### 2. CNAME vs A Record Issues
```bash
# Check record type
dig api.yourdomain.com

# CNAME records cannot coexist with other records
# Use A record for root domain, CNAME for subdomains
```

### Certificate Validation Issues

#### 1. Domain Validation Failures
```bash
# Check HTTP validation
curl -I http://api.yourdomain.com/.well-known/acme-challenge/test

# Check DNS validation
dig TXT _acme-challenge.api.yourdomain.com
```

#### 2. Rate Limiting Issues
```bash
# Let's Encrypt rate limits:
# - 50 certificates per registered domain per week
# - 5 duplicate certificates per week
# - 300 new orders per account per 3 hours

# Check rate limits
curl -s "https://crt.sh/?q=yourdomain.com&output=json" | jq 'length'
```

### Testing Tools

#### 1. SSL Testing
```bash
# SSL Labs test
curl -s "https://api.ssllabs.com/api/v3/analyze?host=api.yourdomain.com" | jq '.status'

# Local SSL test
testssl.sh api.yourdomain.com

# Certificate transparency check
curl -s "https://crt.sh/?q=yourdomain.com&output=json" | jq '.[0]'
```

#### 2. DNS Testing
```bash
# DNS propagation check
dig +short api.yourdomain.com @8.8.8.8
dig +short api.yourdomain.com @1.1.1.1

# DNS trace
dig +trace api.yourdomain.com

# Reverse DNS
dig -x $(dig +short api.yourdomain.com)
```

---

## Maintenance Scripts

### SSL Certificate Renewal Script
```bash
#!/bin/bash
# ssl-renew.sh

DOMAIN="api.yourdomain.com"
NGINX_CONFIG="/etc/nginx/sites-available/default"
LOG_FILE="/var/log/ssl-renewal.log"

echo "$(date): Starting SSL renewal for $DOMAIN" >> $LOG_FILE

# Renew certificate
certbot renew --quiet --no-self-upgrade

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewed successfully" >> $LOG_FILE
    
    # Test nginx configuration
    nginx -t
    
    if [ $? -eq 0 ]; then
        # Reload nginx
        systemctl reload nginx
        echo "$(date): Nginx reloaded successfully" >> $LOG_FILE
        
        # Send success notification
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"SSL certificate for $DOMAIN renewed successfully\"}" \
            $SLACK_WEBHOOK_URL
    else
        echo "$(date): Nginx configuration test failed" >> $LOG_FILE
    fi
else
    echo "$(date): Certificate renewal failed" >> $LOG_FILE
    
    # Send failure notification
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"SSL certificate renewal failed for $DOMAIN\"}" \
        $SLACK_WEBHOOK_URL
fi
```

### Domain Health Check Script
```bash
#!/bin/bash
# domain-health-check.sh

DOMAINS=("api.yourdomain.com" "api-staging.yourdomain.com")
WEBHOOK_URL="your-slack-webhook-url"

for domain in "${DOMAINS[@]}"; do
    echo "Checking $domain..."
    
    # Check HTTP status
    status=$(curl -s -o /dev/null -w "%{http_code}" https://$domain/api/health)
    
    if [ $status -eq 200 ]; then
        echo "$domain is healthy (HTTP $status)"
    else
        echo "$domain is unhealthy (HTTP $status)"
        
        # Send alert
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Domain $domain is unhealthy (HTTP $status)\"}" \
            $WEBHOOK_URL
    fi
    
    # Check SSL certificate expiry
    expiry_days=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2 | xargs -I {} date -d {} +%s | xargs -I {} expr \( {} - $(date +%s) \) / 86400)
    
    if [ $expiry_days -lt 30 ]; then
        echo "SSL certificate for $domain expires in $expiry_days days"
        
        # Send alert
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"SSL certificate for $domain expires in $expiry_days days\"}" \
            $WEBHOOK_URL
    fi
done
```

---

This comprehensive guide covers all aspects of SSL certificate and domain configuration for the UIMP backend. Choose the methods that best fit your infrastructure and security requirements.