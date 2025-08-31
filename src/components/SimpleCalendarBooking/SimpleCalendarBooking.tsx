import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api';
import styles from './SimpleCalendarBooking.module.scss';

interface SimpleCalendarBookingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  isBooked: boolean;
}

interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

const SimpleCalendarBooking: React.FC<SimpleCalendarBookingProps> = ({
  isOpen,
  onClose
}) => {
  console.log('🚀 SimpleCalendarBooking component mounted/rendered');
  console.log('🔍 isOpen prop:', isOpen);
  console.log('📅 Current date for debugging:', new Date().toISOString());
  
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Free Consultation (30 min)',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const serviceOptions = [
    'Free Consultation (30 min)'
  ];

  // Fetch available time slots when date changes

  // Reset all state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Modal opened - resetting all state and fetching fresh data');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Free Consultation (30 min)',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
      setAvailableTimeSlots([]);
      setIsSubmitting(false);
      setSubmitMessage('');
      setIsLoadingSlots(false);
    }
  }, [isOpen]);

  // Fetch available time slots when date changes
  useEffect(() => {
    console.log('🔍 useEffect triggered for formData.preferredDate:', formData.preferredDate);
    if (formData.preferredDate) {
      console.log('✅ Date exists, calling fetchAvailableSlots');
      fetchAvailableSlots(formData.preferredDate);
    } else {
      console.log('❌ No date selected, clearing time slots');
      // Clear time slots if no date selected
      setAvailableTimeSlots([]);
    }
  }, [formData.preferredDate]);

  // Debug: Log when availableTimeSlots changes
  useEffect(() => {
    console.log('*** availableTimeSlots state changed ***');
    console.log('New state:', availableTimeSlots);
    console.log('Length:', availableTimeSlots.length);
    console.log('Slots:', availableTimeSlots.map(slot => slot.time));
    console.log('*** End state change log ***');
  }, [availableTimeSlots]);

  const fetchAvailableSlots = async (date: string) => {
    setIsLoadingSlots(true);
    console.log('=== FETCH AVAILABLE SLOTS DEBUG ===');
    console.log('1. Fetching availability for date:', date);
    console.log('2. Current availableTimeSlots before API call:', availableTimeSlots);
    console.log('3. Timestamp:', new Date().toISOString());
    
    try {
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const apiUrl = `/api/appointments/availability/?date=${date}&t=${timestamp}`;
      console.log('4. Making API request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('5. Response status:', response.status);
      console.log('6. Response ok:', response.ok);
      console.log('7. Response headers:', response.headers);
      
      if (response.ok) {
        const data: AvailabilityResponse = await response.json();
        console.log('🎯 === API RESPONSE DATA DETAILS ===');
        console.log('📊 Raw API Response:', JSON.stringify(data, null, 2));
        console.log('📅 Date from API:', data.date);
        console.log('✅ Available Slots Count:', data.availableSlots.length);
        console.log('✅ Available Slots List:', data.availableSlots);
        console.log('❌ Booked Slots Count:', data.bookedSlots.length);
        console.log('❌ Booked Slots List:', data.bookedSlots);
        console.log('🎯 === END API RESPONSE DETAILS ===');
        
        // Only show available slots - hide booked ones completely
        const availableOnlySlots = data.availableSlots.map(time => ({
          time,
          available: true,
          isBooked: false
        }));
        console.log('🔄 Processed slots for UI:', availableOnlySlots);
        console.log('🔄 Number of slots to display:', availableOnlySlots.length);
        setAvailableTimeSlots(availableOnlySlots);
        console.log('✅ State updated with available slots');
      } else {
        console.error('14. API failed - Response not ok');
        console.error('15. Response status:', response.status);
        console.error('16. Response statusText:', response.statusText);
        const errorText = await response.text();
        console.error('17. Response body:', errorText);
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('18. Fetch error occurred:', error);
      if (error instanceof Error) {
        console.error('19. Error details:', error.message);
        console.error('20. Error stack:', error.stack);
      }
      // On error, show no slots to prevent incorrect bookings
      setAvailableTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
      console.log('21. Finally block - isLoadingSlots set to false');
      console.log('22. Final availableTimeSlots state:', availableTimeSlots);
      console.log('=== END FETCH DEBUG ===');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('📝 Input changed:', name, '=', value);
    
    // If date changes, clear the selected time
    if (name === 'preferredDate') {
      console.log('📅 Date input changed to:', value);
      setFormData(prev => {
        const newFormData = {
          ...prev,
          [name]: value,
          preferredTime: '' // Clear time when date changes
        };
        console.log('📊 New formData after date change:', newFormData);
        return newFormData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Check if selected time slot is still available
    const selectedSlot = availableTimeSlots.find(slot => slot.time === formData.preferredTime);
    if (!selectedSlot || !selectedSlot.available) {
      setSubmitMessage('Selected time slot is no longer available. Please choose another time.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message || 'Appointment request submitted successfully! We will contact you soon to confirm.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'Free Consultation (30 min)',
          preferredDate: '',
          preferredTime: '',
          message: ''
        });
        // Refresh availability after successful booking
        if (formData.preferredDate) {
          fetchAvailableSlots(formData.preferredDate);
        }
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitMessage(data.message || 'Failed to submit appointment request. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  if (!isOpen) {
    console.log('🚫 Modal is closed, not rendering');
    return null;
  }

  console.log('✅ Modal is open, rendering booking form');

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Schedule a Consultation</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          {submitMessage && (
            <div className={`${styles.message} ${submitMessage.includes('successfully') ? styles.success : styles.error}`}>
              {submitMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="service">Service Interest *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredDate">Preferred Date *</label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  min={today}
                  max={maxDateString}
                  required
                />
                {/* Debug button to manually trigger API call */}
                <div style={{marginTop: '10px'}}>
                  <button 
                    type="button" 
                    onClick={() => {
                      console.log('🔴 Manual API trigger for date:', formData.preferredDate);
                      if (formData.preferredDate) {
                        fetchAvailableSlots(formData.preferredDate);
                      } else {
                        console.log('❌ No date selected to refresh');
                      }
                    }}
                    style={{
                      marginTop: '5px', 
                      padding: '10px 15px', 
                      fontSize: '14px',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    🔄 Force Refresh Slots (DEBUG)
                  </button>
                  <small style={{color: '#666', fontSize: '12px'}}>
                    Date: {formData.preferredDate || 'No date selected'} | 
                    Slots: {availableTimeSlots.length}
                  </small>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredTime">Preferred Time *</label>
                {isLoadingSlots ? (
                  <div className={styles.loadingSlots}>Loading available times...</div>
                ) : (
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.preferredDate}
                  >
                    <option value="">
                      {!formData.preferredDate 
                        ? "Please select a date first" 
                        : availableTimeSlots.length === 0
                        ? "No time slots available for this date"
                        : "Select a time slot"
                      }
                    </option>
                    {(() => {
                      console.log('*** RENDER DEBUG ***');
                      console.log('availableTimeSlots in render:', availableTimeSlots);
                      console.log('availableTimeSlots.length:', availableTimeSlots.length);
                      console.log('isLoadingSlots:', isLoadingSlots);
                      console.log('formData.preferredDate:', formData.preferredDate);
                      return availableTimeSlots.map((slot) => {
                        console.log('Rendering slot:', slot);
                        return (
                          <option 
                            key={slot.time} 
                            value={slot.time}
                          >
                            {slot.time}
                          </option>
                        );
                      });
                    })()}
                  </select>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your project requirements, goals, or any specific questions you have..."
              />
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Request Appointment'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className={styles.contactInfo}>
            <h4>Alternative Contact Methods</h4>
            <p><strong>Email:</strong> henry930@gmail.com</p>
            <p><strong>Available:</strong> Monday - Friday, 9 AM - 5 PM</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCalendarBooking;
