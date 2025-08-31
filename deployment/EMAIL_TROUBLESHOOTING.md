# Email Configuration Troubleshooting Guide
## Issue: "553 Relaying disallowed" for info@higgsbosonconsultancy.co.uk

## Root Cause Analysis
The "553 Relaying disallowed" error typically indicates one of these issues:

### 1. Domain Verification Issues
- **Symptom**: `nslookup higgsbosonconsultancy.co.uk` returns "No answer"
- **Cause**: Domain A records may not be properly configured or propagated
- **Impact**: Zoho cannot verify domain ownership

### 2. Zoho Email Account Setup
- **Issue**: The email account `info@higgsbosonconsultancy.co.uk` may not exist in Zoho
- **Required**: Email account must be created in Zoho Mail admin panel

### 3. DNS Configuration Mismatch
- **Found**: DNS records point to `dcj6qsp4iejj2.cloudfront.net`
- **Expected**: Should point to current CloudFront: `d791a5pmkugax.cloudfront.net`

## Immediate Fixes Required

### Fix 1: Update DNS A Records
Current A record points to wrong CloudFront distribution. Update to:

```bash
# Correct A record configuration
higgsbosonconsultancy.co.uk → d791a5pmkugax.cloudfront.net (from SENSITIVE_CREDENTIALS.md)
```

### Fix 2: Verify Zoho Email Setup
1. **Login to Zoho Mail Admin**: https://www.zoho.com/mail/
2. **Check Domain Verification Status**: Must be "Verified"
3. **Create Email Account**: Add `info@higgsbosonconsultancy.co.uk` if it doesn't exist
4. **Verify MX Records**: Confirm Zoho sees the correct MX records

### Fix 3: DNS Propagation Check
After updating A records, verify propagation:

```bash
# Check A record resolution
nslookup higgsbosonconsultancy.co.uk

# Check MX records
dig MX higgsbosonconsultancy.co.uk

# Test email relay (should work after fixes)
telnet mx.zoho.eu 25
```

## Step-by-Step Resolution

### Step 1: Update Route 53 A Records
Use AWS CLI to update the A record to point to the correct CloudFront distribution:

```bash
# Get current hosted zone ID from SENSITIVE_CREDENTIALS.md
HOSTED_ZONE_ID="Z0711252CTEUMKL1Z0HF"
CLOUDFRONT_DOMAIN="d791a5pmkugax.cloudfront.net"

# Update A record
aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch '{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "higgsbosonconsultancy.co.uk",
      "Type": "A",
      "AliasTarget": {
        "DNSName": "'$CLOUDFRONT_DOMAIN'",
        "EvaluateTargetHealth": false,
        "HostedZoneId": "Z2FDTNDATAQYW2"
      }
    }
  }]
}'
```

### Step 2: Verify Zoho Configuration
1. **Domain Status**: https://mail.zoho.com/cpanel/index.do#settings/domain
2. **Email Account**: Create `info@higgsbosonconsultancy.co.uk` if missing
3. **Verification**: Ensure domain shows as "Verified" in Zoho

### Step 3: Test Email Flow
After 15-30 minutes for DNS propagation:

```bash
# Test domain resolution
nslookup higgsbosonconsultancy.co.uk
# Should return CloudFront IP addresses

# Test MX record
dig MX higgsbosonconsultancy.co.uk
# Should show mx.zoho.eu, mx2.zoho.eu, mx3.zoho.eu

# Test SMTP connection
telnet mx.zoho.eu 25
# Should connect successfully
```

## Verification Checklist
- [ ] Domain resolves to correct CloudFront distribution
- [ ] MX records point to Zoho servers  
- [ ] Domain is verified in Zoho Mail admin
- [ ] Email account `info@higgsbosonconsultancy.co.uk` exists in Zoho
- [ ] DNS propagation complete (15-30 minutes)
- [ ] Email sending/receiving works

## Next Actions
1. **Immediate**: Update Route 53 A record to correct CloudFront distribution
2. **Zoho Setup**: Verify domain and create email account if missing
3. **Testing**: Wait for DNS propagation and test email functionality
4. **Monitoring**: Set up email forwarding and auto-responders as needed

---
**Expected Resolution Time**: 15-30 minutes after DNS updates
