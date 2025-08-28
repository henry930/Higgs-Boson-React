"""
AWS Lambda handler for Django application
"""
import os
import sys
import json
import base64
from io import StringIO

# Add the server directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.join(current_dir, '..', '..', 'server')
sys.path.insert(0, server_dir)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

# Import Django
import django
from django.core.wsgi import get_wsgi_application
from django.http import HttpRequest
from django.test import RequestFactory

# Initialize Django
django.setup()
application = get_wsgi_application()

def lambda_handler(event, context):
    """
    AWS Lambda handler for Django requests
    """
    try:
        # Extract request information from Lambda event
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        query_string = event.get('queryStringParameters') or {}
        headers = event.get('headers') or {}
        body = event.get('body', '')
        
        # Handle base64 encoded body
        is_base64 = event.get('isBase64Encoded', False)
        if is_base64 and body:
            body = base64.b64decode(body).decode('utf-8')
        
        # Create Django request
        factory = RequestFactory()
        
        # Build query string
        query_params = '&'.join([f"{k}={v}" for k, v in query_string.items()])
        full_path = f"{path}?{query_params}" if query_params else path
        
        # Create request based on method
        if http_method == 'GET':
            request = factory.get(full_path, **headers)
        elif http_method == 'POST':
            content_type = headers.get('content-type', 'application/json')
            request = factory.post(full_path, data=body, content_type=content_type, **headers)
        elif http_method == 'PUT':
            content_type = headers.get('content-type', 'application/json')
            request = factory.put(full_path, data=body, content_type=content_type, **headers)
        elif http_method == 'DELETE':
            request = factory.delete(full_path, **headers)
        elif http_method == 'PATCH':
            content_type = headers.get('content-type', 'application/json')
            request = factory.patch(full_path, data=body, content_type=content_type, **headers)
        else:
            request = factory.generic(http_method, full_path, data=body, **headers)
        
        # Add CORS headers for preflight
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                    'Access-Control-Max-Age': '86400'
                },
                'body': ''
            }
        
        # Process request through Django
        response = application(environ_from_lambda_event(event, context), start_response_stub)
        
        # Extract response data
        status_code = int(response.status_code) if hasattr(response, 'status_code') else 200
        
        # Get response headers
        response_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Content-Type': 'application/json'
        }
        
        if hasattr(response, 'items'):
            for header_name, header_value in response.items():
                response_headers[header_name] = header_value
        
        # Get response body
        response_body = ''
        if hasattr(response, 'content'):
            response_body = response.content.decode('utf-8') if isinstance(response.content, bytes) else str(response.content)
        elif hasattr(response, '__iter__'):
            response_body = ''.join([chunk.decode('utf-8') if isinstance(chunk, bytes) else str(chunk) for chunk in response])
        
        return {
            'statusCode': status_code,
            'headers': response_headers,
            'body': response_body
        }
        
    except Exception as e:
        print(f"Lambda handler error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def environ_from_lambda_event(event, context):
    """
    Convert Lambda event to WSGI environ
    """
    environ = {
        'REQUEST_METHOD': event.get('httpMethod', 'GET'),
        'SCRIPT_NAME': '',
        'PATH_INFO': event.get('path', '/'),
        'QUERY_STRING': '&'.join([f"{k}={v}" for k, v in (event.get('queryStringParameters') or {}).items()]),
        'CONTENT_TYPE': event.get('headers', {}).get('content-type', ''),
        'CONTENT_LENGTH': str(len(event.get('body', ''))),
        'SERVER_NAME': event.get('headers', {}).get('host', 'localhost'),
        'SERVER_PORT': '443',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': StringIO(event.get('body', '')),
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': True,
        'wsgi.run_once': False,
    }
    
    # Add headers to environ
    for header_name, header_value in (event.get('headers') or {}).items():
        # Convert header name to CGI format
        cgi_header = 'HTTP_' + header_name.upper().replace('-', '_')
        environ[cgi_header] = header_value
    
    return environ

def start_response_stub(status, headers, exc_info=None):
    """
    Stub for WSGI start_response
    """
    pass
