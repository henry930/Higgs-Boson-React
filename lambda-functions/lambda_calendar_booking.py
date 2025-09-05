"""
AWS Lambda function for Google Calendar booking system and AI Chat
Handles both availability checking, appointment booking, and AI chat responses
"""
import json
import os
from datetime import datetime, timedelta, date
import logging
from typing import Dict, List, Any
import uuid

try:
    import boto3
except ImportError:
    boto3 = None

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    import pytz
    GOOGLE_AVAILABLE = True
except ImportError:
    GOOGLE_AVAILABLE = False
    service_account = None
    build = None
    pytz = None

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS Bedrock client for Claude Sonnet (for chat functionality)
try:
    bedrock = boto3.client('bedrock-runtime', region_name=os.environ.get('BEDROCK_REGION', 'us-east-1'))
    BEDROCK_AVAILABLE = True
except:
    bedrock = None
    BEDROCK_AVAILABLE = False

# Claude model configuration
CLAUDE_MODEL_ID = os.environ.get('CLAUDE_MODEL_ID', 'anthropic.claude-3-5-sonnet-20240620-v1:0')

class GoogleCalendarLambda:
    def __init__(self):
        """Initialize the Google Calendar service for Lambda"""
        self.calendar_service = None
        self.business_calendar_id = '39764d8b641ac5b7fbcfd8d44556875fc14a9f51bb842a6496f4e6a0048ea80a@group.calendar.google.com'
        self._init_service_account()
    
    def _init_service_account(self):
        """Initialize Google Calendar service using service account credentials"""
        try:
            if not GOOGLE_AVAILABLE:
                logger.warning("❌ Google Calendar libraries not available")
                return
                
            # Try to load service account from JSON file first, then fall back to environment variables
            service_account_info = None
            
            # Try loading from local JSON file (for deployment packages that include it)
            try:
                import json
                with open('google-service-account.json', 'r') as f:
                    service_account_info = json.load(f)
                logger.info("✅ Loaded service account from JSON file")
            except FileNotFoundError:
                logger.info("📄 JSON file not found, using environment variables")
                # Fallback to environment variables
                private_key = os.environ.get('GOOGLE_PRIVATE_KEY', '')
                # Handle both escaped and unescaped newlines
                if '\\n' in private_key:
                    private_key = private_key.replace('\\n', '\n')
                
                service_account_info = {
                    "type": "service_account",
                    "project_id": os.environ.get('GOOGLE_PROJECT_ID', 'higgs-bonson-consultancy'),
                    "private_key_id": os.environ.get('GOOGLE_PRIVATE_KEY_ID'),
                    "private_key": private_key,
                    "client_email": os.environ.get('GOOGLE_CLIENT_EMAIL', 'higgs-boson-consultancy-calend@higgs-bonson-consultancy.iam.gserviceaccount.com'),
                    "client_id": os.environ.get('GOOGLE_CLIENT_ID'),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ.get('GOOGLE_CLIENT_EMAIL', 'higgs-boson-consultancy-calend@higgs-bonson-consultancy.iam.gserviceaccount.com')}"
                }
                
            if not service_account_info:
                raise Exception("No service account configuration found")
            
            scopes = ['https://www.googleapis.com/auth/calendar']
            
            credentials = service_account.Credentials.from_service_account_info(
                service_account_info, scopes=scopes
            )
            
            self.calendar_service = build('calendar', 'v3', credentials=credentials)
            logger.info("✅ Google Calendar service initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Google Calendar service: {e}")
            self.calendar_service = None
    
    def get_live_availability(self, date_str: str) -> Dict[str, Any]:
        """Get real-time availability from Google Calendar"""
        try:
            # Parse the target date
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Check if date is in the past
            if target_date < date.today():
                return {
                    'date': date_str,
                    'availableSlots': [],
                    'bookedSlots': [],
                    'message': 'Selected date is in the past',
                    'source': 'validation'
                }
            
            logger.info(f"🔄 Getting live availability for {date_str}")
            
            # Get busy times from Google Calendar
            busy_times = self._get_busy_times_from_calendar(target_date)
            
            # Generate available slots
            available_slots = self._generate_available_slots_from_business_hours(target_date, busy_times)
            
            return {
                'date': date_str,
                'availableSlots': available_slots,
                'bookedSlots': [f"{busy['start']}-{busy['end']}" for busy in busy_times],
                'message': f"{len(available_slots)} slots available from Google Calendar",
                'source': 'google_calendar_live',
                'fetched_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting live availability: {e}")
            # Return fallback availability
            return self._get_fallback_availability(date_str)
    
    def _get_busy_times_from_calendar(self, target_date: date) -> List[Dict]:
        """Get busy times from Google Calendar"""
        try:
            if not self.calendar_service:
                logger.warning("📅 Calendar service not available, returning empty busy times")
                return []
            
            # Set timezone to London
            london_tz = pytz.timezone('Europe/London')
            
            # Create datetime range for the target date in London timezone
            start_of_day = london_tz.localize(datetime.combine(target_date, datetime.min.time()))
            end_of_day = london_tz.localize(datetime.combine(target_date, datetime.max.time()))
            
            # Convert to UTC for API call
            start_datetime = start_of_day.astimezone(pytz.UTC)
            end_datetime = end_of_day.astimezone(pytz.UTC)
            
            logger.info(f"📅 Fetching calendar events from {start_datetime} to {end_datetime}")
            
            # Query Google Calendar for events
            events_result = self.calendar_service.events().list(
                calendarId=self.business_calendar_id,
                timeMin=start_datetime.isoformat(),
                timeMax=end_datetime.isoformat(),
                singleEvents=True,
                orderBy='startTime',
                maxResults=100
            ).execute()
            
            events = events_result.get('items', [])
            busy_times = []
            
            logger.info(f"📊 Google Calendar returned {len(events)} events for {target_date}")
            
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                end = event['end'].get('dateTime', event['end'].get('date'))
                
                if start and end and 'T' in start:  # Only process datetime events
                    # Parse datetime
                    start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                    end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
                    
                    # Convert to London timezone
                    if start_dt.tzinfo:
                        start_dt = start_dt.astimezone(london_tz)
                        end_dt = end_dt.astimezone(london_tz)
                    
                    busy_times.append({
                        'start': start_dt.strftime('%H:%M'),
                        'end': end_dt.strftime('%H:%M'),
                        'title': event.get('summary', 'Busy'),
                        'id': event.get('id', 'unknown')
                    })
                    
                    logger.info(f"🚫 BUSY: {start_dt.strftime('%H:%M')}-{end_dt.strftime('%H:%M')} - {event.get('summary', 'Busy')}")
            
            logger.info(f"📅 Found {len(busy_times)} busy periods on {target_date}")
            return busy_times
            
        except Exception as e:
            logger.error(f"❌ Error getting busy times from calendar: {e}")
            return []
    
    def _generate_available_slots_from_business_hours(self, target_date: date, busy_times: List[Dict]) -> List[str]:
        """Generate available 20-minute slots from business hours, excluding busy times"""
        try:
            # Business hours: 9am to 6pm, 7 days a week, 20-minute slots
            business_start = datetime.strptime("09:00", "%H:%M").time()
            business_end = datetime.strptime("18:00", "%H:%M").time()
            slot_duration = timedelta(minutes=20)
            lunch_start = datetime.strptime("12:00", "%H:%M").time()
            lunch_end = datetime.strptime("13:00", "%H:%M").time()
            
            available_slots = []
            current_time = datetime.combine(target_date, business_start)
            end_of_day = datetime.combine(target_date, business_end)
            
            while current_time + slot_duration <= end_of_day:
                slot_end = current_time + slot_duration
                
                # Skip lunch time
                if (current_time.time() >= lunch_start and current_time.time() < lunch_end):
                    current_time += slot_duration
                    continue
                
                # Check if this slot conflicts with any busy time
                is_available = True
                for busy in busy_times:
                    busy_start_time = datetime.strptime(busy['start'], '%H:%M').time()
                    busy_end_time = datetime.strptime(busy['end'], '%H:%M').time()
                    
                    busy_start_dt = datetime.combine(target_date, busy_start_time)
                    busy_end_dt = datetime.combine(target_date, busy_end_time)
                    
                    # Check for overlap
                    if (current_time < busy_end_dt and slot_end > busy_start_dt):
                        is_available = False
                        break
                
                if is_available:
                    available_slots.append(f"{current_time.strftime('%H:%M')}-{slot_end.strftime('%H:%M')}")
                
                current_time += slot_duration
            
            return available_slots
            
        except Exception as e:
            logger.error(f"❌ Error generating available slots: {e}")
            return []
    
    def _get_fallback_availability(self, date_str: str) -> Dict[str, Any]:
        """Fallback availability when Google Calendar is not accessible"""
        default_slots = [
            "09:00-09:20", "09:20-09:40", "09:40-10:00", "10:00-10:20", "10:20-10:40", "10:40-11:00",
            "11:00-11:20", "11:20-11:40", "11:40-12:00", "13:00-13:20", "13:20-13:40", "13:40-14:00",
            "14:00-14:20", "14:20-14:40", "14:40-15:00", "15:00-15:20", "15:20-15:40", "15:40-16:00",
            "16:00-16:20", "16:20-16:40", "16:40-17:00", "17:00-17:20", "17:20-17:40", "17:40-18:00"
        ]
        
        return {
            'date': date_str,
            'availableSlots': default_slots,
            'bookedSlots': [],
            'message': 'Fallback availability (20-min slots) - Calendar service unavailable',
            'source': 'fallback',
            'fetched_at': datetime.now().isoformat()
        }
    
    def book_appointment(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Book an appointment and create Google Calendar event"""
        try:
            logger.info(f"📝 Booking appointment for {appointment_data.get('name')}")
            
            # Validate required fields
            required_fields = ['name', 'email', 'preferred_date', 'preferred_time']
            missing_fields = [field for field in required_fields if not appointment_data.get(field)]
            
            if missing_fields:
                return {
                    'success': False,
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }
            
            # Create calendar event
            event_result = self._create_calendar_event(appointment_data)
            
            if event_result.get('success'):
                # Store appointment in DynamoDB (optional)
                # self._store_appointment_in_dynamodb(appointment_data, event_result.get('event_id'))
                
                return {
                    'success': True,
                    'message': '✅ Appointment booked successfully!',
                    'event_id': event_result.get('event_id'),
                    'appointment_details': {
                        'name': appointment_data.get('name'),
                        'email': appointment_data.get('email'),
                        'date': appointment_data.get('preferred_date'),
                        'time': appointment_data.get('preferred_time'),
                        'service': appointment_data.get('service', 'Consultation')
                    },
                    'next_steps': [
                        '📧 Check your email for calendar invitation',
                        '⏰ The appointment has been added to the consultant\'s calendar',
                        '🔔 You will receive reminder notifications'
                    ]
                }
            else:
                return {
                    'success': False,
                    'error': event_result.get('error', 'Failed to create calendar event')
                }
                
        except Exception as e:
            logger.error(f"❌ Error booking appointment: {e}")
            return {
                'success': False,
                'error': f'Failed to book appointment: {str(e)}'
            }
    
    def _create_calendar_event(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create Google Calendar event"""
        try:
            if not self.calendar_service:
                raise Exception("Google Calendar service not available")
            
            # Parse appointment data
            date_str = appointment_data.get('preferred_date')
            time_str = appointment_data.get('preferred_time')
            client_name = appointment_data.get('name')
            client_email = appointment_data.get('email')
            service_type = appointment_data.get('service', 'Consultation')
            description = appointment_data.get('description', '')
            client_phone = appointment_data.get('phone', '')
            client_company = appointment_data.get('company', '')
            
            # Create datetime objects
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Parse time - handle both "HH:MM" and "HH:MM-HH:MM" formats
            if '-' in time_str:
                start_time_str = time_str.split('-')[0]
            else:
                start_time_str = time_str
            
            appointment_time = datetime.strptime(start_time_str, '%H:%M').time()
            
            # Set timezone - using London timezone
            timezone = pytz.timezone('Europe/London')
            
            # Create naive datetime first, then localize to London time
            naive_datetime = datetime.combine(appointment_date, appointment_time)
            start_datetime = timezone.localize(naive_datetime)
            end_datetime = start_datetime + timedelta(minutes=20)  # 20-minute appointment
            
            # Create event description
            event_description = f"""Client: {client_name}
Email: {client_email}
Phone: {client_phone}
Company: {client_company}
Service: {service_type}

Description: {description}

Booked via Higgs Boson Consultancy website.

📧 Notification: henry930@gmail.com"""
            
            # Create event object
            event = {
                'summary': f'{service_type} with {client_name}',
                'description': event_description,
                'start': {
                    'dateTime': start_datetime.isoformat(),
                    'timeZone': str(timezone),
                },
                'end': {
                    'dateTime': end_datetime.isoformat(),
                    'timeZone': str(timezone),
                },
                'reminders': {
                    'useDefault': True,  # Use calendar's default notification settings
                },
                'guestsCanModify': False,
                'guestsCanInviteOthers': False,
                'guestsCanSeeOtherGuests': False,
                'visibility': 'default',
            }
            
            # Create the event
            created_event = self.calendar_service.events().insert(
                calendarId=self.business_calendar_id,
                body=event
            ).execute()
            
            logger.info(f"✅ Calendar event created: {created_event.get('id')}")
            
            return {
                'success': True,
                'event_id': created_event.get('id'),
                'event_link': created_event.get('htmlLink')
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating calendar event: {e}")
            return {
                'success': False,
                'error': f'Failed to create calendar event: {str(e)}'
            }

# Lambda function handler
def lambda_handler(event, context):
    """Main Lambda function handler"""
    try:
        # Log the event structure for debugging
        logger.info(f"🔍 Event structure: {json.dumps(event, default=str)}")
        
        # Initialize calendar service
        calendar_lambda = GoogleCalendarLambda()
        
        # Parse the request - handle both API Gateway and Function URL formats
        # Function URL format
        if 'requestContext' in event and 'http' in event['requestContext']:
            http_method = event['requestContext']['http']['method']
            path = event['requestContext']['http']['path']
            query_params = event.get('queryStringParameters') or {}
            logger.info(f"📱 Function URL format - Method: {http_method}, Path: {path}")
        # API Gateway format
        else:
            http_method = event.get('httpMethod', '')
            path = event.get('path', '')
            query_params = event.get('queryStringParameters') or {}
            logger.info(f"🌐 API Gateway format - Method: {http_method}, Path: {path}")
        
        # CORS headers - More comprehensive
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept,Origin,Referer',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,PUT,DELETE',
            'Access-Control-Max-Age': '86400'
        }
        
        # Handle preflight requests
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight'})
            }
        
        # Parse request body for POST requests
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except json.JSONDecodeError:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid JSON in request body'})
                }
        
        # Route requests
        if http_method == 'GET' and '/live-availability' in path:
            # GET /api/google-calendar/live-availability/
            date_param = query_params.get('date')
            if not date_param:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Date parameter is required'})
                }
            
            result = calendar_lambda.get_live_availability(date_param)
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(result)
            }
            
        elif http_method == 'POST' and '/book' in path:
            # POST /api/google-calendar/book/
            result = calendar_lambda.book_appointment(body)
            status_code = 201 if result.get('success') else 400
            
            return {
                'statusCode': status_code,
                'headers': headers,
                'body': json.dumps(result)
            }
            
        else:
            # Route not found
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Route not found',
                    'available_routes': [
                        'GET /api/google-calendar/live-availability/?date=YYYY-MM-DD',
                        'POST /api/google-calendar/book/'
                    ]
                })
            }
    
    except Exception as e:
        logger.error(f"❌ Lambda function error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
