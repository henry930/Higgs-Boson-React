# Higgs Boson Consultancy - Deployment Configuration Reference
# DO NOT LOSE THIS INFORMATION!

## 🌍 AWS Configuration
- **Region:** us-east-1
- **AWS Account:** 358157044493

## 🌐 API Gateway
- **Gateway ID:** fqsgv6rshb
- **Base URL:** https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod
- **Stage:** prod

## 🔗 API Endpoints
- **Chat API:** https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/chat
- **Calendar Availability:** https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/google-calendar/live-availability
- **Calendar Booking:** https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/google-calendar/book
- **Admin API:** https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/admin

## 🔧 Lambda Functions
- **Chat Function:** claude-chat-api
  - ARN: arn:aws:lambda:us-east-1:358157044493:function:claude-chat-api
  - Handler: lambda_chat_api.lambda_handler
  - Runtime: python3.9
  - Memory: 512MB
  - Timeout: 30s

- **Calendar Function:** google-calendar-booking
  - ARN: arn:aws:lambda:us-east-1:358157044493:function:google-calendar-booking
  - Handler: lambda_calendar_booking.lambda_handler
  - Runtime: python3.9
  - Memory: 256MB
  - Timeout: 30s

## 📦 Lambda Layer
- **Layer Name:** higgs-boson-consultancy-layer
- **Layer ARN:** arn:aws:lambda:us-east-1:358157044493:layer:higgs-boson-consultancy-layer:1
- **Compatible Runtime:** python3.9

## 🗂️ File Paths (Project Structure)
```
/Users/navcolon/Documents/higgsbosonconsultancy2/React/
├── lambda-functions/
│   ├── lambda_calendar_booking.py    # Calendar & booking logic
│   └── lambda_chat_api.py            # AI chat with Claude
├── deployment-scripts/
│   ├── deploy-all.sh                 # Full deployment
│   ├── deploy-quick.sh               # Lambda functions only
│   ├── deploy_lambda_calendar_optimized.sh
│   └── deploy-claude-chat-api.sh
├── src/                              # React frontend
├── google-service-account.json       # Google Calendar credentials
└── higgs_layer_requirements.txt      # Layer dependencies
```

## 🚀 Quick Deployment Commands
```bash
# Full deployment (includes layer check)
cd deployment-scripts && ./deploy-all.sh

# Quick deployment (Lambda functions only)
cd deployment-scripts && ./deploy-quick.sh

# Individual function deployment
./deploy_lambda_calendar_optimized.sh
./deploy-claude-chat-api.sh
```

## 🧪 Test Commands
```bash
# Chat API
curl -X POST "https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/chat" \
     -H "Content-Type: application/json" \
     -d '{"message":"test","session_id":"test123"}'

# Calendar Availability
curl "https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/google-calendar/live-availability?date=2025-09-06"

# Calendar Booking
curl -X POST "https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod/api/google-calendar/book" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","preferred_date":"2025-09-06","preferred_time":"15:00","service":"Consultation"}'
```

## 🔐 Environment Configuration
- **.env files:** Updated with us-east-1 endpoints
- **Google Calendar:** Service account JSON included in deployment
- **AWS Bedrock:** Claude 3.5 Sonnet model
- **CORS:** Configured for all origins (*)

## 📊 Current Status (September 5, 2025)
✅ **All APIs operational**
✅ **Regional consolidation complete (us-east-1)**
✅ **Layer optimization deployed**
✅ **Frontend integration ready**
✅ **Google Calendar booking functional**
✅ **AI chat fully operational**

## ⚠️ Critical Notes
1. **Never change the API Gateway ID:** fqsgv6rshb
2. **Always deploy to us-east-1 region**
3. **Use layers for dependencies** (keeps functions small)
4. **Google service account file must be included** in calendar deployment
5. **Frontend API config points to unified endpoint**

---
**Last Updated:** September 5, 2025
**System Version:** 2.0 (Post-optimization)
