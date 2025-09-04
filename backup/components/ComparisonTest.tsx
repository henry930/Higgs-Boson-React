import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePages } from '../hooks/pages/usePages';
import { useAppSelector } from '../store/hooks';

const ComparisonTest: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Test both approaches
  const { currentPage, loading, error, fetchPageBySlug } = usePages();
  const directReduxState = useAppSelector((state) => state.pages);

  console.log('=== COMPARISON TEST ===');
  console.log('Slug:', slug);
  console.log('usePages hook result:', { currentPage, loading, error });
  console.log('Direct Redux state:', directReduxState);
  console.log('Are they the same?', {
    sameCurrentPage: currentPage === directReduxState.currentPage,
    sameLoading: loading === directReduxState.loading,
    sameError: error === directReduxState.error
  });

  useEffect(() => {
    if (slug) {
      console.log('Fetching page for slug:', slug);
      fetchPageBySlug(slug);
    }
  }, [slug, fetchPageBySlug]);

  return (
    <div>
      <h1>Comparison Test</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h2>usePages Hook</h2>
          <pre>{JSON.stringify({ currentPage, loading, error }, null, 2)}</pre>
        </div>
        <div>
          <h2>Direct Redux</h2>
          <pre>{JSON.stringify(directReduxState, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTest;
