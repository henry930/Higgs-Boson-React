# 🗓️ Google Calendar Automatic Integration Setup

## 🎯 Goal: Seamless Calendar Integration
- Users book appointments without any "connect" buttons
- Appointments automatically appear in your Google Calendar
- System checks your existing events and removes conflicts
- You get notifications when bookings are made

## 🔧 Step-by-Step Setup

### 1. Create Google Service Account (5 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create new one: "Higgs Boson Calendar")
3. **Enable Google Calendar API**:
   - Go to "APIs & Services" > "Library"
   - Search "Google Calendar API"
   - Click "Enable"

4. **Create Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name: "Higgs Boson Calendar Service"
   - Description: "Automatic calendar integration for appointment booking"
   - Click "Create and Continue"

5. **Download JSON Key**:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - **Save the file as**: `google-service-account.json`

### 2. Share Your Calendar with Service Account

1. **Get Service Account Email**:
   - Open the downloaded JSON file
   - Find the "client_email" field
   - Copy this email (looks like: `higgs-boson@project-123456.iam.gserviceaccount.com`)

2. **Share Your Google Calendar**:
   - Go to https://calendar.google.com
   - Click the settings gear ⚙️ > "Settings"
   - Click on your calendar name (usually your email)
   - Scroll to "Share with specific people"
   - Click "Add people"
   - **Paste the service account email**
   - Set permission to "Make changes to events"
   - Click "Send"

### 3. Install the Service Account File

1. **Copy the JSON file** to your server directory:
   ```bash
   cp /path/to/your/google-service-account.json /Users/navcolon/Documents/higgsbosonconsultancy2/React/server/
   ```

2. **Update your .env file**:
   ```
   GOOGLE_SERVICE_ACCOUNT_FILE=/Users/navcolon/Documents/higgsbosonconsultancy2/React/server/google-service-account.json
   ```

### 4. Test the Integration

After setup, the system will:
- ✅ Automatically read your existing calendar events
- ✅ Remove conflicting time slots from availability  
- ✅ Create new appointments directly in your calendar
- ✅ Send you notifications (email/SMS)

## 🔍 Current Status Check

Run this to see if it's working:
```bash
curl "http://localhost:8000/api/legacy/google-calendar/status/"
```

Should show:
```json
{
  "connection_status": "connected",
  "authentication": {
    "service_account_available": true,
    "method_used": "service_account"
  }
}
```

## 🚨 Security Notes

- The service account JSON file contains sensitive credentials
- Add `google-service-account.json` to your `.gitignore`
- Never commit this file to version control
- Keep it secure on your server only

## 📧 Notification Setup

Once connected, you'll get notifications via:
- ✅ Email when appointments are booked
- ✅ Calendar invitations sent to clients
- ✅ SMS alerts (optional)
