import React from 'react';
import ContactForm from '../../components/ContactForm/ContactForm';
import styles from './Contact.module.scss';

const Contact = () => {
  const handleFormSubmit = (formData: any) => {
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You could send this data to an API, show a success message, etc.
  };

  return (
    <div className={styles.contact}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Let's Build Something Amazing Together</h1>
          <p className={styles.subtitle}>
            Ready to transform your business with AI-powered solutions? Get in touch with our team
            of experts and let's discuss your project requirements.
          </p>
        </div>
      </div>

      <div className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Get in Touch</h2>
              <p>
                We're here to help you revolutionize your business with cutting-edge AI solutions.
                Contact us today to start your digital transformation journey.
              </p>

              <div className={styles.contactMethods}>
                <div className={styles.contactMethod}>
                  <div className={styles.icon}>📧</div>
                  <div>
                    <h3>Email</h3>
                    <p>hello@higgsbosonconsultancy.com</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}>📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}>🌍</div>
                  <div>
                    <h3>Office</h3>
                    <p>San Francisco, CA<br />New York, NY<br />London, UK</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}>⏰</div>
                  <div>
                    <h3>Response Time</h3>
                    <p>Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>

      <div className={styles.faqSection}>
        <div className={styles.container}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>How quickly can you start my project?</h3>
              <p>Most projects can begin within 1-2 weeks after initial consultation and agreement.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Do you work with startups?</h3>
              <p>Yes! We work with companies of all sizes, from startups to Fortune 500 enterprises.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>What's included in your AI development services?</h3>
              <p>Full-stack development, AI integration, testing, deployment, and ongoing support.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can you help with existing projects?</h3>
              <p>Absolutely! We can enhance existing applications with AI capabilities or optimize current systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
