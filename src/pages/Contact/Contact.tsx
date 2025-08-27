import styles from './Contact.module.scss';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const handleEnlargeChat = () => {
    navigate('/project-estimation');
  };

  return (
    <div className={styles.contact}>
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
                    <p className={styles.methodText}>hello@higgsbosonconsultancy.com<br />projects@higgsbosonconsultancy.com</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.methodIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.methodContent}>
                    <h3 className={styles.methodTitle}>Contact Phone</h3>
                    <p className={styles.methodText}>+1 (555) 123-4567<br />Available Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.aiAssistantSection}>
              <div className={styles.chatBox}>
                <div className={styles.chatHeader}>
                  <div className={styles.headerContent}>
                    <h4>Sarah - AI Project Assistant</h4>
                    <p>Ready to help with your project estimation</p>
                  </div>
                  <div className={styles.headerActions}>
                    <div className={styles.statusIndicator}>
                      <span className={styles.onlineStatus}></span>
                      Online
                    </div>
                    <button className={styles.enlargeButton} onClick={handleEnlargeChat} title="Open full estimation interface">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className={styles.chatMessages}>
                  <div className={styles.welcomeMessage}>
                    <div className={styles.aiAvatar}>👩‍💼</div>
                    <div className={styles.messageContent}>
                      <p><strong>Hello, I am Sarah, your AI Project Assistant.</strong></p>
                      
                      <p>At first, please give me your company name, contact person, contact email and contact phone.</p>
                      
                      <p>Then, please give me your project requirement. Please be detailed, as it will be binded in contract later.</p>
                      
                      <p><strong>Our daily rate is £160. All startup and NGO will have 20% off discount.</strong></p>
                      
                      <p>The estimation is not final, our specialist will contact you lately for deeply understanding.</p>
                      
                      <p><strong>Let's start!</strong></p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.chatInput}>
                  <div className={styles.inputContainer}>
                    <input 
                      type="text" 
                      placeholder="Type your message here..."
                      className={styles.messageInput}
                    />
                    <button className={styles.sendButton}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
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
              <p className={styles.faqAnswer}>Any software development, AI Integration, deployment and ongoing support</p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Can you help with existing projects?</h3>
              <p className={styles.faqAnswer}>Absolutely! We can enhance existing applications with AI capabilities or optimize current systems.</p>
            </div>
            <div className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>Can you reform our system to AI maintenance service?</h3>
              <p className={styles.faqAnswer}>Yes, of course. We can train your stuffs on how to use AI for maintaining your system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
