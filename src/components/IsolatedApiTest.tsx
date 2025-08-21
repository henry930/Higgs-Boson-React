import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const IsolatedApiTest: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState({
    loading: false,
    data: null as any,
    error: null as string | null
  });

  useEffect(() => {
    if (slug) {
      console.log('IsolatedApiTest: Starting fetch for:', slug);
      setState({ loading: true, data: null, error: null });
      
      // Direct fetch call bypassing our API service
      fetch(`http://localhost:8000/api/pages/slug/${encodeURIComponent(slug)}/`)
        .then(response => {
          console.log('IsolatedApiTest: Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('IsolatedApiTest: Response data:', data);
          if (data.status === 'success') {
            setState({ loading: false, data: data.data, error: null });
          } else {
            setState({ loading: false, data: null, error: data.message || 'API error' });
          }
        })
        .catch(error => {
          console.error('IsolatedApiTest: Error:', error);
          setState({ loading: false, data: null, error: error.message });
        });
    }
  }, [slug]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Isolated API Test</h1>
      <p><strong>Slug:</strong> {slug}</p>
      <p><strong>Loading:</strong> {String(state.loading)}</p>
      <p><strong>Error:</strong> {state.error || 'none'}</p>
      <p><strong>Has Data:</strong> {String(!!state.data)}</p>
      
      {state.loading && <p style={{ color: 'blue' }}>⏳ Loading...</p>}
      {state.error && <p style={{ color: 'red' }}>❌ Error: {state.error}</p>}
      {state.data && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green' }}>
          <h2>✅ Direct API Success!</h2>
          <p><strong>Title:</strong> {state.data.title}</p>
          <p><strong>Published:</strong> {String(state.data.published)}</p>
          <div style={{ marginTop: '10px' }}>
            <strong>Content:</strong>
            <div dangerouslySetInnerHTML={{ __html: state.data.content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default IsolatedApiTest;
