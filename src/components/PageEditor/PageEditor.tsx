import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { usePages } from '../../hooks/pages/usePages';
import { useUI } from '../../hooks/ui/useUI';
import type { Page } from '../../types';
import styles from './PageEditor.module.scss';

interface PageEditorProps {
  page?: Page | null;
  onSave?: () => void;
  onCancel?: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel }) => {
  const { createPage, updatePage, loading } = usePages();
  const { actions } = useUI();
  const { addNotification } = actions;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    excerpt: '',
    authorName: '',
    coverImage: '',
    tags: '',
    published: false,
    featured: false,
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        excerpt: page.excerpt || '',
        authorName: page.authorName || '',
        coverImage: page.coverImage || '',
        tags: page.tags || '',
        published: page.published || false,
        featured: page.featured || false,
      });
    }
  }, [page]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !page ? generateSlug(title) : prev.slug // Only auto-generate slug for new pages
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      addNotification({
        type: 'error',
        message: 'Title, slug, and content are required fields.'
      });
      return;
    }

    try {
      if (page) {
        await updatePage(page.id, formData).unwrap();
        addNotification({
          type: 'success',
          message: 'Page updated successfully!'
        });
      } else {
        await createPage(formData).unwrap();
        addNotification({
          type: 'success',
          message: 'Page created successfully!'
        });
      }
      onSave?.();
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Failed to ${page ? 'update' : 'create'} page: ${error}`
      });
    }
  };

  return (
    <div className={styles.pageEditor}>
      <div className={styles.header}>
        <h2>{page ? 'Edit Page' : 'Create New Page'}</h2>
        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onCancel}
            className={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="page-form"
            className={styles.saveBtn}
            disabled={loading}
          >
            {loading ? 'Saving...' : (page ? 'Update' : 'Create')}
          </button>
        </div>
      </div>

      <form id="page-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.mainFields}>
          <div className={styles.field}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="slug">URL Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="e.g., my-article"
            />
            <small>The page will be accessible at: /{formData.slug}</small>
          </div>

          <div className={styles.field}>
            <label htmlFor="content">Content *</label>
            <Editor
              value={formData.content}
              onEditorChange={handleContentChange}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.section}>
            <h3>Publication Settings</h3>
            <div className={styles.checkboxField}>
              <label>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                />
                Published
              </label>
            </div>
            <div className={styles.checkboxField}>
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                Featured
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <h3>SEO Settings</h3>
            <div className={styles.field}>
              <label htmlFor="metaTitle">Meta Title</label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                maxLength={60}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                maxLength={160}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Additional Info</h3>
            <div className={styles.field}>
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief summary of the page..."
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="authorName">Author Name</label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="coverImage">Cover Image URL</label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageEditor;
