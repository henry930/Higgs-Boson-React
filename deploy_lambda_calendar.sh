#!/bin/bash

# Deploy Google Calendar Booking Lambda Function
# This script packages and deploys the Lambda function to AWS

set -e

# Configuration
FUNCTION_NAME="google-calendar-booking"
RUNTIME="python3.9"
HANDLER="lambda_calendar_booking.lambda_handler"
TIMEOUT=30
MEMORY_SIZE=256

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Lambda deployment for Google Calendar Booking${NC}"

# Create deployment directory
DEPLOY_DIR="lambda_deploy"
echo -e "${YELLOW}📦 Creating deployment package...${NC}"

# Clean up previous deployment
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy Lambda function
cp lambda_calendar_booking.py $DEPLOY_DIR/

# Install dependencies
echo -e "${YELLOW}📥 Installing Python dependencies...${NC}"
pip install -r lambda_requirements.txt -t $DEPLOY_DIR/

# Create deployment package
echo -e "${YELLOW}📦 Creating ZIP package...${NC}"
cd $DEPLOY_DIR
zip -r ../google-calendar-booking.zip .
cd ..

echo -e "${GREEN}✅ Package created: google-calendar-booking.zip${NC}"

# Check if function exists
echo -e "${YELLOW}🔍 Checking if Lambda function exists...${NC}"
if aws lambda get-function --function-name $FUNCTION_NAME >/dev/null 2>&1; then
    echo -e "${YELLOW}🔄 Updating existing Lambda function...${NC}"
    
    # Update function code
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://google-calendar-booking.zip
    
    # Update function configuration
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --handler $HANDLER \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE
        
    echo -e "${GREEN}✅ Lambda function updated successfully${NC}"
else
    echo -e "${YELLOW}🆕 Creating new Lambda function...${NC}"
    
    # Create IAM role for Lambda (if it doesn't exist)
    ROLE_NAME="lambda-google-calendar-role"
    
    if ! aws iam get-role --role-name $ROLE_NAME >/dev/null 2>&1; then
        echo -e "${YELLOW}👤 Creating IAM role...${NC}"
        
        # Create trust policy
        cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
        
        # Create role
        aws iam create-role \
            --role-name $ROLE_NAME \
            --assume-role-policy-document file://trust-policy.json
        
        # Attach basic Lambda execution policy
        aws iam attach-role-policy \
            --role-name $ROLE_NAME \
            --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        
        # Clean up
        rm trust-policy.json
        
        echo -e "${GREEN}✅ IAM role created${NC}"
        
        # Wait for role to be available
        echo -e "${YELLOW}⏳ Waiting for IAM role to be available...${NC}"
        sleep 10
    fi
    
    # Get role ARN
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    
    # Create Lambda function
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler $HANDLER \
        --zip-file fileb://google-calendar-booking.zip \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --description "Google Calendar booking system for Higgs Boson Consultancy"
    
    echo -e "${GREEN}✅ Lambda function created successfully${NC}"
fi

# Set environment variables (you'll need to update these with your actual values)
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"

aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --environment Variables='{
        "GOOGLE_PROJECT_ID":"higgs-bonson-consultancy",
        "GOOGLE_CLIENT_EMAIL":"higgs-boson-consultancy-calend@higgs-bonson-consultancy.iam.gserviceaccount.com"
    }'

echo -e "${RED}⚠️  IMPORTANT: You need to set the following environment variables manually:${NC}"
echo -e "${RED}   - GOOGLE_PRIVATE_KEY_ID${NC}"
echo -e "${RED}   - GOOGLE_PRIVATE_KEY${NC}"
echo -e "${RED}   - GOOGLE_CLIENT_ID${NC}"
echo -e "${RED}   Use AWS CLI or AWS Console to set these securely${NC}"

# Get function URL (if API Gateway is set up)
echo -e "${YELLOW}🔗 Getting function information...${NC}"
aws lambda get-function --function-name $FUNCTION_NAME --query 'Configuration.[FunctionName,Runtime,LastModified]' --output table

# Clean up
rm -rf $DEPLOY_DIR
rm google-calendar-booking.zip

echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Set the Google service account environment variables securely"
echo "2. Configure API Gateway to route requests to this Lambda function"
echo "3. Test the endpoints:"
echo "   - GET /api/google-calendar/live-availability/?date=YYYY-MM-DD"
echo "   - POST /api/google-calendar/book/"
echo "4. Update your frontend API_CONFIG.BASE_URL to point to the API Gateway"
