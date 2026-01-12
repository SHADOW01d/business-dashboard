import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard_backup';
import { API_BASE_URL } from './config';
import { getCsrfTokenWithFallback } from './utils/csrf';
import { runFullDebug } from './utils/apiDebug';
import { runAllTests } from './utils/testAPI';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get CSRF token first, then check auth
    getCsrfTokenWithFallback();
    checkAuth();
    
    // Debug: Make debug functions available in console
    if (import.meta.env.DEV || window.location.hostname.includes('onrender.com')) {
      window.runFullDebug = runFullDebug;
      window.runAllTests = runAllTests;
      console.log('🔍 Debug functions available. Run:');
      console.log('  runFullDebug() - Full API debug suite');
      console.log('  runAllTests() - Test all API endpoints');
    }
  }, []);

  const getCsrfToken = async () => {
    try {
      // Make a GET request to trigger CSRF token generation
      await fetch(`${API_BASE_URL}/api/auth/current_user/`, {
        credentials: 'include',
      });
    } catch (error) {
      // Ignore errors, we just want to trigger CSRF token generation
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/current_user/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Not authenticated:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getCsrfTokenFromCookie = () => {
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

  const handleLogout = async () => {
    try {
      const csrfToken = await getCsrfTokenWithFallback();
      await fetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
      });
      // Clear local state
      setUser(null);
      // Clear any local storage
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)' }}>
        <p style={{ color: 'white', fontSize: '18px' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
  }

  return (
    <div style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f5f5f5', minHeight: '100vh' }}>
      <Dashboard 
        user={user} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
    </div>
  );
}