import { Routes, Route, Link, useLocation } from 'react-router-dom';
import PagesManager from '../../components/PagesManager/PagesManager';
import PageEditor from '../../components/PageEditor/PageEditor';
import AICustomerServiceDashboard from '../../components/AdminDashboard/AdminDashboard';
import AppointmentDashboard from '../../components/AppointmentDashboard/AppointmentDashboard';
import AdminLogin from '../../components/AdminLogin/AdminLogin';
import FullAdminDashboard from '../../components/FullAdminDashboard/FullAdminDashboard';
import { useState, useEffect } from 'react';
import styles from './Admin.module.scss';

const Admin = () => {
  const location = useLocation();
  
  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Admin Panel</h1>
        <p>Manage your website content and create articles</p>
        <div className={styles.nav}>
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? styles.active : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/pages" 
            className={location.pathname === '/admin/pages' ? styles.active : ''}
          >
            Manage Pages
          </Link>
          <Link 
            to="/admin/ai-service" 
            className={location.pathname === '/admin/ai-service' ? styles.active : ''}
          >
            AI Customer Service
          </Link>
          <Link 
            to="/admin/appointments" 
            className={location.pathname === '/admin/appointments' ? styles.active : ''}
          >
            Appointments
          </Link>
          <Link 
            to="/admin/management" 
            className={location.pathname === '/admin/management' ? styles.active : ''}
          >
            Admin Dashboard
          </Link>
          <Link 
            to="/admin/create-article" 
            className={`${styles.createBtn} ${location.pathname === '/admin/create-article' ? styles.active : ''}`}
          >
            ✍️ Create Article
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/pages" element={<PagesManager />} />
          <Route path="/ai-service" element={<AICustomerServiceDashboard />} />
          <Route path="/appointments" element={<AppointmentDashboard />} />
          <Route path="/management" element={<FullAdminDashboard />} />
          <Route path="/create-article" element={<PageEditor isStandalone={true} />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h2>Welcome to Your Article Creation System!</h2>
      <p>Create dynamic pages and articles for your website with our HTML editor.</p>
      
      <div className={styles.quickActions}>
        <Link to="/admin/create-article" className={styles.primaryAction}>
          <div className={styles.actionIcon}>✍️</div>
          <div>
            <h3>Create New Article</h3>
            <p>Write and publish articles with our rich HTML editor</p>
          </div>
        </Link>
        
        <Link to="/admin/pages" className={styles.secondaryAction}>
          <div className={styles.actionIcon}>📄</div>
          <div>
            <h3>Manage Pages</h3>
            <p>Edit, delete, or view all your created pages</p>
          </div>
        </Link>
      </div>

      <div className={styles.howItWorks}>
        <h3>How to Create Articles:</h3>
        <ol>
          <li><strong>Click "Create New Article"</strong> - Start with our rich HTML editor</li>
          <li><strong>Write Your Content</strong> - Use the editor to format text, add images, and create beautiful layouts</li>
          <li><strong>Set URL Slug</strong> - Choose a custom URL like "my-awesome-article"</li>
          <li><strong>Publish</strong> - Your article will be live at <code>/page/your-slug</code></li>
        </ol>
      </div>
    </div>
  );
};

export default Admin;
