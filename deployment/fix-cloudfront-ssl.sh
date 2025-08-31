#!/bin/bash

# Fix CloudFront 403 Error by Setting Up SSL Certificate
# Requests SSL certificate and updates CloudFront distribution

set -e

echo "🔧 Fixing CloudFront 403 Error - SSL Certificate Setup"
echo "====================================================="

# Configuration from SENSITIVE_CREDENTIALS.md
DOMAIN="higgsbosonconsultancy.co.uk"
CLOUDFRONT_ID="E2HJ0QZBZ5VR38"
HOSTED_ZONE_ID="Z0711252CTEUMKL1Z0HF"
AWS_PROFILE="target-account"

echo "📋 Configuration:"
echo "   Domain: $DOMAIN"
echo "   CloudFront ID: $CLOUDFRONT_ID"
echo "   Hosted Zone: $HOSTED_ZONE_ID"
echo ""

# Step 1: Request SSL Certificate
echo "🔐 Step 1: Requesting SSL Certificate..."
cert_arn=$(aws acm request-certificate \
    --domain-name $DOMAIN \
    --subject-alternative-names www.$DOMAIN \
    --validation-method DNS \
    --region us-east-1 \
    --profile $AWS_PROFILE \
    --query 'CertificateArn' \
    --output text)

echo "✅ SSL Certificate requested: $cert_arn"
echo ""

# Step 2: Get DNS validation records
echo "📝 Step 2: Getting DNS validation records..."
sleep 10  # Wait for ACM to generate validation records

validation_records=$(aws acm describe-certificate \
    --certificate-arn $cert_arn \
    --region us-east-1 \
    --profile $AWS_PROFILE \
    --query 'Certificate.DomainValidationOptions[*].[ResourceRecord.Name,ResourceRecord.Value,ResourceRecord.Type]' \
    --output text)

echo "📋 DNS validation records needed:"
echo "$validation_records"
echo ""

# Step 3: Add DNS validation records
echo "🌐 Step 3: Adding DNS validation records to Route 53..."

# Parse validation records and add to Route 53
while IFS=$'\t' read -r name value type; do
    if [ -n "$name" ] && [ -n "$value" ] && [ -n "$type" ]; then
        echo "Adding DNS record: $name -> $value"
        
        # Create change batch for this validation record
        cat > /tmp/validation-record.json << EOF
{
    "Comment": "SSL certificate validation for $DOMAIN",
    "Changes": [
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "$name",
                "Type": "$type",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "\"$value\""
                    }
                ]
            }
        }
    ]
}
EOF

        # Add validation record to Route 53
        aws route53 change-resource-record-sets \
            --hosted-zone-id $HOSTED_ZONE_ID \
            --change-batch file:///tmp/validation-record.json \
            --profile $AWS_PROFILE \
            --output text
            
        rm -f /tmp/validation-record.json
    fi
done <<< "$validation_records"

echo "✅ DNS validation records added"
echo ""

# Step 4: Wait for certificate validation
echo "⏳ Step 4: Waiting for SSL certificate validation..."
echo "This may take 5-10 minutes..."

aws acm wait certificate-validated \
    --certificate-arn $cert_arn \
    --region us-east-1 \
    --profile $AWS_PROFILE

echo "✅ SSL certificate validated successfully!"
echo ""

# Step 5: Get current CloudFront configuration
echo "🔄 Step 5: Updating CloudFront distribution..."

# Get current CloudFront config
aws cloudfront get-distribution-config \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE > /tmp/cloudfront-current.json

# Extract current config and ETag
etag=$(jq -r '.ETag' /tmp/cloudfront-current.json)
config=$(jq '.DistributionConfig' /tmp/cloudfront-current.json)

# Update config with SSL certificate and domain names
updated_config=$(echo "$config" | jq --arg cert_arn "$cert_arn" '
.Aliases = {
    "Quantity": 2,
    "Items": ["'$DOMAIN'", "www.'$DOMAIN'"]
} |
.ViewerCertificate = {
    "ACMCertificateArn": $cert_arn,
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "CertificateSource": "acm"
} |
.DefaultCacheBehavior.ViewerProtocolPolicy = "redirect-to-https"
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
    --output text

echo "✅ CloudFront distribution updated!"
echo ""

# Step 6: Monitor deployment
echo "⏳ Step 6: Waiting for CloudFront deployment..."
echo "This will take 15-20 minutes..."

aws cloudfront wait distribution-deployed \
    --id $CLOUDFRONT_ID \
    --profile $AWS_PROFILE

echo "✅ CloudFront deployment completed!"
echo ""

# Step 7: Test the fix
echo "🧪 Step 7: Testing the fix..."
sleep 30  # Give a moment for propagation

echo "Testing custom domain..."
if curl -I https://www.$DOMAIN 2>/dev/null | grep -q "200\|301\|302"; then
    echo "✅ Success! https://www.$DOMAIN is now working"
else
    echo "⚠️  Custom domain may still be propagating. Test again in a few minutes."
fi

echo ""
echo "🎉 CloudFront 403 Error Fix Complete!"
echo "📋 Summary:"
echo "✅ SSL certificate created and validated"
echo "✅ CloudFront distribution updated with custom domain"
echo "✅ HTTPS redirect enabled"
echo "✅ Custom domain configured"
echo ""
echo "🌐 Your website should now be accessible at:"
echo "   https://higgsbosonconsultancy.co.uk"
echo "   https://www.higgsbosonconsultancy.co.uk"

# Cleanup temp files
rm -f /tmp/cloudfront-*.json

echo ""
echo "⏰ Note: Full global propagation may take up to 20 minutes"
