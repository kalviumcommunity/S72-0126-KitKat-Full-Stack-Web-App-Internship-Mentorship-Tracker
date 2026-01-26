#!/bin/bash

# AWS Application Load Balancer Setup Script

set -e

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
CLUSTER_NAME=${CLUSTER_NAME:-"uimp-cluster"}
SERVICE_NAME=${SERVICE_NAME:-"uimp-backend-service"}
ALB_NAME=${ALB_NAME:-"uimp-backend-alb"}
TARGET_GROUP_NAME=${TARGET_GROUP_NAME:-"uimp-backend-tg"}
DOMAIN_NAME=${DOMAIN_NAME:-"api.yourdomain.com"}
CERTIFICATE_ARN=${CERTIFICATE_ARN}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 Setting up Application Load Balancer for UIMP Backend${NC}"

# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --region ${AWS_REGION} --query 'Vpcs[0].VpcId' --output text)
echo -e "${YELLOW}Using VPC: ${VPC_ID}${NC}"

# Get subnet IDs
SUBNET_IDS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=${VPC_ID}" "Name=default-for-az,Values=true" \
    --region ${AWS_REGION} \
    --query 'Subnets[*].SubnetId' \
    --output text)

SUBNET_ARRAY=(${SUBNET_IDS})
if [ ${#SUBNET_ARRAY[@]} -lt 2 ]; then
    echo -e "${RED}❌ Need at least 2 subnets in different AZs for ALB${NC}"
    exit 1
fi

echo -e "${YELLOW}Using subnets: ${SUBNET_IDS}${NC}"

# Step 1: Create security group for ALB
echo -e "${YELLOW}🔒 Creating security group for ALB...${NC}"

ALB_SG_ID=$(aws ec2 create-security-group \
    --group-name ${ALB_NAME}-sg \
    --description "Security group for ${ALB_NAME}" \
    --vpc-id ${VPC_ID} \
    --region ${AWS_REGION} \
    --query 'GroupId' \
    --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=${ALB_NAME}-sg" \
        --region ${AWS_REGION} \
        --query 'SecurityGroups[0].GroupId' \
        --output text)

# Add inbound rules for ALB
aws ec2 authorize-security-group-ingress \
    --group-id ${ALB_SG_ID} \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id ${ALB_SG_ID} \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || true

echo -e "${GREEN}✅ ALB Security Group: ${ALB_SG_ID}${NC}"

# Step 2: Create security group for ECS tasks
echo -e "${YELLOW}🔒 Creating security group for ECS tasks...${NC}"

ECS_SG_ID=$(aws ec2 create-security-group \
    --group-name ${SERVICE_NAME}-sg \
    --description "Security group for ${SERVICE_NAME}" \
    --vpc-id ${VPC_ID} \
    --region ${AWS_REGION} \
    --query 'GroupId' \
    --output text 2>/dev/null || \
    aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=${SERVICE_NAME}-sg" \
        --region ${AWS_REGION} \
        --query 'SecurityGroups[0].GroupId' \
        --output text)

# Allow traffic from ALB to ECS tasks
aws ec2 authorize-security-group-ingress \
    --group-id ${ECS_SG_ID} \
    --protocol tcp \
    --port 3001 \
    --source-group ${ALB_SG_ID} \
    --region ${AWS_REGION} 2>/dev/null || true

echo -e "${GREEN}✅ ECS Security Group: ${ECS_SG_ID}${NC}"

# Step 3: Create Application Load Balancer
echo -e "${YELLOW}🏗️  Creating Application Load Balancer...${NC}"

ALB_ARN=$(aws elbv2 create-load-balancer \
    --name ${ALB_NAME} \
    --subnets ${SUBNET_IDS} \
    --security-groups ${ALB_SG_ID} \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --region ${AWS_REGION} \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text 2>/dev/null || \
    aws elbv2 describe-load-balancers \
        --names ${ALB_NAME} \
        --region ${AWS_REGION} \
        --query 'LoadBalancers[0].LoadBalancerArn' \
        --output text)

echo -e "${GREEN}✅ ALB Created: ${ALB_ARN}${NC}"

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns ${ALB_ARN} \
    --region ${AWS_REGION} \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

echo -e "${YELLOW}ALB DNS Name: ${ALB_DNS}${NC}"

# Step 4: Create target group
echo -e "${YELLOW}🎯 Creating target group...${NC}"

TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
    --name ${TARGET_GROUP_NAME} \
    --protocol HTTP \
    --port 3001 \
    --vpc-id ${VPC_ID} \
    --target-type ip \
    --health-check-path /api/health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --matcher HttpCode=200 \
    --region ${AWS_REGION} \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text 2>/dev/null || \
    aws elbv2 describe-target-groups \
        --names ${TARGET_GROUP_NAME} \
        --region ${AWS_REGION} \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

echo -e "${GREEN}✅ Target Group Created: ${TARGET_GROUP_ARN}${NC}"

# Step 5: Create HTTP listener (redirect to HTTPS)
echo -e "${YELLOW}🔀 Creating HTTP listener (redirect to HTTPS)...${NC}"

aws elbv2 create-listener \
    --load-balancer-arn ${ALB_ARN} \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}' \
    --region ${AWS_REGION} >/dev/null 2>&1 || true

# Step 6: Create HTTPS listener (if certificate ARN is provided)
if [ ! -z "${CERTIFICATE_ARN}" ]; then
    echo -e "${YELLOW}🔒 Creating HTTPS listener...${NC}"
    
    aws elbv2 create-listener \
        --load-balancer-arn ${ALB_ARN} \
        --protocol HTTPS \
        --port 443 \
        --certificates CertificateArn=${CERTIFICATE_ARN} \
        --default-actions Type=forward,TargetGroupArn=${TARGET_GROUP_ARN} \
        --region ${AWS_REGION} >/dev/null 2>&1 || true
    
    echo -e "${GREEN}✅ HTTPS listener created with certificate${NC}"
else
    echo -e "${YELLOW}⚠️  No certificate ARN provided. Creating HTTP listener only.${NC}"
    
    aws elbv2 create-listener \
        --load-balancer-arn ${ALB_ARN} \
        --protocol HTTP \
        --port 80 \
        --default-actions Type=forward,TargetGroupArn=${TARGET_GROUP_ARN} \
        --region ${AWS_REGION} >/dev/null 2>&1 || true
fi

# Step 7: Update ECS service to use target group
echo -e "${YELLOW}🔄 Updating ECS service to use ALB...${NC}"

aws ecs update-service \
    --cluster ${CLUSTER_NAME} \
    --service ${SERVICE_NAME} \
    --load-balancers targetGroupArn=${TARGET_GROUP_ARN},containerName=uimp-backend,containerPort=3001 \
    --region ${AWS_REGION} >/dev/null

# Wait for service to stabilize
echo -e "${YELLOW}⏳ Waiting for service to stabilize...${NC}"
aws ecs wait services-stable \
    --cluster ${CLUSTER_NAME} \
    --services ${SERVICE_NAME} \
    --region ${AWS_REGION}

echo -e "${GREEN}✅ ECS service updated with load balancer${NC}"

# Step 8: Create Route 53 record (if domain is provided)
if [ "${DOMAIN_NAME}" != "api.yourdomain.com" ]; then
    echo -e "${YELLOW}🌐 Creating Route 53 DNS record...${NC}"
    
    # Get hosted zone ID
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones \
        --query "HostedZones[?contains(Name, '$(echo ${DOMAIN_NAME} | cut -d. -f2-)')].Id" \
        --output text | cut -d/ -f3)
    
    if [ ! -z "${HOSTED_ZONE_ID}" ]; then
        # Create change batch
        cat > /tmp/route53-change.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "${DOMAIN_NAME}",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "${ALB_DNS}",
                    "EvaluateTargetHealth": true,
                    "HostedZoneId": "$(aws elbv2 describe-load-balancers --load-balancer-arns ${ALB_ARN} --region ${AWS_REGION} --query 'LoadBalancers[0].CanonicalHostedZoneId' --output text)"
                }
            }
        }
    ]
}
EOF
        
        # Apply DNS change
        aws route53 change-resource-record-sets \
            --hosted-zone-id ${HOSTED_ZONE_ID} \
            --change-batch file:///tmp/route53-change.json \
            --region ${AWS_REGION} >/dev/null
        
        echo -e "${GREEN}✅ Route 53 DNS record created for ${DOMAIN_NAME}${NC}"
        rm /tmp/route53-change.json
    else
        echo -e "${YELLOW}⚠️  Hosted zone not found for domain ${DOMAIN_NAME}${NC}"
    fi
fi

# Step 9: Output summary
echo -e "${GREEN}🎉 Application Load Balancer setup completed!${NC}"
echo -e "${YELLOW}📋 Summary:${NC}"
echo -e "  ALB Name: ${ALB_NAME}"
echo -e "  ALB DNS: ${ALB_DNS}"
echo -e "  Target Group: ${TARGET_GROUP_NAME}"
echo -e "  Security Groups: ${ALB_SG_ID}, ${ECS_SG_ID}"

if [ ! -z "${CERTIFICATE_ARN}" ]; then
    echo -e "  HTTPS URL: https://${DOMAIN_NAME}"
else
    echo -e "  HTTP URL: http://${ALB_DNS}"
fi

echo -e "${YELLOW}📝 Next steps:${NC}"
if [ -z "${CERTIFICATE_ARN}" ]; then
    echo -e "  1. Request SSL certificate in AWS Certificate Manager"
    echo -e "  2. Update HTTPS listener with certificate ARN"
fi
echo -e "  3. Test the application: curl -I https://${DOMAIN_NAME}/api/health"
echo -e "  4. Set up monitoring and alerting"
echo -e "  5. Configure auto-scaling policies"