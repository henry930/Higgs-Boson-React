#!/bin/bash

# Fix DNS A Record for Email Issues
# Updates Route 53 A record to point to correct CloudFront distribution

set -e

echo "🔧 Fixing DNS A Record for Email Issues"
echo "========================================"

# Configuration from SENSITIVE_CREDENTIALS.md
HOSTED_ZONE_ID="Z0711252CTEUMKL1Z0HF"
CURRENT_CLOUDFRONT="d791a5pmkugax.cloudfront.net"
DOMAIN="higgsbosonconsultancy.co.uk"

echo "📋 Configuration:"
echo "   Domain: $DOMAIN"
echo "   Hosted Zone: $HOSTED_ZONE_ID"
echo "   CloudFront: $CURRENT_CLOUDFRONT"
echo ""

# Check current A record
echo "🔍 Checking current A record..."
current_record=$(dig +short $DOMAIN)
if [ -z "$current_record" ]; then
    echo "❌ Domain not resolving - this is the problem!"
else
    echo "📍 Current A record: $current_record"
fi

echo ""
echo "🚀 Updating A record to correct CloudFront distribution..."

# Create the change batch JSON
cat > /tmp/dns-change.json << EOF
{
    "Comment": "Fix A record for email domain verification",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$CURRENT_CLOUDFRONT",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        },
        {
            "Action": "UPSERT", 
            "ResourceRecordSet": {
                "Name": "www.$DOMAIN",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$CURRENT_CLOUDFRONT",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }
    ]
}
EOF

# Apply the DNS changes
echo "📝 Applying DNS changes..."
change_id=$(aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file:///tmp/dns-change.json \
    --profile target-account \
    --query 'ChangeInfo.Id' \
    --output text)

echo "✅ DNS change submitted: $change_id"
echo ""

# Monitor the change
echo "⏳ Monitoring DNS change status..."
aws route53 wait resource-record-sets-changed \
    --id $change_id \
    --profile target-account

echo "✅ DNS changes have propagated!"
echo ""

# Verify the fix
echo "🧪 Verifying DNS resolution..."
sleep 10  # Give a moment for propagation

new_record=$(dig +short $DOMAIN)
if [ -n "$new_record" ]; then
    echo "✅ Success! Domain now resolves to: $new_record"
else
    echo "⚠️  DNS may still be propagating. Check again in 5-10 minutes."
fi

echo ""
echo "📧 Email Fix Checklist:"
echo "✅ A record updated to correct CloudFront distribution"
echo "⏳ Next steps:"
echo "   1. Wait 15-30 minutes for full DNS propagation"
echo "   2. Verify domain is verified in Zoho Mail admin"
echo "   3. Create info@higgsbosonconsultancy.co.uk account in Zoho"
echo "   4. Test email sending/receiving"

echo ""
echo "🔗 Zoho Mail Admin: https://mail.zoho.com/cpanel/index.do#settings/domain"

# Cleanup
rm -f /tmp/dns-change.json
