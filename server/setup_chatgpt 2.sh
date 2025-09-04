#!/bin/bash

echo "🚀 ChatGPT Integration Setup for Higgs Boson Consultancy"
echo "============================================"
echo ""

echo "📋 Setup Steps:"
echo "1. Get your OpenAI API Key from: https://platform.openai.com/api-keys"
echo "2. Create new API key or use existing one"
echo "3. Copy the key (starts with 'sk-')"
echo "4. Update settings.py with your API key"
echo ""

echo "💡 After getting your API key:"
echo "1. Open: /Users/navcolon/Documents/higgsbosonconsultancy2/React/server/settings.py"
echo "2. Find line: OPENAI_API_KEY = 'your-openai-api-key-here'"
echo "3. Replace 'your-openai-api-key-here' with your actual key"
echo "4. Save the file"
echo ""

echo "💰 Expected Costs:"
echo "- Setup: Free"
echo "- Per conversation: ~£0.01-0.05"
echo "- Monthly (moderate usage): £50-100"
echo "- Daily limit: 20 messages per session (configurable)"
echo ""

echo "🔧 Current Configuration:"
echo "- AI Service: OpenAI GPT-3.5 Turbo"
echo "- Daily Rate: £170"
echo "- Location: UK"
echo "- Specialties: React, Django, Full-Stack"
echo "- Usage Control: ✅ Enabled"
echo "- Rate Limiting: ✅ Enabled"
echo "- Cost Monitoring: ✅ Enabled"
echo ""

echo "🧪 Test Commands (after API key setup):"
echo "curl -X POST http://localhost:8000/api/ai-chat/ \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"session_id\": \"test_chatgpt\", \"message\": \"Hello, I need help with a startup project\"}'"
echo ""

echo "📊 Monitor Usage:"
echo "curl http://localhost:8000/api/ai/usage-stats/"
echo ""

echo "Ready to integrate ChatGPT! 🎉"
echo "Follow the steps above to complete setup."
