#!/bin/bash

# SSL Certificate monitoring and CloudFront update script
CERT_ARN="arn:aws:acm:us-east-1:358157044493:certificate/412f9296-15be-48fb-a290-722c14e37c51"
DISTRIBUTION_ID="E2HJ0QZBZ5VR38"

echo "🔍 Monitoring SSL certificate validation..."
echo "Certificate ARN: $CERT_ARN"
echo "CloudFront Distribution: $DISTRIBUTION_ID"
echo ""

while true; do
    # Check certificate status
    STATUS=$(aws acm describe-certificate \
        --certificate-arn $CERT_ARN \
        --region us-east-1 \
        --query "Certificate.Status" \
        --output text)
    
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Certificate Status: $STATUS"
    
    if [ "$STATUS" = "ISSUED" ]; then
        echo "🎉 Certificate is validated! Updating CloudFront distribution..."
        
        # Get current distribution config
        aws cloudfront get-distribution-config \
            --id $DISTRIBUTION_ID \
            --output json > current_config.json
        
        # Extract ETag for update
        ETAG=$(jq -r '.ETag' current_config.json)
        
        # Update the distribution config with custom domains and SSL certificate
        jq '.DistributionConfig.Aliases.Quantity = 2 |
            .DistributionConfig.Aliases.Items = ["higgsbosonconsultancy.co.uk", "www.higgsbosonconsultancy.co.uk"] |
            .DistributionConfig.ViewerCertificate = {
                "ACMCertificateArn": "'$CERT_ARN'",
                "SSLSupportMethod": "sni-only",
                "MinimumProtocolVersion": "TLSv1.2_2021",
                "CertificateSource": "acm"
            }' current_config.json > updated_config.json
        
        # Update CloudFront distribution
        aws cloudfront update-distribution \
            --id $DISTRIBUTION_ID \
            --distribution-config file://updated_config.json \
            --if-match $ETAG
        
        if [ $? -eq 0 ]; then
            echo "✅ CloudFront distribution updated successfully!"
            echo "🚀 Your domain should be working with SSL in 5-15 minutes."
            echo ""
            echo "Test URLs:"
            echo "  - https://higgsbosonconsultancy.co.uk"
            echo "  - https://www.higgsbosonconsultancy.co.uk"
        else
            echo "❌ Failed to update CloudFront distribution"
        fi
        
        # Cleanup
        rm -f current_config.json updated_config.json
        break
    elif [ "$STATUS" = "FAILED" ]; then
        echo "❌ Certificate validation failed. Please check your DNS records."
        break
    else
        echo "⏳ Still waiting for validation... (checking again in 30 seconds)"
        sleep 30
    fi
done
