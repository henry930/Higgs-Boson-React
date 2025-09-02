# Google Calendar Management Views
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import logging
from ..google_calendar_service import GoogleCalendarService

logger = logging.getLogger(__name__)

@api_view(['GET'])
def list_calendars(request):
    """
    List all available Google Calendars for the authenticated user
    GET /api/legacy/google-calendar/calendars/
    """
    try:
        calendar_service = GoogleCalendarService()
        
        # Check if we have OAuth credentials
        if not calendar_service.service:
            return Response({
                'success': False,
                'error': 'Google Calendar not authorized',
                'message': 'Please authorize Google Calendar access first',
                'setup_url': '/api/legacy/google-calendar/auth/'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get list of calendars
        calendars_result = calendar_service.service.calendarList().list().execute()
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

@api_view(['GET'])
def calendar_status(request):
    """
    Get current Google Calendar integration status
    GET /api/legacy/google-calendar/status/
    """
    try:
        calendar_service = GoogleCalendarService()
        
        # Check service account
        has_service_account = calendar_service.service_account_service is not None
        
        # Check OAuth
        has_oauth = calendar_service.service is not None
        
        # Get current calendar ID
        current_calendar_id = getattr(settings, 'GOOGLE_CALENDAR_ID', 'primary')
        
        # Try to get calendar info if connected
        calendar_info = None
        connection_status = "disconnected"
        
        if has_oauth or has_service_account:
            try:
                service = calendar_service.service or calendar_service.service_account_service
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

@api_view(['POST'])
def set_calendar(request):
    """
    Set which calendar to use for appointments
    POST /api/legacy/google-calendar/set-calendar/
    Body: {"calendar_id": "your-calendar-id"}
    """
    try:
        calendar_id = request.data.get('calendar_id')
        if not calendar_id:
            return Response({
                'success': False,
                'error': 'calendar_id is required',
                'message': 'Please provide a calendar_id'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        calendar_service = GoogleCalendarService()
        
        # Verify the calendar exists and we have access
        if calendar_service.service or calendar_service.service_account_service:
            service = calendar_service.service or calendar_service.service_account_service
            try:
                calendar = service.calendars().get(calendarId=calendar_id).execute()
                
                # Update the environment variable (in production, you'd update your .env file)
                # For now, we'll just return the information
                return Response({
                    'success': True,
                    'message': f'Calendar selection verified: {calendar.get("summary", calendar_id)}',
                    'calendar': {
                        'id': calendar['id'],
                        'name': calendar.get('summary', 'Unnamed Calendar'),
                        'description': calendar.get('description', ''),
                        'timezone': calendar.get('timeZone', 'UTC')
                    },
                    'note': 'To permanently set this calendar, update GOOGLE_CALENDAR_ID in your .env file',
                    'env_setting': f'GOOGLE_CALENDAR_ID={calendar_id}'
                })
                
            except Exception as e:
                return Response({
                    'success': False,
                    'error': f'Cannot access calendar: {str(e)}',
                    'message': 'Make sure the calendar ID is correct and you have access to it'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'success': False,
                'error': 'Google Calendar not authorized',
                'message': 'Please authorize Google Calendar access first'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
    except Exception as e:
        logger.error(f"Error setting calendar: {e}")
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to set calendar'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
