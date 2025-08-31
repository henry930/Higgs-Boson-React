# Email Setup Completion Guide
## ✅ DNS Fixed - Now Complete Zoho Email Setup

## Current Status
- ✅ **DNS A Record Fixed**: Domain now resolves to correct CloudFront distribution
- ✅ **MX Records Active**: Pointing to Zoho mail servers
- ⏳ **DNS Propagation**: Active (may take 15-30 minutes globally)

## Next Steps to Fix "553 Relaying disallowed"

### Step 1: Access Zoho Mail Admin Panel
1. **Go to**: https://mail.zoho.com/cpanel/index.do#settings/domain
2. **Login** with your Zoho account credentials
3. **Navigate to**: Mail Admin → Domain Settings

### Step 2: Verify Domain Status
Look for `higgsbosonconsultancy.co.uk` in your domain list:
- **Status should show**: "Verified" or "Active"
- **If not verified**: Click "Verify Domain" button
- **Wait**: Domain verification may take 5-10 minutes after DNS propagation

### Step 3: Create Email Account
1. **Go to**: User Details → Add User
2. **Create account**: `info@higgsbosonconsultancy.co.uk`
3. **Set password**: Choose a secure password
4. **Assign role**: Admin or User as needed

### Step 4: Configure Email Settings
1. **SMTP Settings**: 
   - Server: `smtp.zoho.com`
   - Port: `587` (TLS) or `465` (SSL)
   - Authentication: Required
2. **IMAP Settings**:
   - Server: `imap.zoho.com`  
   - Port: `993` (SSL)
3. **POP Settings**:
   - Server: `pop.zoho.com`
   - Port: `995` (SSL)

### Step 5: Test Email Functionality
After domain verification and account creation:

```bash
# Test SMTP connection
telnet smtp.zoho.com 587

# Test domain resolution (should work now)
nslookup higgsbosonconsultancy.co.uk

# Test MX records
dig MX higgsbosonconsultancy.co.uk
```

## Troubleshooting "553 Relaying disallowed"

### Common Causes & Solutions:

1. **Email Account Doesn't Exist**
   - **Fix**: Create `info@higgsbosonconsultancy.co.uk` in Zoho Admin
   
2. **Domain Not Verified in Zoho**
   - **Fix**: Wait for DNS propagation, then verify domain in Zoho
   
3. **Wrong SMTP Authentication**
   - **Fix**: Use full email address as username, not just "info"
   
4. **DNS Still Propagating**
   - **Fix**: Wait 15-30 minutes for global DNS propagation

### If Still Getting Errors:

1. **Check Zoho Domain Status**:
   - Should show "Active" or "Verified"
   - If pending, wait for DNS propagation

2. **Verify Email Account Exists**:
   - Login to Zoho Mail with `info@higgsbosonconsultancy.co.uk`
   - If can't login, account doesn't exist - create it

3. **Test Email Client Settings**:
   ```
   Incoming Server: imap.zoho.com:993 (SSL)
   Outgoing Server: smtp.zoho.com:587 (TLS)
   Username: info@higgsbosonconsultancy.co.uk
   Password: [your password]
   ```

## Expected Timeline
- **DNS Propagation**: 15-30 minutes globally
- **Domain Verification**: 5-10 minutes after DNS propagation  
- **Email Functionality**: Immediate after domain verification

## Quick Test Commands
```bash
# Check if domain resolves (should return CloudFront IPs)
nslookup higgsbosonconsultancy.co.uk 8.8.8.8

# Check MX records (should show Zoho servers)
dig MX higgsbosonconsultancy.co.uk @8.8.8.8

# Test SMTP connection (should connect)
nc -v smtp.zoho.com 587
```

## Support Resources
- **Zoho Mail Admin**: https://mail.zoho.com/cpanel/
- **Zoho Support**: https://help.zoho.com/portal/en/community/zoho-mail
- **DNS Propagation Checker**: https://dnschecker.org/

---
**The DNS issue is fixed! Complete the Zoho setup and email should work within 30 minutes.**
