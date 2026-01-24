#!/bin/bash

# AWS ECS Deployment Script for UIMP Backend

set -e

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
CLUSTER_NAME=${CLUSTER_NAME:-"uimp-cluster"}
SERVICE_NAME=${SERVICE_NAME:-"uimp-backend-service"}
TASK_FAMILY=${TASK_FAMILY:-"uimp-backend"}
ECR_REPOSITORY=${ECR_REPOSITORY:-"uimp-backend"}
ENVIRONMENT=${ENVIRONMENT:-"production"}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Deploying UIMP Backend to AWS ECS${NC}"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo -e "  AWS Region: ${AWS_REGION}"
echo -e "  Cluster: ${CLUSTER_NAME}"
echo -e "  Service: ${SERVICE_NAME}"
echo -e "  ECR URI: ${ECR_URI}"
echo -e "  Environment: ${ENVIRONMENT}"

# Step 1: Create ECR repository if it doesn't exist
echo -e "${YELLOW}📦 Setting up ECR repository...${NC}"
if ! aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} >/dev/null 2>&1; then
    echo -e "${YELLOW}Creating ECR repository...${NC}"
    aws ecr create-repository \
        --repository-name ${ECR_REPOSITORY} \
        --region ${AWS_REGION} \
        --image-scanning-configuration scanOnPush=true
    
    # Set lifecycle policy
    aws ecr put-lifecycle-policy \
        --repository-name ${ECR_REPOSITORY} \
        --region ${AWS_REGION} \
        --lifecycle-policy-text '{
            "rules": [
                {
                    "rulePriority": 1,
                    "description": "Keep last 10 images",
                    "selection": {
                        "tagStatus": "tagged",
                        "countType": "imageCountMoreThan",
                        "countNumber": 10
                    },
                    "action": {
                        "type": "expire"
                    }
                }
            ]
        }'
else
    echo -e "${GREEN}✅ ECR repository already exists${NC}"
fi

# Step 2: Build and push Docker image
echo -e "${YELLOW}🔨 Building and pushing Docker image...${NC}"

# Login to ECR
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

# Build image
docker build -f server/Dockerfile.production -t ${ECR_REPOSITORY}:latest ./server

# Tag image
docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:latest
docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)

# Push images
docker push ${ECR_URI}:latest
docker push ${ECR_URI}:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)

echo -e "${GREEN}✅ Docker image pushed successfully${NC}"

# Step 3: Create or update task definition
echo -e "${YELLOW}📝 Creating task definition...${NC}"

# Create task definition JSON
cat > aws/task-definition-${ENVIRONMENT}.json << EOF
{
  "family": "${TASK_FAMILY}",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "${ECR_REPOSITORY}",
      "image": "${ECR_URI}:latest",
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
          "value": "${ENVIRONMENT}"
        },
        {
          "name": "PORT",
          "value": "3001"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:uimp/${ENVIRONMENT}/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:uimp/${ENVIRONMENT}/jwt-secret"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:uimp/${ENVIRONMENT}/redis-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${TASK_FAMILY}",
          "awslogs-region": "${AWS_REGION}",
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
EOF

# Register task definition
TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://aws/task-definition-${ENVIRONMENT}.json \
    --region ${AWS_REGION} \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

echo -e "${GREEN}✅ Task definition registered: ${TASK_DEFINITION_ARN}${NC}"

# Step 4: Create ECS cluster if it doesn't exist
echo -e "${YELLOW}🏗️  Setting up ECS cluster...${NC}"
if ! aws ecs describe-clusters --clusters ${CLUSTER_NAME} --region ${AWS_REGION} --query 'clusters[0].status' --output text | grep -q ACTIVE; then
    echo -e "${YELLOW}Creating ECS cluster...${NC}"
    aws ecs create-cluster \
        --cluster-name ${CLUSTER_NAME} \
        --region ${AWS_REGION} \
        --capacity-providers FARGATE \
        --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
else
    echo -e "${GREEN}✅ ECS cluster already exists${NC}"
fi

# Step 5: Create or update ECS service
echo -e "${YELLOW}🔄 Updating ECS service...${NC}"

# Check if service exists
if aws ecs describe-services --cluster ${CLUSTER_NAME} --services ${SERVICE_NAME} --region ${AWS_REGION} --query 'services[0].status' --output text | grep -q ACTIVE; then
    echo -e "${YELLOW}Updating existing service...${NC}"
    aws ecs update-service \
        --cluster ${CLUSTER_NAME} \
        --service ${SERVICE_NAME} \
        --task-definition ${TASK_DEFINITION_ARN} \
        --region ${AWS_REGION}
else
    echo -e "${YELLOW}Creating new service...${NC}"
    
    # Get subnet IDs (you may need to adjust this based on your VPC setup)
    SUBNET_IDS=$(aws ec2 describe-subnets \
        --filters "Name=default-for-az,Values=true" \
        --region ${AWS_REGION} \
        --query 'Subnets[*].SubnetId' \
        --output text | tr '\t' ',')
    
    # Get default security group
    SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=default" \
        --region ${AWS_REGION} \
        --query 'SecurityGroups[0].GroupId' \
        --output text)
    
    aws ecs create-service \
        --cluster ${CLUSTER_NAME} \
        --service-name ${SERVICE_NAME} \
        --task-definition ${TASK_DEFINITION_ARN} \
        --desired-count 2 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_IDS}],securityGroups=[${SECURITY_GROUP_ID}],assignPublicIp=ENABLED}" \
        --region ${AWS_REGION}
fi

# Step 6: Wait for deployment to complete
echo -e "${YELLOW}⏳ Waiting for deployment to complete...${NC}"
aws ecs wait services-stable \
    --cluster ${CLUSTER_NAME} \
    --services ${SERVICE_NAME} \
    --region ${AWS_REGION}

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Step 7: Get service information
echo -e "${YELLOW}📋 Service Information:${NC}"
aws ecs describe-services \
    --cluster ${CLUSTER_NAME} \
    --services ${SERVICE_NAME} \
    --region ${AWS_REGION} \
    --query 'services[0].{Status:status,RunningCount:runningCount,PendingCount:pendingCount,DesiredCount:desiredCount}'

# Step 8: Get task information
echo -e "${YELLOW}📋 Running Tasks:${NC}"
TASK_ARNS=$(aws ecs list-tasks \
    --cluster ${CLUSTER_NAME} \
    --service-name ${SERVICE_NAME} \
    --region ${AWS_REGION} \
    --query 'taskArns' \
    --output text)

if [ ! -z "$TASK_ARNS" ]; then
    aws ecs describe-tasks \
        --cluster ${CLUSTER_NAME} \
        --tasks ${TASK_ARNS} \
        --region ${AWS_REGION} \
        --query 'tasks[*].{TaskArn:taskArn,LastStatus:lastStatus,HealthStatus:healthStatus,CreatedAt:createdAt}'
fi

echo -e "${GREEN}🎉 UIMP Backend deployed successfully to AWS ECS!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "  1. Set up Application Load Balancer (ALB)"
echo -e "  2. Configure SSL certificate in AWS Certificate Manager"
echo -e "  3. Set up Route 53 DNS records"
echo -e "  4. Configure monitoring and alerting"