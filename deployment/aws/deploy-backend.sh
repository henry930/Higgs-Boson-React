#!/bin/bash

# AWS Lambda + API Gateway Deployment Script for Django Backend
# This script deploys the Django backend to AWS Lambda using Serverless Framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="higgs-boson-api"
STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo -e "${BLUE}🚀 Starting AWS Lambda + API Gateway deployment for Django backend${NC}"
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  • Project: ${PROJECT_NAME}"
echo "  • Stage: ${STAGE}"
echo "  • Region: ${REGION}"
echo ""

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo -e "${YELLOW}⚠️  Serverless Framework not found. Installing...${NC}"
    npm install -g serverless
    echo -e "${GREEN}✅ Serverless Framework installed${NC}"
fi

# Check if serverless-python-requirements plugin is available
if ! serverless plugin list | grep -q "serverless-python-requirements"; then
    echo -e "${YELLOW}⚠️  Installing serverless-python-requirements plugin...${NC}"
    serverless plugin install -n serverless-python-requirements
    echo -e "${GREEN}✅ Plugin installed${NC}"
fi

# Navigate to deployment directory
cd "$(dirname "$0")"

# Check if required environment variables are set
echo -e "${BLUE}🔍 Checking environment variables...${NC}"

if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}❌ SUPABASE_URL environment variable is not set${NC}"
    echo "Please set: export SUPABASE_URL=your_supabase_url"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_SERVICE_KEY environment variable is not set${NC}"
    echo "Please set: export SUPABASE_SERVICE_KEY=your_supabase_service_key"
    exit 1
fi

if [ -z "$SECRET_KEY" ]; then
    echo -e "${YELLOW}⚠️  SECRET_KEY not set. Generating a random one...${NC}"
    export SECRET_KEY=$(openssl rand -base64 32)
    echo "Generated SECRET_KEY: ${SECRET_KEY}"
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Copy Django server files to deployment directory
echo -e "${BLUE}📁 Preparing Django files for deployment...${NC}"

# Create server directory in deployment folder
rm -rf server
cp -r ../../server ./server

# Remove unnecessary files for Lambda
find ./server -name "*.pyc" -delete
find ./server -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
rm -rf ./server/migrations 2>/dev/null || true
rm -f ./server/db.sqlite3 2>/dev/null || true
rm -f ./server/*.log 2>/dev/null || true

echo -e "${GREEN}✅ Django files prepared${NC}"

# Deploy to AWS
echo -e "${BLUE}🚀 Deploying to AWS Lambda...${NC}"

# Set environment variables for deployment
export DJANGO_SETTINGS_MODULE=settings
export DEBUG=false
export ALLOWED_HOSTS="*"
export CORS_ALLOW_ALL_ORIGINS=true

# Deploy using Serverless Framework
serverless deploy --stage "${STAGE}" --region "${REGION}" --verbose

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    
    # Get API Gateway endpoint
    API_ENDPOINT=$(serverless info --stage "${STAGE}" --region "${REGION}" | grep "https://" | awk '{print $2}')
    
    echo ""
    echo -e "${YELLOW}📋 Deployment Information:${NC}"
    echo "  • Stage: ${STAGE}"
    echo "  • Region: ${REGION}"
    echo "  • API Gateway Endpoint: ${API_ENDPOINT}"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo "  1. Update your React app's API_BASE_URL to: ${API_ENDPOINT}"
    echo "  2. Test the API endpoints:"
    echo "     curl ${API_ENDPOINT}/api/"
    echo "     curl ${API_ENDPOINT}/api/pages/"
    echo "  3. Deploy the frontend to S3/CloudFront"
    echo ""
    echo -e "${GREEN}✅ Backend deployment complete!${NC}"
else
    echo -e "${RED}❌ Deployment failed. Check the logs above for details.${NC}"
    exit 1
fi
