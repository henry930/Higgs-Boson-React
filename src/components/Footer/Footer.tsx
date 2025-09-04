import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../../assets/logo.svg';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save email to localStorage for this demo
      const existingEmails = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
      
      if (existingEmails.includes(email)) {
        alert('This email is already subscribed to our newsletter.');
        setIsSubmitting(false);
        return;
      }

      existingEmails.push(email);
      localStorage.setItem('newsletterSubscriptions', JSON.stringify(existingEmails));
      
      // Show success state
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Services Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Services</h3>
            <div className={styles.linkGroup}>
              <Link to="/services" className={styles.footerLink}>
                AI-Powered Development
              </Link>
              <Link to="/services" className={styles.footerLink}>
                Fractional CTOs
              </Link>
              <Link to="/services" className={styles.footerLink}>
                HR Recruitment
              </Link>
              <Link to="/services" className={styles.footerLink}>
                Project Management
              </Link>
              <Link to="/services" className={styles.footerLink}>
                AI Training and Strategies
              </Link>
            </div>
          </div>

          {/* Technology & Tools Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Technology</h3>
            <div className={styles.techSection}>
              <div className={styles.techColumns}>
                <div className={styles.techColumn}>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Frontend
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Backend
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Mobile
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Cloud
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    DevOps
                  </Link>
                </div>
                <div className={styles.techColumn}>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Database
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    AI
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Blockchain
                  </Link>
                  <Link to="/services#tech-stacks" className={styles.footerLink}>
                    Tools
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Navigation</h3>
            <div className={styles.mainNav}>
              <Link to="/how-it-works" className={styles.footerLink}>
                How it works
              </Link>
              <Link to="/about" className={styles.footerLink}>
                About us
              </Link>
              <a href="#" className={styles.footerLink}>
                Reviews
              </a>
              <Link to="/price-comparison" className={styles.footerLink}>
                Pricing
              </Link>
              <Link to="/careers" className={styles.footerLink}>
                Careers
              </Link>
              <a href="#" className={styles.footerLink}>
                Learn
              </a>
              <a href="#" className={styles.footerLink}>
                Customer Stories
              </a>
            </div>

            <div className={styles.subscribeSection}>
              <h4 className={styles.subSectionTitle}>Subscribe</h4>
              <p className={styles.subscribeText}>
                Everything you need to find, manage and retain exceptional tech talent - delivered monthly.
              </p>
              {isSubscribed ? (
                <div className={styles.successMessage}>
                  <p style={{ color: '#4CAF50', fontWeight: 'bold', margin: '10px 0' }}>
                    Thank you for subscribed our newsletter!
                  </p>
                </div>
              ) : (
                <form className={styles.subscribeForm} onSubmit={handleNewsletterSubmit}>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className={styles.emailInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className={styles.subscribeBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <img 
                  src={logoSvg} 
                  alt="Higgs Boson Consultancy Logo" 
                  style={{ 
                    filter: 'invert(1)'
                  }}
                />
              </div>
            </div>
            <p className={styles.copyright}>
              © 2025 Higgs Boson. All rights reserved.
            </p>
            <a href="mailto:info@higgsbosonconsultancy.co.uk" className={styles.emailLink}>
              info@higgsbosonconsultancy.co.uk
            </a>
            <Link to="/privacy-policy" className={styles.privacyLink}>
              Privacy Policy
            </Link>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.ctaSection}>
              <Link to="/contact" className={styles.scheduleCall}>
                Schedule a Call
              </Link>
              <Link to="/contact" className={styles.contactUs}>
                Contact us
              </Link>
            </div>
            
            <div className={styles.regionSection}>
              <span className={styles.regionLabel}>Region</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
