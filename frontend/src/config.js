// API Configuration
// This file determines the backend URL based on the environment

const getBackendURL = () => {
  // Use Vite environment variable if available (production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're on ngrok (development)
  if (window.location.hostname.includes('ngrok')) {
    // Always use HTTPS for ngrok
    return 'https://b9c5f2395fe5.ngrok-free.app';
  }
  
  // Check if we're on localhost (development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // For production (Render), use the production backend
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://business-dashboard-1backend.onrender.com';
  }
  
  // For local network development
  return `http://${window.location.hostname}:8000`;
};

export const API_BASE_URL = getBackendURL();

console.log('🔧 Backend URL:', API_BASE_URL);
