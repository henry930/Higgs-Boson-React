#!/bin/bash

# Optimized Google Calendar Booking Lambda Deployment
# This script uses layers for dependencies and deploys to us-east-1

set -e

# Configuration
FUNCTION_NAME="google-calendar-booking"
LAYER_NAME="higgs-boson-consultancy-layer"
REGION="us-east-1"
RUNTIME="python3.9"
HANDLER="lambda_calendar_booking.lambda_handler"
TIMEOUT=30
MEMORY_SIZE=256

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting optimized Lambda deployment for Google Calendar Booking${NC}"
echo -e "${YELLOW}📍 Target region: $REGION${NC}"

# Step 1: Check if layer exists in us-east-1, create if needed
echo -e "${YELLOW}🔍 Checking for layer in $REGION...${NC}"
LAYER_ARN=$(aws lambda list-layer-versions --region $REGION --layer-name $LAYER_NAME --query 'LayerVersions[0].LayerVersionArn' --output text 2>/dev/null || echo "NONE")

if [ "$LAYER_ARN" = "NONE" ] || [ "$LAYER_ARN" = "None" ]; then
    echo -e "${YELLOW}📦 Layer not found in $REGION. Creating layer...${NC}"
    
    # Create layer build directory
    LAYER_DIR="layer_build"
    PYTHON_DIR="$LAYER_DIR/python"
    
    echo -e "${YELLOW}📦 Building layer directory structure...${NC}"
    rm -rf $LAYER_DIR
    mkdir -p $PYTHON_DIR
    
    # Install dependencies
    echo -e "${YELLOW}📥 Installing Python dependencies for layer...${NC}"
    pip install -r higgs_layer_requirements.txt -t $PYTHON_DIR/
    
    # Create layer package
    echo -e "${YELLOW}📦 Creating layer ZIP package...${NC}"
    cd $LAYER_DIR
    zip -r ../higgs-boson-consultancy-layer.zip .
    cd ..
    
    # Publish layer to us-east-1
    echo -e "${YELLOW}🚀 Publishing layer to $REGION...${NC}"
    LAYER_RESULT=$(aws lambda publish-layer-version \
        --region $REGION \
        --layer-name $LAYER_NAME \
        --description "Common dependencies for Higgs Boson Consultancy Lambda functions (Chat API & Google Calendar)" \
        --zip-file fileb://higgs-boson-consultancy-layer.zip \
        --compatible-runtimes $RUNTIME \
        --output json)
    
    LAYER_ARN=$(echo $LAYER_RESULT | jq -r '.LayerVersionArn')
    echo -e "${GREEN}✅ Layer created: $LAYER_ARN${NC}"
    
    # Clean up layer build
    rm -rf $LAYER_DIR
    rm higgs-boson-consultancy-layer.zip
else
    echo -e "${GREEN}✅ Found existing layer: $LAYER_ARN${NC}"
fi

# Step 2: Create lightweight function package (code only)
echo -e "${YELLOW}📦 Creating lightweight function package...${NC}"
DEPLOY_DIR="lambda_deploy_optimized"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy only the Lambda function code (no dependencies) and Google service account
cp lambda_calendar_booking.py $DEPLOY_DIR/
cp google-service-account.json $DEPLOY_DIR/

# Create deployment package
cd $DEPLOY_DIR
zip -r ../google-calendar-booking-optimized.zip .
cd ..

echo -e "${GREEN}✅ Lightweight package created: google-calendar-booking-optimized.zip${NC}"

# Step 3: Check if function exists in us-east-1
echo -e "${YELLOW}🔍 Checking if Lambda function exists in $REGION...${NC}"
if aws lambda get-function --region $REGION --function-name $FUNCTION_NAME >/dev/null 2>&1; then
    echo -e "${YELLOW}🔄 Updating existing Lambda function...${NC}"
    
    # Update function code
    aws lambda update-function-code \
        --region $REGION \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://google-calendar-booking-optimized.zip
    
    # Update function configuration with layer
    aws lambda update-function-configuration \
        --region $REGION \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --handler $HANDLER \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --layers "$LAYER_ARN"
        
    echo -e "${GREEN}✅ Lambda function updated successfully${NC}"
else
    echo -e "${YELLOW}🆕 Creating new Lambda function in $REGION...${NC}"
    
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
    
    # Create Lambda function with layer
    aws lambda create-function \
        --region $REGION \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler $HANDLER \
        --zip-file fileb://google-calendar-booking-optimized.zip \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --layers "$LAYER_ARN" \
        --description "Google Calendar booking system for Higgs Boson Consultancy"
    
    echo -e "${GREEN}✅ Lambda function created successfully${NC}"
fi

# Step 4: Set environment variables (minimal, since we include the JSON file)
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"
aws lambda update-function-configuration \
    --region $REGION \
    --function-name $FUNCTION_NAME \
    --environment Variables='{"BEDROCK_REGION":"us-east-1","CLAUDE_MODEL_ID":"anthropic.claude-3-5-sonnet-20240620-v1:0"}'

# Step 5: Get function information
echo -e "${YELLOW}🔗 Getting function information...${NC}"
aws lambda get-function --region $REGION --function-name $FUNCTION_NAME --query 'Configuration.[FunctionName,Runtime,LastModified]' --output table

# Clean up
rm -rf $DEPLOY_DIR
rm google-calendar-booking-optimized.zip

echo -e "${GREEN}🎉 Optimized deployment completed!${NC}"
echo -e "${YELLOW}📊 Deployment Summary:${NC}"
echo "• Region: $REGION"
echo "• Function: $FUNCTION_NAME"
echo "• Layer: $LAYER_ARN"
echo "• Runtime: $RUNTIME"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Set up API Gateway in $REGION to route requests to this Lambda function"
echo "2. Update frontend API_CONFIG.CALENDAR_API_URL to point to the new $REGION endpoint"
echo "3. Test the endpoints:"
echo "   - GET /api/google-calendar/live-availability/?date=YYYY-MM-DD"
echo "   - POST /api/google-calendar/book/"
echo ""
echo -e "${YELLOW}💡 Benefits of this optimized deployment:${NC}"
echo "• ✅ Uses Lambda layers for dependencies (faster deployment)"
echo "• ✅ Smaller function package size"
echo "• ✅ Consistent region (us-east-1) with chat API"
echo "• ✅ Faster cold start times"
echo "• ✅ Lower deployment costs"
