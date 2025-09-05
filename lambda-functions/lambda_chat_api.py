"""
AWS Lambda function for AI Chat API
Handles project advice and estimation requests from EmbeddedAIChat and AICustomerService components
Provides comprehensive business consulting including technology recommendations, architecture advice, and cost estimation
Now includes database storage for customer conversations and admin dashboard support
"""

import json
import boto3
import logging
import os
import re
from datetime import datetime
import uuid
import time
import random
import sqlite3
import hashlib
import base64

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS Bedrock client for Claude Sonnet
bedrock = boto3.client('bedrock-runtime', region_name=os.environ.get('BEDROCK_REGION', 'us-east-1'))

# AWS SES client for sending emails
ses = boto3.client('ses', region_name=os.environ.get('SES_REGION', 'us-east-1'))

# Claude model configuration
CLAUDE_MODEL_ID = os.environ.get('CLAUDE_MODEL_ID', 'anthropic.claude-3-5-sonnet-20240620-v1:0')

# Email configuration
COMPANY_EMAIL = os.environ.get('COMPANY_EMAIL', 'info@higgsbosonconsultancy.co.uk')
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@higgsbosonconsultancy.co.uk')

# Database configuration
DB_PATH = '/tmp/project_estimation.db'

def init_database():
    """Initialize the SQLite database with schema"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.executescript("""
        -- Customers table to store customer information
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            contact_name TEXT,
            contact_email TEXT NOT NULL,
            contact_phone TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Conversations table to store chat sessions
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            customer_id INTEGER,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers (id)
        );

        -- Messages table to store individual chat messages
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            speaker TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id)
        );

        -- Admin users table for dashboard authentication
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            is_active BOOLEAN DEFAULT TRUE
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
        CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
        CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
        CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(contact_email);
    """)
    
    # Insert default admin user (password: admin123)
    cursor.execute("""
        INSERT OR IGNORE INTO admin_users (username, email, password_hash) 
        VALUES ('admin', 'admin@higgsbosonconsultancy.co.uk', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LU.hs/.1fXlx.jTu2')
    """)
    
    conn.commit()
    conn.close()

def store_customer_info(company_name, contact_name, contact_email, contact_phone):
    """Store customer information in database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO customers (company_name, contact_name, contact_email, contact_phone)
            VALUES (?, ?, ?, ?)
        """, (company_name, contact_name, contact_email, contact_phone))
        
        customer_id = cursor.lastrowid
        conn.commit()
        return customer_id
    except sqlite3.IntegrityError:
        # Customer might already exist, try to find them
        cursor.execute("""
            SELECT id FROM customers WHERE contact_email = ?
        """, (contact_email,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        conn.close()

def store_conversation(session_id, customer_id=None):
    """Store conversation session in database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT OR IGNORE INTO conversations (session_id, customer_id)
            VALUES (?, ?)
        """, (session_id, customer_id))
        
        cursor.execute("""
            SELECT id FROM conversations WHERE session_id = ?
        """, (session_id,))
        
        result = cursor.fetchone()
        conversation_id = result[0] if result else None
        conn.commit()
        return conversation_id
    finally:
        conn.close()

def store_message(conversation_id, speaker, message, metadata=None):
    """Store individual message in database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO messages (conversation_id, speaker, message, metadata)
            VALUES (?, ?, ?, ?)
        """, (conversation_id, speaker, message, json.dumps(metadata) if metadata else None))
        
        conn.commit()
    finally:
        conn.close()

def update_conversation_with_customer(session_id, customer_id):
    """Update conversation with customer ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE conversations SET customer_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE session_id = ?
        """, (customer_id, session_id))
        conn.commit()
    finally:
        conn.close()

def lambda_handler(event, context):
    """
    Main Lambda function handler for chat API
    """
    logger.info(f"Received event: {json.dumps(event)}")
    
    # Initialize database
    init_database()
    
    try:
        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return create_cors_response(200, {})
        
        # Handle admin dashboard routes
        if event.get('path', '').startswith('/api/admin/'):
            return handle_admin_request(event, context)
        
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        
        # Extract chat parameters
        session_id = body.get('session_id', str(uuid.uuid4()))
        message = body.get('message', '')
        customer_info = body.get('customer_info', {})
        use_ai = body.get('use_ai', True)
        
        if not message:
            return create_cors_response(400, {'error': 'Message is required'})
        
        logger.info(f"Processing chat message for session {session_id}: {message}")
        
        # Store conversation session if not exists
        conversation_id = store_conversation(session_id)
        
        # Store customer message
        store_message(conversation_id, 'customer', message)
        
        # Get AI response using Claude Sonnet
        ai_response, customer_details_extracted = get_ai_response(message, customer_info, session_id)
        
        # Store AI response
        store_message(conversation_id, 'ai', ai_response)
        
        # If customer details were extracted, store them and link to conversation
        if customer_details_extracted:
            customer_id = store_customer_info(
                customer_details_extracted.get('company_name', ''),
                customer_details_extracted.get('contact_name', ''),
                customer_details_extracted.get('contact_email', ''),
                customer_details_extracted.get('contact_phone', '')
            )
            if customer_id:
                update_conversation_with_customer(session_id, customer_id)
        
        # Check if requirements are complete
        requirement_complete = bool(customer_details_extracted and 
                                  customer_details_extracted.get('contact_email') and 
                                  customer_details_extracted.get('contact_phone'))
        
        # Send email if customer provided complete contact details
        if requirement_complete:
            try:
                send_conversation_email(session_id, customer_details_extracted, ai_response)
            except Exception as e:
                logger.error(f"Error sending email: {str(e)}")
        
        # Return response in expected format
        response_data = {
            'data': {
                'response': ai_response,
                'session_id': session_id,
                'requirement_complete': requirement_complete,
                'quote_ready': False
            }
        }
        
        return create_cors_response(200, response_data)
        
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error details: {repr(e)}")
        # Return a user-friendly error with the expected data structure
        fallback_response = {
            'data': {
                'response': "I'm here to help with your project! I can provide advice on technology choices, architecture, AI-powered development approaches, cost estimation, and more. We use AI agents and GitHub Copilot to deliver projects 40-60% faster than traditional methods. Could you please be more specific about what aspect of your project you'd like to discuss? Or feel free to leave your email and contact number for a personalized consultation.",
                'session_id': session_id if 'session_id' in locals() else 'error_session',
                'requirement_complete': False,
                'quote_ready': False
            }
        }
        return create_cors_response(200, fallback_response)

def get_ai_response(message, customer_info, session_id):
    """
    Get AI response using Claude Sonnet via AWS Bedrock
    Now includes customer information collection logic
    """
    
    try:
        logger.info(f"Starting AI response generation for session: {session_id}")
        logger.info(f"Using Claude model: {CLAUDE_MODEL_ID}")
        logger.info(f"Bedrock region: {bedrock._client_config.region_name}")
        
        # Check if this is the initial message or if we need customer details
        is_initial_greeting = message.lower() in ['hello', 'hi', 'hey', 'start', 'help']
        customer_details = extract_customer_details(message)
        
        # System prompt for Claude Sonnet (business consultant persona)
        if not customer_details and (is_initial_greeting or not has_customer_details(session_id)):
            system_prompt = """You are Sarah, a business consultant for Higgs Boson Consultancy. 

IMPORTANT: Before providing any project advice or estimates, you MUST collect the following customer information:
1. Company name
2. Contact person's name  
3. Contact email address
4. Contact phone number

Start every conversation by warmly greeting the customer and asking for these details. Say something like:

"Hello! I'm Sarah, your AI Business Consultant at Higgs Boson Consultancy. I'm here to provide expert project advice and accurate estimates for AI-powered development.

Before we dive into your project discussion, I'd love to get to know you better. Could you please share:

• Your company name
• Your name (contact person)
• Your email address  
• Your phone number

This will help me provide more personalized advice and ensure our team can follow up with detailed recommendations!"

Only after collecting this information should you proceed with project advice. Be friendly but persistent about getting these details first."""
        else:
            system_prompt = """You are Sarah, a business consultant for Higgs Boson Consultancy. You provide comprehensive project advice and AI-powered development guidance.

Your expertise covers:
1. Technology Stack Selection (React, Node.js, Python, AI/ML, Cloud platforms)
2. Architecture & Design Patterns (Microservices, Serverless, APIs)
3. AI-Powered Development & Automation (GitHub Copilot, AI agents, automated testing)
4. Scalability & Performance Optimization
5. Security Best Practices
6. Cost-Benefit Analysis & Budget Planning
7. Risk Assessment & Mitigation Strategies
8. Project Timeline & Resource Planning

For project advice, provide:
- Clear, actionable recommendations with reasoning
- Technology pros/cons and alternatives
- Industry best practices and standards
- Potential challenges and solutions
- Implementation strategies and next steps

For estimates, provide TWO versions:
1. Traditional Development: Standard man-day estimates
2. AI-Powered Development: 40-60% faster with AI agents, automated code generation, and intelligent testing

Example format:
• Frontend Development: 12-15 days (Traditional) → 7-9 days (AI-Powered)
• Backend Development: 10-12 days (Traditional) → 6-7 days (AI-Powered)
• Testing & QA: 5-7 days (Traditional) → 3-4 days (AI-Powered)

Always end estimates with: "🤖 We use AI-powered development with GitHub Copilot and autonomous coding agents, delivering 40-60% faster than traditional methods. Our daily rate starts from £150. Schedule a call: [Schedule Call](/schedule-a-call)"

Be practical, knowledgeable, and highlight our AI development advantages."""

        # Prepare Claude message format
        claude_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,  # Increased for more comprehensive advice
            "system": system_prompt,
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }
        
        logger.info(f"Calling Claude Sonnet with message: {message[:100]}...")
        
        # Add retry logic for throttling - optimized for Lambda timeout
        max_retries = 2  # Reduced from 3 to avoid timeout
        base_delay = 0.5  # Reduced from 1 second
        
        for attempt in range(max_retries):
            try:
                # Call Claude Sonnet via Bedrock
                response = bedrock.invoke_model(
                    modelId=CLAUDE_MODEL_ID,
                    body=json.dumps(claude_body)
                )
                break  # Success, exit retry loop
                
            except Exception as e:
                if attempt < max_retries - 1 and "ThrottlingException" in str(e):
                    # Shorter exponential backoff to avoid Lambda timeout
                    delay = base_delay * (2 ** attempt) + random.uniform(0, 0.5)
                    logger.warning(f"Throttling detected, retrying in {delay:.2f} seconds (attempt {attempt + 1}/{max_retries})")
                    time.sleep(delay)
                    continue
                else:
                    # Last attempt or non-throttling error, re-raise
                    raise e
        
        logger.info("Claude Sonnet API call successful")
        
        # Parse response
        response_body = json.loads(response['body'].read())
        logger.info(f"Claude response structure: {response_body.keys()}")
        
        if 'content' in response_body and len(response_body['content']) > 0:
            ai_response = response_body['content'][0]['text']
            logger.info(f"Claude Sonnet response received: {ai_response[:100]}...")
            return ai_response, customer_details
        else:
            logger.error("No content in Claude response")
            logger.error(f"Full response: {response_body}")
            return "I'm here to help with your project! I can provide advice on technology choices, architecture, AI-powered development approaches, cost estimation, and more. We use AI agents and GitHub Copilot to deliver projects 40-60% faster than traditional methods. Could you please be more specific about what aspect of your project you'd like to discuss? Or feel free to leave your email and contact number for a personalized consultation.", None
            
    except Exception as e:
        logger.error(f"Error calling Claude Sonnet: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error traceback: ", exc_info=True)
        return "I'm here to help with your project! I can provide advice on technology choices, architecture, AI-powered development approaches, cost estimation, and more. We use AI agents and GitHub Copilot to deliver projects 40-60% faster than traditional methods. Could you please be more specific about what aspect of your project you'd like to discuss? Or feel free to leave your email and contact number for a personalized consultation.", None

def extract_customer_details(message):
    """
    Extract customer details from message using enhanced regex patterns
    """
    customer_details = {}
    
    # Email pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_matches = re.findall(email_pattern, message)
    if email_matches:
        customer_details['contact_email'] = email_matches[0]
    
    # Phone pattern (supports various formats)
    phone_pattern = r'(?:\+?44\s*)?(?:\(?0\d{1,4}\)?\s*|\(?0\d{3}\)?[-\s]?)\d{3}[-\s]?\d{3,4}|(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
    phone_matches = re.findall(phone_pattern, message)
    if phone_matches:
        customer_details['contact_phone'] = phone_matches[0]
    
    # Company name patterns - look for common indicators
    company_patterns = [
        r'(?:company|business|firm|corporation|corp|ltd|limited|inc|llc|enterprise)\s*:?\s*([A-Za-z0-9\s&]+)',
        r'(?:i work at|i am from|we are|our company is|my company is)\s+([A-Za-z0-9\s&]+)',
        r'([A-Za-z0-9\s&]+)\s+(?:company|business|firm|corporation|corp|ltd|limited|inc|llc|enterprise)'
    ]
    
    for pattern in company_patterns:
        matches = re.findall(pattern, message, re.IGNORECASE)
        if matches:
            customer_details['company_name'] = matches[0].strip()
            break
    
    # Name patterns - look for "my name is", "i am", etc.
    name_patterns = [
        r'(?:my name is|i am|i\'m|call me)\s+([A-Za-z\s]+)',
        r'(?:name|contact)\s*:?\s*([A-Za-z\s]+)',
    ]
    
    for pattern in name_patterns:
        matches = re.findall(pattern, message, re.IGNORECASE)
        if matches:
            name = matches[0].strip()
            # Filter out common words that aren't names
            if len(name) > 1 and not any(word in name.lower() for word in ['looking', 'interested', 'from', 'the', 'and']):
                customer_details['contact_name'] = name
                break
    
    return customer_details

def has_customer_details(session_id):
    """
    Check if we have customer details for this session
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT c.contact_email, c.contact_phone 
            FROM conversations conv
            JOIN customers c ON conv.customer_id = c.id
            WHERE conv.session_id = ?
        """, (session_id,))
        
        result = cursor.fetchone()
        return result is not None and result[0] and result[1]
    except:
        return False
    finally:
        conn.close()

def handle_admin_request(event, context):
    """
    Handle admin dashboard requests
    """
    path = event.get('path', '')
    method = event.get('httpMethod', 'GET')
    
    try:
        if path == '/api/admin/login' and method == 'POST':
            return handle_admin_login(event)
        elif path == '/api/admin/conversations' and method == 'GET':
            return handle_get_conversations(event)
        elif path == '/api/admin/conversation' and method == 'GET':
            return handle_get_conversation_details(event)
        else:
            return create_cors_response(404, {'error': 'Admin endpoint not found'})
    except Exception as e:
        logger.error(f"Error in admin request: {str(e)}")
        return create_cors_response(500, {'error': 'Internal server error'})

def handle_admin_login(event):
    """
    Handle admin login authentication
    """
    body = json.loads(event.get('body', '{}'))
    username = body.get('username', '')
    password = body.get('password', '')
    
    if not username or not password:
        return create_cors_response(400, {'error': 'Username and password required'})
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT id, password_hash FROM admin_users 
            WHERE username = ? AND is_active = 1
        """, (username,))
        
        result = cursor.fetchone()
        if result and result[1] == hashlib.sha256(password.encode()).hexdigest():
            # Simple session token (in production, use JWT)
            token = base64.b64encode(f"{username}:{datetime.now().isoformat()}".encode()).decode()
            
            # Update last login
            cursor.execute("""
                UPDATE admin_users SET last_login = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (result[0],))
            conn.commit()
            
            return create_cors_response(200, {'token': token, 'username': username})
        else:
            return create_cors_response(401, {'error': 'Invalid credentials'})
    finally:
        conn.close()

def handle_get_conversations(event):
    """
    Get all conversations for admin dashboard
    """
    # Simple auth check (in production, validate JWT token)
    auth_header = event.get('headers', {}).get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return create_cors_response(401, {'error': 'Authentication required'})
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT 
                conv.id,
                conv.session_id,
                conv.status,
                conv.created_at,
                c.company_name,
                c.contact_name,
                c.contact_email,
                c.contact_phone,
                COUNT(m.id) as message_count
            FROM conversations conv
            LEFT JOIN customers c ON conv.customer_id = c.id
            LEFT JOIN messages m ON conv.id = m.conversation_id
            GROUP BY conv.id
            ORDER BY conv.created_at DESC
        """)
        
        conversations = []
        for row in cursor.fetchall():
            conversations.append({
                'id': row[0],
                'session_id': row[1],
                'status': row[2],
                'created_at': row[3],
                'company_name': row[4],
                'contact_name': row[5],
                'contact_email': row[6],
                'contact_phone': row[7],
                'message_count': row[8]
            })
        
        return create_cors_response(200, {'conversations': conversations})
    finally:
        conn.close()

def handle_get_conversation_details(event):
    """
    Get detailed conversation with messages
    """
    # Simple auth check
    auth_header = event.get('headers', {}).get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return create_cors_response(401, {'error': 'Authentication required'})
    
    conversation_id = event.get('queryStringParameters', {}).get('id')
    if not conversation_id:
        return create_cors_response(400, {'error': 'Conversation ID required'})
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Get conversation details
        cursor.execute("""
            SELECT 
                conv.session_id,
                conv.status,
                conv.created_at,
                c.company_name,
                c.contact_name,
                c.contact_email,
                c.contact_phone
            FROM conversations conv
            LEFT JOIN customers c ON conv.customer_id = c.id
            WHERE conv.id = ?
        """, (conversation_id,))
        
        conv_row = cursor.fetchone()
        if not conv_row:
            return create_cors_response(404, {'error': 'Conversation not found'})
        
        # Get messages
        cursor.execute("""
            SELECT speaker, message, timestamp
            FROM messages
            WHERE conversation_id = ?
            ORDER BY timestamp ASC
        """, (conversation_id,))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                'speaker': row[0],
                'message': row[1],
                'timestamp': row[2]
            })
        
        conversation_details = {
            'session_id': conv_row[0],
            'status': conv_row[1],
            'created_at': conv_row[2],
            'company_name': conv_row[3],
            'contact_name': conv_row[4],
            'contact_email': conv_row[5],
            'contact_phone': conv_row[6],
            'messages': messages
        }
        
        return create_cors_response(200, conversation_details)
    finally:
        conn.close()

def send_conversation_email(session_id, conversation, contact_details):
    """
    Send conversation transcript to company email
    """
    try:
        # Build conversation transcript
        transcript = ""
        for msg in conversation:
            speaker = "Customer" if msg['speaker'] == 'customer' else "Sarah (AI Assistant)"
            timestamp = datetime.fromisoformat(msg['timestamp']).strftime('%Y-%m-%d %H:%M:%S')
            transcript += f"\n[{timestamp}] {speaker}:\n{msg['message']}\n"
        
        # Email subject and body
        subject = f"New Customer Inquiry - Session {session_id[:8]}"
        
        body = f"""
New customer inquiry received through the AI chat system.

Contact Details:
- Email: {contact_details.get('email', 'Not provided')}
- Phone: {contact_details.get('phone', 'Not provided')}

Conversation Transcript:
{transcript}

Session ID: {session_id}
Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}

Please follow up with the customer promptly.

Best regards,
Higgs Boson Consultancy AI System
        """
        
        # Send email via SES
        response = ses.send_email(
            Source=FROM_EMAIL,
            Destination={
                'ToAddresses': [COMPANY_EMAIL]
            },
            Message={
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': body,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        
        logger.info(f"Email sent successfully. Message ID: {response['MessageId']}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        raise e

def check_requirement_complete(response):
    """
    Check if requirements gathering might be complete or if estimation was provided
    This function is kept for potential future use but not used for UI highlighting
    """
    completion_indicators = [
        'quote', 'estimate', 'budget', 'timeline', 'proposal', 
        'ready to move forward', 'next steps', 'contact you within',
        'task breakdown', 'man-day', 'daily rate', 'schedule a call',
        'total estimated time', 'development service'
    ]
    
    response_lower = response.lower()
    return any(indicator in response_lower for indicator in completion_indicators)

def create_cors_response(status_code, body):
    """
    Create response with CORS headers
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Max-Age': '86400'
        },
        'body': json.dumps(body)
    }
