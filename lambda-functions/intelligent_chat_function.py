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

# Constants
BUCKET_NAME = 'higgs-boson-consultancy-frontend-test'
DISTRIBUTION_ID = 'E1UDBVTZEX6FER'

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
        # Parse the message
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        
        if not message:
            return create_response(400, {'error': 'No message provided'})
        
        logger.info(f"Processing message: {message}")
        
        # Analyze the user's request with AI
        analysis = analyze_user_request(message)
        
        if analysis['action'] == 'modify_content':
            result = modify_content(analysis)
            return create_response(200, result)
        else:
            return create_response(200, {
                'response': analysis.get('response', 'I understand your request, but I need more specific information about what content you want to change.')
            })
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return create_response(500, {'error': f'Internal error: {str(e)}'})

def analyze_user_request(message: str) -> Dict[str, Any]:
    """Use AI to analyze what the user wants to change"""
    
    prompt = f"""
    You are an intelligent content management assistant. A user wants to modify website content.
    
    Available content types:
    - Hero slides: Main banner content, headlines, taglines, main messages
    - Benefits: Company advantages, services, value propositions, selling points
    - Testimonials: Customer reviews, quotes, feedback, client stories
    - Process steps: Work methodology, procedures, how-to steps, workflow
    
    User request: "{message}"
    
    Analyze this request and respond with a JSON object containing:
    {{
        "action": "modify_content" or "need_clarification",
        "content_type": "hero-slides" or "benefits" or "testimonials" or "process-steps" or null,
        "modification_type": "add" or "update" or "replace" or "delete",
        "target": "description of what specifically to modify",
        "new_content": {{
            "title": "new title if applicable",
            "description": "new description if applicable", 
            "subtitle": "new subtitle if applicable"
        }},
        "response": "human-friendly response explaining what will be done"
    }}
    
    Guidelines:
    - If user wants to change hero/banner/main title/headline → hero-slides
    - If user wants to change benefits/services/advantages → benefits  
    - If user wants to change reviews/testimonials/feedback → testimonials
    - If user wants to change process/steps/methodology → process-steps
    - Be specific about what content to create
    - If request is vague, set action to "need_clarification"
    """
    
    try:
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
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            logger.warning(f"Could not parse AI response: {content}")
            return analyze_fallback(message)
            
    except Exception as e:
        logger.error(f"AI analysis failed: {str(e)}")
        return analyze_fallback(message)

def analyze_fallback(message: str) -> Dict[str, Any]:
    """Fallback analysis using keyword matching"""
    message_lower = message.lower()
    
    # Keywords for different content types
    hero_keywords = ['hero', 'banner', 'main title', 'headline', 'tagline', 'main message']
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
            'response': f'I\'ll update the {content_type.replace("-", " ")} content for you.'
        }
    else:
        return {
            'action': 'need_clarification',
            'response': f'I can help you modify: Hero slides, Benefits, Testimonials, or Process steps. What would you like to change? Available options: {", ".join(DATA_FILES.keys())}'
        }

def extract_quoted_text(message: str) -> Optional[str]:
    """Extract text in quotes from message"""
    quote_patterns = [r'"([^"]+)"', r"'([^']+)'", r'`([^`]+)`']
    for pattern in quote_patterns:
        match = re.search(pattern, message)
        if match:
            return match.group(1)
    return None

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
            'response': f"✅ Successfully updated {content_type.replace('-', ' ')}! Changes will be visible in a few moments.",
            'modified_file': filename,
            'changes': analysis.get('new_content', {})
        }
        
    except Exception as e:
        logger.error(f"Error modifying content: {str(e)}")
        return {'error': f'Failed to modify content: {str(e)}'}

def update_content_structure(current_content: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Update content structure based on analysis"""
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
                'CallerReference': f'invalidation-{int(boto3.Session().get_credentials().token or 0)}'
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
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
        },
        'body': json.dumps(body)
    }
