import React, { useState } from 'react';
import GoogleCalendarScheduler from '../../components/GoogleCalendarScheduler';
import SEO from '../../components/SEO/SEO';
import styles from './ScheduleCall.module.scss';

const ScheduleCall: React.FC = () => {
  const [showScheduler, setShowScheduler] = useState(true);

  const handleCloseScheduler = () => {
    setShowScheduler(false);
  };

  return (
    <div className={styles.scheduleCall}>
      <SEO 
        title="Schedule a Call - Higgs Boson Consultancy"
        description="Book a consultation with our AI development experts. Discuss your project requirements and discover how we can accelerate your software development with AI-powered solutions."
        keywords="schedule call, consultation, AI development, project discussion, software development"
        url="https://higgsbosonconsultancy.co.uk/schedule-a-call"
      />

      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Schedule Your <span className={styles.accent}>AI Development</span> Consultation
            </h1>
            <p className={styles.heroSubtitle}>
              Ready to transform your development process? Book a free consultation with our AI experts 
              and discover how we can accelerate your project delivery by 75% while reducing costs by 70%.
            </p>
            
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>🚀</div>
                <h3>Free Consultation</h3>
                <p>No-obligation discussion about your project needs and goals</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>⚡</div>
                <h3>Quick Response</h3>
                <p>Get expert insights and project roadmap within 24 hours</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>🎯</div>
                <h3>Tailored Solutions</h3>
                <p>Custom AI-powered development strategy for your specific requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.schedulerSection}>
        <div className={styles.schedulerContainer}>
          <div className={styles.schedulerWrapper}>
            <h2 className={styles.sectionTitle}>Choose Your Preferred Time</h2>
            <p className={styles.sectionSubtitle}>
              Select a convenient time slot from our calendar. All consultations are conducted via video call.
            </p>
            
            {showScheduler && (
              <div className={styles.googleCalendar}>
                <GoogleCalendarScheduler 
                  isOpen={showScheduler}
                  onClose={handleCloseScheduler}
                />
              </div>
            )}
          </div>
          
          <div className={styles.infoPanel}>
            <h3>What to Expect</h3>
            <ul className={styles.expectationsList}>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <strong>Project Assessment:</strong> We'll review your current development challenges and goals
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <strong>AI Strategy Discussion:</strong> Learn how AI can transform your development process
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <strong>Timeline & Budget:</strong> Get realistic estimates for your project scope
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <strong>Next Steps:</strong> Clear roadmap for getting started with your AI development journey
              </li>
            </ul>

            <div className={styles.contactInfo}>
              <h4>Need Help?</h4>
              <p>If you can't find a suitable time slot or have urgent requirements, feel free to contact us directly.</p>
              <div className={styles.contactDetails}>
                <p><strong>Email:</strong> contact@higgsbosonconsultancy.co.uk</p>
                <p><strong>Response Time:</strong> Within 4 hours during business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "The consultation was incredibly insightful. They understood our needs immediately and provided a clear roadmap to success."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Sarah Johnson</strong>
                <span>CTO, TechFlow Solutions</span>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "Professional, knowledgeable, and efficient. The AI development approach exceeded our expectations."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Michael Chen</strong>
                <span>VP Engineering, DataVision Corp</span>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                "Working with their team was a game-changer. They delivered on every promise made during our initial consultation."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Emily Rodriguez</strong>
                <span>Product Director, InnovateLab</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScheduleCall;
