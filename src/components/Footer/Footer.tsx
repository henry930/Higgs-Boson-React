import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Services', path: '/services' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' }
    ],
    services: [
      { label: 'AI Development', path: '/services#ai-development' },
      { label: 'Software Engineering', path: '/services#software-engineering' },
      { label: 'Consulting', path: '/services#consulting' },
      { label: 'Support', path: '/services#support' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Legal Notice', path: '/legal' }
    ]
  };

  const socialLinks = [
    { 
      label: 'LinkedIn', 
      url: 'https://linkedin.com/company/higgs-boson-consultancy',
      icon: '💼'
    },
    { 
      label: 'Twitter', 
      url: 'https://twitter.com/higgsbosonconsultancy',
      icon: '🐦'
    },
    { 
      label: 'GitHub', 
      url: 'https://github.com/higgs-boson-consultancy',
      icon: '💻'
    },
    { 
      label: 'Email', 
      url: 'mailto:contact@higgsbosonconsultancy.com',
      icon: '📧'
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.brand}>
              <h3>Higgs Boson Consultancy</h3>
              <p className={styles.tagline}>
                Accelerating innovation through AI-powered development solutions
              </p>
            </div>
            <div className={styles.contact}>
              <p>📍 123 Innovation Drive, Tech City, TC 12345</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 contact@higgsbosonconsultancy.com</p>
            </div>
          </div>

          {/* Company Links */}
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <ul className={styles.linkList}>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className={styles.footerSection}>
            <h4>Services</h4>
            <ul className={styles.linkList}>
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <ul className={styles.linkList}>
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className={styles.footerSection}>
            <h4>Stay Updated</h4>
            <p>Get the latest insights on AI development and technology trends.</p>
            <form className={styles.newsletter}>
              <input 
                type="email" 
                placeholder="Enter your email"
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.subscribeBtn}>
                Subscribe
              </button>
            </form>
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title={social.label}
                >
                  <span className={styles.socialIcon}>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} Higgs Boson Consultancy. All rights reserved.</p>
          </div>
          <div className={styles.certifications}>
            <span className={styles.cert}>🏆 ISO 27001 Certified</span>
            <span className={styles.cert}>⭐ SOC 2 Compliant</span>
            <span className={styles.cert}>🔒 GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
