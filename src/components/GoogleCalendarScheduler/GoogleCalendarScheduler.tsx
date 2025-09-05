import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
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

// Material-UI theme aligned with company colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#21456f', // Company primary color
      light: '#4a6b8a',
      dark: '#1a3659',
    },
    secondary: {
      main: '#dff46e', // Company secondary color
      light: '#e8f67a',
      dark: '#c6db5f',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12, // More rounded like company style
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
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [meetingType, setMeetingType] = useState('consultation');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset all state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 GoogleCalendarScheduler opened - resetting all state and fetching fresh data');
      setSelectedDate(null);
      setSelectedTime('');
      setClientName('');
      setClientEmail(userEmail);
      setClientPhone('');
      setClientCompany('');
      setMeetingType('consultation');
      setDescription('');
      setIsLoading(false);
      setAvailableSlots([]);
      setShowSettings(false);
      setBookingError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, userEmail]);

  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation (20 min)' },
    { value: 'project-discussion', label: 'Project Discussion' },
    { value: 'technical-review', label: 'Technical Review' },
    { value: 'follow-up', label: 'Follow-up Meeting' },
  ];

  // Fetch available slots from API
  const fetchAvailableSlots = async (date: Dayjs) => {
    if (!date) return;
    
    console.log('🔄 Fetching available slots for:', date.format('YYYY-MM-DD'));
    setIsLoading(true);
    setBookingError(null);

    try {
      const dateStr = date.format('YYYY-MM-DD');
      console.log('📡 Making API request to:', `${API_CONFIG.CALENDAR_API_URL}/api/google-calendar/live-availability?date=${dateStr}`);
      
      const response = await fetch(`${API_CONFIG.CALENDAR_API_URL}/api/google-calendar/live-availability?date=${dateStr}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error response:', errorText);
        throw new Error(`Failed to fetch availability: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Availability data received:', data);

      // Convert slot strings to TimeSlot objects
      const slots: TimeSlot[] = (data.availableSlots || []).map((slot: string) => ({
        start: slot.split('-')[0],
        end: slot.split('-')[1],
        isBooked: false
      }));

      setAvailableSlots(slots);
      console.log('📅 Available slots set:', slots);

    } catch (error) {
      console.error('💥 Error fetching available slots:', error);
      setBookingError(`Failed to load available time slots: ${(error as Error).message}`);
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

  // Handle form submission
  const handleScheduleCall = async () => {
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      setBookingError('Please fill in all required fields');
      return;
    }

    console.log('📝 Submitting appointment booking...');
    setIsLoading(true);
    setBookingError(null);
    setSuccessMessage(null);

    try {
      const appointmentData = {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        company: clientCompany,
        preferred_date: selectedDate.format('YYYY-MM-DD'),
        preferred_time: selectedTime,
        service: meetingTypes.find(type => type.value === meetingType)?.label || 'Consultation',
        description: description,
        status: 'pending'
      };

      console.log('📤 Sending appointment data:', appointmentData);

      const response = await fetch(`${API_CONFIG.CALENDAR_API_URL}/api/google-calendar/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      console.log('📡 Booking response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Booking error:', errorData);
        throw new Error(errorData.error || `Booking failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Booking successful:', result);

      const successMsg = `✅ Appointment Booked Successfully!

📅 Date: ${selectedDate.format('MMMM D, YYYY')}
⏰ Time: ${selectedTime}
👤 Name: ${clientName}
📧 Email: ${clientEmail}

You'll receive a confirmation email shortly with calendar details.`;

      setSuccessMessage(successMsg);
      
      // Optionally close modal after success
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('💥 Booking error:', error);
      
      const errorMessage = `❌ Booking Failed

Unfortunately, we couldn't complete your appointment booking.

Error: ${(error as Error).message}

Please try again or contact us directly at info@higgsbosonconsultancy.co.uk.`;
      
      setBookingError(errorMessage);
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
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              background: '#ffffff',
              minHeight: '80vh',
            }
          }}
        >
          <DialogTitle
            sx={{
              background: '#21456f', // Company primary color
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
              <Box sx={{ p: 3 }}>
                {/* Row 1: Calendar and Time Slots */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                  gap: 3,
                  mb: 4
                }}>
                  {/* Calendar Section */}
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid #e5e5e5',
                      borderRadius: 2,
                      p: 3,
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#21456f',
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center',
                      }}
                    >
                      Select Date
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        value={selectedDate}
                        onChange={handleDateChange}
                        minDate={dayjs()}
                        maxDate={dayjs().add(60, 'day')}
                        sx={{
                          backgroundColor: '#ffffff',
                          borderRadius: 2,
                          '& .MuiPickersDay-root': {
                            '&:hover': {
                              backgroundColor: 'rgba(33, 69, 111, 0.1)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: '#21456f !important',
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
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        📅 Connected to Google Calendar - showing live availability
                      </Alert>
                    )}
                    
                    {!isConnected && (
                      <Alert
                        severity="info"
                        sx={{
                          mt: 2,
                          backgroundColor: 'rgba(33, 69, 111, 0.1)',
                          border: '1px solid rgba(33, 69, 111, 0.2)',
                        }}
                      >
                        📅 Using database availability - connect Google Calendar for real-time sync
                      </Alert>
                    )}
                  </Paper>

                  {/* Time Slots Section */}
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid #e5e5e5',
                      borderRadius: 2,
                      p: 3,
                      backgroundColor: '#fafafa',
                    }}
                  >
                    {selectedDate ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#21456f' }}>
                            Available Times
                            <Typography component="span" variant="body2" sx={{ ml: 1, color: '#737373' }}>
                              ({availableSlots?.length || 0} slots)
                            </Typography>
                          </Typography>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => fetchAvailableSlots(selectedDate)}
                            disabled={isLoading}
                            sx={{ 
                              minWidth: 'auto', 
                              p: 1,
                              color: '#21456f',
                              '&:hover': { backgroundColor: 'rgba(33, 69, 111, 0.1)' }
                            }}
                          >
                            🔄
                          </Button>
                        </Box>

                        {isLoading ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                            <CircularProgress sx={{ mb: 2, color: '#21456f' }} />
                            <Typography variant="body2" color="#737373">
                              Loading available time slots...
                            </Typography>
                          </Box>
                        ) : availableSlots && availableSlots.length > 0 ? (
                          <Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {availableSlots.map((slot, index) => {
                                const isSelected = selectedTime === slot.start;
                                return (
                                  <Chip
                                    key={index}
                                    label={slot.start}
                                    clickable
                                    onClick={() => setSelectedTime(slot.start)}
                                    variant={isSelected ? 'filled' : 'outlined'}
                                    sx={{
                                      fontWeight: isSelected ? 600 : 400,
                                      transition: 'all 0.2s ease',
                                      fontSize: '0.9rem',
                                      height: '36px',
                                      backgroundColor: isSelected ? '#21456f' : 'transparent',
                                      borderColor: isSelected ? '#21456f' : '#d4d4d4',
                                      color: isSelected ? 'white' : '#21456f',
                                      '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(33, 69, 111, 0.15)',
                                        backgroundColor: isSelected ? '#1a3659' : 'rgba(33, 69, 111, 0.05)',
                                        borderColor: '#21456f',
                                      },
                                    }}
                                  />
                                );
                              })}
                            </Box>
                            <Typography variant="caption" sx={{ mt: 1, color: '#737373', display: 'block' }}>
                              💡 All times are shown in your local timezone. Each session is 20 minutes.
                            </Typography>
                          </Box>
                        ) : (
                          <Alert 
                            severity="info" 
                            sx={{ 
                              backgroundColor: 'rgba(33, 69, 111, 0.1)',
                              border: '1px solid rgba(33, 69, 111, 0.2)',
                            }}
                          >
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>No available time slots for this date.</strong>
                            </Typography>
                            <Typography variant="body2">
                              Please try selecting a different date. Available: Monday - Sunday, 9 AM - 6 PM
                            </Typography>
                          </Alert>
                        )}
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="#737373">
                          Please select a date to view available time slots
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>

                {/* Row 2: Booking Form */}
                {selectedTime && (
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid #e5e5e5',
                      borderRadius: 2,
                      p: 4,
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {/* Appointment Summary */}
                    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fafafa', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#21456f', fontWeight: 600 }}>
                        📋 Appointment Summary
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#404040' }}>📅 Date:</Typography>
                          <Typography variant="body2" color="#737373">{selectedDate?.format('MMMM D, YYYY')}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#404040' }}>⏰ Time:</Typography>
                          <Typography variant="body2" color="#737373">{selectedTime}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#404040' }}>🔧 Service:</Typography>
                          <Typography variant="body2" color="#737373">
                            {meetingTypes.find(type => type.value === meetingType)?.label}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#404040' }}>⏱️ Duration:</Typography>
                          <Typography variant="body2" color="#737373">20 minutes</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Form Title */}
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#21456f' }}>
                      Your Information
                    </Typography>

                    {/* Success Message */}
                    {successMessage && (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 3, 
                          whiteSpace: 'pre-line',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                        onClose={() => setSuccessMessage(null)}
                      >
                        {successMessage}
                      </Alert>
                    )}

                    {/* Error Message */}
                    {bookingError && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 3, 
                          whiteSpace: 'pre-line',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                        onClose={() => setBookingError(null)}
                      >
                        {bookingError}
                      </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={(e) => { e.preventDefault(); handleScheduleCall(); }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                        <TextField
                          fullWidth
                          label="Your Name *"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          variant="outlined"
                          required
                          error={!clientName && bookingError !== null}
                          helperText={!clientName && bookingError !== null ? "Name is required" : ""}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#21456f',
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Email Address *"
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          variant="outlined"
                          required
                          error={!clientEmail && bookingError !== null}
                          helperText={!clientEmail && bookingError !== null ? "Valid email is required" : ""}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#21456f',
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#21456f',
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Company/Organization"
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#21456f',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#21456f',
                            },
                          }}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Meeting Type"
                        select
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value)}
                        variant="outlined"
                        sx={{ 
                          mt: 3,
                          '& .MuiOutlinedInput-root': {
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#21456f',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#21456f',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#21456f',
                          },
                        }}
                      >
                        {meetingTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        fullWidth
                        label="Tell us about your project or questions (optional)"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        placeholder="Share any specific questions, project details, or goals you'd like to discuss during our consultation..."
                        sx={{ 
                          mt: 3,
                          '& .MuiOutlinedInput-root': {
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#21456f',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#21456f',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#21456f',
                          },
                        }}
                      />

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={onClose}
                          sx={{
                            borderColor: '#d4d4d4',
                            color: '#737373',
                            '&:hover': {
                              borderColor: '#21456f',
                              backgroundColor: 'rgba(33, 69, 111, 0.05)',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isLoading || !clientName || !clientEmail}
                          sx={{
                            backgroundColor: '#21456f',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#1a3659',
                            },
                            '&:disabled': {
                              backgroundColor: '#d4d4d4',
                              color: '#a3a3a3',
                            },
                          }}
                        >
                          {isLoading ? (
                            <>
                              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                              Booking...
                            </>
                          ) : (
                            '📅 Schedule Consultation'
                          )}
                        </Button>
                      </Box>
                    </form>
                  </Paper>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default GoogleCalendarScheduler;
