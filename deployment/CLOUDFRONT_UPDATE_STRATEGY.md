# CloudFront Website Update Strategy
## Current Caching Configuration Analysis

### 📊 Your Current CloudFront Settings:
- **Default TTL**: 86,400 seconds (24 hours)
- **Min TTL**: 0 seconds  
- **Max TTL**: 31,536,000 seconds (1 year)
- **Query String Caching**: Disabled
- **Headers Forwarding**: None (0 headers)
- **Viewer Protocol**: Redirect to HTTPS

## ⏰ Update Timeline With Current Settings

### 🐌 **Slow Updates (Current Setup)**:
- **New file uploads to S3**: 24 hours to appear globally
- **File modifications**: 24 hours to show changes
- **Cache duration**: Files cached for 24 hours minimum
- **Global propagation**: Up to 24 hours in worst case

### 🚀 **How to Get Faster Updates**:

#### Option 1: Invalidate Cache (Immediate - Recommended)
```bash
# Invalidate specific files (immediate update)
aws cloudfront create-invalidation \
    --distribution-id E2HJ0QZBZ5VR38 \
    --paths "/index.html" "/static/*" \
    --profile target-account

# Invalidate everything (immediate but costs more)
aws cloudfront create-invalidation \
    --distribution-id E2HJ0QZBZ5VR38 \
    --paths "/*" \
    --profile target-account
```

#### Option 2: Optimize Cache Settings (Long-term)
Update CloudFront to cache static assets longer but HTML shorter:

```bash
# Cache Behavior Strategy:
# - HTML files: 5 minutes (300 seconds)
# - CSS/JS files: 1 hour (3600 seconds) 
# - Images: 1 day (86400 seconds)
# - API calls: No cache (0 seconds)
```

## 🛠 Immediate Update Workflow

### For Quick Website Updates:

1. **Upload files to S3**:
   ```bash
   aws s3 sync ./dist/ s3://higgs-boson-consultancy-1756591201/ \
       --profile target-account
   ```

2. **Invalidate CloudFront cache**:
   ```bash
   aws cloudfront create-invalidation \
       --distribution-id E2HJ0QZBZ5VR38 \
       --paths "/*" \
       --profile target-account
   ```

3. **Check invalidation status**:
   ```bash
   aws cloudfront list-invalidations \
       --distribution-id E2HJ0QZBZ5VR38 \
       --profile target-account
   ```

### Timeline:
- **S3 Upload**: 1-2 minutes
- **Invalidation**: 5-15 minutes to complete
- **Global Update**: 15-20 minutes total

## 📈 Optimized Cache Strategy (Recommended)

### Current Problem:
- Everything cached for 24 hours (too long for development)
- No differentiation between static assets and dynamic content

### Recommended Solution:
Create multiple cache behaviors:

1. **HTML Files** (`*.html`): 5 minutes cache
2. **CSS/JS Files** (`/static/*`): 1 hour cache  
3. **Images** (`/images/*`): 1 day cache
4. **Everything Else**: 5 minutes cache

## 🔧 Quick Cache Optimization Script

Let me create a script to optimize your cache settings:

### Benefits:
- ✅ **Faster development**: HTML updates in 5 minutes
- ✅ **Better performance**: Static assets cached appropriately
- ✅ **Lower costs**: Fewer invalidations needed
- ✅ **SEO friendly**: Fresh content indexed quickly

## 💰 Cost Considerations

### Current Setup:
- **Cache Hit Rate**: High (good for costs)
- **Invalidation Needs**: High (expensive for frequent updates)

### Invalidation Costs:
- **First 1,000 paths/month**: Free
- **Additional paths**: $0.005 per path
- **Wildcard invalidations**: Count as multiple paths

### Recommended for Development:
1. **Use invalidations** for immediate updates (fastest)
2. **Optimize cache behaviors** for long-term efficiency
3. **Stage changes** to minimize invalidations

## 🚀 Development Workflow Options

### Option A: Invalidation-Based (Current)
```bash
# After each update:
1. Upload to S3
2. Create invalidation
3. Wait 15 minutes
```

### Option B: Optimized Caching (Better)
```bash
# Setup once, then:
1. Upload to S3
2. Wait 5 minutes (for HTML)
3. Static assets update hourly
```

### Option C: Direct S3 Testing (Fastest for Dev)
```bash
# For development testing:
http://higgs-boson-consultancy-1756591201.s3-website-us-east-1.amazonaws.com
# No caching, immediate updates
```

## ⚡ Immediate Action Plan

### For Today's Updates:
1. **Use S3 direct URL for testing**: Immediate updates
2. **Use invalidation for CloudFront**: 15-minute updates
3. **Consider cache optimization**: For future efficiency

### Commands Ready to Use:
```bash
# Upload changes
aws s3 sync ./dist/ s3://higgs-boson-consultancy-1756591201/ --profile target-account

# Invalidate for immediate update  
aws cloudfront create-invalidation --distribution-id E2HJ0QZBZ5VR38 --paths "/*" --profile target-account

# Check status
aws cloudfront list-invalidations --distribution-id E2HJ0QZBZ5VR38 --profile target-account
```

---

**Current Answer**: With your settings, updates take **24 hours** naturally, but **15 minutes with invalidation**.
