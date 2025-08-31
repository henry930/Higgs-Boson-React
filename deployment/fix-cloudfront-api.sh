#!/bin/bash

# Fix CloudFront API Routing - Add API Gateway Origin and Cache Behavior
# This script updates CloudFront to properly route /api/* requests to API Gateway

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fixing CloudFront API Routing...${NC}"
echo -e "${YELLOW}📋 This will add API Gateway as an origin and create cache behavior for /api/* routes${NC}"

# Configuration
DISTRIBUTION_ID="E2HJ0QZBZ5VR38"
API_GATEWAY_DOMAIN="r3zeleb6z5.execute-api.us-east-1.amazonaws.com"
REGION="us-east-1"

echo -e "${BLUE}🔍 Getting current CloudFront configuration...${NC}"

# Get current configuration
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID --region $REGION > temp-config.json

# Extract ETag and DistributionConfig
ETAG=$(jq -r '.ETag' temp-config.json)
jq '.DistributionConfig' temp-config.json > distribution-config.json

echo -e "${BLUE}📝 Adding API Gateway origin...${NC}"

# Add API Gateway as second origin
jq --arg domain "$API_GATEWAY_DOMAIN" '
.Origins.Quantity = 2 |
.Origins.Items += [{
    "Id": "API-Gateway-Origin",
    "DomainName": $domain,
    "OriginPath": "/prod",
    "CustomHeaders": {
        "Quantity": 0
    },
    "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "https-only",
        "OriginSslProtocols": {
            "Quantity": 1,
            "Items": ["TLSv1.2"]
        },
        "OriginReadTimeout": 30,
        "OriginKeepaliveTimeout": 5
    },
    "ConnectionAttempts": 3,
    "ConnectionTimeout": 10,
    "OriginShield": {
        "Enabled": false
    },
    "OriginAccessControlId": ""
}]' distribution-config.json > temp-origins.json

echo -e "${BLUE}📝 Adding cache behavior for /api/* routes...${NC}"

# Add cache behavior for API routes
jq '
.CacheBehaviors.Quantity = 1 |
.CacheBehaviors.Items = [{
    "PathPattern": "/api/*",
    "TargetOriginId": "API-Gateway-Origin",
    "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
    },
    "TrustedKeyGroups": {
        "Enabled": false,
        "Quantity": 0
    },
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
        "Quantity": 7,
        "Items": ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
        "CachedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"]
        }
    },
    "MinTTL": 0,
    "ForwardedValues": {
        "QueryString": true,
        "Cookies": {
            "Forward": "none"
        },
        "Headers": {
            "Quantity": 4,
            "Items": [
                "Authorization",
                "Content-Type", 
                "X-Requested-With",
                "Origin"
            ]
        },
        "QueryStringCacheKeys": {
            "Quantity": 0
        }
    },
    "DefaultTTL": 0,
    "MaxTTL": 0,
    "SmoothStreaming": false,
    "Compress": false,
    "LambdaFunctionAssociations": {
        "Quantity": 0
    },
    "FunctionAssociations": {
        "Quantity": 0
    },
    "FieldLevelEncryptionId": ""
}]' temp-origins.json > final-config.json

echo -e "${BLUE}🚀 Updating CloudFront distribution...${NC}"

# Update the distribution
aws cloudfront update-distribution \
    --id $DISTRIBUTION_ID \
    --distribution-config file://final-config.json \
    --if-match $ETAG \
    --region $REGION > update-result.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CloudFront distribution updated successfully!${NC}"
    echo -e "${YELLOW}⏳ Distribution update is deploying... This may take 5-15 minutes.${NC}"
    echo ""
    echo -e "${BLUE}📋 Summary:${NC}"
    echo "  • Added API Gateway origin: ${API_GATEWAY_DOMAIN}"
    echo "  • Added cache behavior for /api/* routes"
    echo "  • API calls will now route to Lambda function"
    echo "  • Static files continue to serve from S3"
    echo ""
    echo -e "${GREEN}🎉 API routing fixed! Test in a few minutes once deployment completes.${NC}"
else
    echo -e "${RED}❌ Failed to update CloudFront distribution${NC}"
    exit 1
fi

# Cleanup
rm -f temp-config.json distribution-config.json temp-origins.json final-config.json update-result.json

echo -e "${BLUE}🧹 Cleanup completed${NC}"
