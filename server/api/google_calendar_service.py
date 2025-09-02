# Google Calendar API Integration Service
import os
import json
from datetime import datetime, timedelta
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2 import service_account
from django.conf import settings
from django.core.cache import cache
import logging
import pytz

logger = logging.getLogger(__name__)

class GoogleCalendarService:
    """
    Google Calendar API service for managing appointments
    Supports both OAuth flow and service account for automatic access
    """
    
    # Calendar API scopes
    SCOPES = ['https://www.googleapis.com/auth/calendar']
    
    def __init__(self):
        self.service = None
        self.credentials = None
        # Initialize service account for automatic calendar access
        self.service_account_service = self._init_service_account()
        
    def _init_service_account(self):
        """Initialize service account for automatic calendar access"""
        try:
            service_account_file = getattr(settings, 'GOOGLE_SERVICE_ACCOUNT_FILE', None)
            if service_account_file:
                # Handle relative paths from Django's BASE_DIR
                if not os.path.isabs(service_account_file):
                    service_account_file = os.path.join(settings.BASE_DIR, service_account_file)
                
                if os.path.exists(service_account_file):
                    credentials = service_account.Credentials.from_service_account_file(
                        service_account_file, 
                        scopes=self.SCOPES
                    )
                    service = build('calendar', 'v3', credentials=credentials)
                    logger.info(f"✅ Service account initialized from: {service_account_file}")
                    return service
                else:
                    logger.warning(f"❌ Service account file not found at: {service_account_file}")
                    return None
            else:
                logger.info("ℹ️ Service account file not configured, using OAuth flow only")
                return None
        except Exception as e:
            logger.error(f"❌ Failed to initialize service account: {e}")
            return None
        
    def get_oauth_flow(self, redirect_uri):
        """Create OAuth flow for user authentication"""
        client_config = {
            "web": {
                "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [redirect_uri]
            }
        }
        
        flow = Flow.from_client_config(
            client_config,
            scopes=self.SCOPES
        )
        flow.redirect_uri = redirect_uri
        return flow
    
    def get_authorization_url(self, redirect_uri, state=None):
        """Get the authorization URL for OAuth"""
        flow = self.get_oauth_flow(redirect_uri)
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            state=state
        )
        return auth_url
    
    def exchange_code_for_tokens(self, code, redirect_uri):
        """Exchange authorization code for access tokens"""
        flow = self.get_oauth_flow(redirect_uri)
        flow.fetch_token(code=code)
        return flow.credentials
    
    def build_service_from_credentials(self, credentials):
        """Build Google Calendar service from credentials"""
        self.credentials = credentials
        self.service = build('calendar', 'v3', credentials=credentials)
        return self.service
    
    def build_service_from_service_account(self):
        """Build service using service account (for server-side operations)"""
        from google.oauth2 import service_account
        
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_SERVICE_ACCOUNT_FILE,
            scopes=self.SCOPES
        )
        
        self.credentials = credentials
        self.service = build('calendar', 'v3', credentials=credentials)
        return self.service
    
    def get_calendar_list(self):
        """Get list of user's calendars"""
        if not self.service:
            raise Exception("Calendar service not initialized")
            
        try:
            calendars_result = self.service.calendarList().list().execute()
            calendars = calendars_result.get('items', [])
            return calendars
        except Exception as e:
            logger.error(f"Error fetching calendar list: {e}")
            raise
    
    def get_primary_calendar_id(self):
        """Get primary calendar ID"""
        calendars = self.get_calendar_list()
        for calendar in calendars:
            if calendar.get('primary'):
                return calendar['id']
        return 'primary'  # fallback
    
    def check_availability(self, start_time, end_time, calendar_id='primary'):
        """Check if a time slot is available"""
        if not self.service:
            raise Exception("Calendar service not initialized")
            
        try:
            # Convert datetime to RFC3339 format
            time_min = start_time.isoformat()
            time_max = end_time.isoformat()
            
            # Query for busy times
            body = {
                "timeMin": time_min,
                "timeMax": time_max,
                "items": [{"id": calendar_id}]
            }
            
            freebusy_result = self.service.freebusy().query(body=body).execute()
            busy_times = freebusy_result['calendars'][calendar_id]['busy']
            
            # If no busy times, slot is available
            return len(busy_times) == 0
            
        except Exception as e:
            logger.error(f"Error checking availability: {e}")
            raise
    
    def get_available_slots(self, date, calendar_id='primary', duration_minutes=20):
        """Get available time slots for a specific date"""
        if not self.service:
            raise Exception("Calendar service not initialized")
            
        try:
            # Define business hours (9 AM to 5 PM)
            start_hour = 9
            end_hour = 17
            
            # Create datetime objects for the day
            start_of_day = datetime.combine(date, datetime.min.time().replace(hour=start_hour))
            end_of_day = datetime.combine(date, datetime.min.time().replace(hour=end_hour))
            
            # Get busy times for the day
            body = {
                "timeMin": start_of_day.isoformat(),
                "timeMax": end_of_day.isoformat(),
                "items": [{"id": calendar_id}]
            }
            
            freebusy_result = self.service.freebusy().query(body=body).execute()
            busy_times = freebusy_result['calendars'][calendar_id]['busy']
            
            # Generate all possible slots
            available_slots = []
            current_time = start_of_day
            slot_duration = timedelta(minutes=duration_minutes)
            
            while current_time + slot_duration <= end_of_day:
                slot_end = current_time + slot_duration
                
                # Check if this slot conflicts with any busy time
                is_available = True
                for busy in busy_times:
                    busy_start = datetime.fromisoformat(busy['start'].replace('Z', '+00:00'))
                    busy_end = datetime.fromisoformat(busy['end'].replace('Z', '+00:00'))
                    
                    # Remove timezone info for comparison
                    busy_start = busy_start.replace(tzinfo=None)
                    busy_end = busy_end.replace(tzinfo=None)
                    
                    if (current_time < busy_end and slot_end > busy_start):
                        is_available = False
                        break
                
                if is_available:
                    available_slots.append({
                        'start': current_time.strftime('%H:%M'),
                        'end': slot_end.strftime('%H:%M'),
                        'datetime': current_time
                    })
                
                current_time += slot_duration
            
            return available_slots
            
        except Exception as e:
            logger.error(f"Error getting available slots: {e}")
            raise
    
    def create_event(self, summary, start_time, end_time, attendee_emails=None, 
                    description=None, calendar_id='primary'):
        """Create a calendar event"""
        if not self.service:
            raise Exception("Calendar service not initialized")
            
        try:
            event = {
                'summary': summary,
                'description': description or '',
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},  # 1 day
                        {'method': 'popup', 'minutes': 30},       # 30 minutes
                    ],
                },
            }
            
            # Add attendees if provided
            if attendee_emails:
                event['attendees'] = [{'email': email} for email in attendee_emails]
            
            # Create the event
            created_event = self.service.events().insert(
                calendarId=calendar_id, 
                body=event,
                sendUpdates='all'  # Send email invitations
            ).execute()
            
            return created_event
            
        except Exception as e:
            logger.error(f"Error creating calendar event: {e}")
            raise
    
    def update_event(self, event_id, **kwargs):
        """Update an existing calendar event"""
        if not self.service:
            raise Exception("Calendar service not initialized")
            
        try:
            # Get existing event
            event = self.service.events().get(
                calendarId=getattr(settings, 'GOOGLE_CALENDAR_ID', 'primary'), 
                eventId=event_id
            ).execute()
            
            # Update fields
            for key, value in kwargs.items():
                if key in ['summary', 'description']:
                    event[key] = value
                elif key == 'start_time':
                    event['start'] = {'dateTime': value.isoformat(), 'timeZone': 'UTC'}
                elif key == 'end_time':
                    event['end'] = {'dateTime': value.isoformat(), 'timeZone': 'UTC'}
            
            # Update the event
            updated_event = self.service.events().update(
                calendarId=getattr(settings, 'GOOGLE_CALENDAR_ID', 'primary'),
                eventId=event_id,
                body=event,
                sendUpdates='all'
            ).execute()
            
            return updated_event
            
        except Exception as e:
            logger.error(f"Error updating calendar event: {e}")
            raise
    
    def delete_event(self, event_id, calendar_id='primary'):
        """Delete a calendar event"""
        if not self.service:
            raise Exception("Calendar service not initialized")
            
        try:
            self.service.events().delete(
                calendarId=calendar_id,
                eventId=event_id,
                sendUpdates='all'
            ).execute()
            
            return True
            
        except Exception as e:
            logger.error(f"Error deleting calendar event: {e}")
            raise
    
    def get_live_availability(self, date_str: str) -> dict:
        """
        Get real-time availability from Google Calendar
        This is the main method for automatic calendar access
        """
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Use service account if available (for automated access)
            if self.service_account_service:
                return self._get_availability_from_service_account(target_date)
            
            # Fall back to default business hours if no service account
            else:
                logger.info("No service account available, using default business hours")
                return self._get_default_availability(target_date)
                
        except Exception as e:
            logger.error(f"❌ Error getting live availability: {e}")
            return self._get_default_availability(target_date)
    
    def _get_availability_from_service_account(self, target_date) -> dict:
        """Get availability using service account (automatic access)"""
        try:
            # Ensure target_date is a date object
            if isinstance(target_date, str):
                target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
                
            # Get busy times from Google Calendar
            calendar_busy_times = self._get_busy_times_from_calendar(target_date)
            
            # Get busy times from database appointments
            database_busy_times = self._get_busy_times_from_database(target_date)
            
            # Combine both sources
            all_busy_times = calendar_busy_times + database_busy_times
            
            # Remove duplicates by converting to set of time strings and back
            unique_busy_times = []
            seen_slots = set()
            for busy in all_busy_times:
                slot_key = f"{busy['start']}-{busy['end']}"
                if slot_key not in seen_slots:
                    seen_slots.add(slot_key)
                    unique_busy_times.append(busy)
            
            # Generate available slots excluding all busy times
            available_slots = self._generate_available_slots_from_business_hours(target_date, unique_busy_times)
            
            return {
                'date': target_date.strftime('%Y-%m-%d'),
                'availableSlots': available_slots,
                'bookedSlots': [f"{busy['start']}-{busy['end']}" for busy in unique_busy_times],
                'message': f"{len(available_slots)} slots available (live from Google Calendar + database)",
                'source': 'google_calendar_plus_database'
            }
            
        except Exception as e:
            logger.error(f"❌ Service account availability error: {e}")
            return self._get_default_availability(target_date)
    
    def _get_busy_times_from_calendar(self, target_date) -> list:
        """Get busy times from Google Calendar using service account - ALWAYS FRESH DATA"""
        try:
            # Ensure target_date is a date object
            if isinstance(target_date, str):
                target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
                
            # Use London timezone
            timezone = pytz.timezone('Europe/London')
            
            # Create start and end of day in London time
            start_datetime = timezone.localize(datetime.combine(target_date, datetime.min.time()))
            end_datetime = start_datetime + timedelta(days=1)
            
            logger.info(f"🔄 FETCHING FRESH calendar data for {target_date} (no cache)")
            
            # Query Google Calendar for events - FORCE FRESH DATA
            events_result = self.service_account_service.events().list(
                calendarId='39764d8b641ac5b7fbcfd8d44556875fc14a9f51bb842a6496f4e6a0048ea80a@group.calendar.google.com',
                timeMin=start_datetime.isoformat(),
                timeMax=end_datetime.isoformat(),
                singleEvents=True,
                orderBy='startTime',
                maxResults=100  # Ensure we get all events for the day
            ).execute()
            
            events = events_result.get('items', [])
            busy_times = []
            
            logger.info(f"📊 Google Calendar returned {len(events)} events for {target_date}")
            
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                end = event['end'].get('dateTime', event['end'].get('date'))
                
                if start and end and 'T' in start:  # Only process datetime events, not all-day
                    # Parse datetime
                    start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                    end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
                    
                    # Convert to London timezone
                    london_tz = pytz.timezone('Europe/London')
                    if start_dt.tzinfo:
                        start_dt = start_dt.astimezone(london_tz)
                        end_dt = end_dt.astimezone(london_tz)
                    
                    busy_times.append({
                        'start': start_dt.strftime('%H:%M'),
                        'end': end_dt.strftime('%H:%M'),
                        'title': event.get('summary', 'Busy'),
                        'id': event.get('id', 'unknown')
                    })
                    
                    logger.info(f"� BUSY: {start_dt.strftime('%H:%M')}-{end_dt.strftime('%H:%M')} - {event.get('summary', 'Busy')}")
            
            logger.info(f"�📅 Found {len(busy_times)} busy periods on {target_date} (FRESH from Google Calendar)")
            return busy_times
            
        except Exception as e:
            logger.error(f"❌ Error getting busy times from calendar: {e}")
            return []
    
    def _get_busy_times_from_database(self, target_date) -> list:
        """Get busy times from database appointments"""
        try:
            from .models import Appointment
            
            # Get all appointments for the target date
            appointments = Appointment.objects.filter(preferred_date=target_date)
            
            busy_times = []
            for appointment in appointments:
                # Parse the time slot (e.g., "10:00-10:30")
                if '-' in appointment.preferred_time:
                    start_time_str, end_time_str = appointment.preferred_time.split('-')
                    busy_times.append({
                        'start': start_time_str,
                        'end': end_time_str,
                        'title': f'Database: {appointment.name}'
                    })
            
            logger.info(f"📊 Found {len(busy_times)} database appointments on {target_date}")
            return busy_times
            
        except Exception as e:
            logger.error(f"❌ Error getting database busy times: {e}")
            return []
    
    def _generate_available_slots_from_business_hours(self, target_date, busy_times) -> list:
        """Generate available slots from business hours, excluding busy times"""
        try:
            # Business hours configuration (9am to 6pm, 7 days a week)
            business_start = datetime.strptime("09:00", "%H:%M").time()
            business_end = datetime.strptime("18:00", "%H:%M").time()
            slot_duration = timedelta(minutes=20)  # 20-minute slots to match booking system
            lunch_start = datetime.strptime("12:00", "%H:%M").time()
            lunch_end = datetime.strptime("13:00", "%H:%M").time()
            
            # No weekend restrictions - available 7 days a week
            # if target_date.weekday() >= 5:  # Removed weekend restriction
            #     return []
            
            available_slots = []
            current_time = datetime.combine(target_date, business_start)
            end_of_day = datetime.combine(target_date, business_end)
            
            while current_time + slot_duration <= end_of_day:
                slot_end = current_time + slot_duration
                
                # Skip lunch time
                if (current_time.time() >= lunch_start and current_time.time() < lunch_end):
                    current_time = current_time + slot_duration
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
                
                current_time = current_time + slot_duration
            
            return available_slots
            
        except Exception as e:
            logger.error(f"❌ Error generating available slots: {e}")
            return []
    
    def _get_default_availability(self, target_date) -> dict:
        """Fallback availability when calendar access is not available"""
        # Ensure target_date is a date object
        if isinstance(target_date, str):
            target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
            
        # Available 7 days a week (removed weekend restriction)
        # if target_date.weekday() >= 5:
        #     return {
        #         'date': target_date.strftime('%Y-%m-%d'),
        #         'availableSlots': [],
        #         'bookedSlots': [],
        #         'message': 'No appointments available on weekends',
        #         'source': 'default_fallback'
        #     }
        
        # Get booked slots from database
        from .models import Appointment
        booked_appointments = Appointment.objects.filter(
            preferred_date=target_date,
            status__in=['pending', 'confirmed']
        ).values_list('preferred_time', flat=True)
        
        booked_slots = list(booked_appointments)
        
        # Default business hours slots (20-minute slots, 9am-6pm, 7 days a week)
        all_default_slots = [
            "09:00-09:20", "09:20-09:40", "09:40-10:00", "10:00-10:20", "10:20-10:40", "10:40-11:00",
            "11:00-11:20", "11:20-11:40", "11:40-12:00", "13:00-13:20", "13:20-13:40", "13:40-14:00",
            "14:00-14:20", "14:20-14:40", "14:40-15:00", "15:00-15:20", "15:20-15:40", "15:40-16:00",
            "16:00-16:20", "16:20-16:40", "16:40-17:00", "17:00-17:20", "17:20-17:40", "17:40-18:00"
        ]
        
        # Filter out booked slots
        available_slots = [slot for slot in all_default_slots if slot not in booked_slots]
        
        return {
            'date': target_date.strftime('%Y-%m-%d'),
            'availableSlots': available_slots,
            'bookedSlots': booked_slots,
            'message': f"{len(available_slots)} slots available (database filtered)",
            'source': 'default_business_hours_with_db'
        }
    
    def create_appointment_with_notification(self, appointment_data: dict) -> dict:
        """
        Create appointment and send notification automatically
        """
        try:
            # Create the calendar event
            event_result = None
            
            if self.service_account_service:
                # Use service account to create event
                event_result = self._create_event_with_service_account(appointment_data)
            
            # Send notification (implement your notification method)
            self._send_appointment_notification(appointment_data, event_result)
            
            return {
                'success': True,
                'event_id': event_result.get('id') if event_result else None,
                'message': 'Appointment created and notification sent',
                'event_details': event_result
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating appointment with notification: {e}")
            return {
                'success': False,
                'message': f'Failed to create appointment: {str(e)}'
            }
    
    def _create_event_with_service_account(self, appointment_data: dict):
        """Create calendar event using service account"""
        try:
            # Parse appointment data
            date_str = appointment_data.get('preferred_date')
            time_str = appointment_data.get('preferred_time')
            client_name = appointment_data.get('name')
            client_email = appointment_data.get('email')
            service_type = appointment_data.get('service', 'Consultation')
            description = appointment_data.get('description', '')
            
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
            
            # Create event object
            event = {
                'summary': f'{service_type} with {client_name}',
                'description': f'Client: {client_name}\nEmail: {client_email}\nService: {service_type}\n\nDescription: {description}\n\nBooked via Higgs Boson Consultancy website.\n\n📧 Notification: henry930@gmail.com',
                'start': {
                    'dateTime': start_datetime.isoformat(),
                    'timeZone': str(timezone),
                },
                'end': {
                    'dateTime': end_datetime.isoformat(),
                    'timeZone': str(timezone),
                },
                # Cannot add attendees with service account without Domain-Wide Delegation
                'reminders': {
                    'useDefault': True,  # Use calendar's default notification settings
                },
                'guestsCanModify': False,
                'guestsCanInviteOthers': False,
                'guestsCanSeeOtherGuests': False,
                'visibility': 'default',  # Make sure event is visible
            }
            
            # Create the event with default calendar notifications
            created_event = self.service_account_service.events().insert(
                calendarId='39764d8b641ac5b7fbcfd8d44556875fc14a9f51bb842a6496f4e6a0048ea80a@group.calendar.google.com',
                body=event
            ).execute()
            
            logger.info(f"✅ Calendar event created: {created_event.get('id')}")
            return created_event
            
        except Exception as e:
            logger.error(f"❌ Error creating calendar event: {e}")
            raise
    
    def _send_appointment_notification(self, appointment_data: dict, event_result: dict):
        """Log appointment booking (Google Calendar handles email notifications)"""
        try:
            logger.info(f"📧 Appointment notification will be sent by Google Calendar for {appointment_data.get('name')}")
            
            # Create notification message for logging
            notification_message = f"""
🗓️ NEW APPOINTMENT BOOKED
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Client: {appointment_data.get('name')}
📧 Email: {appointment_data.get('email')}
📅 Date: {appointment_data.get('preferred_date')}
⏰ Time: {appointment_data.get('preferred_time')}
🔧 Service: {appointment_data.get('service')}
📝 Notes: {appointment_data.get('description')}
🆔 Event ID: {event_result.get('id') if event_result else 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Google Calendar will send email notification to henry930@gmail.com
"""
            
            logger.info(notification_message)
            
        except Exception as e:
            logger.error(f"❌ Error logging notification: {e}")
