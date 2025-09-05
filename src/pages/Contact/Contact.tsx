import styles from './Contact.module.scss';
import SEO from '../../components/SEO/SEO';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.contact}>
      <SEO 
        title="Contact Us"
        description="Get in touch with Higgs Boson Consultancy Ltd for AI and technology solutions. Contact our experts for consultation and project estimation."
        keywords="contact higgs boson, AI consultation, technology consultation, project estimation, get quote"
        url="https://higgsbosonconsultancy.co.uk/contact"
      />
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Let's Build Something <span className={styles.accent}>Amazing Together</span></h1>
            <p className={styles.heroDescription}>
              Ready to transform your business with AI-powered solutions? Get in touch with our team
              of experts and let's discuss your project requirements.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Get in Touch</h2>
                <p className={styles.sectionDescription}>
                  We're here to help you revolutionize your business with cutting-edge AI solutions.
                  Contact us today to start your digital transformation journey.
                </p>
              </div>

              <div className={styles.contactMethods}>
                <div className={styles.contactMethod}>
                  <div className={styles.methodIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 21V19H5V8C5 6.9 5.9 6 7 6H10V4H18V8H21V10H19V19H21V21H3ZM7 8V19H12V8H7ZM14 6V19H17V6H14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.methodContent}>
                    <h3 className={styles.methodTitle}>Contact Company</h3>
                    <p className={styles.methodText}>Higgs Boson Consultancy Ltd.<br />AI Solutions & Development</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.methodIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.methodContent}>
                    <h3 className={styles.methodTitle}>Contact Email</h3>
                    <p className={styles.methodText}>info@higgsbosonconsultancy.co.uk</p>
                  </div>
                </div>


              </div>
            </div>

            <div className={styles.actionSection}>
              <div className={styles.actionGrid}>
                <div className={styles.actionCard}>
                  <div className={styles.cardIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 15.5C18.75 15.5 17.55 15.3 16.43 14.93C16.08 14.82 15.69 14.9 15.41 15.18L13.21 17.38C10.38 15.94 8.06 13.62 6.62 10.79L8.82 8.59C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.5C21 15.95 20.55 15.5 20 15.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>Schedule A Call</h3>
                    <p className={styles.cardDescription}>
                      Book a consultation with our experts.
                    </p>
                    <button 
                      className={styles.actionButton}
                      onClick={() => navigate('/schedule-a-call')}
                    >
                      Book Consultation
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={styles.actionCard}>
                  <div className={styles.cardIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>Project Advice</h3>
                    <p className={styles.cardDescription}>
                      Get expert advice and estimates using AI.
                    </p>
                    <button 
                      className={styles.actionButton}
                      onClick={() => navigate('/project-estimation')}
                    >
                      Get Advice
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>How quickly can you start my project?</h3>
              <p className={styles.faqAnswer}>Most projects can begin within 1-2 weeks after initial consultation and agreement.</p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Do you work with startups?</h3>
              <p className={styles.faqAnswer}>Yes! We work with companies of all sizes, from startups to Fortune 500 enterprises.</p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>What's included in your AI development services?</h3>
              <p className={styles.faqAnswer}>Complete software development, AI integration, deployment, and ongoing support services.</p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Can you help with existing projects?</h3>
              <p className={styles.faqAnswer}>Absolutely! We can enhance existing applications with AI capabilities or optimize current systems.</p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Can you convert our system to AI-powered maintenance?</h3>
              <p className={styles.faqAnswer}>Yes, absolutely. We can train your staff on how to use AI for maintaining and optimizing your systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
