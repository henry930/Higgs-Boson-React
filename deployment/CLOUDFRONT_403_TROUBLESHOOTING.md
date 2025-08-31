# CloudFront 403 Error Troubleshooting Guide
## Issue: 403 ERROR on www.higgsbosonconsultancy.co.uk

## Root Cause Analysis
The 403 CloudFront error indicates several potential issues:

### 1. SSL Certificate Problem
- **Symptom**: SSL error when accessing custom domain
- **Cause**: No SSL certificate configured for `higgsbosonconsultancy.co.uk`
- **Required**: AWS Certificate Manager (ACM) certificate

### 2. CloudFront Origin Configuration
- **Issue**: CloudFront may not be properly configured to serve from S3
- **Check**: Origin settings and default root object

### 3. S3 Bucket Permissions
- **Issue**: S3 bucket may not allow CloudFront access
- **Required**: Proper bucket policy for CloudFront

## Current Working URLs
✅ **CloudFront Direct**: https://d791a5pmkugax.cloudfront.net
✅ **S3 Direct**: http://higgs-boson-consultancy-1756591201.s3-website-us-east-1.amazonaws.com
❌ **Custom Domain**: https://www.higgsbosonconsultancy.co.uk

## Diagnosis Results

### Working Components:
- ✅ S3 website hosting functional
- ✅ CloudFront distribution serving content
- ✅ DNS A records pointing to CloudFront

### Missing Components:
- ❌ SSL Certificate for custom domain
- ❌ CloudFront alternate domain names (CNAME) configuration
- ❌ Proper origin configuration

## Fix Required: SSL Certificate Setup

### Step 1: Create SSL Certificate in ACM
```bash
# Request SSL certificate for domain
aws acm request-certificate \
    --domain-name higgsbosonconsultancy.co.uk \
    --subject-alternative-names www.higgsbosonconsultancy.co.uk \
    --validation-method DNS \
    --region us-east-1 \
    --profile target-account
```

### Step 2: Validate Certificate via DNS
1. ACM will provide DNS validation records
2. Add these records to Route 53
3. Wait for validation (5-10 minutes)

### Step 3: Update CloudFront Distribution
```bash
# Get current CloudFront configuration
aws cloudfront get-distribution-config \
    --id E2HJ0QZBZ5VR38 \
    --profile target-account > cloudfront-config.json

# Update configuration with:
# - SSL certificate ARN
# - Alternate domain names (CNAME)
# - Viewer protocol policy: redirect-to-https
```

## Quick Fix Script Approach

### Option 1: Manual Fix via AWS Console
1. **AWS Certificate Manager**: Request certificate for both domains
2. **CloudFront Console**: Update distribution with certificate and CNAMEs
3. **Wait**: 15-20 minutes for deployment

### Option 2: Automated Fix via CLI
Create script to:
1. Request SSL certificate
2. Update CloudFront distribution
3. Monitor deployment status

## Expected Issues and Solutions

### Issue: "Certificate not found"
- **Cause**: SSL certificate must be in us-east-1 region for CloudFront
- **Fix**: Ensure certificate is requested in us-east-1

### Issue: "Domain validation failed"
- **Cause**: DNS validation records not added to Route 53
- **Fix**: Add ACM validation records to hosted zone

### Issue: "CloudFront deployment slow"
- **Cause**: CloudFront deployments take 15-20 minutes
- **Fix**: Wait for deployment to complete

## Verification Steps
After fixes applied:

```bash
# Test SSL certificate
curl -I https://www.higgsbosonconsultancy.co.uk

# Test custom domain
curl -I https://higgsbosonconsultancy.co.uk

# Check CloudFront distribution
aws cloudfront get-distribution \
    --id E2HJ0QZBZ5VR38 \
    --profile target-account
```

## Timeline Expectations
- **SSL Certificate Request**: 2-3 minutes
- **DNS Validation**: 5-10 minutes
- **CloudFront Update**: 15-20 minutes
- **Total Resolution Time**: 20-30 minutes

---
**Next Action**: Create and configure SSL certificate for custom domain
