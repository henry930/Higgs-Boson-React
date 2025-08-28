import React, { useState } from 'react';
import Card from '../UI/Card';
import { dataService } from '../../services/supabaseDataService';
import styles from './ContactForm.module.scss';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  budget: string;
  timeline: string;
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

const ContactForm = ({ onSubmit, className = '' }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    budget: '',
    timeline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`I am changing ${name} ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Create a simplified data object for Supabase
      const submissionData = {
        name: formData.name,
        email: formData.email,
        subject: `Contact Form - ${formData.company || 'Project Inquiry'}`,
        message: `
Company: ${formData.company || 'Not specified'}
Phone: ${formData.phone || 'Not provided'}
Budget: ${formData.budget || 'Not specified'}
Timeline: ${formData.timeline || 'Not specified'}

Message:
${formData.message}
        `.trim()
      };

      const result = await dataService.submitContactForm(submissionData);

      if (result.success) {
        setSubmitStatus('success');
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          budget: '',
          timeline: ''
        });
        
        // Call parent onSubmit if provided
        if (onSubmit) {
          onSubmit(formData);
        }
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit form');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error occurred. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`${styles.contactForm} ${className}`} padding="xl" shadow="xl">
      <h2 className={styles.title}>Start Your Project</h2>
      
      {submitStatus === 'success' && (
        <div className={styles.successMessage}>
          ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className={styles.errorMessage}>
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="budget">Project Budget</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select budget range</option>
              <option value="10k-25k">$10k - $25k</option>
              <option value="25k-50k">$25k - $50k</option>
              <option value="50k-100k">$50k - $100k</option>
              <option value="100k+">$100k+</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="timeline">Project Timeline</label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select timeline</option>
              <option value="asap">ASAP</option>
              <option value="1-3months">1-3 months</option>
              <option value="3-6months">3-6 months</option>
              <option value="6months+">6+ months</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Project Description *</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project, goals, and requirements..."
            required
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </Card>
  );
};

export default ContactForm;
