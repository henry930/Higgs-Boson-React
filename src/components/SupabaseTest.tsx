import { dataService } from '../services/supabaseDataService';

const SupabaseTest = () => {
  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Test basic connection by trying to fetch pages
      const pages = await dataService.getPages();
      console.log('✅ Supabase connection successful!');
      console.log('Pages found:', pages);
      
      // Test contact form submission
      const testSubmission = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Submission',
        message: 'This is a test message to verify Supabase integration.'
      };
      
      const result = await dataService.submitContactForm(testSubmission);
      if (result.success) {
        console.log('✅ Contact form submission test successful!');
      } else {
        console.log('❌ Contact form submission failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Supabase Connection Test</h2>
      <p>This component tests the Supabase integration.</p>
      
      <button 
        onClick={testConnection}
        style={{
          background: '#0066ff',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Test Supabase Connection
      </button>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Make sure you've set up your Supabase project</li>
          <li>Update the environment variables in <code>.env.local</code></li>
          <li>Run the SQL setup script in your Supabase dashboard</li>
          <li>Click the button above to test the connection</li>
          <li>Check the browser console for results</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseTest;
