import { useState } from 'react';
import PagesManager from '../../components/PagesManager/PagesManager';
import styles from './Admin.module.scss';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'pages' | 'benefits' | 'process' | 'testimonials' | 'hero'>('pages');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pages':
        return <PagesManager />;
      case 'benefits':
        return <div className={styles.comingSoon}>Benefits management coming soon...</div>;
      case 'process':
        return <div className={styles.comingSoon}>Process steps management coming soon...</div>;
      case 'testimonials':
        return <div className={styles.comingSoon}>Testimonials management coming soon...</div>;
      case 'hero':
        return <div className={styles.comingSoon}>Hero slides management coming soon...</div>;
      default:
        return <PagesManager />;
    }
  };

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Admin Panel</h1>
        <p>Manage your website content and settings</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'pages' ? styles.active : ''}`}
          onClick={() => setActiveTab('pages')}
        >
          Pages
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'benefits' ? styles.active : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          Benefits
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'process' ? styles.active : ''}`}
          onClick={() => setActiveTab('process')}
        >
          Process Steps
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'testimonials' ? styles.active : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'hero' ? styles.active : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          Hero Slides
        </button>
      </div>

      <div className={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Admin;
