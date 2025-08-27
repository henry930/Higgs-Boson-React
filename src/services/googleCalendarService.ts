import { gapi } from 'gapi-script';

// Google Calendar API configuration
const CALENDAR_ID = 'primary'; // Use 'primary' for the user's main calendar
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
  status: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

class GoogleCalendarService {
  private isInitialized = false;
  private signedIn = false;

  async initializeGapi(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      // Check if API credentials are available
      if (!API_KEY || !CLIENT_ID || API_KEY === 'your_api_key_here' || CLIENT_ID === 'your_client_id_here.apps.googleusercontent.com') {
        console.warn('Google Calendar API credentials not configured');
        return false;
      }

      await gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES
        });

        this.isInitialized = true;
        
        // Check if user is already signed in
        const authInstance = gapi.auth2.getAuthInstance();
        this.signedIn = authInstance.isSignedIn.get();
      });

      return true;
    } catch (error) {
      console.error('Error initializing Google API:', error);
      return false;
    }
  }

  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initializeGapi();
        if (!initialized) return false;
      }

      const authInstance = gapi.auth2.getAuthInstance();
      
      if (!this.signedIn) {
        try {
          await authInstance.signIn({
            prompt: 'consent'  // Force consent screen to appear
          });
          this.signedIn = authInstance.isSignedIn.get();
        } catch (error: any) {
          console.error('OAuth sign-in failed:', error);
          
          // Handle specific OAuth errors
          if (error.error === 'access_denied') {
            alert('Google Calendar access was denied. Please check your OAuth configuration:\n\n1. Add yourself as a test user in Google Cloud Console\n2. Verify redirect URIs are correct\n3. Try again in a few minutes');
          } else if (error.error === 'popup_blocked_by_browser') {
            alert('Popup was blocked. Please allow popups and try again.');
          } else {
            alert('Failed to connect to Google Calendar. You can still use the default scheduling system.');
          }
          
          return false;
        }
      }

      return this.signedIn;
    } catch (error) {
      console.error('Error signing in to Google:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (this.isInitialized) {
        const authInstance = gapi.auth2.getAuthInstance();
        await authInstance.signOut();
        this.signedIn = false;
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async getEvents(timeMin: string, timeMax: string): Promise<CalendarEvent[]> {
    try {
      if (!this.signedIn) {
        throw new Error('User not signed in');
      }

      const response = await gapi.client.calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 50
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async createEvent(eventDetails: {
    summary: string;
    description: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees: Array<{ email: string }>;
  }): Promise<boolean> {
    try {
      if (!this.signedIn) {
        throw new Error('User not signed in');
      }

      const response = await gapi.client.calendar.events.insert({
        calendarId: CALENDAR_ID,
        resource: eventDetails
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return false;
    }
  }

  generateTimeSlots(date: Date, businessHours = { start: 9, end: 17 }, slotDuration = 30): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startHour = businessHours.start;
    const endHour = businessHours.end;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startTime = new Date(date);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + slotDuration);

        // Don't add slots that go past business hours
        if (endTime.getHours() > endHour) {
          break;
        }

        slots.push({
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          available: true // Will be updated based on existing events
        });
      }
    }

    return slots;
  }

  async getAvailableTimeSlots(date: Date): Promise<TimeSlot[]> {
    try {
      // Generate all possible time slots for the day
      const allSlots = this.generateTimeSlots(date);

      // Get the start and end of the day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // Fetch existing events for the day
      const existingEvents = await this.getEvents(
        dayStart.toISOString(),
        dayEnd.toISOString()
      );

      // Mark slots as unavailable if they conflict with existing events
      const availableSlots = allSlots.map(slot => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);

        const isConflicting = existingEvents.some(event => {
          if (event.status === 'cancelled') return false;

          const eventStart = new Date(event.start.dateTime || event.start.date || '');
          const eventEnd = new Date(event.end.dateTime || event.end.date || '');

          // Check if slot overlaps with existing event
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        return {
          ...slot,
          available: !isConflicting
        };
      });

      // Filter out past time slots for today
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date.getTime() === today.getTime()) {
        return availableSlots.filter(slot => new Date(slot.start) > now);
      }

      return availableSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      // Return default slots if API fails
      return this.generateTimeSlots(date);
    }
  }

  isSignedIn(): boolean {
    return this.signedIn;
  }

  getCurrentUser(): any {
    if (this.signedIn && this.isInitialized) {
      const authInstance = gapi.auth2.getAuthInstance();
      return authInstance.currentUser.get();
    }
    return null;
  }
}

export const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;
