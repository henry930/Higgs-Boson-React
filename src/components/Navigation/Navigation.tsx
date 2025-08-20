import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navigation.module.scss';

const Navigation = () => {
  const location = useLocation();
  const { setActiveSection } = useApp();
  const { theme, toggleTheme } = useTheme();
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

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
    { path: '/admin', label: 'Admin', isAdmin: true },
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
            <span className={styles.logoText}>Higgs Boson Consultancy</span>
            <span className={styles.logoTextMobile}>HBC</span>
          </Link>

          {/* Desktop Menu */}
          <div className={styles.menu}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''} ${item.isAdmin ? styles.adminLink : ''}`}
                onClick={() => handleNavClick(item.label)}
              >
                {item.isAdmin && '⚙️ '}{item.label}
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.active : ''} ${item.isAdmin ? styles.adminLink : ''}`}
                onClick={() => handleNavClick(item.label)}
              >
                {item.isAdmin && '⚙️ '}{item.label}
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className={styles.mobileThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
