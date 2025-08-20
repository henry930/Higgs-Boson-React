import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageEditor from '../../components/PageEditor/PageEditor';
import { usePages } from '../../hooks/pages/usePages';
import styles from './AdminPageEditor.module.scss';

const AdminPageEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPage, loading } = usePages();
  
  const isEditing = id && id !== 'new';
  const page = isEditing ? currentPage : null;

  // For simplicity, we'll pass the page if editing, or null if creating new
  // In a real app, you'd have a fetchPageById function

  const handleSave = () => {
    navigate('/admin/pages');
  };

  const handleCancel = () => {
    navigate('/admin/pages');
  };

  if (loading && isEditing) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading page...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminPageEditor}>
      <PageEditor
        page={page}
        onSave={handleSave}
        onCancel={handleCancel}
        isStandalone={true}
      />
    </div>
  );
};

export default AdminPageEditor;
