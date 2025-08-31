import json
from datetime import datetime, timedelta

def lambda_handler(event, context):
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
                'message': 'Test Lambda is working!',
                'timestamp': datetime.now().isoformat()
            })
        }
    
    # Appointments availability endpoint
    if path.startswith('/api/appointments/availability') and method == 'GET':
        # Get date parameter from query string
        query_params = event.get('queryStringParameters') or {}
        requested_date = query_params.get('date')
        
        if not requested_date:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Date parameter is required'})
            }
        
        # Generate time slots in the format the frontend expects
        # Frontend expects: "10:30-11:00" format
        available_slots = [
            "09:00-09:30",
            "09:30-10:00", 
            "10:00-10:30",
            "10:30-11:00",
            "11:00-11:30",
            "11:30-12:00",
            "12:00-12:30",
            "12:30-13:00",
            "13:00-13:30",
            "13:30-14:00",
            "14:00-14:30",
            "14:30-15:00",
            "15:00-15:30",
            "15:30-16:00",
            "16:00-16:30",
            "16:30-17:00"
        ]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'availableSlots': available_slots,
                'bookedSlots': []  # No bookings for now
            })
        }
    
    # Schedule notification endpoint (when appointment is booked)
    if path.startswith('/api/schedule-notification') and method == 'POST':
        try:
            # Parse the request body
            body = json.loads(event.get('body', '{}'))
            
            client_name = body.get('client_name')
            client_email = body.get('client_email') 
            meeting_type = body.get('meeting_type')
            scheduled_time = body.get('scheduled_time')
            description = body.get('description')
            
            # Log the appointment booking
            print(f"📅 New appointment booked:")
            print(f"   Client: {client_name} ({client_email})")
            print(f"   Type: {meeting_type}")
            print(f"   Time: {scheduled_time}")
            print(f"   Description: {description}")
            
            # In a real implementation, you would:
            # 1. Save to database
            # 2. Send confirmation emails
            # 3. Add to calendar system
            # 4. Send notifications to staff
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'message': 'Appointment notification received',
                    'appointment_id': f"apt_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                })
            }
            
        except Exception as e:
            print(f"Error handling schedule notification: {str(e)}")
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Failed to process notification', 'details': str(e)})
            }
    
    # Default response
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({'error': 'Endpoint not found', 'path': path})
    }
