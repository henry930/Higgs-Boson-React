import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DynamicPage from './DynamicPage/DynamicPage';

const RouteHandler: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Reserved routes that should be handled by static components
  const staticRoutes = ['about', 'services', 'contact', 'admin'];
  
  if (slug && staticRoutes.includes(slug.toLowerCase())) {
    // Redirect to 404 which will trigger the catch-all and let static routes handle it
    return <Navigate to="/404" replace />;
  }

  // For all other slugs, use the DynamicPage component
  return <DynamicPage />;
};

export default RouteHandler;
