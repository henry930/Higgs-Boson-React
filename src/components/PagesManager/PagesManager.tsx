import React, { useState, useEffect } from 'react';
import { usePages } from '../../hooks/pages/usePages';
import { useUI } from '../../hooks/ui/useUI';
import PageEditor from '../PageEditor/PageEditor';
import type { Page } from '../../types';
import styles from './PagesManager.module.scss';

const PagesManager: React.FC = () => {
  const { pages, loading, error, fetchPages, deletePage } = usePages();
  const { actions } = useUI();
  const { addNotification } = actions;
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleCreateNew = () => {
    setEditingPage(null);
    setShowEditor(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setShowEditor(true);
  };

  const handleEditorSave = () => {
    setShowEditor(false);
    setEditingPage(null);
    fetchPages(); // Refresh the list
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setEditingPage(null);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete) {
      try {
        await deletePage(confirmDelete).unwrap();
        addNotification({
          type: 'success',
          message: 'Page deleted successfully!'
        });
        setConfirmDelete(null);
      } catch (error) {
        addNotification({
          type: 'error',
          message: `Failed to delete page: ${error}`
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showEditor) {
    return (
      <PageEditor
        page={editingPage}
        onSave={handleEditorSave}
        onCancel={handleEditorCancel}
      />
    );
  }

  return (
    <div className={styles.pagesManager}>
      <div className={styles.header}>
        <div>
          <h2>Pages Manager</h2>
          <p>Create and manage dynamic pages for your website</p>
        </div>
        <button onClick={handleCreateNew} className={styles.createBtn}>
          Create New Page
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <p>Error loading pages: {error}</p>
          <button onClick={fetchPages} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <p>Loading pages...</p>
        </div>
      ) : (
        <div className={styles.pagesList}>
          {pages.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No pages yet</h3>
              <p>Create your first dynamic page to get started.</p>
              <button onClick={handleCreateNew} className={styles.createBtn}>
                Create First Page
              </button>
            </div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div>Title</div>
                <div>Slug</div>
                <div>Status</div>
                <div>Views</div>
                <div>Updated</div>
                <div>Actions</div>
              </div>
              {pages.map((page) => (
                <div key={page.id} className={styles.tableRow}>
                  <div className={styles.titleCell}>
                    <h4>{page.title}</h4>
                    {page.excerpt && <p>{page.excerpt}</p>}
                  </div>
                  <div className={styles.slugCell}>
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.slugLink}
                    >
                      /{page.slug}
                    </a>
                  </div>
                  <div className={styles.statusCell}>
                    <span className={`${styles.status} ${page.published ? styles.published : styles.draft}`}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                    {page.featured && (
                      <span className={styles.featured}>Featured</span>
                    )}
                  </div>
                  <div className={styles.viewsCell}>
                    {page.viewCount || 0}
                  </div>
                  <div className={styles.dateCell}>
                    {formatDate(page.updatedAt)}
                  </div>
                  <div className={styles.actionsCell}>
                    <button
                      onClick={() => handleEdit(page)}
                      className={styles.editBtn}
                      title="Edit page"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(page.id)}
                      className={styles.deleteBtn}
                      title="Delete page"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this page? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button onClick={handleDeleteCancel} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className={styles.confirmBtn}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesManager;
