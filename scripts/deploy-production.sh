#!/bin/bash

# UIMP Backend Production Deployment Script
# Supports multiple cloud providers and deployment methods

set -e

# Configuration
CLOUD_PROVIDER=${1:-"docker"}  # docker, aws, gcp, azure, digitalocean, heroku
ENVIRONMENT=${2:-"production"}
DOMAIN_NAME=${3:-"api.yourdomain.com"}
SSL_METHOD=${4:-"letsencrypt"}  # letsencrypt, custom, cloudflare

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    UIMP Backend Deployment                   ║"
echo "║              Unified Internship & Mentorship Portal         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}🚀 Starting deployment to ${CLOUD_PROVIDER} (${ENVIRONMENT})${NC}"

# Validate environment variables
validate_env() {
    local required_vars=("DATABASE_URL" "JWT_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        printf '%s\n' "${missing_vars[@]}"
        echo -e "${YELLOW}Please set these variables and try again.${NC}"
        exit 1
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    echo -e "${YELLOW}🔍 Running pre-deployment checks...${NC}"
    
    # Check if required files exist
    local required_files=(
        "server/package.json"
        "server/Dockerfile.production"
        "docker-compose.production.yml"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}❌ Required file not found: $file${NC}"
            exit 1
        fi
    done
    
    # Validate environment variables
    validate_env
    
    # Test database connection
    echo -e "${YELLOW}🗄️  Testing database connection...${NC}"
    if command -v psql >/dev/null 2>&1; then
        if psql "${DATABASE_URL}" -c "SELECT version();" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Database connection successful${NC}"
        else
            echo -e "${RED}❌ Database connection failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  psql not found, skipping database test${NC}"
    fi
    
    echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
}

# Build and test application
build_and_test() {
    echo -e "${YELLOW}🔨 Building and testing application...${NC}"
    
    cd server
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm ci
    
    # Run tests
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    npm test
    
    # Build application
    echo -e "${YELLOW}🏗️  Building application...${NC}"
    npm run build
    
    cd ..
    
    echo -e "${GREEN}✅ Build and test completed${NC}"
}

# Deploy based on cloud provider
deploy_to_cloud() {
    case $CLOUD_PROVIDER in
        "docker")
            echo -e "${YELLOW}🐳 Deploying with Docker Compose...${NC}"
            
            # Setup SSL if needed
            if [ "$SSL_METHOD" != "none" ]; then
                ./scripts/setup-ssl.sh "$DOMAIN_NAME" "$ADMIN_EMAIL" "$SSL_METHOD"
            fi
            
            # Deploy with Docker Compose
            docker-compose -f docker-compose.production.yml up -d --build
            
            # Wait for services to be healthy
            echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
            sleep 30
            
            # Test deployment
            if curl -f "http://localhost/api/health" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Docker deployment successful${NC}"
            else
                echo -e "${RED}❌ Docker deployment failed${NC}"
                exit 1
            fi
            ;;
            
        "aws")
            echo -e "${YELLOW}☁️  Deploying to AWS ECS...${NC}"
            
            # Check AWS CLI
            if ! command -v aws >/dev/null 2>&1; then
                echo -e "${RED}❌ AWS CLI not found${NC}"
                exit 1
            fi
            
            # Deploy to ECS
            ./aws/deploy-ecs.sh
            
            # Setup ALB
            if [ ! -z "$CERTIFICATE_ARN" ]; then
                ./aws/setup-alb.sh
            else
                echo -e "${YELLOW}⚠️  No CERTIFICATE_ARN provided, skipping ALB setup${NC}"
            fi
            ;;
            
        "gcp")
            echo -e "${YELLOW}☁️  Deploying to Google Cloud Run...${NC}"
            
            # Check gcloud CLI
            if ! command -v gcloud >/dev/null 2>&1; then
                echo -e "${RED}❌ gcloud CLI not found${NC}"
                exit 1
            fi
            
            # Deploy to Cloud Run
            ./gcp/deploy-cloud-run.sh
            ;;
            
        "azure")
            echo -e "${YELLOW}☁️  Deploying to Azure...${NC}"
            
            # Check Azure CLI
            if ! command -v az >/dev/null 2>&1; then
                echo -e "${RED}❌ Azure CLI not found${NC}"
                exit 1
            fi
            
            echo -e "${YELLOW}Azure deployment script not implemented yet${NC}"
            exit 1
            ;;
            
        "digitalocean")
            echo -e "${YELLOW}☁️  Deploying to DigitalOcean...${NC}"
            
            # Check doctl CLI
            if ! command -v doctl >/dev/null 2>&1; then
                echo -e "${RED}❌ doctl CLI not found${NC}"
                exit 1
            fi
            
            echo -e "${YELLOW}DigitalOcean deployment script not implemented yet${NC}"
            exit 1
            ;;
            
        "heroku")
            echo -e "${YELLOW}☁️  Deploying to Heroku...${NC}"
            
            # Check Heroku CLI
            if ! command -v heroku >/dev/null 2>&1; then
                echo -e "${RED}❌ Heroku CLI not found${NC}"
                exit 1
            fi
            
            # Deploy to Heroku
            heroku create uimp-backend-${ENVIRONMENT} || true
            heroku stack:set container -a uimp-backend-${ENVIRONMENT}
            
            # Set environment variables
            heroku config:set NODE_ENV=${ENVIRONMENT} -a uimp-backend-${ENVIRONMENT}
            heroku config:set DATABASE_URL="${DATABASE_URL}" -a uimp-backend-${ENVIRONMENT}
            heroku config:set JWT_SECRET="${JWT_SECRET}" -a uimp-backend-${ENVIRONMENT}
            
            # Deploy
            git push heroku main
            
            # Add custom domain
            if [ "$DOMAIN_NAME" != "api.yourdomain.com" ]; then
                heroku domains:add "$DOMAIN_NAME" -a uimp-backend-${ENVIRONMENT}
                heroku certs:auto:enable -a uimp-backend-${ENVIRONMENT}
            fi
            ;;
            
        *)
            echo -e "${RED}❌ Unknown cloud provider: $CLOUD_PROVIDER${NC}"
            echo -e "${YELLOW}Supported providers: docker, aws, gcp, azure, digitalocean, heroku${NC}"
            exit 1
            ;;
    esac
}

# Post-deployment verification
post_deployment_verification() {
    echo -e "${YELLOW}🔍 Running post-deployment verification...${NC}"
    
    # Determine the URL to test
    local test_url
    case $CLOUD_PROVIDER in
        "docker")
            test_url="http://localhost/api/health"
            ;;
        "heroku")
            test_url="https://uimp-backend-${ENVIRONMENT}.herokuapp.com/api/health"
            ;;
        *)
            test_url="https://${DOMAIN_NAME}/api/health"
            ;;
    esac
    
    # Wait for deployment to be ready
    echo -e "${YELLOW}⏳ Waiting for deployment to be ready...${NC}"
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f "$test_url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            break
        else
            echo -e "${YELLOW}Attempt $attempt/$max_attempts failed, retrying in 10 seconds...${NC}"
            sleep 10
            ((attempt++))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}❌ Health check failed after $max_attempts attempts${NC}"
        exit 1
    fi
    
    # Test API endpoints
    echo -e "${YELLOW}🧪 Testing API endpoints...${NC}"
    
    # Test health endpoint
    local health_response=$(curl -s "$test_url")
    if echo "$health_response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Health endpoint working${NC}"
    else
        echo -e "${RED}❌ Health endpoint failed${NC}"
        echo "$health_response"
    fi
    
    # Test auth endpoints (should return 422 for missing data)
    if curl -s -o /dev/null -w "%{http_code}" "${test_url%/health}/auth/login" | grep -q "422"; then
        echo -e "${GREEN}✅ Auth endpoints accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Auth endpoints may not be working properly${NC}"
    fi
    
    echo -e "${GREEN}✅ Post-deployment verification completed${NC}"
}

# Generate deployment report
generate_report() {
    echo -e "${BLUE}📋 Deployment Report${NC}"
    echo "=================================="
    echo "Cloud Provider: $CLOUD_PROVIDER"
    echo "Environment: $ENVIRONMENT"
    echo "Domain: $DOMAIN_NAME"
    echo "SSL Method: $SSL_METHOD"
    echo "Deployment Time: $(date)"
    echo "=================================="
    
    # Save report to file
    cat > deployment-report-$(date +%Y%m%d-%H%M%S).txt << EOF
UIMP Backend Deployment Report
==============================

Deployment Details:
- Cloud Provider: $CLOUD_PROVIDER
- Environment: $ENVIRONMENT
- Domain: $DOMAIN_NAME
- SSL Method: $SSL_METHOD
- Deployment Time: $(date)

Configuration:
- Database URL: ${DATABASE_URL%@*}@***
- JWT Secret: ***
- Node Environment: $ENVIRONMENT

Next Steps:
1. Monitor application logs
2. Set up monitoring and alerting
3. Configure backup strategies
4. Test all API endpoints
5. Update DNS records if needed

EOF
    
    echo -e "${GREEN}✅ Deployment report saved${NC}"
}

# Main deployment flow
main() {
    echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
    echo -e "  Cloud Provider: $CLOUD_PROVIDER"
    echo -e "  Environment: $ENVIRONMENT"
    echo -e "  Domain: $DOMAIN_NAME"
    echo -e "  SSL Method: $SSL_METHOD"
    echo ""
    
    # Confirm deployment
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
    fi
    
    # Run deployment steps
    pre_deployment_checks
    build_and_test
    deploy_to_cloud
    post_deployment_verification
    generate_report
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    
    # Show next steps
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo -e "  1. Monitor application logs and metrics"
    echo -e "  2. Set up monitoring and alerting"
    echo -e "  3. Configure backup and disaster recovery"
    echo -e "  4. Update documentation"
    echo -e "  5. Notify team of successful deployment"
}

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Usage: $0 <cloud_provider> [environment] [domain] [ssl_method]${NC}"
    echo -e "${YELLOW}Cloud Providers: docker, aws, gcp, azure, digitalocean, heroku${NC}"
    echo -e "${YELLOW}Example: $0 docker production api.yourdomain.com letsencrypt${NC}"
    exit 1
fi

# Run main function
main