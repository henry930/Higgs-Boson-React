import styles from './Contact.module.scss';
import SEO from '../../components/SEO/SEO';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const handleEnlargeChat = () => {
    navigate('/project-estimation');
  };

  return (
    <div className={styles.contact}>
      <SEO 
        title="Contact Us"
        description="Get in touch with Higgs Boson Consultancy Ltd for AI and technology solutions. Contact our experts for consultation and project estimation."
        keywords="contact higgs boson, AI consultation, technology consultation, project estimation, get quote"
        url="https://higgsboson.tech/contact"
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
                      
                      <p>First, please provide me with your company name, contact person, and contact email.</p>
                      
                      <p>Then, please give me your project requirements. Please be detailed, as this will be included in the contract later.</p>
                      
                      <p><strong>Our daily rate is £160. All startups and NGOs receive a 20% discount.</strong></p>
                      
                      <p>This estimation is preliminary - our specialist will contact you later for a deeper understanding of your needs.</p>
                      
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
