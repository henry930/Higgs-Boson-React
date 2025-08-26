import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import styles from './Navigation.module.scss';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { setActiveSection } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest(`.${styles.navigation}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/price-comparison', label: 'Pricing' },
    { path: '/contact', label: 'Contact' },
  ];

  const authNavItems = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin', label: 'Admin' },
  ] : [
    { path: '/login', label: 'Login' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (label: string) => {
    setActiveSection(label.toLowerCase());
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={`${styles.navContainer} ${isScrolled ? styles.scrolled : ''}`}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              H
            </div>
            <span className={styles.logoText}>Higgs Boson</span>
            <span className={styles.logoTextMobile}>HB</span>
          </Link>

          {/* Desktop Menu */}
          <div className={styles.menu}>
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                onClick={() => handleNavClick(item.label)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Auth Navigation */}
            <div className={styles.authSection}>
              {authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''} ${item.label === 'Login' ? styles.loginBtn : ''}`}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <div className={styles.userMenu}>
                  <span className={styles.userName}>
                    {user?.firstName || user?.username}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.active : ''}`}
                onClick={() => handleNavClick(item.label)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className={styles.mobileAuthSection}>
              {authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.active : ''} ${item.label === 'Login' ? styles.loginBtn : ''}`}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <div className={styles.mobileUserInfo}>
                  <span>Welcome, {user?.firstName || user?.username}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
