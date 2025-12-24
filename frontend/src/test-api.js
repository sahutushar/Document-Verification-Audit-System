// Test API connection
const testAPI = async () => {
  try {
    const response = await fetch('https://document-verification-audit-system-2.onrender.com/api/documents/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection Success:', data);
    } else {
      console.error('❌ API Response Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
};

// Run test
testAPI();