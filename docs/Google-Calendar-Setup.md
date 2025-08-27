# Google Calendar Integration Setup Guide

This guide will help you set up Google Calendar integration for real-time availability checking and event creation.

## Prerequisites

- Google account
- Access to Google Cloud Console
- Domain or localhost for testing

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

## Step 3: Create Credentials

### Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" > "API key"
3. Copy the API key
4. (Optional) Restrict the API key to only Calendar API for security

### Create OAuth 2.0 Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" for testing
   - Fill in required fields (App name, User support email, Developer contact)
   - Add your domain to authorized domains
4. Choose "Web application" as application type
5. Add authorized JavaScript origins:
   - `http://localhost:5174` (for local development)
   - Your production domain (e.g., `https://yourdomain.com`)
6. Add authorized redirect URIs:
   - `http://localhost:5174` (for local development)
   - Your production domain (e.g., `https://yourdomain.com`)
7. Copy the Client ID

## Step 4: Configure Environment Variables

1. Open `.env` file in your React project
2. Replace the placeholder values:

```
VITE_GOOGLE_API_KEY=your_actual_api_key_here
VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Services page
3. Click "Schedule a Call"
4. Select a date
5. Click "Connect Google Calendar" to test authentication
6. Check if available time slots load from your actual calendar

## Security Notes

### For Production:

1. **Restrict API Key**: Limit API key to only Calendar API and your domain
2. **OAuth Consent Screen**: Complete the verification process for production use
3. **Domain Verification**: Verify your domain in Google Search Console
4. **HTTPS Required**: Google Calendar API requires HTTPS in production

### Environment Security:

- Never commit `.env` files to version control
- Use different credentials for development and production
- Regularly rotate API keys and credentials

## Troubleshooting

### Common Issues:

1. **"API key not valid"**
   - Check if Calendar API is enabled
   - Verify API key restrictions

2. **"OAuth error: redirect_uri_mismatch"**
   - Ensure redirect URIs match exactly in OAuth settings
   - Include protocol (http/https) and port numbers

3. **"Access blocked"**
   - Complete OAuth consent screen configuration
   - Add test users in development mode

4. **"No available slots showing"**
   - Check API key permissions
   - Verify user has calendar access
   - Check browser console for errors

### Browser Developer Tools:

Open browser developer tools (F12) and check:
- Console for JavaScript errors
- Network tab for failed API requests
- Application tab for authentication tokens

## Features Included

✅ **Real-time Availability**: Shows actual free/busy times from Google Calendar
✅ **Event Creation**: Creates events directly in user's calendar
✅ **Fallback Mode**: Works without authentication using static time slots
✅ **Business Hours**: Configurable working hours (9 AM - 5 PM by default)
✅ **Conflict Detection**: Prevents double-booking
✅ **Time Zone Support**: Automatically detects user's time zone

## API Limits

- **Google Calendar API**: 1,000,000 queries per day (free tier)
- **Rate Limiting**: 100 queries per 100 seconds per user
- **Quota Management**: Monitor usage in Google Cloud Console

## Next Steps

1. Set up the credentials as described above
2. Test the integration in development
3. Deploy to production with HTTPS
4. Monitor API usage and costs
5. Consider implementing user calendar selection for multiple calendars

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Google Cloud Console configuration
3. Test with different browsers
4. Review API quotas and limits
