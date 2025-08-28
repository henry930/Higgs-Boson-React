import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleCalendarScheduler from '../GoogleCalendarScheduler';
import logoSvg from '../../assets/logo.svg';
import styles from './Navigation.module.scss';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // CloudEmployee-inspired navigation structure
  const mainNavigation = [
    { path: '/how-it-works', label: 'How it works' },
    { path: '/about', label: 'About us' },
    { path: '/services', label: 'Services' },
    { path: '/price-comparison', label: 'Pricing' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
  ];

  const userNavigation = [
    { path: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { path: '/admin', label: 'Admin', requiresAuth: true, requiresStaff: true },
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
                filter: 'invert(1)'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.menu}>
            {/* Main navigation links */}
            {mainNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* User-specific navigation */}
            {user && userNavigation.map((item) => {
              if (item.requiresStaff && !user.is_staff) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${
                    location.pathname === item.path ? styles.active : ''
                  } ${item.label === 'Admin' ? styles.adminLink : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Auth section */}
            {user ? (
              <div className={styles.authSection}>
                <span className={styles.userName}>Hello, {user.username}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            ) : (
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
                <Link to="/login" className={styles.loginBtn}>
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            {/* Main navigation for mobile */}
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

            {/* User navigation for mobile */}
            {user && userNavigation.map((item) => {
              if (item.requiresStaff && !user.is_staff) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.mobileNavLink} ${
                    location.pathname === item.path ? styles.active : ''
                  } ${item.label === 'Admin' ? styles.adminLink : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile auth section */}
            {user ? (
              <div className={styles.mobileAuthSection}>
                <div className={styles.mobileUserInfo}>
                  Hello, {user.username}
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }} 
                  className={styles.mobileLogoutBtn}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className={styles.mobileAuthButtons}>
                <button 
                  onClick={() => {
                    console.log('🎯 Schedule a Call button clicked in Mobile Navigation');
                    setIsSchedulerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={styles.mobileScheduleCall}
                >
                  Schedule a Call
                </button>
                <Link 
                  to="/login" 
                  className={styles.mobileLoginBtn}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Google Calendar Scheduler Modal */}
      <GoogleCalendarScheduler
        key={isSchedulerOpen ? 'open' : 'closed'} // Force remount when opening
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        userEmail={user?.email}
      />
    </nav>
  );
};

export default Navigation;