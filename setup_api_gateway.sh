#!/bin/bash

# API Gateway Configuration Script
set -e

API_ID="95d9cmhpoh"
REGION="ap-northeast-1"
ACCOUNT_ID="358157044493"
LAMBDA_FUNCTION="google-calendar-booking"

echo "🔧 Configuring API Gateway..."

# Add Lambda permission for API Gateway
echo "📝 Adding Lambda permissions..."
aws lambda add-permission \
    --function-name $LAMBDA_FUNCTION \
    --statement-id api-gateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" || echo "Permission already exists"

# Deploy API to prod stage
echo "🚀 Deploying API..."
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --query 'id' --output text)

echo "✅ API Gateway deployed successfully!"
echo "🌐 API Gateway URL: https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"
echo "📍 Lambda function endpoint: https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod/api/google-calendar/"

# Test the API
echo "🧪 Testing API availability endpoint..."
curl -s "https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod/api/google-calendar/live-availability/?date=$(date -v+1d +%Y-%m-%d)" | jq .

echo "🎉 API Gateway setup complete!"
