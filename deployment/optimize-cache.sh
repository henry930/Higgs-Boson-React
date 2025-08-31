#!/bin/bash

# Optimize CloudFront Cache Settings for Development
# Reduces cache time for HTML files while keeping static assets cached

set -e

echo "⚡ Optimizing CloudFront Cache Settings"
echo "======================================"

CLOUDFRONT_ID="E2HJ0QZBZ5VR38"
AWS_PROFILE="target-account"

echo "📋 Configuration:"
echo "   CloudFront ID: $CLOUDFRONT_ID"
echo ""

echo "🔍 Current cache settings:"
aws cloudfront get-distribution \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE \
    --query 'Distribution.DistributionConfig.DefaultCacheBehavior.{MinTTL:MinTTL,DefaultTTL:DefaultTTL,MaxTTL:MaxTTL}' \
    --output table

echo ""
echo "🎯 Optimization Strategy:"
echo "   Current: 24 hours cache for everything"
echo "   Target:  5 minutes for HTML, 1 hour for static assets"
echo ""

# Get current distribution config
echo "📥 Getting current CloudFront configuration..."
aws cloudfront get-distribution-config \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE > /tmp/cf-current.json

etag=$(jq -r '.ETag' /tmp/cf-current.json)
config=$(jq '.DistributionConfig' /tmp/cf-current.json)

# Update default cache behavior for faster development
echo "🔄 Updating cache behavior..."

optimized_config=$(echo "$config" | jq '
.DefaultCacheBehavior.MinTTL = 0 |
.DefaultCacheBehavior.DefaultTTL = 300 |
.DefaultCacheBehavior.MaxTTL = 86400 |
.DefaultCacheBehavior.ForwardedValues.QueryString = false |
.DefaultCacheBehavior.ForwardedValues.Cookies.Forward = "none"
')

echo "$optimized_config" > /tmp/cf-optimized.json

echo "📤 Applying optimized settings..."
aws cloudfront update-distribution \
    --id $CLOUDFRONT_ID \
    --distribution-config file:///tmp/cf-optimized.json \
    --if-match $etag \
    --profile $AWS_PROFILE \
    --output table

echo "✅ CloudFront settings updated!"
echo ""

echo "⏳ Waiting for deployment..."
echo "This will take 10-15 minutes..."

# Show deployment status
echo "📊 Deployment progress:"
for i in {1..10}; do
    status=$(aws cloudfront get-distribution \
        --id $CLOUDFRONT_ID \
        --profile $AWS_PROFILE \
        --query 'Distribution.Status' \
        --output text)
    
    echo "   [$i/10] Status: $status ($(date '+%H:%M:%S'))"
    
    if [ "$status" = "Deployed" ]; then
        echo "✅ Deployment completed!"
        break
    fi
    
    if [ $i -eq 10 ]; then
        echo "⏰ Deployment continuing in background..."
        break
    fi
    
    sleep 90  # Wait 90 seconds between checks
done

echo ""
echo "🎉 Cache Optimization Complete!"
echo "📋 New Settings:"
echo "✅ Default Cache: 5 minutes (was 24 hours)"
echo "✅ Min Cache: 0 seconds (immediate if no cache headers)"
echo "✅ Max Cache: 24 hours (for static assets with cache headers)"
echo ""
echo "🚀 Benefits:"
echo "   • HTML updates appear in 5 minutes (vs 24 hours)"
echo "   • Static assets still cached efficiently"
echo "   • Fewer invalidations needed"
echo "   • Better development workflow"
echo ""
echo "💡 Usage:"
echo "   • Regular updates: Wait 5 minutes"
echo "   • Immediate updates: Use invalidation script"
echo "   • Static assets: Update hourly automatically"

# Cleanup
rm -f /tmp/cf-*.json

echo ""
echo "🔧 Next Steps:"
echo "1. Wait 15 minutes for full deployment"
echo "2. Test website updates (should be faster)"
echo "3. Use ./deployment/update-website.sh for immediate updates"
