#!/bin/bash

# Test the admin interface locally
echo "🧪 Testing AI Chat System Locally"
echo "================================="

# Check if the admin.html file exists
ADMIN_FILE="../frontend/admin.html"

if [ -f "$ADMIN_FILE" ]; then
    echo "✅ Admin interface found"
    
    # Open in default browser
    if command -v open &> /dev/null; then
        # macOS
        open "$ADMIN_FILE"
        echo "🌐 Opening admin interface in browser..."
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$ADMIN_FILE"
        echo "🌐 Opening admin interface in browser..."
    elif command -v start &> /dev/null; then
        # Windows
        start "$ADMIN_FILE"
        echo "🌐 Opening admin interface in browser..."
    else
        echo "📁 Please open this file manually: $ADMIN_FILE"
    fi
    
    echo ""
    echo "🎯 Test Instructions:"
    echo "1. Enter any text as access key to authenticate"
    echo "2. Try these test messages:"
    echo "   • 'Change the hero title'"
    echo "   • 'Deploy the website'"
    echo "   • 'Update contact information'"
    echo "3. Watch the terminal output for simulated responses"
    echo ""
    echo "💡 This is demo mode - to connect to real AWS:"
    echo "   1. Deploy using ./deploy.sh"
    echo "   2. Update WebSocket URL in admin.html"
    echo "   3. Enable Bedrock access in AWS"
    
else
    echo "❌ Admin interface not found at $ADMIN_FILE"
    echo "Please run this script from the aws-chat-system/scripts directory"
fi
