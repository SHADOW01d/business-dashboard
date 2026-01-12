// API Debugging Utilities

import { API_BASE_URL } from '../config';

// Debug function to check API configuration
export const debugApiConfig = () => {
  console.group('🔍 API Configuration Debug');
  console.log('📍 API_BASE_URL:', API_BASE_URL);
  console.log('📍 VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('📍 Current hostname:', window.location.hostname);
  console.log('📍 Current origin:', window.location.origin);
  console.log('📍 Is onrender.com:', window.location.hostname.includes('onrender.com'));
  console.log('📍 Is localhost:', window.location.hostname === 'localhost');
  console.groupEnd();
};

// Debug function to check cookies
export const debugCookies = () => {
  console.group('🍪 Cookie Debug');
  console.log('📄 All cookies:', document.cookie);
  
  // Check for specific cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});
  
  console.log('🔐 Session ID:', cookies.sessionid || 'Not found');
  console.log('🛡️ CSRF Token:', cookies.csrftoken ? `${cookies.csrftoken.substring(0, 10)}...` : 'Not found');
  console.log('🔑 Message cookies:', Object.keys(cookies).filter(key => key.includes('message')));
  console.groupEnd();
};

// Test basic API connectivity
export const testApiConnectivity = async () => {
  console.group('🌐 API Connectivity Test');
  
  try {
    console.log('📡 Testing GET request to current_user endpoint...');
    const response = await fetch(`${API_BASE_URL}/api/auth/current_user/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('✅ Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Response data:', data);
      console.log('👤 User authenticated:', !!data.username);
    } else {
      console.log('❌ Response not OK:', response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.log('📄 Error data:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
  
  console.groupEnd();
};

// Test CSRF token endpoint
export const testCsrfEndpoint = async () => {
  console.group('🛡️ CSRF Endpoint Test');
  
  try {
    console.log('📡 Testing CSRF token endpoint...');
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('✅ Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('🔐 CSRF token response:', data);
      console.log('🔑 CSRF token:', data.csrfToken ? `${data.csrfToken.substring(0, 10)}...` : 'Not found');
    } else {
      console.log('❌ CSRF endpoint failed:', response.statusText);
    }
  } catch (error) {
    console.error('❌ CSRF endpoint error:', error);
  }
  
  console.groupEnd();
};

// Test POST request with CSRF
export const testPostRequest = async () => {
  console.group('📤 POST Request Test');
  
  try {
    // First get CSRF token
    const csrfResponse = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
      credentials: 'include',
    });
    
    if (!csrfResponse.ok) {
      console.log('❌ Could not get CSRF token');
      return;
    }
    
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;
    
    console.log('🔐 Using CSRF token:', csrfToken ? `${csrfToken.substring(0, 10)}...` : 'None');
    
    // Test a simple POST request (login with dummy data)
    console.log('📡 Testing POST request...');
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: 'test',
        password: 'test',
      }),
    });
    
    console.log('✅ POST response status:', response.status);
    console.log('📋 POST response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📊 POST response data:', data);
    
  } catch (error) {
    console.error('❌ POST request error:', error);
  }
  
  console.groupEnd();
};

// Run all debug tests
export const runFullDebug = async () => {
  console.log('🚀 Starting Full API Debug Suite');
  console.log('=====================================');
  
  debugApiConfig();
  debugCookies();
  await testApiConnectivity();
  await testCsrfEndpoint();
  await testPostRequest();
  
  console.log('=====================================');
  console.log('✅ Debug suite complete');
};

// Auto-run debug in development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode detected. Run runFullDebug() to test API connectivity.');
}
