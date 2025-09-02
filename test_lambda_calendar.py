#!/usr/bin/env python3
"""
Test script for Google Calendar Lambda function
Run this locally to test the function before deploying
"""

import json
import sys
import os
from datetime import datetime, timedelta

# Add current directory to path to import the lambda function
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from lambda_calendar_booking import lambda_handler
except ImportError as e:
    print(f"❌ Error importing lambda function: {e}")
    print("Make sure lambda_calendar_booking.py is in the same directory")
    sys.exit(1)

def test_availability():
    """Test the availability endpoint"""
    print("🧪 Testing availability endpoint...")
    
    # Create test event for availability check
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    
    event = {
        'httpMethod': 'GET',
        'path': '/api/google-calendar/live-availability/',
        'queryStringParameters': {
            'date': tomorrow
        },
        'headers': {
            'Content-Type': 'application/json'
        }
    }
    
    context = {}
    
    try:
        response = lambda_handler(event, context)
        print(f"✅ Status Code: {response['statusCode']}")
        
        if response['statusCode'] == 200:
            body = json.loads(response['body'])
            available_slots = body.get('availableSlots', [])
            print(f"📅 Available slots for {tomorrow}: {len(available_slots)}")
            print(f"🕐 First few slots: {available_slots[:5]}")
            print(f"📊 Response: {json.dumps(body, indent=2)}")
        else:
            print(f"❌ Error response: {response['body']}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

def test_booking():
    """Test the booking endpoint"""
    print("\n🧪 Testing booking endpoint...")
    
    # Create test event for booking
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    
    test_appointment = {
        'name': 'Test User',
        'email': 'test@example.com',
        'phone': '+44 1234 567890',
        'company': 'Test Company',
        'preferred_date': tomorrow,
        'preferred_time': '09:00',
        'service': 'Free Consultation (20 min)',
        'description': 'This is a test booking from the Lambda test script'
    }
    
    event = {
        'httpMethod': 'POST',
        'path': '/api/google-calendar/book/',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(test_appointment)
    }
    
    context = {}
    
    try:
        response = lambda_handler(event, context)
        print(f"✅ Status Code: {response['statusCode']}")
        
        body = json.loads(response['body'])
        if response['statusCode'] in [200, 201]:
            print(f"✅ Booking successful!")
            print(f"📋 Response: {json.dumps(body, indent=2)}")
        else:
            print(f"❌ Booking failed: {json.dumps(body, indent=2)}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

def test_cors():
    """Test CORS preflight request"""
    print("\n🧪 Testing CORS preflight...")
    
    event = {
        'httpMethod': 'OPTIONS',
        'path': '/api/google-calendar/live-availability/',
        'headers': {
            'Origin': 'https://example.com'
        }
    }
    
    context = {}
    
    try:
        response = lambda_handler(event, context)
        print(f"✅ Status Code: {response['statusCode']}")
        
        headers = response.get('headers', {})
        cors_headers = {k: v for k, v in headers.items() if 'Access-Control' in k}
        print(f"🔧 CORS Headers: {json.dumps(cors_headers, indent=2)}")
        
    except Exception as e:
        print(f"❌ CORS test failed: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting Lambda function tests...\n")
    
    # Set environment variables for testing (optional)
    # os.environ['GOOGLE_PROJECT_ID'] = 'your-project-id'
    # os.environ['GOOGLE_CLIENT_EMAIL'] = 'your-service-account@project.iam.gserviceaccount.com'
    
    print("📝 Note: These tests will run with limited functionality unless you set the Google service account environment variables\n")
    
    test_cors()
    test_availability()
    
    # Uncomment the line below to test booking (will create a real calendar event if credentials are set)
    # test_booking()
    
    print("\n🎉 Tests completed!")
    print("\n📋 Next steps:")
    print("1. Set up Google service account credentials as environment variables")
    print("2. Deploy the function using: ./deploy_lambda_calendar.sh")
    print("3. Configure API Gateway to route requests to the Lambda function")
    print("4. Test with real requests from your frontend")

if __name__ == '__main__':
    main()
