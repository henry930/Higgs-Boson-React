// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://yp5h5o5ma4.execute-api.us-east-1.amazonaws.com/prod',
  STATIC_MODE: import.meta.env.VITE_MODE === 'static'
};

console.log('🔧 API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
console.log('🔧 API_CONFIG.STATIC_MODE:', API_CONFIG.STATIC_MODE);
