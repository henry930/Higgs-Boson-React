#!/bin/bash

# Configuration template for AWS deployment
# Replace placeholders with actual values from SENSITIVE_CREDENTIALS.md

# AWS Account Configuration
export TARGET_ACCOUNT_ID="your-target-account-id"
export SOURCE_ACCOUNT_ID="your-source-account-id"

# AWS Resource Names (replace with actual values)
export S3_BUCKET_NAME="your-bucket-name"
export LAMBDA_FUNCTION_NAME="your-lambda-function"
export API_GATEWAY_ID="your-api-gateway-id"
export CLOUDFRONT_DISTRIBUTION_ID="your-cloudfront-id"
export ROUTE53_HOSTED_ZONE_ID="your-hosted-zone-id"

# Domain Configuration
export DOMAIN_NAME="higgsbosonconsultancy.co.uk"

echo "Configuration loaded with placeholder values"
echo "Replace with actual values from SENSITIVE_CREDENTIALS.md"
