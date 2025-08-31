import React, { useState } from 'react';
import { API_CONFIG } from '../config/api';

const ApiTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string) => {
    setLoading(true);
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log('Testing API:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('API test error:', error);
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h3>API Test</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button onClick={() => testApi('/api/benefits/')} disabled={loading}>
          Test Benefits
        </button>
        <button onClick={() => testApi('/api/services/')} disabled={loading}>
          Test Services
        </button>
        <button onClick={() => testApi('/api/process-steps/')} disabled={loading}>
          Test Process Steps
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      <pre style={{ 
        fontSize: '10px', 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word',
        marginTop: '10px'
      }}>
        {result}
      </pre>
    </div>
  );
};

export default ApiTest;
