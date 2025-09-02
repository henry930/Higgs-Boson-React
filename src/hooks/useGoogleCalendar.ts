// Google Calendar Integration Hook
import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

interface CalendarConnectionStatus {
  connected: boolean;
  message: string;
}

interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
  message: string;
  calendar_connected: boolean;
}

interface AppointmentData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
}

export const useGoogleCalendar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection status
  const checkConnectionStatus = async (): Promise<CalendarConnectionStatus> => {
    try {
      const response = await fetch(`${API_CONFIG.DJANGO_BASE_URL}/google-calendar/calendar_status/`);
      const data = await response.json();
      setIsConnected(data.connected);
      return data;
    } catch (error) {
      console.error('Error checking calendar status:', error);
      setError('Failed to check calendar connection');
      return { connected: false, message: 'Connection check failed' };
    }
  };

  // Get OAuth authorization URL
  const getAuthUrl = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_CONFIG.DJANGO_BASE_URL}/google-calendar/auth_url/`);
      const data = await response.json();
      return data.auth_url;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      setError('Failed to get authorization URL');
      return null;
    }
  };

  // Handle OAuth callback
  const handleCallback = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.DJANGO_BASE_URL}/google-calendar/callback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data.success) {
        setIsConnected(true);
        setError(null);
        return true;
      } else {
        setError(data.error || 'Failed to connect calendar');
        return false;
      }
    } catch (error) {
      console.error('Error handling callback:', error);
      setError('Failed to complete calendar connection');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to Google Calendar
  const connectCalendar = async (): Promise<void> => {
    try {
      const authUrl = await getAuthUrl();
      if (authUrl) {
        // Open in popup window
        const popup = window.open(
          authUrl,
          'google-calendar-auth',
          'width=500,height=600,scrollbars=yes'
        );

        // Listen for popup to close or send message
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Check if connection was successful
            checkConnectionStatus();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting calendar:', error);
      setError('Failed to initiate calendar connection');
    }
  };

  // Disconnect Google Calendar
  const disconnectCalendar = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.DJANGO_BASE_URL}/google-calendar/disconnect/`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setIsConnected(false);
        setError(null);
        return true;
      } else {
        setError('Failed to disconnect calendar');
        return false;
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      setError('Failed to disconnect calendar');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get availability from Google Calendar
  const getAvailability = async (date: string): Promise<AvailabilityResponse | null> => {
    try {
      const response = await fetch(
        `${API_CONFIG.DJANGO_BASE_URL}/google-calendar/availability/?date=${date}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting availability:', error);
      setError('Failed to get availability');
      return null;
    }
  };

  // Create appointment with Google Calendar integration
  const createAppointment = async (appointmentData: AppointmentData): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.DJANGO_BASE_URL}/google-calendar/create_appointment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setError(null);
        return data;
      } else {
        setError(data.error || 'Failed to create appointment');
        throw new Error(data.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to create appointment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize - check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    connectCalendar,
    disconnectCalendar,
    checkConnectionStatus,
    getAvailability,
    createAppointment,
    handleCallback,
  };
};
