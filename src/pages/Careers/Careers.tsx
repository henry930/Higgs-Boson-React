import React, { useState } from 'react';
import styles from './Careers.module.scss';
import apiService from '../../services/apiService';

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  cv: File | null;
  linkedIn: string;
  portfolio: string;
}

const Careers: React.FC = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    cv: null,
    linkedIn: '',
    portfolio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
    }
    setApplicationForm(prev => ({ ...prev, cv: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('first_name', applicationForm.firstName);
      formData.append('last_name', applicationForm.lastName);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('position', applicationForm.position);
      formData.append('experience', applicationForm.experience);
      formData.append('cover_letter', applicationForm.coverLetter);
      formData.append('linkedin', applicationForm.linkedIn);
      formData.append('portfolio', applicationForm.portfolio);
      
      if (applicationForm.cv) {
        formData.append('cv', applicationForm.cv);
      }

      // Submit to API
      const response = await apiService.submitJobApplication(formData);
      
      if (response.status === 'success') {
        setSubmitStatus('success');
        setApplicationForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          coverLetter: '',
          cv: null,
          linkedIn: '',
          portfolio: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.careers}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Join Our Mission</h1>
            <p className={styles.heroDescription}>
              Help us revolutionize software development with AI. We're building the future where 
              developers can create amazing products faster, cheaper, and with better quality.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Team Members</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>25+</span>
                <span className={styles.statLabel}>Countries</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>£1M+</span>
                <span className={styles.statLabel}>Funding Raised</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className={`${styles.aboutSection} ${styles.cultureSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Culture</h2>
          </div>
          <div className={styles.cultureGrid}>
            <div className={styles.cultureCard}>
              <div className={styles.cultureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Innovation First</h3>
              <p>We embrace cutting-edge technology and encourage bold ideas that push the boundaries of what's possible.</p>
            </div>
            <div className={styles.cultureCard}>
              <div className={styles.cultureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="m22 21-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="19" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Remote-First</h3>
              <p>Work from anywhere in the world. We believe talent isn't limited by geography and offer full remote flexibility.</p>
            </div>
            <div className={styles.cultureCard}>
              <div className={styles.cultureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="m9 14 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Growth Mindset</h3>
              <p>Continuous learning is in our DNA. We provide generous learning budgets and time for professional development.</p>
            </div>
            <div className={styles.cultureCard}>
              <div className={styles.cultureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15l8-8H4l8 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Work-Life Balance</h3>
              <p>We value sustainable work practices with flexible hours, unlimited PTO, and mental health support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Join Our Team</h2>
            <p>We're always looking for talented people. Send us your application and we'll keep you in mind for opportunities.</p>
          </div>
          <div className={styles.generalApplication}>
            <button 
              className={styles.generalApplyBtn}
              onClick={() => {
                setApplicationForm(prev => ({ ...prev, position: 'General Application' }));
                setShowApplicationForm(true);
              }}
            >
              Send Application
            </button>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Apply for {applicationForm.position}</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowApplicationForm(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {submitStatus === 'success' ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3>Application Submitted!</h3>
                <p>Thank you for your interest. We'll review your application and get back to you within 5-7 business days.</p>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => setShowApplicationForm(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.applicationForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={applicationForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={applicationForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={applicationForm.email}
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
                      value={applicationForm.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="experience">Years of Experience *</label>
                  <select
                    id="experience"
                    name="experience"
                    value={applicationForm.experience}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-8">5-8 years</option>
                    <option value="8+">8+ years</option>
                  </select>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="linkedIn">LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedIn"
                      name="linkedIn"
                      value={applicationForm.linkedIn}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="portfolio">Portfolio/Website</label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={applicationForm.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cv">CV/Resume * (PDF or Word, max 5MB)</label>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  {applicationForm.cv && (
                    <div className={styles.fileInfo}>
                      <span>Selected: {applicationForm.cv.name}</span>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="coverLetter">Cover Letter *</label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={applicationForm.coverLetter}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                    required
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    There was an error submitting your application. Please try again.
                  </div>
                )}

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.secondaryBtn}
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.primaryBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
