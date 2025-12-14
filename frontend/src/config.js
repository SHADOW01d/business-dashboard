// API Configuration
// This file determines the backend URL based on the environment

const getBackendURL = () => {
  // Use Vite environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're on ngrok (any ngrok domain)
  if (window.location.hostname.includes('ngrok')) {
    // Always use HTTPS for ngrok
    return 'https://b9c5f2395fe5.ngrok-free.app';
  }
  
  // Check if we're on localhost (development on same machine)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // For mobile or remote access, use the same host as frontend
  // This way if you access from http://192.168.1.100:3000
  // It will automatically use http://192.168.1.100:8000
  return `http://${window.location.hostname}:8000`;
};

export const API_BASE_URL = getBackendURL();

console.log('🔧 Backend URL:', API_BASE_URL);
