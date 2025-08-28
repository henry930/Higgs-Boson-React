#!/bin/bash

# AWS S3 + CloudFront Deployment Script for React Frontend
# This script deploys the React build to S3 and configures CloudFront distribution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="higgs-boson-consultancy"
STAGE=${1:-dev}
REGION=${2:-us-east-1}
S3_BUCKET="${PROJECT_NAME}-frontend-${STAGE}"
CLOUDFRONT_COMMENT="${PROJECT_NAME} Frontend Distribution (${STAGE})"

echo -e "${BLUE}🚀 Starting AWS S3 + CloudFront deployment for ${PROJECT_NAME}${NC}"
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  • Stage: ${STAGE}"
echo "  • Region: ${REGION}"
echo "  • S3 Bucket: ${S3_BUCKET}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured successfully${NC}"

# Step 1: Build React application
echo -e "${BLUE}📦 Step 1: Building React application...${NC}"
cd "$(dirname "$0")/../.."

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the React project root.${NC}"
    exit 1
fi

# Build the React app
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed. 'dist' directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ React application built successfully${NC}"

# Step 2: Create S3 bucket if it doesn't exist
echo -e "${BLUE}🪣 Step 2: Setting up S3 bucket...${NC}"

if aws s3 ls "s3://${S3_BUCKET}" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "Creating S3 bucket: ${S3_BUCKET}"
    
    if [ "${REGION}" = "us-east-1" ]; then
        aws s3 mb "s3://${S3_BUCKET}" --region "${REGION}"
    else
        aws s3 mb "s3://${S3_BUCKET}" --region "${REGION}" --create-bucket-configuration LocationConstraint="${REGION}"
    fi
    echo -e "${GREEN}✅ S3 bucket created: ${S3_BUCKET}${NC}"
else
    echo -e "${GREEN}✅ S3 bucket already exists: ${S3_BUCKET}${NC}"
fi

# Step 3: Configure S3 bucket for static website hosting
echo -e "${BLUE}🌐 Step 3: Configuring S3 bucket for static website hosting...${NC}"

# Create website configuration
cat > /tmp/website-config.json << EOF
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}
EOF

aws s3api put-bucket-website --bucket "${S3_BUCKET}" --website-configuration file:///tmp/website-config.json

# Create bucket policy for public read access
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${S3_BUCKET}/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket "${S3_BUCKET}" --policy file:///tmp/bucket-policy.json
aws s3api put-public-access-block --bucket "${S3_BUCKET}" --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo -e "${GREEN}✅ S3 bucket configured for static website hosting${NC}"

# Step 4: Upload files to S3
echo -e "${BLUE}📤 Step 4: Uploading files to S3...${NC}"

# Sync files with appropriate cache headers
aws s3 sync dist/ "s3://${S3_BUCKET}" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# Upload HTML files with no-cache headers
aws s3 sync dist/ "s3://${S3_BUCKET}" \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --include "manifest.json"

echo -e "${GREEN}✅ Files uploaded to S3 successfully${NC}"

# Step 5: Create CloudFront distribution
echo -e "${BLUE}☁️ Step 5: Setting up CloudFront distribution...${NC}"

# Check if distribution already exists
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='${CLOUDFRONT_COMMENT}'].Id" --output text)

if [ -z "${DISTRIBUTION_ID}" ] || [ "${DISTRIBUTION_ID}" = "None" ]; then
    echo "Creating new CloudFront distribution..."
    
    # Create distribution configuration
    cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "${PROJECT_NAME}-${STAGE}-$(date +%s)",
    "Comment": "${CLOUDFRONT_COMMENT}",
    "DefaultCacheBehavior": {
        "TargetOriginId": "${S3_BUCKET}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "${S3_BUCKET}",
                "DomainName": "${S3_BUCKET}.s3-website-${REGION}.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100",
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF
    
    DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cloudfront-config.json)
    DISTRIBUTION_ID=$(echo "${DISTRIBUTION_OUTPUT}" | jq -r '.Distribution.Id')
    DOMAIN_NAME=$(echo "${DISTRIBUTION_OUTPUT}" | jq -r '.Distribution.DomainName')
    
    echo -e "${GREEN}✅ CloudFront distribution created: ${DISTRIBUTION_ID}${NC}"
else
    echo -e "${GREEN}✅ Using existing CloudFront distribution: ${DISTRIBUTION_ID}${NC}"
    DOMAIN_NAME=$(aws cloudfront get-distribution --id "${DISTRIBUTION_ID}" --query 'Distribution.DomainName' --output text)
fi

# Step 6: Create invalidation
echo -e "${BLUE}🔄 Step 6: Creating CloudFront invalidation...${NC}"

INVALIDATION_OUTPUT=$(aws cloudfront create-invalidation \
    --distribution-id "${DISTRIBUTION_ID}" \
    --paths "/*")
    
INVALIDATION_ID=$(echo "${INVALIDATION_OUTPUT}" | jq -r '.Invalidation.Id')

echo -e "${GREEN}✅ CloudFront invalidation created: ${INVALIDATION_ID}${NC}"

# Cleanup temp files
rm -f /tmp/website-config.json /tmp/bucket-policy.json /tmp/cloudfront-config.json

# Step 7: Output deployment information
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📋 Deployment Information:${NC}"
echo "  • S3 Bucket: ${S3_BUCKET}"
echo "  • S3 Website URL: http://${S3_BUCKET}.s3-website-${REGION}.amazonaws.com"
echo "  • CloudFront Distribution ID: ${DISTRIBUTION_ID}"
echo "  • CloudFront URL: https://${DOMAIN_NAME}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "  1. Update your DNS to point to the CloudFront distribution"
echo "  2. Configure custom domain and SSL certificate if needed"
echo "  3. Update API endpoints in your React app to point to Lambda API Gateway"
echo ""
echo -e "${YELLOW}⚠️  Note: CloudFront distribution may take 15-20 minutes to fully deploy${NC}"
