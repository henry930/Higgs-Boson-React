#!/bin/bash

# Simple CloudFront Origin Fix
# Updates CloudFront to properly serve from S3 website

set -e

echo "🔧 Simple CloudFront Origin Fix"
echo "==============================="

CLOUDFRONT_ID="E2HJ0QZBZ5VR38"
AWS_PROFILE="target-account"

echo "📋 Configuration:"
echo "   CloudFront ID: $CLOUDFRONT_ID"
echo ""

# Get current distribution info
echo "🔍 Checking current CloudFront status..."
current_status=$(aws cloudfront get-distribution \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE \
    --query 'Distribution.Status' \
    --output text)

echo "📊 Current Status: $current_status"

# Get the CloudFront domain
cloudfront_domain=$(aws cloudfront get-distribution \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE \
    --query 'Distribution.DomainName' \
    --output text)

echo "🌐 CloudFront Domain: $cloudfront_domain"
echo ""

# Test current CloudFront access
echo "🧪 Testing current CloudFront access..."

# Test with curl
echo "Testing HTTPS access..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://$cloudfront_domain || echo "000")

if [ "$response" = "200" ]; then
    echo "✅ CloudFront is working! HTTP 200 response"
    echo "🎉 No CloudFront fix needed - website is accessible"
elif [ "$response" = "403" ]; then
    echo "❌ CloudFront 403 error confirmed"
    echo "🔍 Checking S3 origin accessibility..."
    
    # Test S3 origin directly
    s3_response=$(curl -s -o /dev/null -w "%{http_code}" http://higgs-boson-consultancy-1756591201.s3-website-us-east-1.amazonaws.com || echo "000")
    
    if [ "$s3_response" = "200" ]; then
        echo "✅ S3 origin is working (HTTP $s3_response)"
        echo "❌ Issue is in CloudFront configuration"
    else
        echo "❌ S3 origin also has issues (HTTP $s3_response)"
    fi
else
    echo "⚠️  Unexpected response: HTTP $response"
fi

echo ""

# Create a minimal working CloudFront distribution update
echo "🔄 Attempting minimal CloudFront fix..."

# Get current config
aws cloudfront get-distribution-config \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE > /tmp/cf-config.json

etag=$(jq -r '.ETag' /tmp/cf-config.json)

# Create minimal update - just ensure default root object
minimal_update=$(jq '.DistributionConfig | .DefaultRootObject = "index.html"' /tmp/cf-config.json)

echo "$minimal_update" > /tmp/cf-minimal.json

echo "📤 Applying minimal update..."
aws cloudfront update-distribution \
    --id $CLOUDFRONT_ID \
    --distribution-config file:///tmp/cf-minimal.json \
    --if-match $etag \
    --profile $AWS_PROFILE > /dev/null

echo "✅ Update submitted to CloudFront"
echo ""

# Wait a bit and test again
echo "⏳ Waiting 30 seconds for initial propagation..."
sleep 30

echo "🧪 Testing after update..."
new_response=$(curl -s -o /dev/null -w "%{http_code}" https://$cloudfront_domain || echo "000")

if [ "$new_response" = "200" ]; then
    echo "✅ SUCCESS! CloudFront now working (HTTP $new_response)"
elif [ "$new_response" = "403" ]; then
    echo "⚠️  Still getting 403 - CloudFront deployment may take 15-20 minutes"
else
    echo "⚠️  Response changed to: HTTP $new_response"
fi

echo ""
echo "📋 Current Access Status:"
echo "   CloudFront URL: https://$cloudfront_domain"
echo "   Response Code: HTTP $new_response"
echo ""

if [ "$new_response" = "200" ]; then
    echo "🎉 CloudFront 403 Error Fixed!"
    echo "✅ Your website is now accessible"
else
    echo "⏰ CloudFront deployment in progress"
    echo "⏱️  Full deployment takes 15-20 minutes"
    echo "🔄 Check again in 15 minutes"
fi

echo ""
echo "🌐 Access Your Website:"
echo "   Primary: https://$cloudfront_domain"
echo "   Backup:  http://higgs-boson-consultancy-1756591201.s3-website-us-east-1.amazonaws.com"

# Cleanup
rm -f /tmp/cf-*.json
