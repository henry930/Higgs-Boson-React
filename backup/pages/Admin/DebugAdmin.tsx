
import { Routes, Route, Link, useLocation } from 'react-router-dom';

const DebugAdmin = () => {
  const location = useLocation();
  console.log('DebugAdmin rendering, location:', location);
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Debug Admin Panel</h1>
      <p>Current path: {location.pathname}</p>
      
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/admin" style={{ marginRight: '20px', padding: '10px', background: 'blue', color: 'white', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link to="/admin/pages" style={{ marginRight: '20px', padding: '10px', background: 'green', color: 'white', textDecoration: 'none' }}>
          Manage Pages
        </Link>
        <Link to="/admin/create-article" style={{ padding: '10px', background: 'purple', color: 'white', textDecoration: 'none' }}>
          Create Article
        </Link>
      </nav>

      <div style={{ background: 'white', padding: '20px', border: '1px solid #ccc' }}>
        <Routes>
          <Route path="/" element={<DebugDashboard />} />
          <Route path="/pages" element={<div>Pages Manager would go here</div>} />
          <Route path="/create-article" element={<div>Page Editor would go here</div>} />
        </Routes>
      </div>
    </div>
  );
};

const DebugDashboard = () => {
  console.log('DebugDashboard rendering');
  
  return (
    <div>
      <h2>Welcome to Your Article Creation System!</h2>
      <p>This is the debug dashboard</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Link to="/admin/create-article" style={{ padding: '20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Create New Article
        </Link>
        
        <Link to="/admin/pages" style={{ padding: '20px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Manage Pages
        </Link>
      </div>
    </div>
  );
};

export default DebugAdmin;
