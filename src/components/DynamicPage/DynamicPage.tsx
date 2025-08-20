import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { usePages } from '../../hooks/pages/usePages';
import DOMPurify from 'dompurify';
import styles from './DynamicPage.module.scss';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentPage, loading, error, fetchPageBySlug, incrementPageViews, clearCurrentPage } = usePages();

  console.log('DynamicPage Debug:', {
    slug,
    currentPage,
    loading,
    error,
    hasCurrentPage: !!currentPage,
    currentPageData: currentPage
  });

  useEffect(() => {
    console.log('DynamicPage useEffect triggered with slug:', slug);
    if (slug) {
      console.log('Calling fetchPageBySlug for slug:', slug);
      fetchPageBySlug(slug);
      
      // Increment page views after a short delay (to avoid counting quick navigation away)
      const viewTimer = setTimeout(() => {
        incrementPageViews(slug);
      }, 3000);
      
      return () => {
        clearTimeout(viewTimer);
      };
    }
    
    return () => {
      clearCurrentPage();
    };
  }, [slug, fetchPageBySlug, incrementPageViews, clearCurrentPage]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error || !currentPage) {
    return <Navigate to="/404" replace />;
  }

  // Don't show unpublished pages to regular users
  if (!currentPage.published) {
    return <Navigate to="/404" replace />;
  }

  // Sanitize HTML content before rendering
  const sanitizedContent = DOMPurify.sanitize(currentPage.content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
      'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id', 'style']
  });

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.dynamicPage}>
      {/* SEO Meta Tags */}
      <title>{currentPage.meta_title || currentPage.title}</title>
      <meta name="description" content={currentPage.meta_description || currentPage.excerpt || ''} />
      
      {currentPage.cover_image && (
        <div className={styles.coverImage}>
          <img src={currentPage.cover_image} alt={currentPage.title} />
        </div>
      )}
      
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{currentPage.title}</h1>
          
          <div className={styles.meta}>
            {currentPage.author_name && (
              <span className={styles.author}>By {currentPage.author_name}</span>
            )}
            {currentPage.created_at && (
              <span className={styles.date}>
                Published on {formatDate(currentPage.created_at)}
              </span>
            )}
            {currentPage.view_count > 0 && (
              <span className={styles.views}>
                {currentPage.view_count} view{currentPage.view_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {currentPage.excerpt && (
            <div className={styles.excerpt}>
              {currentPage.excerpt}
            </div>
          )}
          
          {currentPage.tags && (
            <div className={styles.tags}>
              {currentPage.tags.split(',').map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>
    </div>
  );
};

export default DynamicPage;
