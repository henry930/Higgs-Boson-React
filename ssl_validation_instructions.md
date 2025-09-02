# SSL Certificate Validation Instructions

## Issue
SSL certificate has been pending validation for 10 hours due to missing DNS validation records.

## Required DNS Records
Add these CNAME records to higgsbosonconsultancy.co.uk DNS:

### Record 1 (for higgsbosonconsultancy.co.uk)
- **Type:** CNAME
- **Name:** `_1678ff5aaa3fe08e5e4aa1965aba4a3a`
- **Value:** `_758b6d81d000b36e72f0f4d0345bf71f.xlfgrmvvlj.acm-validations.aws.`

### Record 2 (for www.higgsbosonconsultancy.co.uk)
- **Type:** CNAME
- **Name:** `_e50a1f992e072b2301baaa69fa0422a5`
- **Value:** `_e8f153e91dabc85bf9a786f5a97dfce5.xlfgrmvvlj.acm-validations.aws.`

## Steps
1. Log into domain registrar
2. Navigate to DNS Management
3. Add both CNAME records exactly as shown
4. Save changes
5. Wait 5-60 minutes for DNS propagation
6. Run `./monitor_ssl.sh` to track validation progress

## Certificate Details
- **ARN:** arn:aws:acm:us-east-1:358157044493:certificate/412f9296-15be-48fb-a290-722c14e37c51
- **Status:** PENDING_VALIDATION
- **Domains:** higgsbosonconsultancy.co.uk, www.higgsbosonconsultancy.co.uk
- **Created:** 2025-08-31T18:08:14+01:00

## Next Steps
After adding DNS records, certificate validation will complete automatically and CloudFront will be updated with SSL.
