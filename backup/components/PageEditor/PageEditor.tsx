import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { usePages } from '../../hooks/pages/usePages';
import { useUI } from '../../hooks/ui/useUI';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import type { Page } from '../../types';
import styles from './PageEditor.module.scss';

interface PageEditorProps {
  page?: Page | null;
  onSave?: () => void;
  onCancel?: () => void;
  isStandalone?: boolean; // For standalone admin page
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel, isStandalone = false }) => {
  const { createPage, updatePage, loading } = usePages();
  const { actions } = useUI();
  const { addNotification } = actions;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    excerpt: '',
    author_name: '',
    cover_image: '',
    tags: '',
    published: false,
    featured: false,
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [editorMode, setEditorMode] = useState<'markdown' | 'html'>('markdown');

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        excerpt: page.excerpt || '',
        author_name: page.author_name || '',
        cover_image: page.cover_image || '',
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
    setIsDirty(true);
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const handlePreviewInNewTab = () => {
    if (formData.slug) {
      window.open(`/page/${formData.slug}`, '_blank');
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    
    if (isStandalone) {
      navigate('/admin/pages');
    } else {
      onCancel?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    setIsDirty(true);
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    setIsDirty(true);
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

    // Sanitize content before saving
    const sanitizedContent = DOMPurify.sanitize(formData.content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
        'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id', 'style']
    });

    try {
      if (page) {
        await updatePage(page.id, { ...formData, content: sanitizedContent });
        addNotification({
          type: 'success',
          message: 'Page updated successfully!'
        });
      } else {
        // For new pages, prepare data in the format expected by the API
        const pageData = {
          ...formData,
          content: sanitizedContent,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await createPage(pageData);
        addNotification({
          type: 'success',
          message: 'Page created successfully!'
        });
      }
      
      setIsDirty(false);
      
      if (isStandalone) {
        navigate('/admin/pages');
      } else {
        onSave?.();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Failed to ${page ? 'update' : 'create'} page: ${error}`
      });
    }
  };

  const insertHTML = (openTag: string, closeTag: string) => {
    const textarea = document.querySelector(`.${styles.htmlTextarea}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const replacement = openTag + selectedText + closeTag;
    
    const newContent = 
      formData.content.substring(0, start) + 
      replacement + 
      formData.content.substring(end);
    
    handleContentChange(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  return (
    <div className={styles.pageEditor}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>{page ? 'Edit Page' : 'Create New Page'}</h2>
          {isDirty && <span className={styles.unsavedIndicator}>• Unsaved changes</span>}
        </div>
        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={handlePreviewToggle}
            className={`${styles.previewBtn} ${previewMode ? styles.active : ''}`}
            disabled={!formData.content}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button 
            type="button" 
            onClick={handlePreviewInNewTab}
            className={styles.previewLinkBtn}
            disabled={!formData.slug}
            title="Preview in new tab"
          >
            👁️ Live Preview
          </button>
          <button 
            type="button" 
            onClick={handleCancel}
            className={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="page-form"
            className={styles.saveBtn}
            disabled={loading || !formData.title || !formData.slug || !formData.content}
            onClick={() => console.log('Save button clicked!', {
              loading,
              title: formData.title,
              slug: formData.slug,
              content: formData.content,
              disabled: loading || !formData.title || !formData.slug || !formData.content
            })}
          >
            {loading ? 'Saving...' : (page ? 'Update Page' : 'Create Page')}
          </button>
        </div>
      </div>

      <form id="page-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.mainFields}>
          {/* Debug save button */}
          <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '6px', marginBottom: '1rem' }}>
            <h3>Debug Save Test</h3>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Debug save clicked', formData);
                handleSubmit(e as any);
              }}
              style={{ 
                padding: '10px 20px', 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              🚀 DEBUG SAVE ARTICLE
            </button>
            <span>Title: {formData.title || 'None'} | Slug: {formData.slug || 'None'} | Content: {formData.content ? 'Has content' : 'No content'}</span>
          </div>
          
          <div className={styles.field}>
            <label htmlFor="title">Page Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              placeholder="Enter a compelling page title"
              className={styles.titleInput}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="slug">URL Slug *</label>
            <div className={styles.slugWrapper}>
              <span className={styles.urlPrefix}>/page/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="url-friendly-slug"
                className={styles.slugInput}
              />
            </div>
            <small className={styles.helpText}>
              The page will be accessible at: <strong>/page/{formData.slug || 'your-slug'}</strong>
            </small>
          </div>

          <div className={styles.field}>
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
              placeholder="Brief summary that appears in page listings..."
              className={styles.excerptInput}
            />
            <small className={styles.helpText}>Optional short description for listings and SEO</small>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.contentHeader}>
              <label>Content *</label>
              <div className={styles.contentTools}>
                <span className={styles.wordCount}>
                  {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length} words
                </span>
              </div>
            </div>
            
            {previewMode ? (
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <h3>Preview</h3>
                  <small>This is how your content will appear to readers</small>
                </div>
                <div 
                  className={styles.previewContent}
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(formData.content, {
                      ALLOWED_TAGS: [
                        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
                        'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
                      ],
                      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id', 'style']
                    }) 
                  }}
                />
              </div>
            ) : (
              <div className={styles.editorWrapper}>
                <div className={styles.editorControls}>
                  <button 
                    type="button"
                    onClick={() => setEditorMode('markdown')}
                    className={`${styles.editorModeBtn} ${editorMode === 'markdown' ? styles.active : ''}`}
                  >
                    📝 Markdown
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditorMode('html')}
                    className={`${styles.editorModeBtn} ${editorMode === 'html' ? styles.active : ''}`}
                  >
                    🔧 HTML
                  </button>
                </div>
                
                {editorMode === 'markdown' ? (
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => handleContentChange(value || '')}
                    height={500}
                    preview="edit"
                    hideToolbar={false}
                    data-color-mode="light"
                  />
                ) : (
                  <div className={styles.htmlEditor}>
                    <div className={styles.htmlToolbar}>
                      <button type="button" onClick={() => insertHTML('<h1>', '</h1>')}>H1</button>
                      <button type="button" onClick={() => insertHTML('<h2>', '</h2>')}>H2</button>
                      <button type="button" onClick={() => insertHTML('<h3>', '</h3>')}>H3</button>
                      <button type="button" onClick={() => insertHTML('<strong>', '</strong>')}>Bold</button>
                      <button type="button" onClick={() => insertHTML('<em>', '</em>')}>Italic</button>
                      <button type="button" onClick={() => insertHTML('<p>', '</p>')}>Paragraph</button>
                      <button type="button" onClick={() => insertHTML('<br>', '')}>Line Break</button>
                      <button type="button" onClick={() => insertHTML('<a href="">', '</a>')}>Link</button>
                      <button type="button" onClick={() => insertHTML('<ul><li>', '</li></ul>')}>List</button>
                      <button type="button" onClick={() => insertHTML('<blockquote>', '</blockquote>')}>Quote</button>
                    </div>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className={styles.htmlTextarea}
                      placeholder="Enter your HTML content here..."
                      rows={20}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.section}>
            <h3>📊 Publication Status</h3>
            <div className={styles.statusIndicator}>
              <span className={`${styles.status} ${formData.published ? styles.published : styles.draft}`}>
                {formData.published ? '✅ Published' : '📝 Draft'}
              </span>
            </div>
            <div className={styles.checkboxField}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                />
                <span className={styles.checkboxCustom}></span>
                Publish this page
              </label>
            </div>
            <div className={styles.checkboxField}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <span className={styles.checkboxCustom}></span>
                Feature this page
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <h3>🔍 SEO Settings</h3>
            <div className={styles.field}>
              <label htmlFor="meta_title">Meta Title</label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                maxLength={60}
                placeholder="Leave empty to use page title"
              />
              <small className={styles.charCount}>
                {formData.meta_title.length}/60 characters
              </small>
            </div>
            <div className={styles.field}>
              <label htmlFor="meta_description">Meta Description</label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                maxLength={160}
                rows={3}
                placeholder="Brief description for search engines..."
              />
              <small className={styles.charCount}>
                {formData.meta_description.length}/160 characters
              </small>
            </div>
          </div>

          <div className={styles.section}>
            <h3>👤 Author & Media</h3>
            <div className={styles.field}>
              <label htmlFor="author_name">Author Name</label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={formData.author_name}
                onChange={handleInputChange}
                placeholder="Article author"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="cover_image">Cover Image URL</label>
              <input
                type="url"
                id="cover_image"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              {formData.cover_image && (
                <div className={styles.imagePreview}>
                  <img 
                    src={formData.cover_image} 
                    alt="Cover preview" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="technology, ai, development"
              />
              <small className={styles.helpText}>
                Separate multiple tags with commas
              </small>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageEditor;
