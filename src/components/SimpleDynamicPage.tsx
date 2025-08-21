import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePages } from '../hooks/pages/usePages';

const SimpleDynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentPage, loading, error, fetchPageBySlug } = usePages();

  console.log('SimpleDynamicPage render:', {
    slug,
    currentPage,
    loading,
    error,
    hasCurrentPage: !!currentPage
  });

  useEffect(() => {
    console.log('SimpleDynamicPage useEffect:', slug);
    if (slug) {
      fetchPageBySlug(slug);
    }
  }, [slug, fetchPageBySlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentPage) {
    return <div>No page found</div>;
  }

  return (
    <div>
      <h1>{currentPage.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: currentPage.content }} />
    </div>
  );
};

export default SimpleDynamicPage;
