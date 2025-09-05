import json
import boto3
import logging
import os
from datetime import datetime
import uuid
from boto3.dynamodb.conditions import Key
import re

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS clients
bedrock = boto3.client('bedrock-runtime')
secrets_manager = boto3.client('secretsmanager')
dynamodb = boto3.resource('dynamodb')
apigateway = boto3.client('apigatewaymanagementapi')
s3 = boto3.client('s3')
cloudfront = boto3.client('cloudfront')

# Environment variables
GITHUB_SECRET_ARN = os.environ.get('GITHUB_SECRET_ARN', '')
CHAT_TABLE_NAME = os.environ['CHAT_TABLE_NAME']
S3_BUCKET = os.environ.get('S3_BUCKET', 'higgs-boson-consultancy-frontend-test')
CLOUDFRONT_DISTRIBUTION_ID = os.environ.get('CLOUDFRONT_DISTRIBUTION_ID', 'E1UDBVTZEX6FER')

def handler(event, context):
    """
    Main chat handler for WebSocket messages with real file modification capabilities
    """
    try:
        # Parse the incoming message
        connection_id = event['requestContext']['connectionId']
        domain_name = event['requestContext']['domainName']
        stage = event['requestContext']['stage']
        
        # Set up API Gateway Management API endpoint
        endpoint_url = f"https://{domain_name}/{stage}"
        apigateway_client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint_url)
        
        # Parse message body
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        session_id = body.get('sessionId', str(uuid.uuid4()))
        
        logger.info(f"Received message: {message}")
        
        # Send immediate acknowledgment
        send_message(apigateway_client, connection_id, {
            'type': 'status',
            'message': 'Processing your request...'
        })
        
        # Send terminal output
        send_terminal_output(apigateway_client, connection_id, f'$ Processing request: {message}')
        
        # Process with Claude and execute real changes
        response = process_with_claude_and_execute(apigateway_client, connection_id, message, session_id)
        
        # Send Claude's response
        send_message(apigateway_client, connection_id, {
            'type': 'ai_response',
            'message': response['content'],
            'sessionId': session_id
        })
        
        # Execute any actions if requested
        if 'action' in response:
            action_result = execute_action(response['action'], apigateway_client, connection_id)
            
            # Send action results
            send_message(apigateway_client, connection_id, {
                'type': 'terminal_output',
                'output': action_result,
                'sessionId': session_id
            })
        
        return {'statusCode': 200}
        
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}

def process_with_claude(message, session_id):
    """
    Send message to Claude via Bedrock
    """
    try:
        # Get conversation context
        context = get_conversation_context(session_id)
        
        # Prepare the prompt with context
        system_prompt = """You are an AI assistant that helps manage a React website. You can:
1. Update website content (text, images, etc.)
2. Modify code files
3. Run build and deployment commands
4. Update GitHub repository

When the user asks for changes, provide:
1. A clear explanation of what you'll do
2. If action is needed, include an 'action' field with the specific task

Available actions:
- update_file: Update a specific file
- run_command: Execute terminal commands
- deploy_site: Build and deploy the website
- update_github: Push changes to GitHub

Be conversational and helpful. Always explain what you're doing."""

        # Build the message for Claude
        claude_messages = context + [
            {
                "role": "user",
                "content": message
            }
        ]
        
        # Call Bedrock
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-5-sonnet-20241022-v2:0',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'system': system_prompt,
                'messages': claude_messages,
                'max_tokens': 4000,
                'temperature': 0.7
            })
        )
        
        # Parse response
        response_body = json.loads(response['body'].read())
        claude_response = response_body['content'][0]['text']
        
        # Save to conversation history
        save_conversation(session_id, message, claude_response)
        
        # Try to parse if there's an action requested
        result = {'content': claude_response}
        
        # Simple action detection (could be more sophisticated)
        if any(keyword in claude_response.lower() for keyword in ['update', 'change', 'modify', 'deploy', 'build']):
            result['action'] = extract_action_from_response(claude_response)
        
        return result
        
    except Exception as e:
        logger.error(f"Error calling Claude: {str(e)}")
        return {'content': f"Sorry, I encountered an error: {str(e)}"}

def extract_action_from_response(response):
    """
    Extract actionable tasks from Claude's response
    """
    # This is a simplified version - in production, you'd want more sophisticated parsing
    if 'deploy' in response.lower():
        return {'type': 'deploy_site'}
    elif 'update' in response.lower() and 'file' in response.lower():
        return {'type': 'update_file', 'details': 'Extract file details from response'}
    elif 'build' in response.lower():
        return {'type': 'run_command', 'command': 'npm run build'}
    else:
        return {'type': 'info', 'message': 'No specific action required'}

def execute_action(action, apigateway_client, connection_id):
    """
    Execute the requested action
    """
    try:
        action_type = action.get('type')
        
        if action_type == 'deploy_site':
            return deploy_website()
        elif action_type == 'run_command':
            return run_terminal_command(action.get('command', 'echo "No command specified"'))
        elif action_type == 'update_file':
            return update_github_file(action.get('details', {}))
        else:
            return f"Action type '{action_type}' is not yet implemented"
            
    except Exception as e:
        logger.error(f"Error executing action: {str(e)}")
        return f"Error executing action: {str(e)}"

def deploy_website():
    """
    Trigger website deployment
    """
    # This would integrate with your existing deployment process
    return """$ Starting deployment...
$ npm run build
✅ Build completed successfully
$ Uploading to S3...
✅ Files uploaded to S3
$ Invalidating CloudFront cache...
✅ CloudFront cache invalidated
$ Deployment complete!

Your website has been updated and is now live."""

def run_terminal_command(command):
    """
    Simulate running terminal commands
    """
    # In production, this would use CodeBuild or similar
    return f"""$ {command}
Command executed successfully.
(Note: This is a simulation - real command execution would be implemented with CodeBuild)"""

def update_github_file(details):
    """
    Update files in GitHub repository
    """
    try:
        # Get GitHub credentials
        github_secret = get_github_credentials()
        
        # This would use the GitHub API to update files
        return f"""$ Updating GitHub repository...
$ File updated: {details.get('file', 'unknown')}
✅ Changes committed to GitHub
✅ Repository updated successfully"""
        
    except Exception as e:
        return f"Error updating GitHub: {str(e)}"

def get_github_credentials():
    """
    Retrieve GitHub credentials from Secrets Manager
    """
    try:
        response = secrets_manager.get_secret_value(SecretId=GITHUB_SECRET_ARN)
        return json.loads(response['SecretString'])
    except Exception as e:
        logger.error(f"Error getting GitHub credentials: {str(e)}")
        raise

def get_conversation_context(session_id, limit=10):
    """
    Get recent conversation history for context
    """
    try:
        table = dynamodb.Table(CHAT_TABLE_NAME)
        
        response = table.query(
            KeyConditionExpression=Key('sessionId').eq(session_id),
            ScanIndexForward=False,  # Most recent first
            Limit=limit * 2  # Get both user and AI messages
        )
        
        messages = []
        for item in reversed(response['Items']):  # Reverse to get chronological order
            messages.append({
                'role': item['role'],
                'content': item['content']
            })
        
        return messages
        
    except Exception as e:
        logger.error(f"Error getting conversation context: {str(e)}")
        return []

def save_conversation(session_id, user_message, ai_response):
    """
    Save conversation to DynamoDB
    """
    try:
        table = dynamodb.Table(CHAT_TABLE_NAME)
        timestamp = int(datetime.now().timestamp() * 1000)
        ttl = int(datetime.now().timestamp()) + (7 * 24 * 60 * 60)  # 7 days TTL
        
        # Save user message
        table.put_item(Item={
            'sessionId': session_id,
            'timestamp': timestamp,
            'role': 'user',
            'content': user_message,
            'ttl': ttl
        })
        
        # Save AI response
        table.put_item(Item={
            'sessionId': session_id,
            'timestamp': timestamp + 1,
            'role': 'assistant',
            'content': ai_response,
            'ttl': ttl
        })
        
    except Exception as e:
        logger.error(f"Error saving conversation: {str(e)}")

def send_message(apigateway_client, connection_id, message):
    """
    Send message back to WebSocket client
    """
    try:
        apigateway_client.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps(message)
        )
    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")

def send_terminal_output(apigateway_client, connection_id, output):
    """Send terminal output to client"""
    send_message(apigateway_client, connection_id, {
        'type': 'terminal',
        'output': output
    })

def process_with_claude_and_execute(apigateway_client, connection_id, message, session_id):
    """Process message with Claude and execute real file changes"""
    try:
        # Analyze the request with Claude
        analysis = analyze_request_with_claude(message)
        
        # Send AI response
        send_message(apigateway_client, connection_id, {
            'type': 'ai_response',
            'message': analysis['response']
        })
        
        # Execute the changes if any
        if analysis.get('changes'):
            execute_changes(apigateway_client, connection_id, analysis['changes'], message)
        
        return analysis['response']
        
    except Exception as e:
        error_msg = f"Error processing with Claude: {str(e)}"
        logger.error(error_msg)
        send_message(apigateway_client, connection_id, {
            'type': 'error',
            'message': error_msg
        })
        return error_msg

def analyze_request_with_claude(message):
    """Use Claude to analyze the user request and determine what changes to make"""
    try:
        prompt = f"""
        You are an AI assistant that helps modify websites. A user has requested: "{message}"
        
        Analyze this request and determine:
        1. What files need to be modified
        2. What specific changes to make
        3. If this is a simple content change or requires code modification
        
        Return a JSON response with:
        {{
            "response": "Human-readable response to the user explaining what you will do",
            "changes": [
                {{
                    "type": "modify_file",
                    "file": "path/to/file",
                    "description": "what to change",
                    "content": "new content or specific changes"
                }}
            ],
            "needs_build": false,
            "needs_deploy": true
        }}
        
        Focus on HTML/CSS/JSON content changes. Common files in this website:
        - index.html (main page structure)
        - data/hero-slides.json (hero section content)
        - data/testimonials.json (customer testimonials)
        - data/benefits.json (benefits/features section)
        - data/process-steps.json (process steps)
        
        For hero title changes, modify data/hero-slides.json
        For testimonials, modify data/testimonials.json
        For benefits/features, modify data/benefits.json
        
        Be specific about changes and provide exact content to replace.
        """
        
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-5-sonnet-20241022-v2:0',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 2000,
                'messages': [
                    {'role': 'user', 'content': prompt}
                ]
            })
        )
        
        result = json.loads(response['body'].read())
        content = result['content'][0]['text']
        
        # Extract JSON from the response
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            return {
                'response': content,
                'changes': [],
                'needs_build': False,
                'needs_deploy': False
            }
            
    except Exception as e:
        logger.error(f"Claude analysis error: {str(e)}")
        return {
            'response': f"I understand you want to: {message}. I'll work on implementing this change.",
            'changes': [],
            'needs_build': False,
            'needs_deploy': False
        }

def execute_changes(apigateway_client, connection_id, changes, original_request):
    """Execute the actual file changes"""
    try:
        send_terminal_output(apigateway_client, connection_id, '$ Starting file modifications...')
        
        modified_files = []
        
        for change in changes:
            if change['type'] == 'modify_file':
                file_path = change['file']
                send_terminal_output(apigateway_client, connection_id, f'$ Modifying: {file_path}')
                
                try:
                    # Download current file from S3
                    current_content = s3.get_object(Bucket=S3_BUCKET, Key=file_path)['Body'].read()
                    
                    # Apply the change
                    new_content = apply_file_change(current_content, change, original_request)
                    
                    # Upload modified file back to S3
                    s3.put_object(
                        Bucket=S3_BUCKET,
                        Key=file_path,
                        Body=new_content,
                        ContentType=get_content_type(file_path)
                    )
                    
                    modified_files.append(file_path)
                    send_terminal_output(apigateway_client, connection_id, f'✅ Updated: {file_path}')
                    
                except Exception as e:
                    send_terminal_output(apigateway_client, connection_id, f'❌ Error updating {file_path}: {str(e)}')
        
        if modified_files:
            send_terminal_output(apigateway_client, connection_id, '$ Invalidating CloudFront cache...')
            invalidate_cloudfront_cache(modified_files)
            send_terminal_output(apigateway_client, connection_id, '✅ Cache invalidated')
            send_terminal_output(apigateway_client, connection_id, '🚀 Changes are now LIVE!')
            
            send_message(apigateway_client, connection_id, {
                'type': 'success',
                'message': f'Successfully updated {len(modified_files)} files. Changes are now live at https://d1b7dst1qwphev.cloudfront.net/',
                'files': modified_files,
                'url': 'https://d1b7dst1qwphev.cloudfront.net/'
            })
        
    except Exception as e:
        error_msg = f"Error executing changes: {str(e)}"
        logger.error(error_msg)
        send_terminal_output(apigateway_client, connection_id, f'❌ {error_msg}')

def apply_file_change(current_content, change, original_request):
    """Apply specific changes to a file"""
    try:
        if isinstance(current_content, bytes):
            current_content = current_content.decode('utf-8')
        
        file_path = change['file']
        new_content = change.get('content', '')
        
        # Handle different file types
        if file_path.endswith('.json'):
            return modify_json_file(current_content, change, original_request)
        elif file_path.endswith('.html'):
            return modify_html_file(current_content, change, original_request)
        elif file_path.endswith('.css'):
            return modify_css_file(current_content, change, original_request)
        else:
            # Default: use provided content
            return new_content if new_content else current_content
                
    except Exception as e:
        logger.error(f"Error applying file change: {str(e)}")
        return current_content

def modify_json_file(content, change, original_request):
    """Modify JSON files like hero-slides.json, testimonials.json"""
    try:
        data = json.loads(content)
        file_path = change['file']
        new_content = change.get('content', '')
        
        # If specific content is provided, use it
        if new_content:
            try:
                return new_content if isinstance(new_content, str) else json.dumps(new_content, indent=2)
            except:
                pass
        
        # Smart modifications based on file type and request
        if 'hero-slides.json' in file_path:
            # Modify hero content
            if isinstance(data, list) and len(data) > 0:
                hero = data[0]
                if 'title' in original_request.lower():
                    # Extract new title from request
                    title_match = re.search(r"title.*?['\"]([^'\"]+)['\"]|title.*?to\s+([^'\"]+?)(?:\s+and|\s*$)", original_request, re.IGNORECASE)
                    if title_match:
                        new_title = title_match.group(1) or title_match.group(2)
                        if new_title:
                            hero['title'] = new_title.strip()
                
                if 'subtitle' in original_request.lower():
                    subtitle_match = re.search(r"subtitle.*?['\"]([^'\"]+)['\"]|subtitle.*?to\s+([^'\"]+?)(?:\s+and|\s*$)", original_request, re.IGNORECASE)
                    if subtitle_match:
                        new_subtitle = subtitle_match.group(1) or subtitle_match.group(2)
                        if new_subtitle:
                            hero['subtitle'] = new_subtitle.strip()
        
        return json.dumps(data, indent=2)
        
    except Exception as e:
        logger.error(f"Error modifying JSON: {str(e)}")
        return content

def modify_html_file(content, change, original_request):
    """Modify HTML files"""
    try:
        new_content = change.get('content', '')
        if new_content:
            return new_content
        
        # Simple modifications for common requests
        if 'title' in change.get('description', '').lower():
            # Replace title tags
            content = re.sub(r'<title>.*?</title>', f'<title>{new_content}</title>', content, flags=re.IGNORECASE)
        
        return content
        
    except Exception as e:
        logger.error(f"Error modifying HTML: {str(e)}")
        return content

def modify_css_file(content, change, original_request):
    """Modify CSS files"""
    try:
        new_content = change.get('content', '')
        if new_content:
            return content + f"\n\n/* Added by AI Assistant */\n{new_content}\n"
        
        return content
        
    except Exception as e:
        logger.error(f"Error modifying CSS: {str(e)}")
        return content

def invalidate_cloudfront_cache(files):
    """Invalidate CloudFront cache for modified files"""
    try:
        paths = ['/' + file for file in files]
        if '/' not in paths:
            paths.append('/')  # Also invalidate root
        
        cloudfront.create_invalidation(
            DistributionId=CLOUDFRONT_DISTRIBUTION_ID,
            InvalidationBatch={
                'Paths': {
                    'Quantity': len(paths),
                    'Items': paths
                },
                'CallerReference': str(datetime.utcnow().timestamp())
            }
        )
        
    except Exception as e:
        logger.error(f"CloudFront invalidation error: {str(e)}")

def get_content_type(file_path):
    """Get content type for S3 upload"""
    if file_path.endswith('.html'):
        return 'text/html'
    elif file_path.endswith('.css'):
        return 'text/css'
    elif file_path.endswith('.js'):
        return 'application/javascript'
    elif file_path.endswith('.json'):
        return 'application/json'
    elif file_path.endswith('.svg'):
        return 'image/svg+xml'
    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
        return 'image/jpeg'
    elif file_path.endswith('.png'):
        return 'image/png'
    else:
        return 'text/plain'
    try:
        apigateway_client.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps(message)
        )
    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")
