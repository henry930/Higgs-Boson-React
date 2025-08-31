import React, { useState, useEffect } from 'react';
import styles from './GoogleCalendarScheduler.module.scss';
import { 
  TextField,
  MenuItem,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { API_CONFIG } from '../../config/api';

// Local storage key for persisting booked appointments
const BOOKED_APPOINTMENTS_KEY = 'higgs_boson_booked_appointments';

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
  }>;
}

interface TimeSlot {
  start: string;
  end: string;
  isBooked: boolean;
}

interface GoogleCalendarSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

// Material-UI theme for calendar styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const GoogleCalendarScheduler: React.FC<GoogleCalendarSchedulerProps> = ({
  isOpen,
  onClose,
  userEmail = ''
}) => {
  console.log('🚀 GoogleCalendarScheduler component mounted/rendered');
  console.log('🔍 isOpen prop:', isOpen);
  console.log('📅 Current date for debugging:', new Date().toISOString());
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState(userEmail);
  const [meetingType, setMeetingType] = useState('consultation');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Reset all state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 GoogleCalendarScheduler opened - resetting all state and fetching fresh data');
      setSelectedDate(null);
      setSelectedTime('');
      setClientName('');
      setClientEmail(userEmail);
      setMeetingType('consultation');
      setDescription('');
      setIsLoading(false);
      setAvailableSlots([]); // Ensure this is always an empty array, not undefined
      
      // If there was a previously selected date, refresh its availability
      // This ensures we get the latest booking status when modal reopens
      if (selectedDate) {
        console.log('🔄 Refreshing slots for previously selected date on modal reopen');
        setTimeout(() => {
          fetchAvailableSlots(selectedDate);
        }, 100);
      }
    }
  }, [isOpen, userEmail]);

  // Debug: Track when availableSlots changes
  useEffect(() => {
    console.log('🎯 availableSlots state changed:', {
      availableSlots: availableSlots,
      length: availableSlots?.length,
      isArray: Array.isArray(availableSlots),
      type: typeof availableSlots
    });
  }, [availableSlots]);

  // Load available time slots when date is selected
  useEffect(() => {
    console.log('🔍 useEffect triggered - selectedDate changed to:', selectedDate);
    if (selectedDate) {
      console.log('📅 Date selected, fetching real availability from API:', selectedDate);
      console.log('📅 Date ISO string:', selectedDate.toISOString());
      console.log('📅 Date formatted string:', selectedDate.format('YYYY-MM-DD'));
      fetchAvailableSlots(selectedDate);
    } else {
      console.log('❌ No date selected, clearing slots');
      setAvailableSlots([]); // Ensure this is always an empty array
    }
  }, [selectedDate]);

  // Fetch real availability from the appointments API
  const fetchAvailableSlots = async (date: Dayjs) => {
    console.log('=== GOOGLE CALENDAR SCHEDULER API CALL ===');
    
    // Format date using dayjs
    const dateString = date.format('YYYY-MM-DD');
    
    console.log('📅 Original dayjs object:', date.toString());
    console.log('📅 Formatted date string:', dateString);
    
    try {
      const timestamp = Date.now();
      // Add cache busting parameter to URL instead of using headers
      const apiUrl = `${API_CONFIG.BASE_URL}/api/appointments/availability/?date=${dateString}&t=${timestamp}&cache=${Math.random()}`;
      console.log('🌐 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors' // Explicitly set CORS mode
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 API Response data:', JSON.stringify(data, null, 2));
        console.log('✅ Available slots from API:', data.availableSlots);
        console.log('❌ Booked slots from API:', data.bookedSlots);
        
        // Defensive programming: Check if availableSlots exists and is an array
        if (data && data.availableSlots && Array.isArray(data.availableSlots) && data.availableSlots.length > 0) {
          // Simplify: Just extract start times from the API response
          const availableStartTimes = data.availableSlots.map((timeRange: string) => {
            const startTime = timeRange.split('-')[0]; // Get "10:30" from "10:30-11:00"
            console.log('Extracted start time:', startTime, 'from', timeRange);
            return startTime;
          });
          
          console.log('🔄 Available start times:', availableStartTimes);
          
          // Convert to simple TimeSlot format
          const simpleSlots: TimeSlot[] = availableStartTimes.map((startTime: string) => ({
            start: startTime,
            end: startTime, // We don't really need end time for display
            isBooked: false
          }));
          
          console.log('📋 Final slots for display:', simpleSlots);
          setAvailableSlots(simpleSlots);
        } else {
          console.warn('⚠️ No availableSlots array found in API response or empty array');
          console.log('📄 Full API response:', data);
          console.log('🔄 Using fallback demo time slots (no API data)');
          
          // Fallback to demo time slots when API returns no data
          const fallbackSlots: TimeSlot[] = [
            { start: '09:00', end: '09:30', isBooked: false },
            { start: '10:00', end: '10:30', isBooked: false },
            { start: '11:00', end: '11:30', isBooked: false },
            { start: '14:00', end: '14:30', isBooked: false },
            { start: '15:00', end: '15:30', isBooked: false },
            { start: '16:00', end: '16:30', isBooked: false },
          ];
          setAvailableSlots(fallbackSlots);
        }
      } else {
        console.error('❌ API call failed:', response.status, response.statusText);
        console.log('🔄 Using fallback demo time slots (API failure)');
        
        // Fallback to demo slots on API failure
        const fallbackSlots: TimeSlot[] = [
          { start: '09:00', end: '09:30', isBooked: false },
          { start: '10:00', end: '10:30', isBooked: false },
          { start: '11:00', end: '11:30', isBooked: false },
          { start: '14:00', end: '14:30', isBooked: false },
          { start: '15:00', end: '15:30', isBooked: false },
          { start: '16:00', end: '16:30', isBooked: false },
        ];
        setAvailableSlots(fallbackSlots);
      }
    } catch (error) {
      console.error('💥 API call error:', error);
      
      // Enhanced error diagnostics
      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          console.error('🚫 Network Error: Failed to fetch from API');
          console.error('❓ Possible causes:');
          console.error('   - CORS policy blocking the request');
          console.error('   - API server is down or unreachable');
          console.error('   - Network connectivity issues');
          console.error('   - API endpoint URL is incorrect');
          console.error('🌐 Attempted URL:', `${API_CONFIG.BASE_URL}/api/appointments/availability/`);
        } else {
          console.error('🔧 TypeError details:', error.message);
        }
      } else {
        console.error('❌ Unexpected error type:', typeof error);
        console.error('📄 Error details:', error);
      }
      
      // Fallback to demo time slots for development/testing
      console.log('🔄 Using fallback demo time slots');
      const fallbackSlots: TimeSlot[] = [
        { start: '09:00', end: '09:30', isBooked: false },
        { start: '10:00', end: '10:30', isBooked: false },
        { start: '11:00', end: '11:30', isBooked: false },
        { start: '14:00', end: '14:30', isBooked: false },
        { start: '15:00', end: '15:30', isBooked: false },
        { start: '16:00', end: '16:30', isBooked: false },
      ];
      setAvailableSlots(fallbackSlots);
    }
    
    console.log('=== END GOOGLE CALENDAR SCHEDULER API CALL ===');
  };

  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation (30 min)', duration: 30 }
  ];

  const handleScheduleCall = async () => {
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      alert('Please fill in all required fields and select a date and time');
      return;
    }

    setIsLoading(true);

    try {
      // Create the event object
      const selectedMeetingType = meetingTypes.find(type => type.value === meetingType);
      const startDateTime = selectedDate.toDate(); // Convert Dayjs to Date
      const [hours, minutes] = selectedTime.split(':');
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const endDateTime = new Date(startDateTime.getTime() + (selectedMeetingType?.duration || 30) * 60000);

      const eventDetails = {
        summary: `${selectedMeetingType?.label} with ${clientName}`,
        description: `Meeting Type: ${selectedMeetingType?.label}\nClient: ${clientName}\nEmail: ${clientEmail}\n\nDescription: ${description}\n\nScheduled via Higgs Boson Consultancy website.`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: [
          { email: clientEmail },
          { email: 'your-business-email@example.com' } // Replace with your business email
        ]
      };

      // Create Google Calendar URL for easy adding to calendar
      const event: CalendarEvent = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: eventDetails.start,
        end: eventDetails.end,
        attendees: eventDetails.attendees
      };
      
      const googleCalendarUrl = createGoogleCalendarUrl(event);
      
      // FIRST: Save the appointment to the database
      console.log('💾 Saving appointment to database...');
      await createAppointment(eventDetails);
      
      // THEN: Send notification to your backend
      await notifyBackend(eventDetails);
      
      // Immediately update local slots to provide instant feedback
      console.log('⚡ Immediately removing booked slot from local state');
      setAvailableSlots(currentSlots => 
        currentSlots.filter(slot => slot.start !== selectedTime)
      );
      
      // Show success alert
      alert('🎉 Call successfully scheduled! You will be redirected to Google Calendar to confirm the event.');
      
      // Refresh available slots from backend to ensure consistency
      // Add a small delay to allow backend to process the booking
      console.log('🔄 Refreshing available slots from backend after successful booking');
      setTimeout(async () => {
        if (selectedDate) {
          console.log('🔄 Fetching updated slots from backend after booking...');
          await fetchAvailableSlots(selectedDate);
        }
      }, 1500); // 1.5 second delay to allow backend processing
      
      // Reset form and close dialog
      setSelectedDate(null);
      setSelectedTime('');
      setClientName('');
      setClientEmail('');
      setDescription('');
      onClose();
      
      // Open Google Calendar in new tab after dialog closes
      setTimeout(() => {
        window.open(googleCalendarUrl, '_blank');
      }, 500); // Small delay to ensure dialog closes first
      
    } catch (error) {
      console.error('💥 Error during booking process:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to create appointment')) {
          alert('❌ Failed to save appointment to database. Please try again or contact support.');
        } else {
          alert(`❌ Error scheduling call: ${error.message}. Please try again.`);
        }
      } else {
        alert('❌ Unexpected error scheduling call. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createGoogleCalendarUrl = (event: CalendarEvent): string => {
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.summary,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: event.description,
      location: 'Video Call (Link will be provided)',
      add: event.attendees.map(a => a.email).join(',')
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const createAppointment = async (event: CalendarEvent) => {
    try {
      console.log('💾 Creating appointment in database...');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: '', // GoogleCalendarScheduler doesn't collect phone, but SimpleCalendarBooking does
          company: '', // GoogleCalendarScheduler doesn't collect company, but SimpleCalendarBooking does
          service: meetingType,
          preferred_date: selectedDate?.format('YYYY-MM-DD'),
          preferred_time: selectedTime,
          message: description,
          // Additional fields for better tracking
          scheduled_datetime: event.start.dateTime,
          end_datetime: event.end.dateTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          booking_source: 'google_calendar_scheduler' // Track the source of booking
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to create appointment:', response.status, response.statusText, errorText);
        throw new Error(`Failed to create appointment: ${response.status} ${response.statusText}`);
      }

      const appointmentData = await response.json();
      console.log('✅ Appointment created successfully:', appointmentData);
      return appointmentData;
      
    } catch (error) {
      console.error('💥 Error creating appointment:', error);
      throw error; // Re-throw to prevent booking completion if DB save fails
    }
  };

  const notifyBackend = async (event: CalendarEvent) => {
    try {
      console.log('📤 Sending booking notification to backend...');
      
      // Send notification to your backend
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/schedule-notification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          meeting_type: meetingType,
          scheduled_time: event.start.dateTime,
          end_time: event.end.dateTime,
          description: description,
          date: selectedDate?.format('YYYY-MM-DD'),
          time_slot: selectedTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (!response.ok) {
        console.warn('❌ Failed to send backend notification:', response.status, response.statusText);
      } else {
        console.log('✅ Backend notification sent successfully');
      }
    } catch (error) {
      console.warn('💥 Backend notification failed:', error);
    }
  };

  if (!isOpen) {
    console.log('🚫 GoogleCalendarScheduler is closed, not rendering');
    return null;
  }

  console.log('✅ GoogleCalendarScheduler is open, rendering scheduling form');

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2>Schedule a Consultation</h2>
              <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
            
            <div className={styles.content}>
              {/* Modern Two-Section Layout */}
              <div className={styles.schedulerLayout}>
                
                {/* Calendar Section */}
                <div className={styles.calendarSection}>
                  <h3 className={styles.sectionTitle}>Select Date</h3>
                  <div className={styles.calendarContainer}>
                    <StaticDatePicker
                      value={selectedDate}
                      onChange={(newDate) => {
                        console.log('📅 Date selected:', newDate);
                        setSelectedDate(newDate);
                        if (newDate) {
                          fetchAvailableSlots(newDate);
                        }
                      }}
                      minDate={dayjs()}
                      maxDate={dayjs().add(3, 'month')}
                      displayStaticWrapperAs="desktop"
                      slotProps={{
                        actionBar: { actions: [] },
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiPickersLayout-root': {
                          minHeight: 'auto',
                          height: 'auto',
                        },
                        '& .MuiDateCalendar-root': {
                          height: 'auto',
                          maxHeight: 'none',
                          width: '100%',
                        },
                        '& .MuiPickersDay-root': {
                          fontSize: '1.1rem',
                          width: '48px',
                          height: '48px',
                          margin: '4px',
                          borderRadius: '12px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#dbeafe',
                            transform: 'scale(1.05)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#3b82f6',
                            '&:hover': {
                              backgroundColor: '#2563eb',
                            },
                          },
                        },
                        '& .MuiPickersCalendarHeader-root': {
                          paddingLeft: 2,
                          paddingRight: 2,
                          marginBottom: 2,
                        },
                        '& .MuiDayCalendar-root': {
                          width: '100%',
                          maxWidth: 'none',
                          height: 'auto',
                        },
                        '& .MuiPickersCalendarHeader-labelContainer': {
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#1e40af',
                        },
                        '& .MuiDayCalendar-header': {
                          paddingBottom: 1,
                          justifyContent: 'space-between',
                        },
                        '& .MuiDayCalendar-weekContainer': {
                          justifyContent: 'space-between',
                          margin: '4px 0',
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                          width: '48px',
                          height: '40px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#475569',
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Time Slots Section */}
                <div className={styles.timeSlotsSection}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                    <h3 className={styles.sectionTitle}>Available Times</h3>
                    {selectedDate && (
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔄 Manual refresh of available slots requested');
                          fetchAvailableSlots(selectedDate);
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                      >
                        🔄 Refresh
                      </button>
                    )}
                  </div>
                  <div className={styles.timeSlotsContainer}>
                    {selectedDate ? (
                      <>
                        <div className={styles.selectedDateTitle}>
                          {selectedDate.format('dddd, MMMM D, YYYY')}
                        </div>
                        
                        {(!availableSlots || !Array.isArray(availableSlots) || availableSlots.length === 0) ? (
                          <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📅</div>
                            <h4 className={styles.emptyTitle}>No Available Slots</h4>
                            <p className={styles.emptyDescription}>
                              Please try selecting a different date
                            </p>
                            <div style={{fontSize: '12px', color: '#666', marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px'}}>
                              Debug: availableSlots = {JSON.stringify(availableSlots)} (length: {availableSlots?.length || 'undefined'})
                            </div>
                          </div>
                        ) : (
                          <div className={styles.timeSlotGrid}>
                            {availableSlots.map(slot => {
                              const startTime = slot.start;
                              const isSelected = selectedTime === startTime;
                              
                              return (
                                <div
                                  key={startTime}
                                  className={`${styles.timeSlot} ${isSelected ? styles.selected : ''}`}
                                  onClick={() => {
                                    console.log('Time slot selected:', startTime);
                                    setSelectedTime(startTime);
                                  }}
                                >
                                  {startTime}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📅</div>
                        <h4 className={styles.emptyTitle}>Select a Date</h4>
                        <p className={styles.emptyDescription}>
                          Choose a date from the calendar to see available times
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Your Information</h3>
                <div className={styles.formContainer}>
                  <form onSubmit={(e) => { e.preventDefault(); handleScheduleCall(); }}>
                    <div className={styles.formGrid}>
                      <div className={styles.formRow}>
                        <TextField
                          label="Your Name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                          fullWidth
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              fontSize: '1rem',
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1rem',
                              fontWeight: 500,
                            },
                          }}
                        />

                        <TextField
                          label="Your Email"
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          required
                          fullWidth
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              fontSize: '1rem',
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1rem',
                              fontWeight: 500,
                            },
                          }}
                        />
                      </div>

                      <TextField
                        label="Meeting Type"
                        select
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value)}
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            fontSize: '1rem',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 500,
                          },
                        }}
                      >
                        {meetingTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Tell us about your project"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe your project goals, timeline, and what you'd like to discuss..."
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            fontSize: '1rem',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={styles.scheduleButton}
                        disabled={!selectedDate || !selectedTime || !clientName || !clientEmail || isLoading}
                      >
                        {isLoading ? 'Scheduling...' : 'Schedule Consultation'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default GoogleCalendarScheduler;
