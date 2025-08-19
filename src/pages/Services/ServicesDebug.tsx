import { useEffect, useState } from 'react';
import { useServices } from '../../hooks/services/useServices';
import styles from './Services.module.scss';

const ServicesDebug = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  console.log('ServicesDebug component rendering...');
  
  // Add debug info
  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebug('Component mounted');
  }, []);

  let hookData = null;
  let hookError = null;
  
  try {
    hookData = useServices();
    addDebug('useServices hook called successfully');
    addDebug(`Services count: ${hookData.services.length}`);
    addDebug(`Loading: ${hookData.loading}`);
    addDebug(`Error: ${hookData.error || 'none'}`);
  } catch (error) {
    hookError = error;
    addDebug(`Hook error: ${error}`);
  }

  useEffect(() => {
    if (hookData && hookData.actions) {
      addDebug('Attempting to fetch services...');
      hookData.actions.fetch().then(() => {
        addDebug('Fetch completed');
      }).catch((err: any) => {
        addDebug(`Fetch error: ${err}`);
      });
    }
  }, [hookData?.actions]);
  
  return (
    <div className={styles.services} style={{ padding: '2rem' }}>
      <h1 style={{ color: 'red', fontSize: '2rem' }}>SERVICES DEBUG PAGE</h1>
      
      <div style={{ backgroundColor: '#f0f8ff', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
        <h2>Debug Information:</h2>
        <div style={{ maxHeight: '200px', overflow: 'auto', backgroundColor: 'white', padding: '1rem' }}>
          {debugInfo.map((info, index) => (
            <div key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              {info}
            </div>
          ))}
        </div>
      </div>

      {hookError && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '1rem', margin: '1rem' }}>
          <h3>Hook Error:</h3>
          <pre>{String(hookError)}</pre>
        </div>
      )}

      {hookData && (
        <div style={{ backgroundColor: 'lightgreen', padding: '1rem', margin: '1rem' }}>
          <h3>Hook Data:</h3>
          <p>Services: {hookData.services.length}</p>
          <p>Loading: {String(hookData.loading)}</p>
          <p>Error: {hookData.error || 'none'}</p>
          <p>Last Fetched: {hookData.lastFetched || 'never'}</p>
        </div>
      )}

      <div style={{ backgroundColor: 'yellow', padding: '1rem', margin: '1rem' }}>
        <h3>Services Data:</h3>
        {hookData && hookData.services.length > 0 ? (
          <ul>
            {hookData.services.map((service: any) => (
              <li key={service.id}>
                {service.title} - {service.category}
              </li>
            ))}
          </ul>
        ) : (
          <p>No services loaded yet</p>
        )}
      </div>
    </div>
  );
};

export default ServicesDebug;
