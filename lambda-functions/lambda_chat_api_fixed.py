"""
AWS Lambda function for AI Chat API
Handles chat requests from both EmbeddedAIChat and AICustomerService components
"""

import json
import boto3
import logging
import os
from datetime import datetime
import uuid

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS Bedrock client for Claude Sonnet
bedrock = boto3.client('bedrock-runtime', region_name=os.environ.get('BEDROCK_REGION', 'us-east-1'))

# Claude model configuration
CLAUDE_MODEL_ID = os.environ.get('CLAUDE_MODEL_ID', 'anthropic.claude-3-5-sonnet-20240620-v1:0')

def lambda_handler(event, context):
    """
    Main Lambda function handler for chat API
    """
    logger.info(f"Received event: {json.dumps(event)}")
    
    try:
        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return create_cors_response(200, {})
        
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
        
        # Get AI response using Claude Sonnet
        ai_response = get_ai_response(message, customer_info, session_id)
        
        # Return response in expected format
        response_data = {
            'data': {
                'response': ai_response,
                'session_id': session_id,
                'requirement_complete': check_requirement_complete(ai_response),
                'quote_ready': False
            }
        }
        
        return create_cors_response(200, response_data)
        
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        # Return a user-friendly error with the expected data structure
        fallback_response = {
            'data': {
                'response': "I don't quite understand your need. Could you please leave your email and contact number, or would you prefer to schedule a call? You can also try rephrasing your question and I'll do my best to help!",
                'session_id': session_id if 'session_id' in locals() else 'error_session',
                'requirement_complete': False,
                'quote_ready': False
            }
        }
        return create_cors_response(200, fallback_response)

def get_ai_response(message, customer_info, session_id):
    """
    Get AI response using Claude Sonnet via AWS Bedrock
    """
    
    try:
        logger.info(f"Using Claude model: {CLAUDE_MODEL_ID}")
        logger.info(f"Bedrock region: {bedrock._client_config.region_name}")
        
        # System prompt for Claude Sonnet (business consultant persona)
        system_prompt = """You are Sarah, a professional business consultant and project analyst for Higgs Boson Consultancy. You specialize in gathering requirements for software development projects and providing accurate cost estimates.

Your role:
- Help potential clients define their project requirements clearly
- Ask strategic questions to understand scope, complexity, and business needs
- Provide realistic timeline and budget estimates
- Maintain a friendly, professional, and consultative tone

Key areas to explore:
1. **Project type**: Web app, mobile app, desktop software, API/backend
2. **Core features**: Authentication, payments, real-time features, integrations
3. **Technology preferences**: React, Angular, Node.js, Python, specific platforms
4. **Timeline**: Launch date, phases, urgency level
5. **Budget range**: Help set realistic expectations
6. **Team size**: How many developers, designers, specialists needed
7. **Maintenance**: Ongoing support, hosting, updates

Response guidelines:
- Keep responses conversational and helpful (2-3 sentences)
- Ask ONE focused question at a time
- Provide estimates when you have enough information
- Use bullet points for lists or technical details
- Always end with a clear next step or question

If the client asks for a quote, make sure you have gathered:
- Project type and core features
- Technology stack preferences  
- Timeline requirements
- Basic complexity level (simple/medium/complex)

Pricing guidelines:
- Simple projects: $5,000-$15,000 (basic websites, simple apps)
- Medium projects: $15,000-$50,000 (complex web apps, e-commerce)
- Complex projects: $50,000+ (enterprise solutions, multiple integrations)

Remember: You're building trust and understanding before providing estimates."""

        # Prepare Claude message format
        claude_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 300,
            "system": system_prompt,
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }
        
        # Call Claude Sonnet via Bedrock
        response = bedrock.invoke_model(
            modelId=CLAUDE_MODEL_ID,
            body=json.dumps(claude_body)
        )
        
        # Parse response
        response_body = json.loads(response['body'].read())
        
        if 'content' in response_body and len(response_body['content']) > 0:
            ai_response = response_body['content'][0]['text']
            logger.info(f"Claude Sonnet response: {ai_response}")
            return ai_response
        else:
            logger.error("No content in Claude response")
            return "I don't quite understand your need. Could you please leave your email and contact number, or would you prefer to schedule a call? You can also try rephrasing your question and I'll do my best to help!"
            
    except Exception as e:
        logger.error(f"Error calling Claude Sonnet: {str(e)}")
        return "I don't quite understand your need. Could you please leave your email and contact number, or would you prefer to schedule a call? You can also try rephrasing your question and I'll do my best to help!"

def check_requirement_complete(response):
    """
    Simple check to see if requirements gathering might be complete
    """
    completion_indicators = [
        'quote', 'estimate', 'budget', 'timeline', 'proposal', 
        'ready to move forward', 'next steps', 'contact you within'
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
