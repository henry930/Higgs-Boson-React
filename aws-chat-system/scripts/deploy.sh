#!/bin/bash

# AWS AI Chat System Deployment Script
# This script deploys the complete AWS infrastructure for your AI chat system

set -e

echo "🚀 AWS AI Chat System Deployment"
echo "=================================="

# Configuration
PROJECT_NAME="higgs-chat-system"
REGION="us-east-1"  # Change to your preferred region
STACK_NAME="${PROJECT_NAME}-infrastructure"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Check if GitHub token is provided
read -s -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token is required"
    exit 1
fi

echo "✅ GitHub token provided"

# Check if Bedrock is available in the region
echo "🔍 Checking Amazon Bedrock availability..."
if aws bedrock list-foundation-models --region $REGION > /dev/null 2>&1; then
    echo "✅ Amazon Bedrock is available in $REGION"
else
    echo "❌ Amazon Bedrock is not available in $REGION"
    echo "Please choose a region where Bedrock is available (us-east-1, us-west-2, etc.)"
    exit 1
fi

# Deploy CloudFormation stack
echo "📦 Deploying CloudFormation infrastructure..."
aws cloudformation deploy \
    --template-file ../cloudformation/infrastructure.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        ProjectName=$PROJECT_NAME \
        GitHubToken=$GITHUB_TOKEN \
    --capabilities CAPABILITY_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Infrastructure deployed successfully"
else
    echo "❌ Infrastructure deployment failed"
    exit 1
fi

# Get stack outputs
echo "📋 Getting deployment information..."
WEBSOCKET_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebSocketURL`].OutputValue' \
    --output text)

echo "✅ WebSocket URL: $WEBSOCKET_URL"

# Update Lambda functions
echo "🔧 Updating Lambda functions..."

# Create deployment packages
cd ../lambda

# Package chat handler
echo "📦 Packaging chat handler..."
zip -r chat-handler.zip chat_handler.py requirements.txt

# Update chat function
aws lambda update-function-code \
    --function-name "${PROJECT_NAME}-chat" \
    --zip-file fileb://chat-handler.zip \
    --region $REGION

# Package connect handler
echo "📦 Packaging connect handler..."
zip -r connect-handler.zip connect_handler.py

# Update connect function
aws lambda update-function-code \
    --function-name "${PROJECT_NAME}-connect" \
    --zip-file fileb://connect-handler.zip \
    --region $REGION

# Package disconnect handler
echo "📦 Packaging disconnect handler..."
zip -r disconnect-handler.zip disconnect_handler.py

# Update disconnect function
aws lambda update-function-code \
    --function-name "${PROJECT_NAME}-disconnect" \
    --zip-file fileb://disconnect-handler.zip \
    --region $REGION

echo "✅ Lambda functions updated"

# Clean up
rm -f *.zip
cd ../scripts

# Update frontend with WebSocket URL
echo "🌐 Updating frontend configuration..."
sed -i.bak "s|wss://your-api-id.execute-api.us-east-1.amazonaws.com/prod|$WEBSOCKET_URL|g" \
    ../frontend/admin.html

echo "✅ Frontend updated with WebSocket URL"

# Deploy frontend to S3 (optional)
echo "📤 Would you like to deploy the admin interface to your S3 bucket? (y/n)"
read -r DEPLOY_FRONTEND

if [ "$DEPLOY_FRONTEND" = "y" ] || [ "$DEPLOY_FRONTEND" = "Y" ]; then
    read -p "Enter your S3 bucket name: " S3_BUCKET
    
    if [ -n "$S3_BUCKET" ]; then
        aws s3 cp ../frontend/admin.html s3://$S3_BUCKET/admin.html \
            --content-type "text/html" \
            --region $REGION
        
        echo "✅ Admin interface deployed to: https://$S3_BUCKET.s3.amazonaws.com/admin.html"
    fi
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📋 Summary:"
echo "  • Infrastructure: ✅ Deployed"
echo "  • Lambda Functions: ✅ Updated"
echo "  • WebSocket API: ✅ $WEBSOCKET_URL"
echo "  • Admin Interface: ✅ Ready"
echo ""
echo "🔧 Next Steps:"
echo "1. Open the admin interface in your browser"
echo "2. Enter any access key to authenticate (demo mode)"
echo "3. Start chatting with your AI assistant!"
echo ""
echo "💡 Note: The system is now in demo mode. To enable full functionality:"
echo "  • Ensure Amazon Bedrock access is enabled in your AWS account"
echo "  • Request access to Claude models if needed"
echo "  • Update the WebSocket URL in the frontend if needed"
echo ""
echo "🔗 Admin Interface: file://$(pwd)/../frontend/admin.html"
