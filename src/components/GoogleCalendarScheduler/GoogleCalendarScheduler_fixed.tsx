import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Close as CloseIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { API_CONFIG } from '../../config/api';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { GoogleCalendarSettings } from '../GoogleCalendarSettings/GoogleCalendarSettings';

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
  
  // Google Calendar integration
  const { isConnected } = useGoogleCalendar();
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState(userEmail);
  const [meetingType, setMeetingType] = useState('consultation');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [showSettings, setShowSettings] = useState(false);

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
      setShowSettings(false);
    }
  }, [isOpen, userEmail]);

  // Fetch available slots for selected date
  const fetchAvailableSlots = async (date: Dayjs) => {
    if (!date) {
      console.log('⚠️ No date provided to fetchAvailableSlots');
      return;
    }

    const dateStr = date.format('YYYY-MM-DD');
    console.log('=== 🔄 FETCHING LIVE AVAILABILITY ===');
    console.log('📅 Date:', dateStr);
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    setIsLoading(true);
    setAvailableSlots([]); // Clear existing slots while loading
    
    try {
      // Use Google Calendar endpoint for real-time availability
      const apiUrl = `${API_CONFIG.DJANGO_BASE_URL}/google-calendar/availability/`;
      console.log('🌐 Live API URL:', apiUrl);
      
      // Add cache-busting parameter for fresh data
      const params = new URLSearchParams({
        date: dateStr,
        cache_bust: Date.now().toString(),
        source: 'live_calendar'
      });
      
      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        mode: 'cors'
      });
      
      console.log('📡 Live availability response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Live availability data received:', data);
        
        if (data && Array.isArray(data.available_slots)) {
          console.log(`📊 Found ${data.available_slots.length} live available slots`);
          setAvailableSlots(data.available_slots);
          
          if (data.live_data) {
            console.log('🟢 Confirmed: Data is live from Google Calendar');
          }
          if (data.last_updated) {
            console.log('⏰ Data last updated:', data.last_updated);
          }
        } else {
          console.warn('⚠️ Invalid live availability data structure:', data);
          setAvailableSlots([]);
        }
      } else {
        console.error('❌ Live availability fetch failed:', response.status, response.statusText);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('💥 Live availability fetch error:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection
  const handleDateChange = (newDate: Dayjs | null) => {
    console.log('📅 Date selected:', newDate?.format('YYYY-MM-DD'));
    setSelectedDate(newDate);
    setSelectedTime(''); // Reset time when date changes
    
    if (newDate) {
      fetchAvailableSlots(newDate);
    } else {
      setAvailableSlots([]);
    }
  };

  // Meeting types configuration
  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation (30 min)', duration: 30 }
  ];

  // Handle scheduling the call with automatic Google Calendar integration
  const handleScheduleCall = async () => {
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      alert('Please fill in all required fields and select a date and time');
      return;
    }

    setIsLoading(true);
    
    console.log('=== 🚀 AUTOMATIC APPOINTMENT BOOKING ===');
    console.log('📅 Selected date:', selectedDate?.format('YYYY-MM-DD'));
    console.log('⏰ Selected time:', selectedTime);
    console.log('👤 Client:', clientName);
    console.log('📧 Email:', clientEmail);

    try {
      const selectedMeetingType = meetingTypes.find(type => type.value === meetingType);
      
      // Create appointment data for the new automatic system
      const appointmentData = {
        name: clientName,
        email: clientEmail,
        phone: '', // Add phone field to form if needed
        company: '', // Add company field to form if needed
        service: selectedMeetingType?.label || 'Consultation',
        preferred_date: selectedDate?.format('YYYY-MM-DD'),
        preferred_time: selectedTime,
        message: description || `${selectedMeetingType?.label} - Consultation session`,
        booking_source: 'google_calendar_scheduler'
      };
      
      console.log('📝 Appointment data:', appointmentData);
      
      // Use the new automatic Google Calendar integration endpoint
      const apiUrl = `${API_CONFIG.DJANGO_BASE_URL}/google-calendar/create_appointment/`;
      console.log('🌐 Booking API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
        mode: 'cors'
      });
      
      console.log('📡 Booking response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Automatic booking result:', result);
        
        if (result.success) {
          // Immediately update local slots to provide instant feedback
          console.log('⚡ Removing booked slot from local state');
          setAvailableSlots(currentSlots => 
            currentSlots.filter(slot => slot.start !== selectedTime)
          );
          
          // Show detailed success message
          const successMessage = `🎉 Appointment Booked Successfully!

📅 Date: ${selectedDate?.format('MMMM D, YYYY')}
⏰ Time: ${selectedTime}
🔧 Service: ${selectedMeetingType?.label}

✅ ${result.message}

📧 You will receive:
• Calendar invitation via email
• Reminder notifications
• Meeting details

The appointment has been automatically added to the consultant's calendar.`;

          alert(successMessage);
          
          // Reset form and close dialog
          setSelectedDate(null);
          setSelectedTime('');
          setClientName('');
          setClientEmail('');
          setDescription('');
          onClose();
          
          // Refresh availability to show updated real-time data
          setTimeout(async () => {
            if (selectedDate) {
              console.log('🔄 Refreshing live availability after successful booking...');
              await fetchAvailableSlots(selectedDate);
            }
          }, 1000);
          
        } else {
          throw new Error(result.message || 'Booking failed');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('💥 Booking error:', error);
      
      const errorMessage = `❌ Booking Failed

Unfortunately, we couldn't complete your appointment booking.

Error: ${(error as Error).message}

Please try again or contact us directly.`;
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={isOpen}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.5rem',
              position: 'relative',
              px: 3,
              py: 2,
            }}
          >
            📅 Schedule a Consultation Call
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setShowSettings(!showSettings)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                title="Google Calendar Settings"
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                onClick={onClose}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            {showSettings ? (
              <Box sx={{ p: 3 }}>
                <GoogleCalendarSettings />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 500 }}>
                {/* Left Panel - Calendar */}
                <Box sx={{ flex: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center',
                      }}
                    >
                      Select Date
                    </Typography>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        value={selectedDate}
                        onChange={handleDateChange}
                        minDate={dayjs()}
                        maxDate={dayjs().add(60, 'day')}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          borderRadius: 2,
                          '& .MuiPickersDay-root': {
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.2)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: '#667eea !important',
                              color: 'white',
                            },
                          },
                        }}
                      />
                    </Box>

                    {isConnected && (
                      <Alert
                        severity="success"
                        sx={{
                          mt: 2,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        📅 Connected to Google Calendar - showing live availability
                      </Alert>
                    )}
                  </Paper>
                </Box>

                {/* Right Panel - Time Slots & Form */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {selectedDate ? (
                      <>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                          Available Times for {selectedDate.format('MMMM D, YYYY')}
                        </Typography>

                        {isLoading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                          </Box>
                        ) : availableSlots && availableSlots.length > 0 ? (
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {availableSlots.map((slot, index) => (
                                <Chip
                                  key={index}
                                  label={slot.start}
                                  clickable
                                  onClick={() => setSelectedTime(slot.start)}
                                  variant={selectedTime === slot.start ? 'filled' : 'outlined'}
                                  color={selectedTime === slot.start ? 'primary' : 'default'}
                                  sx={{
                                    fontWeight: selectedTime === slot.start ? 600 : 400,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        ) : (
                          <Alert severity="info" sx={{ mb: 3 }}>
                            No available time slots for this date. Please select another date.
                          </Alert>
                        )}

                        {selectedTime && (
                          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                              Booking Details
                            </Typography>

                            <form onSubmit={(e) => { e.preventDefault(); handleScheduleCall(); }}>
                              <TextField
                                fullWidth
                                label="Your Name *"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                required
                              />

                              <TextField
                                fullWidth
                                label="Email Address *"
                                type="email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                required
                              />

                              <TextField
                                fullWidth
                                select
                                label="Meeting Type"
                                value={meetingType}
                                onChange={(e) => setMeetingType(e.target.value)}
                                margin="normal"
                                variant="outlined"
                              >
                                {meetingTypes.map((type) => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                  </MenuItem>
                                ))}
                              </TextField>

                              <TextField
                                fullWidth
                                label="Additional Notes (Optional)"
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                placeholder="Tell us about your project or specific questions..."
                              />
                            </form>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h6" color="text.secondary">
                          Please select a date to view available time slots
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>

          {!showSettings && selectedDate && selectedTime && (
            <DialogActions
              sx={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                px: 3,
                py: 2,
                borderTop: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleCall}
                variant="contained"
                disabled={isLoading || !selectedDate || !selectedTime || !clientName || !clientEmail}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Booking...
                  </>
                ) : (
                  'Schedule Call'
                )}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default GoogleCalendarScheduler;
