#!/bin/bash

# Complete AWS Deployment Script
# Deploys both React frontend (S3+CloudFront) and Django backend (Lambda+API Gateway)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STAGE=${1:-dev}
REGION=${2:-us-east-1}
DEPLOY_FRONTEND=${3:-true}
DEPLOY_BACKEND=${4:-true}

echo -e "${BLUE}🚀 Starting Complete AWS Deployment${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  • Stage: ${STAGE}"
echo "  • Region: ${REGION}"
echo "  • Deploy Frontend: ${DEPLOY_FRONTEND}"
echo "  • Deploy Backend: ${DEPLOY_BACKEND}"
echo ""

# Navigate to deployment directory
cd "$(dirname "$0")"

# Deploy Backend First (if enabled)
if [ "${DEPLOY_BACKEND}" = "true" ]; then
    echo -e "${BLUE}🔧 Step 1: Deploying Django Backend to Lambda...${NC}"
    echo "============================================="
    
    ./deploy-backend.sh "${STAGE}" "${REGION}"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Backend deployment failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Backend deployment completed${NC}"
    echo ""
    
    # Extract API Gateway URL
    API_ENDPOINT=$(serverless info --stage "${STAGE}" --region "${REGION}" | grep -E "https://.*\.execute-api\." | awk '{print $2}' | head -1)
    
    if [ -n "${API_ENDPOINT}" ]; then
        echo -e "${YELLOW}📝 Updating React environment for production...${NC}"
        
        # Update the React .env file with the new API endpoint
        cd ../..
        
        # Create or update .env.production
        cat > .env.production << EOF
VITE_API_BASE_URL=${API_ENDPOINT}
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_PUBLISHABLE_KEY}
EOF
        
        echo -e "${GREEN}✅ React environment updated with API endpoint: ${API_ENDPOINT}${NC}"
        cd deployment/aws
    else
        echo -e "${YELLOW}⚠️  Could not extract API Gateway endpoint automatically${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Skipping backend deployment${NC}"
fi

# Deploy Frontend (if enabled)
if [ "${DEPLOY_FRONTEND}" = "true" ]; then
    echo -e "${BLUE}🌐 Step 2: Deploying React Frontend to S3...${NC}"
    echo "==========================================="
    
    ./deploy-frontend.sh "${STAGE}" "${REGION}"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend deployment failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Frontend deployment completed${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping frontend deployment${NC}"
fi

# Final summary
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉${NC}"
echo -e "${BLUE}===========================================${NC}"

if [ "${DEPLOY_BACKEND}" = "true" ]; then
    if [ -n "${API_ENDPOINT}" ]; then
        echo -e "${YELLOW}🔗 Backend API:${NC} ${API_ENDPOINT}"
        echo "  • Test endpoint: ${API_ENDPOINT}/api/"
        echo "  • Pages API: ${API_ENDPOINT}/api/pages/"
        echo "  • Benefits API: ${API_ENDPOINT}/api/benefits/"
    fi
fi

if [ "${DEPLOY_FRONTEND}" = "true" ]; then
    S3_BUCKET="higgs-boson-consultancy-frontend-${STAGE}"
    echo -e "${YELLOW}🌐 Frontend:${NC}"
    echo "  • S3 Bucket: ${S3_BUCKET}"
    echo "  • S3 Website: http://${S3_BUCKET}.s3-website-${REGION}.amazonaws.com"
    
    # Try to get CloudFront domain
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='higgs-boson-consultancy Frontend Distribution (${STAGE})'].Id" --output text)
    if [ -n "${DISTRIBUTION_ID}" ] && [ "${DISTRIBUTION_ID}" != "None" ]; then
        CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id "${DISTRIBUTION_ID}" --query 'Distribution.DomainName' --output text)
        echo "  • CloudFront: https://${CLOUDFRONT_DOMAIN}"
    fi
fi

echo ""
echo -e "${BLUE}📝 Important Notes:${NC}"
echo "  • CloudFront distributions take 15-20 minutes to fully deploy"
echo "  • Make sure to update your domain DNS records if using custom domains"
echo "  • Monitor CloudWatch logs for any issues"
echo "  • Consider setting up monitoring and alerts"
echo ""

# Test the deployment
if [ "${DEPLOY_BACKEND}" = "true" ] && [ -n "${API_ENDPOINT}" ]; then
    echo -e "${BLUE}🧪 Testing API endpoint...${NC}"
    
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${API_ENDPOINT}/api/" || echo "000")
    
    if [ "${HTTP_STATUS}" = "200" ]; then
        echo -e "${GREEN}✅ API is responding correctly${NC}"
    else
        echo -e "${YELLOW}⚠️  API test returned status: ${HTTP_STATUS}${NC}"
        echo "  This might be normal if the Lambda is cold starting"
    fi
fi

echo -e "${GREEN}🏁 Deployment process complete!${NC}"
