// CSRF Token Management Utilities

// Function to get CSRF token from browser cookies
export const getCsrfTokenFromCookie = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Function to get CSRF token from backend API
export const getCsrfToken = async () => {
  try {
    // First try to get from cookie
    const token = getCsrfTokenFromCookie();
    if (token) {
      console.log('✅ CSRF token found in cookie:', token.substring(0, 10) + '...');
      return token;
    }
    
    console.log('🔄 CSRF token not in cookie, fetching from backend...');
    
    // If not in cookie, fetch from backend
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/csrf/`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CSRF token fetched from backend:', data.csrfToken?.substring(0, 10) + '...');
      return data.csrfToken;
    } else {
      console.error('❌ Failed to fetch CSRF token:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error getting CSRF token:', error);
  }
  return null;
};

// Function to get CSRF token with fallback for development
export const getCsrfTokenWithFallback = async () => {
  try {
    // Try to get from API first
    const token = await getCsrfToken();
    if (token) return token;
    
    // Fallback: try to trigger CSRF token generation
    console.log('🔄 Attempting to trigger CSRF token generation...');
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Try again after triggering
    const fallbackToken = getCsrfTokenFromCookie();
    if (fallbackToken) {
      console.log('✅ CSRF token found after fallback:', fallbackToken.substring(0, 10) + '...');
      return fallbackToken;
    }
  } catch (error) {
    console.error('❌ All CSRF token methods failed:', error);
  }
  
  return null;
};

// Function to add CSRF headers to fetch options
export const addCsrfHeaders = (options = {}) => {
  const token = getCsrfTokenFromCookie();
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'X-CSRFToken': token }),
      ...options.headers,
    },
    credentials: 'include',
    ...options.credentials && { credentials: options.credentials },
  };
};
