// Test file to debug the calendar API fetch issue
console.log('🚀 Testing Calendar API...');

const API_URL = 'https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod';
const testDate = new Date().toISOString().split('T')[0];

console.log('📅 Test date:', testDate);
console.log('🔗 API URL:', `${API_URL}/api/google-calendar/live-availability?date=${testDate}`);

// Test fetch
fetch(`${API_URL}/api/google-calendar/live-availability?date=${testDate}`)
  .then(response => {
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', [...response.headers.entries()]);
    return response.json();
  })
  .then(data => {
    console.log('✅ Response data:', data);
  })
  .catch(error => {
    console.error('❌ Fetch error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
  });
