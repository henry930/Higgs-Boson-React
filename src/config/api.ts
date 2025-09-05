// Centralized API configuration - All APIs now unified under us-east-1
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod',
  CALENDAR_API_URL: import.meta.env.VITE_CALENDAR_API_URL || 'https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod',
  DJANGO_BASE_URL: import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://localhost:8000/api/legacy',
  STATIC_MODE: import.meta.env.VITE_MODE === 'static'
};

console.log('🔧 API_CONFIG.BASE_URL (Lambda):', API_CONFIG.BASE_URL);
console.log('🔧 API_CONFIG.CALENDAR_API_URL (Calendar Lambda):', API_CONFIG.CALENDAR_API_URL);
console.log('🔧 API_CONFIG.DJANGO_BASE_URL (Django):', API_CONFIG.DJANGO_BASE_URL);
console.log('🔧 API_CONFIG.STATIC_MODE:', API_CONFIG.STATIC_MODE);
