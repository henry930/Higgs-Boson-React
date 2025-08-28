#!/usr/bin/env python
"""
Test script for Supabase integration
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/Users/navcolon/Documents/higgsbosonconsultancy2/React/server')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from api.supabase_service import supabase_service

def test_supabase_connection():
    """Test basic Supabase connection and operations"""
    print("🧪 Testing Supabase integration...")
    
    try:
        # Test 1: Get pages
        print("\n1. Testing get_pages()...")
        pages = supabase_service.get_pages()
        print(f"✅ Found {len(pages)} pages")
        for page in pages:
            print(f"   - {page.get('title')} ({page.get('slug')})")
        
        # Test 2: Test chat session creation
        print("\n2. Testing chat session creation...")
        test_session_id = f"test_session_{int(__import__('time').time())}"
        session_data = {
            'session_id': test_session_id,
            'customer_name': 'Test User',
            'customer_email': 'test@example.com',
            'status': 'active'
        }
        
        session = supabase_service.create_chat_session(session_data)
        print(f"✅ Created chat session: {session.get('session_id')}")
        
        # Test 3: Test message saving
        print("\n3. Testing message saving...")
        message_data = {
            'session_id': test_session_id,
            'speaker': 'customer',
            'message': 'Hello, this is a test message'
        }
        
        message = supabase_service.save_chat_message(message_data)
        print(f"✅ Saved message: {message.get('message')[:50]}...")
        
        # Test 4: Get messages
        print("\n4. Testing get_chat_messages()...")
        messages = supabase_service.get_chat_messages(test_session_id)
        print(f"✅ Retrieved {len(messages)} messages for session")
        
        # Test 5: Contact submission
        print("\n5. Testing contact submission...")
        contact_data = {
            'name': 'Test Contact',
            'email': 'testcontact@example.com',
            'subject': 'Test Subject',
            'message': 'This is a test contact form submission'
        }
        
        contact = supabase_service.create_contact_submission(contact_data)
        print(f"✅ Created contact submission: {contact.get('id')}")
        
        print("\n🎉 All Supabase integration tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Supabase integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_supabase_connection()
    sys.exit(0 if success else 1)
