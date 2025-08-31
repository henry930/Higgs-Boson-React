#!/bin/bash

# Quick CloudFront Update Script
# Uploads changes to S3 and invalidates CloudFront cache for immediate updates

set -e

echo "🚀 Quick CloudFront Update"
echo "=========================="

# Configuration
S3_BUCKET="higgs-boson-consultancy-1756591201"
CLOUDFRONT_ID="E2HJ0QZBZ5VR38"
AWS_PROFILE="target-account"
SOURCE_DIR="./dist"

echo "📋 Configuration:"
echo "   S3 Bucket: $S3_BUCKET"
echo "   CloudFront: $CLOUDFRONT_ID"
echo "   Source: $SOURCE_DIR"
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Source directory $SOURCE_DIR not found"
    echo "💡 Run 'npm run build' or 'yarn build' first"
    exit 1
fi

echo "📤 Step 1: Uploading files to S3..."
aws s3 sync $SOURCE_DIR/ s3://$S3_BUCKET/ \
    --delete \
    --profile $AWS_PROFILE

echo "✅ Files uploaded to S3"
echo ""

echo "🗑️ Step 2: Creating CloudFront invalidation..."
invalidation_id=$(aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*" \
    --profile $AWS_PROFILE \
    --query 'Invalidation.Id' \
    --output text)

echo "✅ Invalidation created: $invalidation_id"
echo ""

echo "⏳ Step 3: Monitoring invalidation status..."
echo "This typically takes 5-15 minutes..."

# Monitor invalidation status
for i in {1..20}; do
    status=$(aws cloudfront get-invalidation \
        --distribution-id $CLOUDFRONT_ID \
        --id $invalidation_id \
        --profile $AWS_PROFILE \
        --query 'Invalidation.Status' \
        --output text)
    
    echo "   [$i/20] Status: $status ($(date '+%H:%M:%S'))"
    
    if [ "$status" = "Completed" ]; then
        echo "✅ Invalidation completed!"
        break
    fi
    
    if [ $i -eq 20 ]; then
        echo "⏰ Invalidation still in progress, but continuing..."
        break
    fi
    
    sleep 45  # Wait 45 seconds between checks
done

echo ""
echo "🧪 Testing updated website..."

# Test CloudFront URL
cloudfront_url="https://d791a5pmkugax.cloudfront.net"
echo "Testing: $cloudfront_url"

response=$(curl -s -o /dev/null -w "%{http_code}" $cloudfront_url || echo "000")

if [ "$response" = "200" ]; then
    echo "✅ Website updated successfully! (HTTP $response)"
else
    echo "⚠️  Response: HTTP $response - may still be propagating"
fi

echo ""
echo "🎉 Update Complete!"
echo "📋 Summary:"
echo "✅ Files uploaded to S3"
echo "✅ CloudFront cache invalidated"
echo "✅ Website should show latest changes"
echo ""
echo "🌐 Access your updated website:"
echo "   Primary: $cloudfront_url"
echo "   S3 Direct: http://$S3_BUCKET.s3-website-us-east-1.amazonaws.com"
echo ""
echo "⏰ Full global propagation: 15-20 minutes"

# Show invalidation cost info
echo ""
echo "💰 Invalidation Info:"
echo "   Invalidation ID: $invalidation_id"
echo "   Paths invalidated: /* (all files)"
echo "   Cost: Free (first 1,000 paths/month)"
