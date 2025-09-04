#!/bin/bash

# Test the enhanced system endpoints

echo "🧪 Testing Enhanced Company Management System"
echo "=============================================="

# Test company registration
echo "1️⃣ Testing Company Registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/company/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcompany@example.com",
    "password": "testpass123",
    "company_name": "Test Company LLC",
    "company_type": "startup",
    "phone": "+1-555-123-4567",
    "first_name": "John",
    "last_name": "Doe",
    "website": "https://testcompany.com"
  }')

echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('token', ''))" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
    echo "✅ Registration successful, token: ${TOKEN:0:20}..."
    
    # Test company login
    echo "2️⃣ Testing Company Login..."
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/company/login/ \
      -H "Content-Type: application/json" \
      -d '{
        "email": "testcompany@example.com",
        "password": "testpass123"
      }')
    
    echo "$LOGIN_RESPONSE" | python3 -m json.tool
    echo ""
    
    # Test company dashboard
    echo "3️⃣ Testing Company Dashboard..."
    DASHBOARD_RESPONSE=$(curl -s -X GET http://localhost:8000/api/company/dashboard/ \
      -H "Authorization: Token $TOKEN")
    
    echo "$DASHBOARD_RESPONSE" | python3 -m json.tool
    echo ""
    
    # Test estimation with company account requirement
    echo "4️⃣ Testing AI Chat with Company Account..."
    AI_RESPONSE=$(curl -s -X POST http://localhost:8000/api/ai-chat/ \
      -H "Content-Type: application/json" \
      -H "Authorization: Token $TOKEN" \
      -d '{
        "session_id": "test_company_session",
        "message": "I need a React web application for my e-commerce business. Can you provide a detailed estimate?",
        "customer_info": {
          "name": "John Doe",
          "email": "testcompany@example.com",
          "company": "Test Company LLC",
          "phone": "+1-555-123-4567"
        }
      }')
    
    echo "$AI_RESPONSE" | python3 -m json.tool
    echo ""
    
else
    echo "❌ Registration failed, skipping other tests"
fi

echo "🏁 Test completed!"
