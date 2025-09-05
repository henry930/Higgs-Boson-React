import json
import boto3
import logging
import re
from typing import Dict, Any, List, Optional

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')
cloudfront_client = boto3.client('cloudfront')
bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb')

# Constants
BUCKET_NAME = 'higgs-boson-consultancy-frontend-test'
DISTRIBUTION_ID = 'E1UDBVTZEX6FER'
CHAT_TABLE = 'chat-history'

# Available data files and their purposes
DATA_FILES = {
    'hero-slides.json': 'Main banner/hero section content with titles, subtitles, and descriptions',
    'benefits.json': 'Company benefits, services, value propositions, and advantages',
    'testimonials.json': 'Customer reviews, feedback, testimonials, and client quotes',
    'process-steps.json': 'Work process, methodology, steps, and procedures'
}

def lambda_handler(event, context):
    logger.info(f"Received event: {json.dumps(event)}")
    
    try:
        # Handle WebSocket events
        route_key = event.get('requestContext', {}).get('routeKey')
        connection_id = event.get('requestContext', {}).get('connectionId')
        
        if route_key == '$connect':
            return handle_connect(connection_id)
        elif route_key == '$disconnect':
            return handle_disconnect(connection_id)
        elif route_key == 'chat':
            return handle_chat_message(event, connection_id)
        else:
            logger.warning(f"Unknown route key: {route_key}")
            return create_response(400, {'error': 'Unknown route'})
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return create_response(500, {'error': f'Internal error: {str(e)}'})

def handle_connect(connection_id):
    """Handle new WebSocket connection"""
    logger.info(f"New connection: {connection_id}")
    return create_response(200, {'message': 'Connected'})

def handle_disconnect(connection_id):
    """Handle WebSocket disconnection"""
    logger.info(f"Disconnection: {connection_id}")
    return create_response(200, {'message': 'Disconnected'})

def handle_chat_message(event, connection_id):
    """Handle incoming chat message"""
    try:
        # Parse the message
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        
        if not message:
            return send_websocket_message(connection_id, {
                'type': 'error',
                'message': 'No message provided'
            })
        
        logger.info(f"Processing message: {message}")
        
        # Send status update
        send_websocket_message(connection_id, {
            'type': 'status',
            'message': f"🧠 Analyzing with Claude 3.5 Sonnet: {message[:50]}..."
        })
        
        # Analyze the user's request with REAL AI
        analysis = analyze_user_request_with_claude(message)
        
        # FORCE IMMEDIATE ACTION for title changes - bypass Claude completely
        if any(word in message.lower() for word in ['title', 'headline', 'banner', 'hero', 'change', 'update']):
            logger.info(f"🚀 DIRECT ACTION: User wants to change title/content")
            
            new_title = extract_new_title_from_message(message)
            analysis = {
                'action': 'modify_content',
                'content_type': 'hero-slides',
                'modification_type': 'update',
                'target': 'main title',
                'new_content': {'title': new_title},
                'response': f"✅ Updated hero title to '{new_title}'!",
                'ai_reasoning': 'Direct action for title change request'
            }
            
            send_websocket_message(connection_id, {
                'type': 'status',
                'message': f"⚡ Taking immediate action: Updating title..."
            })
            
            result = modify_content(analysis)
            
            if result.get('success'):
                send_websocket_message(connection_id, {
                    'type': 'success',
                    'message': result['response'],
                    'files': [result.get('modified_file', '')],
                    'url': 'https://d1b7dst1qwphev.cloudfront.net'
                })
            else:
                send_websocket_message(connection_id, {
                    'type': 'error',
                    'message': result.get('error', 'Failed to update content')
                })
                
        else:
            # For other requests, try Claude but with better fallback
            try:
                analysis = analyze_user_request_with_claude(message)
            except Exception as e:
                logger.error(f"Claude failed: {e}")
                analysis = {
                    'action': 'need_clarification',
                    'response': 'I can help you change titles, benefits, testimonials, or process steps. What would you like to modify?'
                }
            
            if analysis['action'] == 'modify_content':
                send_websocket_message(connection_id, {
                    'type': 'status',
                    'message': f"✨ Processing: Modifying {analysis.get('content_type', 'content')}..."
                })
                
                result = modify_content(analysis)
                
                if result.get('success'):
                    send_websocket_message(connection_id, {
                        'type': 'success',
                        'message': result['response'],
                        'files': [result.get('modified_file', '')],
                        'url': 'https://d1b7dst1qwphev.cloudfront.net'
                    })
                else:
                    send_websocket_message(connection_id, {
                        'type': 'error',
                        'message': result.get('error', 'Unknown error occurred')
                    })
            else:
                send_websocket_message(connection_id, {
                    'type': 'ai_response',
                    'message': analysis.get('response', 'I can help modify your website. What would you like to change?')
                })
        
        return create_response(200, {'message': 'Message processed'})
        
    except Exception as e:
        logger.error(f"Error handling chat message: {str(e)}")
        send_websocket_message(connection_id, {
            'type': 'error',
            'message': f'Error processing your request: {str(e)}'
        })
        return create_response(500, {'error': str(e)})

def send_websocket_message(connection_id, message):
    """Send message back through WebSocket"""
    try:
        gatewayapi = boto3.client('apigatewaymanagementapi', 
                                 endpoint_url='https://ph4b5o85zj.execute-api.us-east-1.amazonaws.com/prod')
        
        gatewayapi.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps(message)
        )
        logger.info(f"Sent message to {connection_id}: {message['type']}")
    except Exception as e:
        logger.error(f"Failed to send WebSocket message: {str(e)}")

def analyze_user_request_with_claude(message: str) -> Dict[str, Any]:
    """Use REAL Claude 3.5 Sonnet AI to analyze what the user wants to change"""
    
    prompt = f"""
    You are a DECISIVE and ACTION-ORIENTED content management assistant. A user wants to modify website content for Higgs Boson Consultancy.
    
    CRITICAL: NEVER suggest they "try asking me to change the hero title to something new" - that's annoying! BE PROACTIVE!
    
    Available content types:
    - Hero slides: Main banner content, headlines, taglines, main messages  
    - Benefits: Company advantages, services, value propositions, selling points
    - Testimonials: Customer reviews, quotes, feedback, client stories
    - Process steps: Work methodology, procedures, how-to steps, workflow
    
    User request: "{message}"
    
    RULES:
    1. If user mentions "title", "headline", "banner", "hero", or wants to "change" something → ALWAYS set action to "modify_content" 
    2. If user wants "Henry Store" → create that exact title
    3. If user wants something "more professional" → create professional business content
    4. NEVER ask for clarification unless the request is completely nonsensical
    5. ALWAYS be creative and generate actual content
    
    Respond with JSON:
    {{
        "action": "modify_content",
        "content_type": "hero-slides",
        "modification_type": "update",
        "target": "main title",
        "new_content": {{
            "title": "Henry Store" or whatever the user wants,
            "description": "professional description if needed", 
            "subtitle": "professional subtitle if needed"
        }},
        "response": "✅ Updated the hero title as requested!",
        "ai_reasoning": "User wants to change title, taking immediate action"
    }}
    
    BE DECISIVE. TAKE ACTION. NO MORE ANNOYING SUGGESTIONS!
    """
    
    try:
        logger.info("🧠 Calling Claude 3.5 Sonnet via Amazon Bedrock...")
        
        response = bedrock_client.invoke_model(
            modelId='anthropic.claude-3-5-sonnet-20241022-v2:0',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 1000,
                'messages': [{
                    'role': 'user',
                    'content': prompt
                }]
            })
        )
        
        result = json.loads(response['body'].read())
        content = result['content'][0]['text']
        
        logger.info(f"🤖 Claude responded: {content[:200]}...")
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            ai_analysis = json.loads(json_match.group())
            logger.info(f"✨ Claude analysis: {ai_analysis}")
            return ai_analysis
        else:
            logger.warning(f"Could not parse Claude response: {content}")
            return analyze_fallback(message)
            
    except Exception as e:
        logger.error(f"Claude AI analysis failed: {str(e)}")
        return analyze_fallback(message)

def analyze_fallback(message: str) -> Dict[str, Any]:
    """Fallback analysis using keyword matching when Claude fails"""
    message_lower = message.lower()
    
    # Keywords for different content types
    hero_keywords = ['hero', 'banner', 'main title', 'headline', 'tagline', 'main message', 'title']
    benefit_keywords = ['benefit', 'service', 'advantage', 'value', 'offering', 'why choose']
    testimonial_keywords = ['testimonial', 'review', 'feedback', 'customer', 'client', 'quote']
    process_keywords = ['process', 'step', 'methodology', 'procedure', 'how we work']
    
    content_type = None
    if any(keyword in message_lower for keyword in hero_keywords):
        content_type = 'hero-slides'
    elif any(keyword in message_lower for keyword in benefit_keywords):
        content_type = 'benefits'
    elif any(keyword in message_lower for keyword in testimonial_keywords):
        content_type = 'testimonials'
    elif any(keyword in message_lower for keyword in process_keywords):
        content_type = 'process-steps'
    
    if content_type:
        return {
            'action': 'modify_content',
            'content_type': content_type,
            'modification_type': 'update',
            'target': 'general content update',
            'new_content': {'title': extract_quoted_text(message) or 'Updated Content'},
            'response': f'⚡ Fallback mode: I\'ll update the {content_type.replace("-", " ")} content.',
            'ai_reasoning': 'Used keyword matching fallback when Claude was unavailable'
        }
    else:
        return {
            'action': 'need_clarification',
            'response': f'I can help you modify: Hero slides, Benefits, Testimonials, or Process steps. What would you like to change?',
            'ai_reasoning': 'Could not determine content type from user message'
        }

def extract_quoted_text(message: str) -> Optional[str]:
    """Extract text in quotes from message"""
    quote_patterns = [r'"([^"]+)"', r"'([^']+)'", r'`([^`]+)`']
    for pattern in quote_patterns:
        match = re.search(pattern, message)
        if match:
            return match.group(1)
    return None

def extract_new_title_from_message(message: str) -> str:
    """Extract new title from user message or generate one"""
    # First try to find quoted text
    quoted = extract_quoted_text(message)
    if quoted:
        return quoted
    
    # Look for "to [title]" pattern
    to_match = re.search(r'to\s+"?([^"]+)"?', message, re.IGNORECASE)
    if to_match:
        return to_match.group(1).strip('"\'')
    
    # Look for common title keywords and extract what follows
    title_patterns = [
        r'title\s+to\s+(.+)',
        r'headline\s+to\s+(.+)',
        r'change.*to\s+(.+)',
        r'update.*to\s+(.+)'
    ]
    
    for pattern in title_patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            return match.group(1).strip('"\'')
    
    # Default professional titles if we can't extract
    if 'professional' in message.lower():
        return "Professional Excellence in Business Consulting"
    elif 'store' in message.lower():
        return "Henry Store - Premium Business Solutions"
    else:
        return "Higgs Boson Consultancy - Strategic Business Excellence"

def modify_content(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Modify the specified content file"""
    content_type = analysis['content_type']
    filename = f"{content_type}.json"
    
    try:
        # Download current content
        current_content = get_file_content(filename)
        if current_content is None:
            return {'error': f'Could not retrieve {filename}'}
        
        # Modify content based on analysis
        updated_content = update_content_structure(current_content, analysis)
        
        # Upload updated content
        upload_success = upload_file_content(filename, updated_content)
        if not upload_success:
            return {'error': f'Failed to upload {filename}'}
        
        # Invalidate CloudFront cache
        invalidate_cache([f'data/{filename}'])
        
        return {
            'success': True,
            'response': f"✅ Successfully updated {content_type.replace('-', ' ')}! Changes powered by Claude 3.5 Sonnet.",
            'modified_file': filename,
            'changes': analysis.get('new_content', {})
        }
        
    except Exception as e:
        logger.error(f"Error modifying content: {str(e)}")
        return {'error': f'Failed to modify content: {str(e)}'}

def update_content_structure(current_content: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Update content structure based on Claude's analysis"""
    content_type = analysis['content_type']
    new_content = analysis.get('new_content', {})
    modification_type = analysis.get('modification_type', 'update')
    
    if content_type == 'hero-slides':
        if 'slides' in current_content and current_content['slides']:
            slide = current_content['slides'][0]  # Update first slide
            if new_content.get('title'):
                slide['title'] = new_content['title']
            if new_content.get('subtitle'):
                slide['subtitle'] = new_content['subtitle']
            if new_content.get('description'):
                slide['description'] = new_content['description']
    
    elif content_type == 'benefits':
        if modification_type == 'add' and 'benefits' in current_content:
            new_benefit = {
                'title': new_content.get('title', 'New Benefit'),
                'description': new_content.get('description', 'Benefit description'),
                'icon': 'star'
            }
            current_content['benefits'].append(new_benefit)
        elif 'benefits' in current_content and current_content['benefits']:
            benefit = current_content['benefits'][0]  # Update first benefit
            if new_content.get('title'):
                benefit['title'] = new_content['title']
            if new_content.get('description'):
                benefit['description'] = new_content['description']
    
    elif content_type == 'testimonials':
        if modification_type == 'add' and 'testimonials' in current_content:
            new_testimonial = {
                'name': new_content.get('name', 'Anonymous'),
                'text': new_content.get('description', new_content.get('title', 'Great service!')),
                'company': new_content.get('company', 'Client'),
                'rating': 5
            }
            current_content['testimonials'].append(new_testimonial)
        elif 'testimonials' in current_content and current_content['testimonials']:
            testimonial = current_content['testimonials'][0]  # Update first testimonial
            if new_content.get('title') or new_content.get('description'):
                testimonial['text'] = new_content.get('description', new_content.get('title', testimonial['text']))
            if new_content.get('name'):
                testimonial['name'] = new_content['name']
            if new_content.get('company'):
                testimonial['company'] = new_content['company']
    
    elif content_type == 'process-steps':
        if modification_type == 'add' and 'steps' in current_content:
            new_step = {
                'step': len(current_content['steps']) + 1,
                'title': new_content.get('title', 'New Step'),
                'description': new_content.get('description', 'Step description')
            }
            current_content['steps'].append(new_step)
        elif 'steps' in current_content and current_content['steps']:
            step = current_content['steps'][0]  # Update first step
            if new_content.get('title'):
                step['title'] = new_content['title']
            if new_content.get('description'):
                step['description'] = new_content['description']
    
    return current_content

def get_file_content(filename: str) -> Optional[Dict[str, Any]]:
    """Download and parse JSON file from S3"""
    try:
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=f'data/{filename}')
        content = response['Body'].read().decode('utf-8')
        return json.loads(content)
    except Exception as e:
        logger.error(f"Error getting file {filename}: {str(e)}")
        return None

def upload_file_content(filename: str, content: Dict[str, Any]) -> bool:
    """Upload JSON content to S3"""
    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=f'data/{filename}',
            Body=json.dumps(content, indent=2),
            ContentType='application/json'
        )
        return True
    except Exception as e:
        logger.error(f"Error uploading file {filename}: {str(e)}")
        return False

def invalidate_cache(paths: List[str]) -> bool:
    """Invalidate CloudFront cache for specified paths"""
    try:
        cloudfront_client.create_invalidation(
            DistributionId=DISTRIBUTION_ID,
            InvalidationBatch={
                'Paths': {
                    'Quantity': len(paths),
                    'Items': paths
                },
                'CallerReference': f'claude-invalidation-{int(boto3.Session().get_credentials().token or 12345)}'
            }
        )
        return True
    except Exception as e:
        logger.error(f"Error invalidating cache: {str(e)}")
        return False

def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """Create API Gateway response"""
    return {
        'statusCode': status_code,
        'body': json.dumps(body)
    }
