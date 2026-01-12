import React, { useState } from 'react';
import { ShoppingCart, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { getCsrfToken } from '../utils/csrf';
import TwoFactorVerification from '../components/TwoFactorVerification';

export default function AuthPage({ onAuthSuccess, isDarkMode, setIsDarkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get CSRF token using new utility
      const csrfToken = await getCsrfToken();
      
      const endpoint = isLogin ? 'login' : 'register';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Extract user data - handle both response formats
        const userData = data.user || data;
        
        // Check if user has 2FA enabled (for login)
        if (isLogin && response.status === 200) {
          try {
            const twoFAResponse = await fetch(`${API_BASE_URL}/api/auth/2fa/status/`, {
              credentials: 'include',
            });
            
            const twoFAData = await twoFAResponse.json();
            
            if (twoFAData.is_enabled) {
              // Show 2FA verification modal
              setTempUser(userData);
              setShow2FA(true);
              
              // Send verification code
              await fetch(`${API_BASE_URL}/api/auth/2fa/send_code/`, {
                method: 'POST',
                headers: {
                  'X-CSRFToken': csrfToken || '',
                },
                credentials: 'include',
              });
              
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error checking 2FA status:', err);
          }
        }
        
        // No 2FA or registration, login directly
        if (isLogin) {
          onAuthSuccess(userData);
        } else {
          // Registration successful - switch to login
          setIsLogin(true);
          setFormData(prev => ({
            ...prev,
            username: userData.username,
            email: userData.email,
            password: '',
            password_confirm: ''
          }));
          setSuccess('Registration successful! Please login with your new account.');
        }
      } else {
        // Handle different error response formats
        let errorMsg = 'An error occurred';
        if (data.error) {
          errorMsg = data.error;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else {
          // Get first error from validation errors
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMsg = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMsg = firstError;
          }
        }
        setError(errorMsg);
        console.error('Auth error:', data);
      }
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerified = () => {
    setShow2FA(false);
    setTempUser(null);
    onAuthSuccess(tempUser);
  };

  const bgGradient = isDarkMode 
    ? 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f0f4f8 0%, #e0d5f0 50%, #f0f4f8 100%)';

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)'
    : 'linear-gradient(135deg, #ffffff, #f5f0ff)';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';
  const inputBorder = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)';
  const labelColor = isDarkMode ? '#9ca3b8' : '#666';

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input { font-family: inherit; }
        button { cursor: pointer; border: none; }
      `}</style>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)'}`,
          color: textColor,
          padding: '10px 14px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        }}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Logo */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart color="white" size={28} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ProShop</h1>
        </div>
        <p style={{ color: labelColor, fontSize: '16px' }}>Manage your business inventory and sales</p>
      </div>

      {/* Auth Card */}
      <div style={{ background: cardBg, borderRadius: '16px', padding: '40px', border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`, maxWidth: '450px', width: '100%', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.2)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: textColor, marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: labelColor, fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
          {isLogin ? 'Sign in to your account' : 'Join ProShop today'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: isLogin ? '24px' : '16px' }}>
            <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: labelColor,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#a855f7'}
                onMouseLeave={(e) => e.target.style.color = labelColor}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: labelColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#a855f7'}
                  onMouseLeave={(e) => e.target.style.color = labelColor}
                >
                  {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.boxShadow = '0 8px 16px rgba(168, 85, 247, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: labelColor, fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                background: 'none',
                color: '#a855f7',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'underline',
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

{/* 2FA Verification Modal */}
      {show2FA && (
        <TwoFactorVerification
          isDarkMode={isDarkMode}
          onVerified={handle2FAVerified}
          onCancel={() => {
            setShow2FA(false);
            setTempUser(null);
            // Optionally logout by making a logout request
          }}
          email={tempUser?.email}
        />
      )}
    </div>
  );
}
