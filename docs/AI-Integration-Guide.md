# AI Integration Setup Guide

## 📋 **Overview**

This guide explains how to integrate real AI (ChatGPT/Claude) with your customer service system, including cost control, abuse prevention, and business customization.

## 🚫 **Abuse Prevention & Usage Control**

### **1. Rate Limiting**
```python
# Automatic limits implemented:
- 20 messages per session per day
- 50 messages per IP per hour  
- £100 monthly budget cap
- £0.02 cost tracking per request
```

### **2. Geographic & Session Control**
- IP-based rate limiting prevents bot attacks
- Session tracking prevents single users from excessive usage
- Automatic fallback to rule-based system when limits exceeded

### **3. Budget Monitoring**
- Real-time cost tracking
- Monthly budget alerts
- Usage statistics dashboard
- Automatic service suspension at budget limit

## 💰 **Cost Management**

### **AI Service Costs** (Monthly estimates)
```
OpenAI GPT-3.5:     £50/month  (Recommended for business)
OpenAI GPT-4:       £150/month (Premium quality)
Anthropic Claude:   £75/month  (Good middle ground)

Rule-based system:  £0/month   (Current system)
```

### **What You Pay For**
- Per conversation: ~£0.01-0.05
- Per month (moderate usage): £50-150
- No setup fees
- No minimum commitments

## 🎯 **Business Customization**

### **1. Dynamic Pricing Configuration**

```python
# Your business settings (easily adjustable):
DAILY_RATE = 170  # £170 per day
LOCATION = 'UK'
SPECIALTIES = ['React', 'Django', 'Full-Stack']

# Automatic discounts:
STARTUP_DISCOUNT = 15%      # Max £2,000 off
NONPROFIT_DISCOUNT = 20%    # Max £3,000 off  
EDUCATION_DISCOUNT = 25%    # Max £5,000 off
SMALL_BUSINESS_DISCOUNT = 10%  # Max £1,500 off
```

### **2. AI Training & Customization**

The AI is trained with your business context:
```
✅ Your £170 daily rate
✅ UK market focus
✅ Your technology specialties  
✅ Professional communication style
✅ Discount policies
✅ Project complexity understanding
```

### **3. Smart Customer Detection**
```python
# Automatic customer type detection:
if "startup" in conversation:
    apply_startup_discount()

if "charity" or "non-profit" in conversation:
    apply_nonprofit_discount()

if "school" or "university" in conversation:
    apply_education_discount()
```

## 🚀 **Setup Instructions**

### **Step 1: Install AI Packages**
```bash
cd /Users/navcolon/Documents/higgsbosonconsultancy2/React/server
pip install -r requirements-ai.txt
```

### **Step 2: Get API Keys**

**Option A: OpenAI (ChatGPT)**
1. Go to https://platform.openai.com
2. Create account / login
3. Generate API key
4. Add to Django settings:

```python
# settings.py
OPENAI_API_KEY = 'sk-your-api-key-here'
```

**Option B: Anthropic Claude**
1. Go to https://console.anthropic.com
2. Create account / login  
3. Generate API key
4. Add to Django settings:

```python
# settings.py
ANTHROPIC_API_KEY = 'sk-ant-your-api-key-here'
```

### **Step 3: Configure Redis (for rate limiting)**
```bash
# Install Redis
brew install redis

# Start Redis
redis-server

# Add to Django settings:
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### **Step 4: Update URLs**
```python
# server/api/urls.py
from .ai_urls import ai_urlpatterns

urlpatterns += ai_urlpatterns
```

### **Step 5: Test AI Integration**
```bash
# Test with AI enabled
curl -X POST http://localhost:8000/api/ai-chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_ai",
    "message": "I need a startup discount for my project",
    "use_ai": true
  }'
```

## 📊 **Monitoring Dashboard**

### **Access Usage Stats**
```bash
curl http://localhost:8000/api/ai/usage-stats/
```

**Response:**
```json
{
  "monthly_cost": 45.60,
  "monthly_budget": 100.00,
  "budget_remaining": 54.40,
  "percentage_used": 45.6,
  "ai_service_available": true,
  "current_month": "August 2025"
}
```

### **Configure AI Settings**
```bash
curl -X POST http://localhost:8000/api/ai/configuration/ \
  -H "Content-Type: application/json" \
  -d '{
    "daily_rate": 180,
    "specialties": ["React", "Django", "AI/ML"]
  }'
```

## 🔄 **Hybrid Approach (Recommended)**

### **Smart AI Usage**
```python
# Use AI for:
✅ Complex customer questions
✅ Natural language processing  
✅ Advanced negotiations
✅ Technical explanations

# Use rule-based for:
✅ Basic information gathering
✅ Standard quotes
✅ Simple responses
✅ Cost control
```

### **Implementation**
```javascript
// Frontend toggle
const useAI = customerMessage.length > 50 || 
              customerMessage.includes('complex') ||
              customerMessage.includes('explain');

fetch('/api/ai-chat/', {
  method: 'POST',
  body: JSON.stringify({
    session_id: sessionId,
    message: message,
    use_ai: useAI  // Smart switching
  })
});
```

## ⚠️ **Important Considerations**

### **1. Cost Control**
- Start with £50 monthly budget
- Monitor usage weekly
- Increase budget based on business value
- Use rule-based system as fallback

### **2. Quality vs Cost**
- GPT-3.5: Best value for business use
- GPT-4: Premium quality, higher cost
- Rule-based: Free, covers 80% of cases

### **3. Customer Privacy**
- AI providers may store conversations
- Consider data privacy policies
- Implement data retention limits
- Use AI for non-sensitive inquiries

## 🎯 **Business Benefits**

### **AI Integration Advantages**
```
✅ Natural conversation flow
✅ Advanced customer understanding
✅ Complex technical explanations
✅ Competitive advantage
✅ 24/7 intelligent responses
```

### **Current Rule-Based Advantages**
```
✅ Zero ongoing costs
✅ Full control over responses
✅ Predictable behavior
✅ No external dependencies
✅ Privacy compliant
```

## 📈 **Recommended Strategy**

### **Phase 1: Test (Month 1)**
- Enable AI for 10% of conversations
- £50 monthly budget
- Monitor customer satisfaction
- Compare AI vs rule-based effectiveness

### **Phase 2: Scale (Month 2-3)**
- Increase to 30% AI usage
- £100 monthly budget
- Optimize customer type detection
- Refine discount automation

### **Phase 3: Optimize (Month 4+)**
- Data-driven AI usage decisions
- Custom budget based on ROI
- Advanced business customization
- Full integration with sales process

## 🔧 **Configuration Examples**

### **Seasonal Adjustments**
```python
# Christmas discount period
if current_month in ['November', 'December']:
    SEASONAL_DISCOUNT = 0.10  # Extra 10% off
    
# Summer promotion  
if current_month in ['June', 'July', 'August']:
    STARTUP_DISCOUNT = 0.20  # Increase startup discount
```

### **Project Type Pricing**
```python
# AI learns your pricing strategy
if project_type == 'e-commerce':
    base_rate = daily_rate * 1.2  # 20% premium
    
if project_type == 'simple_website':
    base_rate = daily_rate * 0.9  # 10% discount
```

This setup gives you complete control over AI costs while providing professional, customized customer service that grows your business! 🚀
