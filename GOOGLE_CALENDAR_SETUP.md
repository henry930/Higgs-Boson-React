# Google Calendar API Setup Guide

This guide will walk you through setting up Google Calendar API integration for your appointment booking system.

## Overview

The Google Calendar integration provides:
- OAuth 2.0 authentication for secure calendar access
- Real-time availability checking from Google Calendar
- Automatic event creation when appointments are booked
- Seamless synchronization between your app and Google Calendar

## Prerequisites

- Google Cloud Console account
- Domain ownership verification (for production)
- SSL certificate (already configured for your domain)

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `Higgs Boson Consultancy Calendar`
4. Click "Create"

### 1.2 Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on "Google Calendar API"
4. Click "Enable"

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (for public access)
3. Fill in the required information:
   - App name: `Higgs Boson Consultancy`
   - User support email: `your-email@example.com`
   - Developer contact email: `your-email@example.com`
   - App domain: `higgsbosonconsultancy.co.uk`
   - Authorized domains: `higgsbosonconsultancy.co.uk`
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. Save and continue

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "Higgs Boson Calendar Integration"
5. Authorized JavaScript origins:
   - `http://localhost:5174` (for development)
   - `https://d791a5pmkugax.cloudfront.net` (for production)
   - `https://higgsbosonconsultancy.co.uk` (your domain)
6. Authorized redirect URIs:
   - `http://127.0.0.1:8000/api/legacy/google-calendar/callback/` (Django development)
   - `https://your-production-api.com/api/legacy/google-calendar/callback/` (production API)
7. Click "Create"
8. Copy the Client ID and Client Secret

### 1.5 Create Service Account (Optional - for server-side access)

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Service account name: "calendar-service"
4. Click "Create and Continue"
5. Grant roles: "Project" → "Editor"
6. Click "Done"
7. Click on the created service account
8. Go to "Keys" tab → "Add Key" → "Create New Key"
9. Choose JSON format and download the key file

## Step 2: Environment Configuration

### 2.1 Update Django Settings

Create or update your `.env` file in the Django project root:

```env
# Google Calendar API Configuration
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here
GOOGLE_SERVICE_ACCOUNT_FILE=/path/to/service-account-key.json
GOOGLE_CALENDAR_ID=primary
```

### 2.2 Update Django Settings.py

The following settings have already been added to your `server/settings.py`:

```python
# Google Calendar API settings
GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
GOOGLE_SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
GOOGLE_CALENDAR_ID = os.getenv('GOOGLE_CALENDAR_ID', 'primary')
```

## Step 3: Database Migration

The database migration has already been applied, but if you need to run it again:

```bash
cd server
python manage.py makemigrations
python manage.py migrate
```

This adds the following fields to the Appointment model:
- `google_calendar_event_id`: Stores the Google Calendar event ID
- `google_calendar_id`: Stores the calendar ID where the event was created
- `calendar_created`: Boolean flag indicating if the event was created in Google Calendar

## Step 4: Frontend Configuration

### 4.1 React Hook Integration

The `useGoogleCalendar` hook is already implemented and provides:
- `isConnected`: Boolean indicating if Google Calendar is connected
- `getAvailability(date)`: Function to get available time slots
- `createAppointment(data)`: Function to create appointments with calendar sync
- `getAuthUrl()`: Function to initiate OAuth flow
- `disconnect()`: Function to disconnect from Google Calendar

### 4.2 Component Integration

The main scheduler component (`GoogleCalendarScheduler`) has been enhanced with:
- Google Calendar settings panel
- Real-time availability checking
- Automatic calendar event creation
- Connection status display

## Step 5: Testing the Integration

### 5.1 Development Testing

1. Start your Django server:
   ```bash
   cd server
   python manage.py runserver
   ```

2. Start your React development server:
   ```bash
   npm run dev
   ```

3. Open the scheduling modal and click the settings gear (⚙️) icon
4. Click "Connect to Google Calendar"
5. Complete the OAuth flow
6. Test availability checking and appointment creation

### 5.2 Production Deployment

1. Update your OAuth redirect URIs in Google Cloud Console with your production URLs
2. Set the production environment variables in your deployment
3. Ensure your SSL certificate is properly configured
4. Test the complete flow in production

## Step 6: Advanced Configuration

### 6.1 Custom Calendar Configuration

You can specify a specific calendar ID instead of using "primary":

1. Get your calendar ID from Google Calendar settings
2. Update the `GOOGLE_CALENDAR_ID` environment variable

### 6.2 Business Hours Configuration

The availability checking respects your business hours. You can configure these in the Django backend:

```python
# In your Django settings or configuration
BUSINESS_HOURS = {
    'start': '09:00',
    'end': '17:00',
    'timezone': 'America/New_York',
    'working_days': [0, 1, 2, 3, 4]  # Monday-Friday
}
```

### 6.3 Notification Settings

You can configure email notifications for new appointments:

```python
# Email settings for appointment notifications
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive credentials to version control
2. **OAuth Scopes**: Only request the minimum required calendar permissions
3. **Token Storage**: User tokens are securely stored and can be revoked
4. **HTTPS**: Always use HTTPS in production for OAuth callbacks
5. **Domain Verification**: Verify your domain ownership in Google Cloud Console

## Troubleshooting

### Common Issues

1. **"Invalid Client" Error**
   - Check that your client ID and secret are correct
   - Verify authorized domains in OAuth consent screen

2. **"Redirect URI Mismatch"**
   - Ensure redirect URIs match exactly (including trailing slashes)
   - Check both development and production URLs

3. **"Calendar Not Found"**
   - Verify the calendar ID exists and is accessible
   - Check that the user has granted calendar permissions

4. **"Insufficient Permissions"**
   - Ensure the OAuth scope includes calendar access
   - Check that the user completed the consent flow

### Debug Mode

Enable debug logging in Django to see detailed API interactions:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'api.google_calendar_service': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## API Endpoints

The following endpoints are available for Google Calendar integration:

- `GET /api/legacy/google-calendar/auth-url/` - Get OAuth authorization URL
- `GET /api/legacy/google-calendar/callback/` - OAuth callback handler
- `GET /api/legacy/google-calendar/availability/` - Check availability for a date
- `POST /api/legacy/google-calendar/create-appointment/` - Create appointment with calendar sync
- `GET /api/legacy/google-calendar/status/` - Get connection status
- `POST /api/legacy/google-calendar/disconnect/` - Disconnect from Google Calendar

## Next Steps

1. Complete the Google Cloud Console setup with your actual credentials
2. Test the integration in development
3. Deploy to production with proper environment variables
4. Monitor usage and error logs
5. Consider implementing webhook notifications for calendar changes

## Support

For technical support with the Google Calendar integration:
1. Check the browser console for error messages
2. Review Django server logs for API errors
3. Verify Google Cloud Console configuration
4. Test OAuth flow step by step

The integration is designed to be robust with fallback to database-only booking if Google Calendar is unavailable.
