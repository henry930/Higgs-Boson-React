# Google Calendar API Views
from datetime import datetime, timedelta, date
from django.conf import settings
from django.urls import reverse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
import json
import logging

from .google_calendar_service import GoogleCalendarService
from .models import Appointment
from .serializers import AppointmentSerializer

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleCalendarViewSet(viewsets.ViewSet):
    """ViewSet for Google Calendar integration"""
    permission_classes = [AllowAny]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.calendar_service = GoogleCalendarService()
    
    @action(detail=False, methods=['get'])
    def auth_url(self, request):
        """Get Google OAuth authorization URL"""
        try:
            redirect_uri = request.build_absolute_uri(reverse('google-calendar-callback'))
            auth_url = self.calendar_service.get_authorization_url(redirect_uri)
            
            return Response({
                'auth_url': auth_url,
                'redirect_uri': redirect_uri
            })
        except Exception as e:
            logger.error(f"Error getting auth URL: {e}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def callback(self, request):
        """Handle OAuth callback and exchange code for tokens"""
        try:
            code = request.data.get('code')
            if not code:
                return Response(
                    {'error': 'Authorization code is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            redirect_uri = request.build_absolute_uri(reverse('google-calendar-callback'))
            credentials = self.calendar_service.exchange_code_for_tokens(code, redirect_uri)
            
            # Store credentials securely (in production, use encrypted storage)
            credentials_data = {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes
            }
            
            # Cache the credentials for 1 hour (adjust as needed)
            cache.set('google_calendar_credentials', credentials_data, 3600)
            
            return Response({
                'success': True,
                'message': 'Successfully connected to Google Calendar'
            })
            
        except Exception as e:
            logger.error(f"Error in OAuth callback: {e}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def availability(self, request):
        """Get available time slots from Google Calendar (LIVE REAL-TIME)"""
        try:
            date_param = request.query_params.get('date')
            if not date_param:
                return Response(
                    {'error': 'Date parameter is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Parse the date
            try:
                selected_date = datetime.strptime(date_param, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get LIVE availability from Google Calendar
            logger.info(f"🔄 Getting LIVE availability for {date_param}")
            availability_data = self.calendar_service.get_live_availability(date_param)
            
            # Add real-time timestamp to response
            availability_data['fetched_at'] = datetime.now().isoformat()
            availability_data['real_time'] = True
            
            logger.info(f"📅 Live availability: {len(availability_data.get('availableSlots', []))} slots available from {availability_data.get('source', 'unknown')}")
            
            return Response(availability_data)
            
        except Exception as e:
            logger.error(f"❌ Error getting live availability: {e}")
            # Fallback to default availability with 20-minute slots
            fallback_data = {
                'date': date_param,
                'availableSlots': [
                    "09:00-09:20", "09:20-09:40", "09:40-10:00", "10:00-10:20", "10:20-10:40", "10:40-11:00",
                    "11:00-11:20", "11:20-11:40", "11:40-12:00", "13:00-13:20", "13:20-13:40", "13:40-14:00",
                    "14:00-14:20", "14:20-14:40", "14:40-15:00", "15:00-15:20", "15:20-15:40", "15:40-16:00",
                    "16:00-16:20", "16:20-16:40", "16:40-17:00", "17:00-17:20", "17:20-17:40", "17:40-18:00"
                ],
                'bookedSlots': [],
                'message': f'Fallback availability (20-min slots) - {str(e)}',
                'source': 'fallback',
                'real_time': False,
                'fetched_at': datetime.now().isoformat()
            }
            return Response(fallback_data)
            
            # Check if date is in the past
            if selected_date < date.today():
                return Response({
                    'date': date_param,
                    'availableSlots': [],
                    'bookedSlots': [],
                    'message': 'Selected date is in the past'
                })
            
            # Check if it's a weekend (optional)
            if selected_date.weekday() >= 5:  # Saturday = 5, Sunday = 6
                return Response({
                    'date': date_param,
                    'availableSlots': [],
                    'bookedSlots': [],
                    'message': 'Appointments not available on weekends'
                })
            
            # Try to get credentials from cache or use service account
            credentials_data = cache.get('google_calendar_credentials')
            
            if credentials_data:
                # Use user's OAuth credentials
                from google.oauth2.credentials import Credentials
                credentials = Credentials(
                    token=credentials_data['token'],
                    refresh_token=credentials_data['refresh_token'],
                    token_uri=credentials_data['token_uri'],
                    client_id=credentials_data['client_id'],
                    client_secret=credentials_data['client_secret'],
                    scopes=credentials_data['scopes']
                )
                self.calendar_service.build_service_from_credentials(credentials)
            else:
                # Fallback to service account or return static slots
                # For now, return static slots if no OAuth setup
                return self._get_static_availability(selected_date)
            
            # Get available slots from Google Calendar
            available_slots_data = self.calendar_service.get_available_slots(selected_date)
            
            # Format slots for frontend
            available_slots = []
            for slot in available_slots_data:
                slot_str = f"{slot['start']}-{slot['end']}"
                available_slots.append(slot_str)
            
            # Get booked slots from database (fallback)
            booked_appointments = Appointment.objects.filter(
                preferred_date=selected_date,
                status__in=['pending', 'confirmed']
            ).values_list('preferred_time', flat=True)
            
            booked_slots = list(booked_appointments)
            
            return Response({
                'date': date_param,
                'availableSlots': available_slots,
                'bookedSlots': booked_slots,
                'message': f'{len(available_slots)} slots available',
                'calendar_connected': credentials_data is not None
            })
            
        except Exception as e:
            logger.error(f"Error checking availability: {e}")
            # Fallback to database-only availability
            return self._get_static_availability(selected_date)
    
    def _get_static_availability(self, selected_date):
        """Fallback method to get availability without Google Calendar"""
        # Define all possible time slots
        all_slots = [
            '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
            '11:00-11:30', '11:30-12:00', '13:00-13:30', '13:30-14:00',
            '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
            '16:00-16:30', '16:30-17:00'
        ]
        
        # Get booked appointments from database
        booked_appointments = Appointment.objects.filter(
            preferred_date=selected_date,
            status__in=['pending', 'confirmed']
        ).values_list('preferred_time', flat=True)
        
        booked_slots = list(booked_appointments)
        available_slots = [slot for slot in all_slots if slot not in booked_slots]
        
        return Response({
            'date': selected_date.strftime('%Y-%m-%d'),
            'availableSlots': available_slots,
            'bookedSlots': booked_slots,
            'message': f'{len(available_slots)} slots available (database only)',
            'calendar_connected': False
        })
    
    @action(detail=False, methods=['post'])
    def create_appointment(self, request):
        """Create appointment with AUTOMATIC Google Calendar integration and notification"""
        try:
            logger.info("🚀 Creating appointment with automatic calendar integration")
            
            # Validate appointment data
            serializer = AppointmentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Save to database first
            appointment = serializer.save()
            logger.info(f"💾 Appointment saved to database: {appointment.id}")
            
            # Use the new automatic Google Calendar integration
            appointment_data = {
                'name': appointment.name,
                'email': appointment.email,
                'service': appointment.service,
                'preferred_date': appointment.preferred_date.strftime('%Y-%m-%d'),
                'preferred_time': appointment.preferred_time,
                'description': appointment.message or f'Service: {appointment.service}\nPhone: {appointment.phone}\nCompany: {appointment.company}'
            }
            
            # Create calendar event and send notifications automatically
            calendar_result = self.calendar_service.create_appointment_with_notification(appointment_data)
            
            # Update appointment record with Google Calendar event ID
            if calendar_result.get('success') and calendar_result.get('event_id'):
                appointment.google_calendar_event_id = calendar_result['event_id']
                appointment.calendar_created = True
                appointment.save()
                logger.info(f"✅ Appointment linked to calendar event: {calendar_result['event_id']}")
            
            # Return response
            response_data = {
                'success': True,
                'appointment_id': appointment.id,
                'message': '✅ Appointment created successfully!',
                'calendar_integration': {
                    'event_created': calendar_result.get('success', False),
                    'event_id': calendar_result.get('event_id'),
                    'notification_sent': calendar_result.get('success', False)
                },
                'appointment_details': {
                    'id': appointment.id,
                    'name': appointment.name,
                    'email': appointment.email,
                    'date': appointment.preferred_date.strftime('%Y-%m-%d'),
                    'time': appointment.preferred_time,
                    'service': appointment.service
                },
                'next_steps': [
                    '📧 You will receive a calendar invitation via email',
                    '⏰ The appointment has been added to the consultant\'s calendar',
                    '🔔 You will receive reminder notifications before the meeting'
                ]
            }
            
            logger.info(f"🎉 Appointment creation completed successfully")
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"❌ Error creating appointment: {e}")
            
            # Handle specific error types
            error_message = 'Failed to create appointment. Please try again.'
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            
            if 'UNIQUE constraint failed' in str(e) or 'duplicate' in str(e).lower():
                error_message = 'This time slot is already booked. Please select a different time.'
                status_code = status.HTTP_409_CONFLICT
            
            # Clean up if database save succeeded but calendar creation failed
            if 'appointment' in locals():
                appointment.calendar_created = False
                appointment.save()
            
            return Response(
                {
                    'success': False,
                    'error': str(e),
                    'message': error_message
                },
                status=status_code
            )
    
    @action(detail=False, methods=['get'])
    def calendar_status(self, request):
        """Check Google Calendar connection status"""
        credentials_data = cache.get('google_calendar_credentials')
        
        return Response({
            'connected': credentials_data is not None,
            'message': 'Google Calendar connected' if credentials_data else 'Google Calendar not connected'
        })
    
    @action(detail=False, methods=['post'])
    def disconnect(self, request):
        """Disconnect Google Calendar"""
        cache.delete('google_calendar_credentials')
        
        return Response({
            'success': True,
            'message': 'Google Calendar disconnected'
        })

    @action(detail=False, methods=['get'])
    def calendars(self, request):
        """
        List all available Google Calendars for the authenticated user
        GET /api/legacy/google-calendar/calendars/
        """
        try:
            # Check if we have OAuth credentials
            if not self.calendar_service.service:
                return Response({
                    'success': False,
                    'error': 'Google Calendar not authorized',
                    'message': 'Please authorize Google Calendar access first',
                    'setup_url': '/api/legacy/google-calendar/auth/'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Get list of calendars
            calendars_result = self.calendar_service.service.calendarList().list().execute()
            calendars = calendars_result.get('items', [])
            
            # Format calendar information
            calendar_list = []
            for calendar in calendars:
                calendar_info = {
                    'id': calendar['id'],
                    'name': calendar.get('summary', 'Unnamed Calendar'),
                    'description': calendar.get('description', ''),
                    'primary': calendar.get('primary', False),
                    'access_role': calendar.get('accessRole', 'unknown'),
                    'color': calendar.get('backgroundColor', '#1976d2'),
                    'selected': calendar.get('selected', False),
                    'timezone': calendar.get('timeZone', 'UTC')
                }
                calendar_list.append(calendar_info)
            
            # Find current primary calendar
            primary_calendar = next((cal for cal in calendar_list if cal['primary']), None)
            current_calendar_id = getattr(settings, 'GOOGLE_CALENDAR_ID', 'primary')
            
            return Response({
                'success': True,
                'calendars': calendar_list,
                'total_calendars': len(calendar_list),
                'current_calendar_id': current_calendar_id,
                'primary_calendar': primary_calendar,
                'message': f'Found {len(calendar_list)} calendars'
            })
            
        except Exception as e:
            logger.error(f"Error listing calendars: {e}")
            return Response({
                'success': False,
                'error': str(e),
                'message': 'Failed to retrieve calendar list'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def status(self, request):
        """
        Get current Google Calendar integration status
        GET /api/legacy/google-calendar/status/
        """
        try:
            # Check service account
            has_service_account = self.calendar_service.service_account_service is not None
            
            # Check OAuth
            has_oauth = self.calendar_service.service is not None
            
            # Get current calendar ID
            current_calendar_id = getattr(settings, 'GOOGLE_CALENDAR_ID', 'primary')
            
            # Try to get calendar info if connected
            calendar_info = None
            connection_status = "disconnected"
            
            if has_oauth or has_service_account:
                try:
                    service = self.calendar_service.service or self.calendar_service.service_account_service
                    if service:
                        calendar = service.calendars().get(calendarId=current_calendar_id).execute()
                        calendar_info = {
                            'id': calendar['id'],
                            'name': calendar.get('summary', 'Unnamed Calendar'),
                            'description': calendar.get('description', ''),
                            'timezone': calendar.get('timeZone', 'UTC')
                        }
                        connection_status = "connected"
                except Exception as e:
                    logger.warning(f"Could not get calendar info: {e}")
                    connection_status = "authorized_but_no_access"
            
            return Response({
                'success': True,
                'connection_status': connection_status,
                'authentication': {
                    'oauth_available': has_oauth,
                    'service_account_available': has_service_account,
                    'method_used': 'oauth' if has_oauth else ('service_account' if has_service_account else 'none')
                },
                'current_calendar': {
                    'id': current_calendar_id,
                    'info': calendar_info
                },
                'endpoints': {
                    'list_calendars': '/api/legacy/google-calendar/calendars/',
                    'authorize': '/api/legacy/google-calendar/auth/',
                    'set_calendar': '/api/legacy/google-calendar/set-calendar/'
                }
            })
            
        except Exception as e:
            logger.error(f"Error getting calendar status: {e}")
            return Response({
                'success': False,
                'error': str(e),
                'message': 'Failed to get calendar status'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
