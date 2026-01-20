import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend server is not running on', API_BASE_URL);
    } else if (error.message === 'Network Error') {
      console.error('❌ Network Error - Check CORS configuration');
    } else if (error.message.includes('fetch')) {
      console.error('❌ Fetch Error - Possible CORS or network issue');
    }
    
    return Promise.reject(error);
  }
);

// Upload document
export const uploadDocument = async (formData) => {
  try {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Verify document
export const verifyDocument = async (formData) => {
  try {
    const response = await api.post('/documents/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Verify failed:', error);
    throw error;
  }
};

// Get audit logs
export const getAuditLogs = async () => {
  try {
    const response = await api.get('/documents/audit-logs');
    // Ensure we return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    // Return empty array on error to prevent crashes
    return [];
  }
};

// Test API connectivity
export const testConnection = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_BASE_URL);
    const response = await api.get('/documents/health');
    console.log('✅ API Connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API Connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

export default api;