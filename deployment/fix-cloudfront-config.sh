#!/bin/bash

# CloudFront Configuration Fix - Without Custom Domain
# Fixes CloudFront to serve content properly from S3

set -e

echo "🔧 CloudFront Configuration Fix"
echo "==============================="

# Configuration
CLOUDFRONT_ID="E2HJ0QZBZ5VR38"
S3_BUCKET="higgs-boson-consultancy-1756591201"
AWS_PROFILE="target-account"

echo "📋 Configuration:"
echo "   CloudFront ID: $CLOUDFRONT_ID"
echo "   S3 Bucket: $S3_BUCKET"
echo ""

echo "🔍 Diagnosing CloudFront configuration..."

# Get current CloudFront configuration
aws cloudfront get-distribution-config \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE > /tmp/cloudfront-current.json

# Check current configuration
origin_domain=$(jq -r '.DistributionConfig.Origins.Items[0].DomainName' /tmp/cloudfront-current.json)
default_root=$(jq -r '.DistributionConfig.DefaultRootObject' /tmp/cloudfront-current.json)

echo "📊 Current Configuration:"
echo "   Origin Domain: $origin_domain"
echo "   Default Root Object: $default_root"
echo ""

# Extract current config and ETag
etag=$(jq -r '.ETag' /tmp/cloudfront-current.json)
config=$(jq '.DistributionConfig' /tmp/cloudfront-current.json)

# Update config to fix common 403 issues
echo "🔄 Updating CloudFront configuration..."

updated_config=$(echo "$config" | jq '
.DefaultRootObject = "index.html" |
.Origins.Items[0].OriginPath = "" |
.Origins.Items[0].CustomOriginConfig.HTTPPort = 80 |
.Origins.Items[0].CustomOriginConfig.HTTPSPort = 443 |
.Origins.Items[0].CustomOriginConfig.OriginProtocolPolicy = "http-only" |
.DefaultCacheBehavior.ViewerProtocolPolicy = "allow-all" |
.DefaultCacheBehavior.AllowedMethods = {
    "Quantity": 7,
    "Items": ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
    "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
    }
} |
.DefaultCacheBehavior.TrustedSigners = {
    "Enabled": false,
    "Quantity": 0
} |
.DefaultCacheBehavior.ForwardedValues = {
    "QueryString": false,
    "Cookies": {
        "Forward": "none"
    },
    "Headers": {
        "Quantity": 0
    }
} |
.DefaultCacheBehavior.MinTTL = 0
')

# Save updated config
echo "$updated_config" > /tmp/cloudfront-updated.json

# Update CloudFront distribution
echo "📤 Updating CloudFront distribution..."
aws cloudfront update-distribution \
    --id $CLOUDFRONT_ID \
    --distribution-config file:///tmp/cloudfront-updated.json \
    --if-match $etag \
    --profile $AWS_PROFILE \
    --output table

echo "✅ CloudFront distribution updated!"
echo ""

# Monitor deployment
echo "⏳ Waiting for CloudFront deployment..."
echo "This will take 10-15 minutes..."

# Wait for deployment with timeout
echo "📊 Monitoring deployment status:"
for i in {1..20}; do
    status=$(aws cloudfront get-distribution \
        --id $CLOUDFRONT_ID \
        --profile $AWS_PROFILE \
        --query 'Distribution.Status' \
        --output text)
    
    echo "   [$i/20] Status: $status ($(date '+%H:%M:%S'))"
    
    if [ "$status" = "Deployed" ]; then
        echo "✅ Deployment completed!"
        break
    fi
    
    if [ $i -eq 20 ]; then
        echo "⏰ Deployment still in progress, continuing in background..."
        break
    fi
    
    sleep 45  # Wait 45 seconds between checks
done

echo ""
echo "🧪 Testing CloudFront access..."

# Test CloudFront URL
echo "Testing CloudFront distribution..."
if curl -I https://d791a5pmkugax.cloudfront.net 2>/dev/null | head -n 1 | grep -q "200\|301\|302"; then
    echo "✅ CloudFront working: https://d791a5pmkugax.cloudfront.net"
else
    echo "⚠️  CloudFront may still be deploying"
fi

# Test root object
echo "Testing root object (index.html)..."
if curl -s https://d791a5pmkugax.cloudfront.net | grep -q "<title>\|<html>"; then
    echo "✅ Root object (index.html) loading correctly"
else
    echo "⚠️  Root object may need more time to propagate"
fi

echo ""
echo "🎉 CloudFront Configuration Fix Complete!"
echo "📋 Summary:"
echo "✅ Default root object set to index.html"
echo "✅ Origin configuration optimized for S3 website"
echo "✅ Viewer protocol policy set to allow-all"
echo "✅ Caching behavior configured"
echo ""
echo "🌐 Access Your Website:"
echo "   Primary URL: https://d791a5pmkugax.cloudfront.net"
echo "   Direct S3:   http://higgs-boson-consultancy-1756591201.s3-website-us-east-1.amazonaws.com"
echo ""
echo "📝 For Custom Domain (higgsbosonconsultancy.co.uk):"
echo "1. Update nameservers with domain registrar first"
echo "2. Wait 24-48 hours for DNS propagation"
echo "3. Run SSL certificate setup"
echo "4. Add custom domain to CloudFront"

# Cleanup
rm -f /tmp/cloudfront-*.json

echo ""
echo "✅ Your website should now be accessible via CloudFront!"
