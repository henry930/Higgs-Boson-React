import json
import os
import boto3
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from datetime import datetime, timedelta
import re
import random

# Global storage for appointments (in production, use DynamoDB or RDS)
appointments_storage = []

def handle_appointments_availability(event, headers):
    """Handle appointments availability requests"""
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
        
        # Get booked appointments for this date
        booked_times = []
        for appointment in appointments_storage:
            if (appointment.get('preferred_date') == requested_date and 
                appointment.get('status') in ['pending', 'confirmed']):
                booked_times.append(appointment.get('preferred_time'))
        
        while current_time < end_time:
            slot_time = current_time.strftime('%H:%M')
            is_available = slot_time not in booked_times
            
            # Only include available slots in the response
            if is_available:
                # Format as time range (e.g., "09:00-09:30")
                end_slot_time = (current_time + timedelta(minutes=slot_duration)).strftime('%H:%M')
                slots.append(f"{slot_time}-{end_slot_time}")
            
            current_time += timedelta(minutes=slot_duration)
        
        # Return in the format expected by the frontend
        response_data = {
            'availableSlots': slots,
            'bookedSlots': booked_times,
            'date': requested_date
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        print(f"Error handling appointments availability: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }

def handle_appointments_create(event, headers):
    """Handle appointment creation requests"""
    try:
        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        
        # Extract appointment details
        name = body.get('name', '').strip()
        email = body.get('email', '').strip()
        phone = body.get('phone', '').strip()
        company = body.get('company', '').strip()
        service = body.get('service', '').strip()
        preferred_date = body.get('preferred_date', '').strip()
        preferred_time = body.get('preferred_time', '').strip()
        message = body.get('message', '').strip()
        
        # Additional fields that might be sent
        scheduled_datetime = body.get('scheduled_datetime')
        end_datetime = body.get('end_datetime')
        timezone = body.get('timezone')
        booking_source = body.get('booking_source', 'web')
        
        # Validate required fields
        if not all([name, email, preferred_date, preferred_time]):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Missing required fields: name, email, preferred_date, preferred_time'
                })
            }
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid email format'})
            }
        
        # Parse and validate date
        try:
            date_obj = datetime.strptime(preferred_date, '%Y-%m-%d').date()
        except ValueError:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid date format. Use YYYY-MM-DD'})
            }
        
        # Check if date is in the past
        today = datetime.now().date()
        if date_obj < today:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Cannot book appointments in the past'})
            }
        
        # Check if it's a weekend
        if date_obj.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Appointments are not available on weekends'})
            }
        
        # Validate time format (HH:MM)
        try:
            datetime.strptime(preferred_time, '%H:%M')
        except ValueError:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid time format. Use HH:MM'})
            }
        
        # Check for existing appointments at the same date and time
        for existing_appointment in appointments_storage:
            if (existing_appointment.get('preferred_date') == preferred_date and 
                existing_appointment.get('preferred_time') == preferred_time and
                existing_appointment.get('status') in ['pending', 'confirmed']):
                return {
                    'statusCode': 409,
                    'headers': headers,
                    'body': json.dumps({'error': 'Time slot is already booked. Please choose another time.'})
                }
        
        # Generate appointment ID
        appointment_id = f"APT-{datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        
        appointment_data = {
            'id': appointment_id,
            'name': name,
            'email': email,
            'phone': phone,
            'company': company,
            'service': service,
            'preferred_date': preferred_date,
            'preferred_time': preferred_time,
            'message': message,
            'scheduled_datetime': scheduled_datetime,
            'end_datetime': end_datetime,
            'timezone': timezone,
            'booking_source': booking_source,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
        }
        
        # Add to storage
        appointments_storage.append(appointment_data)
        
        # Log the appointment for debugging
        print(f"Appointment created: {json.dumps(appointment_data, indent=2)}")
        
        # In production, send confirmation emails here
        # send_appointment_confirmation_email(appointment_data)
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Appointment booked successfully!',
                'data': appointment_data
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        print(f"Error creating appointment: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }

def lambda_handler(event, context):
    """Main Lambda handler function"""
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

    # AI Chat endpoint
    if path.startswith('/api/ai-chat') and method == 'POST':
        return handle_ai_chat(event, headers)
    
    # Schedule notification endpoint
    elif path.startswith('/api/schedule-notification') and method == 'POST':
        return handle_schedule_notification(event, headers)
    
    # Appointments availability endpoint
    elif path.startswith('/api/appointments/availability') and method == 'GET':
        return handle_appointments_availability(event, headers)
    
    # Appointments creation endpoint
    elif path.startswith('/api/appointments') and method == 'POST':
        return handle_appointments_create(event, headers)

    # API routes
    if path == '/health' or path == '/health/':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'status': 'ok',
                'message': 'Lambda API is working!',
                'service': 'Higgs Boson Consultancy API',
                'ai_chat_available': True,
                'timestamp': datetime.now().isoformat()
            })
        }
    
    # Pages API
    elif path.startswith('/api/pages'):
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': [
                    {'id': 1, 'title': 'Home', 'slug': 'home', 'content': 'Welcome to Higgs Boson Consultancy', 'status': 'published'},
                    {'id': 2, 'title': 'About', 'slug': 'about', 'content': 'About our consultancy services', 'status': 'published'}
                ],
                'message': 'Pages fetched successfully'
            })
        }
    
    elif path.startswith('/api/pages') or path.startswith('/pages'):
        # Mock pages data
        pages_data = [
            {
                'id': 1,
                'title': 'Home',
                'slug': 'home',
                'content': 'Welcome to Higgs Boson Consultancy',
                'status': 'published'
            },
            {
                'id': 2,
                'title': 'About',
                'slug': 'about',
                'content': 'About our consultancy services',
                'status': 'published'
            }
        ]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': pages_data,
                'message': 'Pages fetched successfully'
            })
        }
    
    elif path.startswith('/api/benefits') or path.startswith('/benefits'):
        # Mock benefits data
        benefits_data = [
            {
                'id': 1,
                'title': '70% Cost Reduction',
                'description': 'Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.',
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                'order': 1,
                'active': True
            },
            {
                'id': 2,
                'title': '75% Faster Delivery',
                'description': 'Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.',
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                'order': 2,
                'active': True
            },
            {
                'id': 3,
                'title': 'Lean Expert Teams',
                'description': 'Achieve superior results with smaller teams focused on strategy, management, and quality oversight.',
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C23 18.1645 22.7076 17.3541 22.1679 16.7013C21.6281 16.0484 20.8728 15.5902 20.0394 15.3934" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13A4.001 4.001 0 0 1 16 11.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                'order': 3,
                'active': True
            }
        ]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': benefits_data,
                'message': 'Benefits fetched successfully'
            })
        }
    
    elif path.startswith('/api/testimonials') or path.startswith('/testimonials'):
        # Mock testimonials data
        testimonials_data = [
            {
                'id': 1,
                'name': 'Sarah Johnson',
                'position': 'CTO',
                'company': 'TechStart Inc',
                'content': 'Higgs Boson Consultancy transformed our development process. We reduced costs by 60% and delivered our product 3 months ahead of schedule.',
                'rating': 5
            },
            {
                'id': 2,
                'name': 'Michael Chen',
                'position': 'VP Engineering',
                'company': 'DataFlow Systems',
                'content': 'The AI-accelerated development approach exceeded our expectations. Our team is now 10x more productive.',
                'rating': 5
            }
        ]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': testimonials_data,
                'message': 'Testimonials fetched successfully'
            })
        }
    
    elif path.startswith('/api/process-steps') or path.startswith('/process-steps'):
        # Mock process steps data
        process_steps_data = [
            {
                'id': 1,
                'title': 'Discovery & Planning',
                'description': 'We analyze your requirements and create a comprehensive development strategy.',
                'order': 1,
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3A1 1 0 0 0 13.3 5L8.7 9.6A1 1 0 0 0 8.7 10.4L13.3 15A1 1 0 0 0 14.7 13.6L11.1 10L14.7 6.3Z" fill="currentColor"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
            },
            {
                'id': 2,
                'title': 'AI-Accelerated Development',
                'description': 'Our AI tools generate high-quality code while our experts provide oversight.',
                'order': 2,
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            },
            {
                'id': 3,
                'title': 'Quality Assurance',
                'description': 'Comprehensive testing and validation to ensure enterprise-grade quality.',
                'order': 3,
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="9,11 12,14 22,4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C13.8214 3 15.5291 3.60652 16.9273 4.64273" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
            },
            {
                'id': 4,
                'title': 'Deployment & Support',
                'description': 'Seamless deployment and ongoing support for your application.',
                'order': 4,
                'icon': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            }
        ]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': process_steps_data,
                'message': 'Process steps fetched successfully'
            })
        }
    
    elif path.startswith('/api/hero-slides') or path.startswith('/hero-slides'):
        # Mock hero slides data
        hero_slides_data = [
            {
                'id': 1,
                'title': 'AI-Accelerated Software Development',
                'subtitle': 'Reduce costs by 70% and deliver 75% faster with our expert-guided AI development process',
                'background_image': '/images/how-it-works-hero-bg.jpg',
                'primary_button_text': 'Schedule Consultation',
                'primary_button_action': 'schedule',
                'secondary_button_text': 'Learn More',
                'secondary_button_link': '/how-it-works',
                'order': 1,
                'active': True
            },
            {
                'id': 2,
                'title': 'Expert-Guided Strategy',
                'subtitle': 'Transform your business with lean expert teams and proven methodologies',
                'background_image': '/images/step2-meeting.jpg',
                'primary_button_text': 'Get Started',
                'primary_button_action': 'schedule',
                'secondary_button_text': 'View Process',
                'secondary_button_link': '/how-it-works',
                'order': 2,
                'active': True
            },
            {
                'id': 3,
                'title': 'Scalable Solutions',
                'subtitle': 'Build enterprise-quality applications that grow with your business',
                'background_image': '/images/step4-development.jpg',
                'primary_button_text': 'Start Project',
                'primary_button_action': 'schedule',
                'secondary_button_text': 'Learn More',
                'secondary_button_link': '/services',
                'order': 3,
                'active': True
            }
        ]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': hero_slides_data,
                'message': 'Hero slides fetched successfully'
            })
        }
    
    elif path.startswith('/api/contact') or path.startswith('/contact'):
        if method == 'POST':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Contact form submitted successfully (mock)',
                    'status': 'success'
                })
            }
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    elif path.startswith('/api/ai-chat') or path.startswith('/ai-chat'):
        # AI Chat endpoint
        try:
            if method == 'POST':
                body = json.loads(event.get('body', '{}'))
                session_id = body.get('session_id', 'default')
                message = body.get('message', '')
                customer_info = body.get('customer_info', {})
                
                # Mock AI response - in production, this would integrate with OpenAI/Claude
                ai_responses = [
                    "Thank you for your interest in Higgs Boson Consultancy! I'd be happy to help you with your project requirements.",
                    "That sounds like an exciting project! Can you tell me more about your specific goals and timeline?",
                    "Based on what you've shared, I think we can definitely help. What's your budget range for this project?",
                    "Great! I have all the information I need. Our team will contact you within 24 hours with a detailed proposal.",
                ]
                
                # Simple logic to determine response based on message content
                response_text = ai_responses[0]
                if 'project' in message.lower() or 'build' in message.lower():
                    response_text = ai_responses[1]
                elif 'timeline' in message.lower() or 'budget' in message.lower():
                    response_text = ai_responses[2]
                elif len(message) > 100:  # Longer messages get completion response
                    response_text = ai_responses[3]
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'success': True,
                        'data': {
                            'response': response_text,
                            'session_id': session_id,
                            'requirement_complete': len(message) > 100
                        }
                    })
                }
            else:
                return {
                    'statusCode': 405,
                    'headers': headers,
                    'body': json.dumps({'error': 'Method not allowed'})
                }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': str(e)})
            }
    
    elif path.startswith('/api/schedule-notification') or path.startswith('/schedule-notification'):
        # Schedule notification endpoint
        try:
            if method == 'POST':
                body = json.loads(event.get('body', '{}'))
                client_name = body.get('client_name', '')
                client_email = body.get('client_email', '')
                meeting_type = body.get('meeting_type', '')
                meeting_date = body.get('meeting_date', '')
                meeting_time = body.get('meeting_time', '')
                
                # Mock scheduling response - in production, this would integrate with calendar systems
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'success': True,
                        'message': f'Meeting scheduled successfully for {client_name}',
                        'data': {
                            'client_name': client_name,
                            'client_email': client_email,
                            'meeting_type': meeting_type,
                            'meeting_date': meeting_date,
                            'meeting_time': meeting_time,
                            'confirmation_id': f'HBC-{client_name[:4].upper()}{meeting_date.replace("-", "")}',
                            'meeting_link': 'https://meet.google.com/abc-defg-hij'
                        }
                    })
                }
            else:
                return {
                    'statusCode': 405,
                    'headers': headers,
                    'body': json.dumps({'error': 'Method not allowed'})
                }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': str(e)})
            }
    
    else:
        # Default response
        import datetime
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Higgs Boson Consultancy API',
                'version': '2.0.0-TEST',
                'timestamp': datetime.datetime.now().isoformat(),
                'path': path,
                'method': method,
                'available_endpoints': [
                    '/health',
                    '/api/pages',
                    '/api/benefits',
                    '/api/testimonials',
                    '/api/process-steps',
                    '/api/hero-slides',
                    '/api/contact',
                    '/api/ai-chat',
                    '/api/schedule-notification'
                ]
            })
        }


def handle_ai_chat(event, headers):
    """Handle AI chat requests with intelligent responses"""
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        session_id = body.get('session_id', 'anonymous')
        message = body.get('message', '')
        customer_info = body.get('customer_info', {})
        
        # Generate intelligent AI response based on message content
        ai_response = generate_ai_response(message, customer_info)
        
        response_data = {
            'success': True,
            'message': 'Success',
            'data': {
                'response': ai_response['response'],
                'next_step': ai_response.get('next_step'),
                'ai_powered': True,
                'session_id': session_id,
                'timestamp': datetime.datetime.now().isoformat()
            }
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': 'Internal server error',
                'error': str(e)
            })
        }


def handle_schedule_notification(event, headers):
    """Handle schedule notification requests"""
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        name = body.get('name', '')
        email = body.get('email', '')
        meeting_type = body.get('meeting_type', 'consultation')
        
        response_data = {
            'success': True,
            'message': 'Schedule notification sent successfully',
            'data': {
                'confirmation_id': f"HBC-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}",
                'name': name,
                'email': email,
                'meeting_type': meeting_type,
                'timestamp': datetime.datetime.now().isoformat()
            }
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': 'Internal server error',
                'error': str(e)
            })
        }


def generate_ai_response(message, customer_info=None):
    """Generate intelligent AI responses based on message content"""
    if customer_info is None:
        customer_info = {}
    
    message_lower = message.lower()
    
    # Greeting responses
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
        return {
            'response': f"Hello! Welcome to Higgs Boson Consultancy. I'm here to help you with your data science, AI, and technology needs. How can I assist you today?",
            'next_step': 'collect_requirements'
        }
    
    # Services inquiries
    if any(word in message_lower for word in ['service', 'what do you do', 'help with', 'data science', 'ai', 'machine learning']):
        return {
            'response': "We offer comprehensive data science and AI solutions including:\n\n• Machine Learning model development\n• Data pipeline architecture\n• AI consulting and strategy\n• Custom analytics solutions\n• Cloud infrastructure setup\n• Training and workshops\n\nWhat specific area interests you most?",
            'next_step': 'specify_service'
        }
    
    # Pricing inquiries
    if any(word in message_lower for word in ['price', 'cost', 'how much', 'pricing', 'budget', 'quote']):
        return {
            'response': "Our pricing varies based on project scope and complexity. We offer:\n\n• Hourly consulting: $150-300/hour\n• Fixed-price projects: $5K-50K+\n• Retainer arrangements available\n• Free initial consultation\n\nWould you like to schedule a call to discuss your specific needs and get a customized quote?",
            'next_step': 'schedule_consultation'
        }
    
    # Contact/meeting requests
    if any(word in message_lower for word in ['meet', 'call', 'schedule', 'appointment', 'talk', 'discuss']):
        return {
            'response': "I'd be happy to arrange a consultation! We offer:\n\n• Free 30-minute discovery calls\n• Technical deep-dive sessions\n• Strategy planning meetings\n\nWhat type of meeting would work best for you, and what's your preferred time frame?",
            'next_step': 'schedule_meeting'
        }
    
    # Technical questions
    if any(word in message_lower for word in ['python', 'tensorflow', 'pytorch', 'sklearn', 'pandas', 'numpy', 'technical']):
        return {
            'response': "Great technical question! Our team has extensive experience with:\n\n• Python ecosystem (TensorFlow, PyTorch, scikit-learn)\n• Data processing (Pandas, NumPy, Spark)\n• Cloud platforms (AWS, GCP, Azure)\n• MLOps and deployment\n\nWhat specific technical challenge are you facing? I can connect you with our technical team for a detailed discussion.",
            'next_step': 'technical_consultation'
        }
    
    # Company/about inquiries
    if any(word in message_lower for word in ['about', 'company', 'team', 'who are you', 'experience']):
        return {
            'response': "Higgs Boson Consultancy is a leading data science and AI consulting firm. We help businesses harness the power of data through:\n\n• 10+ years of combined experience\n• Proven track record with Fortune 500 clients\n• Expertise across industries\n• End-to-end solution delivery\n\nWe're passionate about making AI accessible and impactful for businesses of all sizes. What would you like to know more about?",
            'next_step': 'learn_more'
        }
    
    # Default intelligent response
    responses = [
        "Thank you for your message! I understand you're interested in our services. Could you tell me more about your specific needs or challenges?",
        "That's an interesting question! Our team specializes in custom solutions. What's the main goal you're trying to achieve?",
        "I'd love to help you with that! Could you provide more details about your project or requirements?",
        "Great question! Let me connect you with the right information. What industry or type of project are you working on?"
    ]
    
    return {
        'response': random.choice(responses),
        'next_step': 'collect_requirements'
    }

    # Default response for lambda_handler
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({'error': 'Endpoint not found'})
    }
