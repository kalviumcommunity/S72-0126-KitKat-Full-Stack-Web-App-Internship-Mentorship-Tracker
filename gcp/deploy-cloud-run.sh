#!/bin/bash

# Google Cloud Run Deployment Script for UIMP Backend

set -e

# Configuration
PROJECT_ID=${PROJECT_ID:-"your-project-id"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME=${SERVICE_NAME:-"uimp-backend"}
IMAGE_NAME=${IMAGE_NAME:-"uimp-backend"}
ENVIRONMENT=${ENVIRONMENT:-"production"}
DOMAIN_NAME=${DOMAIN_NAME:-"api.yourdomain.com"}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Deploying UIMP Backend to Google Cloud Run${NC}"

# Set project
gcloud config set project ${PROJECT_ID}

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo -e "  Project ID: ${PROJECT_ID}"
echo -e "  Region: ${REGION}"
echo -e "  Service: ${SERVICE_NAME}"
echo -e "  Environment: ${ENVIRONMENT}"
echo -e "  Domain: ${DOMAIN_NAME}"

# Step 1: Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable sql-component.googleapis.com

# Step 2: Create secrets in Secret Manager
echo -e "${YELLOW}🔐 Setting up secrets...${NC}"

# Create secrets if they don't exist
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if ! gcloud secrets describe ${secret_name} >/dev/null 2>&1; then
        echo -e "${YELLOW}Creating secret: ${secret_name}${NC}"
        echo -n "${secret_value}" | gcloud secrets create ${secret_name} --data-file=-
    else
        echo -e "${GREEN}✅ Secret ${secret_name} already exists${NC}"
    fi
}

# You'll need to set these environment variables before running
if [ -z "${DATABASE_URL}" ] || [ -z "${JWT_SECRET}" ]; then
    echo -e "${RED}❌ Please set DATABASE_URL and JWT_SECRET environment variables${NC}"
    echo -e "${YELLOW}Example:${NC}"
    echo -e "  export DATABASE_URL='postgresql://user:pass@host:5432/db'"
    echo -e "  export JWT_SECRET='your-super-secret-jwt-key'"
    exit 1
fi

create_secret "database-url" "${DATABASE_URL}"
create_secret "jwt-secret" "${JWT_SECRET}"
create_secret "redis-url" "${REDIS_URL:-redis://localhost:6379}"

# Step 3: Build and deploy to Cloud Run
echo -e "${YELLOW}🔨 Building and deploying to Cloud Run...${NC}"

# Deploy using source
gcloud run deploy ${SERVICE_NAME} \
    --source ./server \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --port 3001 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --timeout 300 \
    --concurrency 80 \
    --set-env-vars NODE_ENV=${ENVIRONMENT},PORT=3001 \
    --set-secrets DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest,REDIS_URL=redis-url:latest

echo -e "${GREEN}✅ Cloud Run service deployed successfully${NC}"

# Step 4: Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --platform managed \
    --region ${REGION} \
    --format 'value(status.url)')

echo -e "${YELLOW}Service URL: ${SERVICE_URL}${NC}"

# Step 5: Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
if curl -f "${SERVICE_URL}/api/health" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# Step 6: Set up custom domain mapping
if [ "${DOMAIN_NAME}" != "api.yourdomain.com" ]; then
    echo -e "${YELLOW}🌐 Setting up custom domain mapping...${NC}"
    
    # Create domain mapping
    gcloud run domain-mappings create \
        --service ${SERVICE_NAME} \
        --domain ${DOMAIN_NAME} \
        --region ${REGION} || true
    
    # Get the required DNS records
    echo -e "${YELLOW}📋 DNS Configuration Required:${NC}"
    gcloud run domain-mappings describe ${DOMAIN_NAME} \
        --region ${REGION} \
        --format="table(spec.routeName:label='CNAME Record',status.resourceRecords[0].rrdata:label='Target')"
    
    echo -e "${YELLOW}Please add the above CNAME record to your DNS provider${NC}"
fi

# Step 7: Set up Cloud SQL (PostgreSQL) if needed
if [[ "${DATABASE_URL}" == *"localhost"* ]] || [[ "${DATABASE_URL}" == *"127.0.0.1"* ]]; then
    echo -e "${YELLOW}🗄️  Setting up Cloud SQL PostgreSQL...${NC}"
    
    INSTANCE_NAME="${SERVICE_NAME}-postgres"
    
    # Create Cloud SQL instance
    if ! gcloud sql instances describe ${INSTANCE_NAME} >/dev/null 2>&1; then
        echo -e "${YELLOW}Creating Cloud SQL instance...${NC}"
        gcloud sql instances create ${INSTANCE_NAME} \
            --database-version=POSTGRES_13 \
            --tier=db-f1-micro \
            --region=${REGION} \
            --storage-type=SSD \
            --storage-size=10GB \
            --backup-start-time=03:00 \
            --enable-bin-log \
            --deletion-protection
        
        # Create database
        gcloud sql databases create uimp --instance=${INSTANCE_NAME}
        
        # Create user
        DB_PASSWORD=$(openssl rand -base64 32)
        gcloud sql users create uimpuser \
            --instance=${INSTANCE_NAME} \
            --password=${DB_PASSWORD}
        
        # Get connection name
        CONNECTION_NAME=$(gcloud sql instances describe ${INSTANCE_NAME} \
            --format='value(connectionName)')
        
        # Update DATABASE_URL secret
        NEW_DATABASE_URL="postgresql://uimpuser:${DB_PASSWORD}@/${INSTANCE_NAME}?host=/cloudsql/${CONNECTION_NAME}"
        echo -n "${NEW_DATABASE_URL}" | gcloud secrets versions add database-url --data-file=-
        
        echo -e "${GREEN}✅ Cloud SQL instance created${NC}"
        echo -e "${YELLOW}Connection Name: ${CONNECTION_NAME}${NC}"
        
        # Update Cloud Run service to use Cloud SQL
        gcloud run services update ${SERVICE_NAME} \
            --add-cloudsql-instances ${CONNECTION_NAME} \
            --region ${REGION}
    else
        echo -e "${GREEN}✅ Cloud SQL instance already exists${NC}"
    fi
fi

# Step 8: Set up monitoring and alerting
echo -e "${YELLOW}📊 Setting up monitoring...${NC}"

# Create notification channel (email)
if [ ! -z "${ALERT_EMAIL}" ]; then
    NOTIFICATION_CHANNEL=$(gcloud alpha monitoring channels create \
        --display-name="UIMP Alerts" \
        --type=email \
        --channel-labels=email_address=${ALERT_EMAIL} \
        --format="value(name)" 2>/dev/null || echo "")
    
    if [ ! -z "${NOTIFICATION_CHANNEL}" ]; then
        # Create alerting policy for high error rate
        cat > /tmp/alert-policy.yaml << EOF
displayName: "UIMP Backend High Error Rate"
conditions:
  - displayName: "High error rate"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND resource.labels.service_name="${SERVICE_NAME}"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 0.1
      duration: 300s
      aggregations:
        - alignmentPeriod: 60s
          perSeriesAligner: ALIGN_RATE
          crossSeriesReducer: REDUCE_MEAN
          groupByFields:
            - resource.labels.service_name
notificationChannels:
  - ${NOTIFICATION_CHANNEL}
EOF
        
        gcloud alpha monitoring policies create --policy-from-file=/tmp/alert-policy.yaml
        rm /tmp/alert-policy.yaml
        
        echo -e "${GREEN}✅ Monitoring and alerting configured${NC}"
    fi
fi

# Step 9: Output summary
echo -e "${GREEN}🎉 UIMP Backend deployed successfully to Google Cloud Run!${NC}"
echo -e "${YELLOW}📋 Summary:${NC}"
echo -e "  Service Name: ${SERVICE_NAME}"
echo -e "  Service URL: ${SERVICE_URL}"
echo -e "  Region: ${REGION}"
echo -e "  Custom Domain: ${DOMAIN_NAME}"

echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "  1. Configure DNS records for custom domain"
echo -e "  2. Test the application: curl -I ${SERVICE_URL}/api/health"
echo -e "  3. Set up CI/CD pipeline"
echo -e "  4. Configure additional monitoring and logging"

# Step 10: Create deployment script for future updates
cat > gcp/update-service.sh << EOF
#!/bin/bash

# Quick update script for Cloud Run service

set -e

PROJECT_ID=${PROJECT_ID}
REGION=${REGION}
SERVICE_NAME=${SERVICE_NAME}

echo "🔄 Updating Cloud Run service..."

gcloud run deploy \${SERVICE_NAME} \\
    --source ./server \\
    --platform managed \\
    --region \${REGION} \\
    --project \${PROJECT_ID}

echo "✅ Service updated successfully"
EOF

chmod +x gcp/update-service.sh

echo -e "${GREEN}✅ Update script created: gcp/update-service.sh${NC}"