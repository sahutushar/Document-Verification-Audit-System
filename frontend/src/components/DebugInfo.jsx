import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DebugInfo = () => {
  const [supabaseStatus, setSupabaseStatus] = useState('checking...');
  const [apiStatus, setApiStatus] = useState('checking...');
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  
  useEffect(() => {
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
        } else {
          setSupabaseStatus('Connected');
        }
      } catch (err) {
        setSupabaseStatus(`Failed: ${err.message}`);
      }
    };
    
    // Test API connection
    const testAPI = async () => {
      try {
        const response = await fetch(`${apiUrl}/documents/health`);
        if (response.ok) {
          setApiStatus('Connected');
        } else {
          setApiStatus(`HTTP ${response.status}`);
        }
      } catch (err) {
        setApiStatus(`Failed: ${err.message}`);
      }
    };
    
    testSupabase();
    if (apiUrl) testAPI();
  }, [apiUrl]);
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '8px',
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <div style={{marginBottom: '8px', fontWeight: 'bold'}}>🔍 Debug Info</div>
      <div>API URL: {apiUrl || '❌ NOT SET'}</div>
      <div>API Status: {apiStatus}</div>
      <div>Supabase URL: {supabaseUrl ? '✅ SET' : '❌ NOT SET'}</div>
      <div>Supabase Status: {supabaseStatus}</div>
      <div>Environment: {process.env.NODE_ENV}</div>
    </div>
  );
};

export default DebugInfo;