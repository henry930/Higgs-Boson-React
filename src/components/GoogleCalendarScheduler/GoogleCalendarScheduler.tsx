import React, { useState, useEffect } from 'react';
import styles from './GoogleCalendarScheduler.module.scss';
import { 
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { CalendarToday } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

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
      setAvailableSlots([]);
    }
  }, [isOpen, userEmail]);

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
      setAvailableSlots([]);
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
      const apiUrl = `/api/appointments/availability/?date=${dateString}&t=${timestamp}`;
      console.log('🌐 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 API Response data:', JSON.stringify(data, null, 2));
        console.log('✅ Available slots from API:', data.availableSlots);
        console.log('❌ Booked slots from API:', data.bookedSlots);
        
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
          available: true
        }));
        
        console.log('� Final slots for display:', simpleSlots);
        setAvailableSlots(simpleSlots);
      } else {
        console.error('❌ API call failed:', response.status, response.statusText);
        // Fallback to empty slots on API failure
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('💥 API call error:', error);
      // Fallback to empty slots on error
      setAvailableSlots([]);
    }
    
    console.log('=== END GOOGLE CALENDAR SCHEDULER API CALL ===');
  };

  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation (30 min)', duration: 30 },
    { value: 'technical', label: 'Technical Discussion (45 min)', duration: 45 },
    { value: 'project-planning', label: 'Project Planning (60 min)', duration: 60 },
    { value: 'demo', label: 'Product Demo (30 min)', duration: 30 }
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
      
      // Send notification to your backend first
      await notifyBackend(eventDetails);
      
      // Show success alert
      alert('🎉 Call successfully scheduled! You will be redirected to Google Calendar to confirm the event.');
      
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
      console.error('Error scheduling call:', error);
      alert('Error scheduling call. Please try again.');
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

  const notifyBackend = async (event: CalendarEvent) => {
    try {
      // Send notification to your backend
      const response = await fetch('/api/schedule-notification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          meeting_type: meetingType,
          scheduled_time: event.start.dateTime,
          description: description
        })
      });

      if (!response.ok) {
        console.warn('Failed to send backend notification');
      }
    } catch (error) {
      console.warn('Backend notification failed:', error);
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
              <h2>Schedule a Call</h2>
              <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
            
            <div className={styles.content}>
              {/* Two Column Layout */}
              <div className={styles.twoColumnLayout}>
                
                {/* Left Column: Material-UI Calendar */}
                <Box sx={{ width: '100%' }}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
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
                        actionBar: { actions: [] }, // Hide action buttons
                      }}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        '& .MuiPickersLayout-root': {
                          minHeight: 'auto',
                          height: 'auto',
                        },
                        '& .MuiDateCalendar-root': {
                          height: 'auto',
                          maxHeight: 'none',
                        },
                        '& .MuiPickersDay-root': {
                          fontSize: '1rem',
                          width: '40px',
                          height: '40px',
                          margin: '2px',
                        },
                        '& .MuiPickersCalendarHeader-root': {
                          paddingLeft: 1,
                          paddingRight: 1,
                          marginBottom: 1,
                        },
                        '& .MuiDayCalendar-root': {
                          width: '100%',
                          maxWidth: 'none',
                          height: 'auto',
                        },
                        '& .MuiPickersCalendarHeader-labelContainer': {
                          fontSize: '1.1rem',
                          fontWeight: 600,
                        },
                        '& .MuiDayCalendar-header': {
                          paddingBottom: 1,
                          justifyContent: 'space-between',
                        },
                        '& .MuiDayCalendar-weekContainer': {
                          justifyContent: 'space-between',
                          margin: '2px 0',
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                          width: '40px',
                          height: '32px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }
                      }}
                    />
                  </Paper>
                </Box>

                {/* Right Column: Time Slots */}
                <Box sx={{ width: '100%' }}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: 'fit-content' }}>
                    {selectedDate ? (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.9rem', fontWeight: 500 }}>
                          {selectedDate.format('MMMM D, YYYY')}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr', 
                          gap: 1, 
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}>
                          {availableSlots.length === 0 ? (
                            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 3 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                No available slots
                              </Typography>
                            </Box>
                          ) : (
                            availableSlots.map(slot => {
                              const startTime = slot.start;
                              const isSelected = selectedTime === startTime;
                              
                              return (
                                <Chip
                                  key={startTime}
                                  label={startTime}
                                  onClick={() => {
                                    console.log('Time slot selected:', startTime);
                                    setSelectedTime(startTime);
                                  }}
                                  variant={isSelected ? "filled" : "outlined"}
                                  color={isSelected ? "primary" : "default"}
                                  sx={{ 
                                    justifyContent: 'center',
                                    fontSize: '0.85rem',
                                    height: '36px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: isSelected ? 'primary.dark' : 'primary.light',
                                      color: isSelected ? 'white' : 'primary.dark'
                                    }
                                  }}
                                />
                              );
                            })
                          )}
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <CalendarToday sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          Choose a date to see available times
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </div>

          {/* Form Section Below */}
          <Box sx={{ mt: 0 }}>
            <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
              <form onSubmit={(e) => { e.preventDefault(); handleScheduleCall(); }}>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  <TextField
                    label="Your Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    label="Your Email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                  />

                  <TextField
                    label="Meeting Type"
                    select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    {meetingTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Additional Details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe your project or what you'd like to discuss..."
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                  />

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={onClose}
                      sx={{ minWidth: 100 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!selectedDate || !selectedTime || !clientName || !clientEmail || isLoading}
                      sx={{ minWidth: 150 }}
                    >
                      {isLoading ? 'Scheduling...' : 'Schedule Call'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          </Box>
        </div>
      </div>
    </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default GoogleCalendarScheduler;
