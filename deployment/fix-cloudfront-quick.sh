#!/bin/bash

# Quick Fix for CloudFront 403 Error - Manual Configuration
# Updates CloudFront to use default SSL certificate temporarily

set -e

echo "🔧 Quick Fix for CloudFront 403 Error"
echo "======================================"

# Configuration
CLOUDFRONT_ID="E2HJ0QZBZ5VR38"
DOMAIN="higgsbosonconsultancy.co.uk"
AWS_PROFILE="target-account"

echo "📋 Configuration:"
echo "   CloudFront ID: $CLOUDFRONT_ID"
echo "   Domain: $DOMAIN"
echo ""

echo "⚠️  Issue Identified:"
echo "   DNS nameservers not updated with registrar yet"
echo "   SSL certificate validation requires nameserver update"
echo "   Applying temporary fix using CloudFront default SSL"
echo ""

# Get current CloudFront configuration
echo "📥 Getting current CloudFront configuration..."
aws cloudfront get-distribution-config \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE > /tmp/cloudfront-current.json

# Extract current config and ETag
etag=$(jq -r '.ETag' /tmp/cloudfront-current.json)
config=$(jq '.DistributionConfig' /tmp/cloudfront-current.json)

echo "✅ Current configuration retrieved"

# Update config with domain names and default CloudFront SSL
echo "🔄 Updating CloudFront configuration..."

updated_config=$(echo "$config" | jq '
.Aliases = {
    "Quantity": 2,
    "Items": ["'$DOMAIN'", "www.'$DOMAIN'"]
} |
.ViewerCertificate = {
    "CloudFrontDefaultCertificate": true,
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "CertificateSource": "cloudfront"
} |
.DefaultCacheBehavior.ViewerProtocolPolicy = "allow-all" |
.DefaultRootObject = "index.html"
')

# Save updated config
echo "$updated_config" > /tmp/cloudfront-updated.json

# Update CloudFront distribution
echo "📤 Updating CloudFront distribution..."
update_result=$(aws cloudfront update-distribution \
    --id $CLOUDFRONT_ID \
    --distribution-config file:///tmp/cloudfront-updated.json \
    --if-match $etag \
    --profile $AWS_PROFILE)

echo "✅ CloudFront distribution updated!"
echo ""

# Monitor deployment status
echo "⏳ Monitoring deployment status..."
echo "This will take 10-15 minutes..."

# Show deployment progress
echo "📊 Deployment progress:"
for i in {1..10}; do
    status=$(aws cloudfront get-distribution \
        --id $CLOUDFRONT_ID \
        --profile $AWS_PROFILE \
        --query 'Distribution.Status' \
        --output text)
    echo "   [$i/10] Status: $status"
    
    if [ "$status" = "Deployed" ]; then
        echo "✅ Deployment completed!"
        break
    fi
    
    sleep 90  # Wait 90 seconds between checks
done

echo ""
echo "🧪 Testing the fix..."

# Test CloudFront URL
echo "Testing CloudFront direct URL..."
if curl -I https://d791a5pmkugax.cloudfront.net 2>/dev/null | grep -q "200"; then
    echo "✅ CloudFront direct URL working"
else
    echo "❌ CloudFront direct URL issue"
fi

# Test with custom domain (may still have SSL issues but should work with HTTP)
echo "Testing custom domain (HTTP)..."
if curl -I http://www.$DOMAIN 2>/dev/null | grep -q "200\|301\|302"; then
    echo "✅ Custom domain working with HTTP"
else
    echo "⚠️  Custom domain may still be propagating"
fi

echo ""
echo "🎉 Quick Fix Applied!"
echo "📋 Status:"
echo "✅ CloudFront updated with custom domain aliases"
echo "✅ Default CloudFront SSL certificate configured"
echo "✅ HTTP access enabled for custom domain"
echo ""
echo "⚠️  Important Notes:"
echo "   - Using CloudFront default SSL (*.cloudfront.net certificate)"
echo "   - Custom domain SSL will show certificate warning"
echo "   - For proper SSL: Update nameservers with registrar first"
echo ""
echo "🌐 Access Methods:"
echo "   ✅ HTTPS (secure): https://d791a5pmkugax.cloudfront.net"
echo "   ⚠️  HTTP (temp): http://www.higgsbosonconsultancy.co.uk"
echo "   ⚠️  HTTPS (cert warning): https://www.higgsbosonconsultancy.co.uk"

# Cleanup
rm -f /tmp/cloudfront-*.json

echo ""
echo "📝 Next Steps:"
echo "1. Update nameservers with domain registrar:"
echo "   - ns-1498.awsdns-59.org"
echo "   - ns-229.awsdns-28.com"
echo "   - ns-796.awsdns-35.net"
echo "   - ns-1970.awsdns-54.co.uk"
echo "2. Wait 24-48 hours for nameserver propagation"
echo "3. Run SSL certificate setup again"
echo "4. Update CloudFront to use proper SSL certificate"
