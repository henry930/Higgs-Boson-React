import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GoogleCalendarScheduler from '../GoogleCalendarScheduler';
import logoSvg from '../../assets/logo.svg';
import styles from './Navigation.module.scss';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CloudEmployee-inspired navigation structure
  const mainNavigation = [
    { path: '/how-it-works', label: 'How it works' },
    { path: '/about', label: 'About us' },
    { 
      path: '/solutions', 
      label: 'Solutions',
      submenu: [
        { path: '/solutions/ai-developer-hiring', label: 'AI-Powered Developer hiring' },
        { path: '/solutions/ai-project-estimation', label: 'AI-Powered Project Estimation' },
        { path: '/solutions/ai-issues-fixer', label: 'AI-Powered Issues Fixer' }
      ]
    },
    { path: '/services', label: 'Services' },
    { path: '/price-comparison', label: 'Pricing' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={`${styles.navContainer} ${isScrolled ? styles.scrolled : ''}`}>
          {/* Logo - Your Custom SVG Logo */}
          <Link to="/" className={styles.logo}>
            <img 
              src={logoSvg} 
              alt="Higgs Boson Consultancy Logo" 
              style={{ 
                filter: 'invert(1)',
                height: '80px'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.menu}>
            {/* Main navigation links */}
            {mainNavigation.map((item) => (
              <div 
                key={item.path}
                className={styles.navItem}
                onMouseEnter={() => item.submenu && setActiveDropdown(item.path)}
                onMouseLeave={() => item.submenu && setActiveDropdown(null)}
              >
                {item.submenu ? (
                  <div className={styles.dropdownContainer}>
                    <span
                      className={`${styles.navLink} ${
                        location.pathname.startsWith(item.path) ? styles.active : ''
                      }`}
                    >
                      {item.label}
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className={styles.dropdownIcon}
                      >
                        <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                      </svg>
                    </span>
                    {activeDropdown === item.path && (
                      <div className={styles.submenu}>
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className={`${styles.submenuLink} ${
                              location.pathname === subitem.path ? styles.active : ''
                            }`}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${
                      location.pathname === item.path ? styles.active : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Auth section */}
            <div className={styles.authButtons}>
              <button 
                onClick={() => {
                  console.log('🎯 Schedule a Call button clicked in Navigation');
                  setIsSchedulerOpen(true);
                }}
                className={styles.scheduleCall}
              >
                Schedule a Call
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Mobile Navigation */}
          <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
            {/* Mobile navigation links */}
            {mainNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileNavLink} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile auth section */}
            <div className={styles.mobileAuthButtons}>
              <button 
                onClick={() => {
                  console.log('🎯 Schedule a Call button clicked in Mobile Navigation');
                  setIsSchedulerOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className={styles.scheduleCall}
              >
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Google Calendar Scheduler Modal */}
      <GoogleCalendarScheduler
        key={isSchedulerOpen ? 'open' : 'closed'} // Force remount when opening
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </nav>
  );
};

export default Navigation;