import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Services Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Services</h3>
            <div className={styles.linkGroup}>
              <Link to="/services/staff-augmentation" className={styles.footerLink}>
                Staff Augmentation
              </Link>
              <Link to="/services/software-engineers" className={styles.footerLink}>
                Software Engineers
              </Link>
              <Link to="/services/ai-engineers" className={styles.footerLink}>
                AI Engineers
              </Link>
              <Link to="/services/mobile-developers" className={styles.footerLink}>
                Mobile Developers
              </Link>
              <Link to="/services/qa-analysts" className={styles.footerLink}>
                QA Analysts & Testers
              </Link>
              <Link to="/services/devops-engineers" className={styles.footerLink}>
                DevOps Engineers
              </Link>
            </div>

            <div className={styles.productSection}>
              <h4 className={styles.subSectionTitle}>Product Builds</h4>
              <Link to="/services/mvp-development" className={styles.footerLink}>
                MVP Development
              </Link>
              <Link to="/services/mobile-apps" className={styles.footerLink}>
                Mobile Apps
              </Link>
              <Link to="/services/ai-product-builds" className={styles.footerLink}>
                AI Product Builds
              </Link>
            </div>
          </div>

          {/* Technology & Tools Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Technology</h3>
            <div className={styles.techSection}>
              <h4 className={styles.subSectionTitle}>Frequently Supplied Tech</h4>
              <Link to="/technology/react-developers" className={styles.footerLink}>
                React
              </Link>
              <Link to="/technology/nodejs-developers" className={styles.footerLink}>
                Node.js
              </Link>
              <Link to="/technology/python-developers" className={styles.footerLink}>
                Python
              </Link>
              <Link to="/services/data-scientists" className={styles.footerLink}>
                Data Scientists
              </Link>
              <Link to="/services/full-stack-developers" className={styles.footerLink}>
                Full-Stack Developers
              </Link>
            </div>

            <div className={styles.talentSection}>
              <h4 className={styles.subSectionTitle}>Talent Locations</h4>
              <Link to="/services/remote-developers" className={styles.footerLink}>
                Remote Developers
              </Link>
              <Link to="/services/offshore-developers" className={styles.footerLink}>
                Offshore Developers
              </Link>
            </div>
          </div>

          {/* Navigation Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Navigation</h3>
            <div className={styles.mainNav}>
              <h4 className={styles.subSectionTitle}>Main</h4>
              <Link to="/how-it-works" className={styles.footerLink}>
                How it works
              </Link>
              <Link to="/about" className={styles.footerLink}>
                About us
              </Link>
              <Link to="/reviews" className={styles.footerLink}>
                Reviews
              </Link>
              <Link to="/pricing" className={styles.footerLink}>
                Pricing
              </Link>
              <Link to="/careers" className={styles.footerLink}>
                Careers
              </Link>
              <Link to="/resources" className={styles.footerLink}>
                Learn
              </Link>
              <Link to="/customer-stories" className={styles.footerLink}>
                Customer Stories
              </Link>
            </div>

            <div className={styles.subscribeSection}>
              <h4 className={styles.subSectionTitle}>Subscribe</h4>
              <p className={styles.subscribeText}>
                Everything you need to find, manage and retain exceptional tech talent - delivered monthly.
              </p>
              <form className={styles.subscribeForm}>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className={styles.emailInput}
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>HB</div>
                <span className={styles.logoText}>Higgs Boson</span>
              </div>
            </div>
            <p className={styles.copyright}>
              © 2025 Higgs Boson. All rights reserved.
            </p>
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
