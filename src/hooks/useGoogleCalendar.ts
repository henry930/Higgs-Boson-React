// Google Calendar Integration Hook - Lambda API Version
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
  source: string;
}

interface AppointmentData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  description?: string;
}

export const useGoogleCalendar = () => {
  const [isConnected, setIsConnected] = useState(true); // Always true since we use Lambda API directly
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection status - Lambda API is always available
  const checkConnectionStatus = async (): Promise<CalendarConnectionStatus> => {
    try {
      // Test the Lambda API availability endpoint
      const response = await fetch(`${API_CONFIG.CALENDAR_API_URL}/api/google-calendar/live-availability?date=${new Date().toISOString().split('T')[0]}`);
      if (response.ok) {
        setIsConnected(true);
        return { connected: true, message: 'Lambda Calendar API is available' };
      } else {
        setIsConnected(false);
        return { connected: false, message: 'Lambda Calendar API unavailable' };
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
      setError('Failed to check calendar connection');
      setIsConnected(false);
      return { connected: false, message: 'Connection check failed' };
    }
  };

  // Get OAuth authorization URL - Not needed for Lambda API
  const getAuthUrl = async (): Promise<string | null> => {
    console.log('OAuth not required for Lambda API');
    return null;
  };

  // Handle OAuth callback - Not needed for Lambda API
  const handleCallback = async (code: string): Promise<boolean> => {
    console.log('OAuth callback not required for Lambda API');
    return true;
  };

  // Connect to Google Calendar - Not needed for Lambda API
  const connectCalendar = async (): Promise<void> => {
    console.log('Manual connection not required for Lambda API');
    setIsConnected(true);
  };

  // Disconnect Google Calendar - Not applicable for Lambda API
  const disconnectCalendar = async (): Promise<boolean> => {
    console.log('Disconnect not applicable for Lambda API');
    return true;
  };

  // Get availability from Google Calendar via Lambda API
  const getAvailability = async (date: string): Promise<AvailabilityResponse | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_CONFIG.CALENDAR_API_URL}/api/google-calendar/live-availability?date=${date}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch availability: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setError(null);
      return data;
    } catch (error) {
      console.error('Error getting availability:', error);
      setError('Failed to get availability');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create appointment with Google Calendar integration via Lambda API
  const createAppointment = async (appointmentData: AppointmentData): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.CALENDAR_API_URL}/api/google-calendar/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create appointment: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
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
