import json
from datetime import datetime, timedelta

def lambda_handler(event, context):
    """Simple Lambda handler to test appointments availability"""
    
    # Extract path and method
    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    }
    
    # Handle OPTIONS preflight requests
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight successful'})
        }
    
    # Health check
    if path == '/health' or path == '/health/':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'status': 'ok',
                'message': 'Lambda API is working!',
                'timestamp': datetime.now().isoformat()
            })
        }
    
    # Appointments availability endpoint
    if path.startswith('/api/appointments/availability') and method == 'GET':
        try:
            # Get date parameter from query string
            query_params = event.get('queryStringParameters') or {}
            requested_date = query_params.get('date')
            
            if not requested_date:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Date parameter is required'})
                }
            
            # Parse the date
            try:
                date_obj = datetime.strptime(requested_date, '%Y-%m-%d').date()
            except ValueError:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid date format. Use YYYY-MM-DD'})
                }
            
            # Check if it's a weekend
            if date_obj.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([])  # No slots on weekends
                }
            
            # Check if it's in the past
            today = datetime.now().date()
            if date_obj < today:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([])  # No slots in the past
                }
            
            # Generate time slots for business hours (9 AM to 5 PM)
            slots = []
            start_hour = 9
            end_hour = 17
            slot_duration = 30  # 30 minutes
            
            current_time = datetime.combine(date_obj, datetime.min.time().replace(hour=start_hour))
            end_time = datetime.combine(date_obj, datetime.min.time().replace(hour=end_hour))
            
            while current_time < end_time:
                slot_time = current_time.strftime('%H:%M')
                slots.append({
                    'time': slot_time,
                    'available': True
                })
                current_time += timedelta(minutes=slot_duration)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(slots)
            }
            
        except Exception as e:
            print(f"Error handling appointments availability: {str(e)}")
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Internal server error', 'details': str(e)})
            }
    
    # Default response
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({'error': 'Endpoint not found'})
    }
