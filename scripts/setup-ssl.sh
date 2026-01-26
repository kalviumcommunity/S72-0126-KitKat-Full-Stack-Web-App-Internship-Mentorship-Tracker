#!/bin/bash

# SSL Certificate Setup Script for UIMP Backend
# Supports Let's Encrypt and custom certificates

set -e

# Configuration
DOMAIN=${1:-"api.yourdomain.com"}
EMAIL=${2:-"admin@yourdomain.com"}
SSL_METHOD=${3:-"letsencrypt"}  # letsencrypt, custom, or cloudflare
NGINX_CONF_DIR="./nginx"
SSL_DIR="./nginx/ssl"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 Setting up SSL certificate for ${DOMAIN}${NC}"

# Create SSL directory
mkdir -p "${SSL_DIR}"

case $SSL_METHOD in
    "letsencrypt")
        echo -e "${YELLOW}📜 Setting up Let's Encrypt certificate...${NC}"
        
        # Check if certbot is installed
        if ! command -v certbot &> /dev/null; then
            echo -e "${RED}❌ Certbot is not installed. Installing...${NC}"
            
            # Install certbot based on OS
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                if command -v apt-get &> /dev/null; then
                    sudo apt-get update
                    sudo apt-get install -y certbot python3-certbot-nginx
                elif command -v yum &> /dev/null; then
                    sudo yum install -y certbot python3-certbot-nginx
                else
                    echo -e "${RED}❌ Unsupported Linux distribution${NC}"
                    exit 1
                fi
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                if command -v brew &> /dev/null; then
                    brew install certbot
                else
                    echo -e "${RED}❌ Homebrew is required on macOS${NC}"
                    exit 1
                fi
            else
                echo -e "${RED}❌ Unsupported operating system${NC}"
                exit 1
            fi
        fi
        
        # Stop nginx if running
        if docker-compose ps nginx | grep -q "Up"; then
            echo -e "${YELLOW}⏸️  Stopping nginx container...${NC}"
            docker-compose stop nginx
        fi
        
        # Generate certificate using standalone mode
        echo -e "${YELLOW}🔐 Generating Let's Encrypt certificate...${NC}"
        sudo certbot certonly \
            --standalone \
            --email "${EMAIL}" \
            --agree-tos \
            --no-eff-email \
            --domains "${DOMAIN}" \
            --cert-path "${SSL_DIR}/cert.pem" \
            --key-path "${SSL_DIR}/privkey.pem" \
            --fullchain-path "${SSL_DIR}/fullchain.pem" \
            --chain-path "${SSL_DIR}/chain.pem"
        
        # Copy certificates to nginx directory
        sudo cp "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" "${SSL_DIR}/"
        sudo cp "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" "${SSL_DIR}/"
        sudo chown $(whoami):$(whoami) "${SSL_DIR}"/*.pem
        
        # Setup auto-renewal
        echo -e "${YELLOW}🔄 Setting up auto-renewal...${NC}"
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'docker-compose restart nginx'") | crontab -
        
        echo -e "${GREEN}✅ Let's Encrypt certificate installed successfully${NC}"
        ;;
        
    "custom")
        echo -e "${YELLOW}📋 Setting up custom certificate...${NC}"
        
        if [[ ! -f "${SSL_DIR}/fullchain.pem" ]] || [[ ! -f "${SSL_DIR}/privkey.pem" ]]; then
            echo -e "${RED}❌ Custom certificate files not found${NC}"
            echo -e "${YELLOW}Please place your certificate files in ${SSL_DIR}/:${NC}"
            echo -e "  - fullchain.pem (certificate + intermediate)"
            echo -e "  - privkey.pem (private key)"
            exit 1
        fi
        
        # Validate certificate
        if openssl x509 -in "${SSL_DIR}/fullchain.pem" -text -noout | grep -q "${DOMAIN}"; then
            echo -e "${GREEN}✅ Custom certificate validated for ${DOMAIN}${NC}"
        else
            echo -e "${RED}❌ Certificate does not match domain ${DOMAIN}${NC}"
            exit 1
        fi
        ;;
        
    "cloudflare")
        echo -e "${YELLOW}☁️  Setting up Cloudflare Origin Certificate...${NC}"
        
        # Instructions for Cloudflare setup
        cat << EOF
${YELLOW}To set up Cloudflare Origin Certificate:${NC}

1. Log in to your Cloudflare dashboard
2. Go to SSL/TLS > Origin Server
3. Click "Create Certificate"
4. Select "Let Cloudflare generate a private key and a CSR"
5. Add your domain: ${DOMAIN}
6. Choose certificate validity (15 years recommended)
7. Click "Create"

8. Copy the certificate to: ${SSL_DIR}/fullchain.pem
9. Copy the private key to: ${SSL_DIR}/privkey.pem

10. In Cloudflare SSL/TLS settings:
    - Set SSL/TLS encryption mode to "Full (strict)"
    - Enable "Always Use HTTPS"
    - Enable "HTTP Strict Transport Security (HSTS)"

EOF
        
        # Wait for user to place certificates
        read -p "Press Enter after placing the certificate files..."
        
        if [[ ! -f "${SSL_DIR}/fullchain.pem" ]] || [[ ! -f "${SSL_DIR}/privkey.pem" ]]; then
            echo -e "${RED}❌ Certificate files not found${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ Cloudflare Origin Certificate configured${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Unknown SSL method: ${SSL_METHOD}${NC}"
        echo -e "${YELLOW}Supported methods: letsencrypt, custom, cloudflare${NC}"
        exit 1
        ;;
esac

# Set proper permissions
chmod 600 "${SSL_DIR}/privkey.pem"
chmod 644 "${SSL_DIR}/fullchain.pem"

# Validate certificate
echo -e "${YELLOW}🔍 Validating certificate...${NC}"
if openssl x509 -in "${SSL_DIR}/fullchain.pem" -text -noout > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Certificate is valid${NC}"
    
    # Show certificate details
    echo -e "${YELLOW}📋 Certificate details:${NC}"
    openssl x509 -in "${SSL_DIR}/fullchain.pem" -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After :|DNS:)"
else
    echo -e "${RED}❌ Certificate validation failed${NC}"
    exit 1
fi

# Test SSL configuration
echo -e "${YELLOW}🧪 Testing SSL configuration...${NC}"
if openssl s_client -connect "${DOMAIN}:443" -servername "${DOMAIN}" < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
    echo -e "${GREEN}✅ SSL configuration test passed${NC}"
else
    echo -e "${YELLOW}⚠️  SSL test failed - this is normal if the server is not running yet${NC}"
fi

# Create SSL renewal script
cat > scripts/renew-ssl.sh << 'EOF'
#!/bin/bash

# SSL Certificate Renewal Script

set -e

DOMAIN=${1:-"api.yourdomain.com"}
SSL_DIR="./nginx/ssl"

echo "🔄 Renewing SSL certificate for ${DOMAIN}..."

# Renew certificate
sudo certbot renew --quiet

# Copy renewed certificates
sudo cp "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" "${SSL_DIR}/"
sudo cp "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" "${SSL_DIR}/"
sudo chown $(whoami):$(whoami) "${SSL_DIR}"/*.pem

# Restart nginx
docker-compose restart nginx

echo "✅ SSL certificate renewed successfully"
EOF

chmod +x scripts/renew-ssl.sh

echo -e "${GREEN}🎉 SSL setup completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "  1. Update your DNS records to point ${DOMAIN} to your server IP"
echo -e "  2. Start the application: docker-compose -f docker-compose.production.yml up -d"
echo -e "  3. Test the SSL certificate: curl -I https://${DOMAIN}/api/health"
echo -e "  4. Monitor certificate expiration and renewal"