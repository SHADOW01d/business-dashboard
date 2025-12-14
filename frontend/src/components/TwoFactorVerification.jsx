import React, { useState, useRef, useEffect } from 'react';
import { Shield, AlertCircle, Loader } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function TwoFactorVerification({ isDarkMode, onVerified, onCancel, email }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/2fa/verify_code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (response.ok) {
        onVerified();
      } else {
        setAttempts(attempts + 1);
        if (attempts >= 4) {
          setError('❌ Too many failed attempts. Please try again later.');
        } else {
          setError(data.error || 'Invalid code. Please try again.');
        }
        setCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (err) {
      setError('❌ Error verifying code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDarkMode ? '#1a1a3f' : '#ffffff';
  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)',
    }}>
      <form
        onSubmit={handleVerify}
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          padding: '32px',
          width: '90%',
          maxWidth: '420px',
          boxShadow: isDarkMode
            ? '0 20px 60px rgba(0, 0, 0, 0.5)'
            : '0 20px 60px rgba(139, 92, 246, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Shield size={32} color="#8b5cf6" />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: textColor, margin: '0 0 4px 0' }}>
              Verify Your Identity
            </h2>
            <p style={{ fontSize: '12px', color: isDarkMode ? '#9ca3b8' : '#666', margin: 0 }}>
              Two-factor authentication
            </p>
          </div>
        </div>

        {/* Instructions */}
        <p style={{ fontSize: '14px', color: textColor, marginBottom: '20px', lineHeight: '1.5' }}>
          Enter the 6-digit code from your authenticator app or email:
        </p>

        {/* Code Input */}
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="000000"
          maxLength="6"
          disabled={loading || attempts >= 5}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '32px',
            textAlign: 'center',
            letterSpacing: '12px',
            background: inputBg,
            border: error ? '2px solid #ef4444' : `2px solid ${borderColor}`,
            borderRadius: '8px',
            color: textColor,
            boxSizing: 'border-box',
            marginBottom: '16px',
            fontWeight: '600',
            fontFamily: 'monospace',
            transition: 'all 0.2s',
            opacity: loading || attempts >= 5 ? 0.6 : 1,
            cursor: loading || attempts >= 5 ? 'not-allowed' : 'text',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && code.length === 6 && !loading) {
              handleVerify(e);
            }
          }}
        />

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            color: '#ef4444',
            fontSize: '13px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div>{error}</div>
              {attempts >= 5 && (
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Please try again in a few minutes or use a backup code.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attempts Counter */}
        {attempts > 0 && attempts < 5 && (
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? '#9ca3b8' : '#666',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            Attempts remaining: {5 - attempts}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
              color: textColor,
              border: `1px solid ${borderColor}`,
              padding: '12px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = isDarkMode
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'rgba(139, 92, 246, 0.12)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = isDarkMode
                  ? 'rgba(139, 92, 246, 0.1)'
                  : 'rgba(139, 92, 246, 0.08)';
              }
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || code.length !== 6 || attempts >= 5}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: loading || code.length !== 6 || attempts >= 5 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading || code.length !== 6 || attempts >= 5 ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading && code.length === 6 && attempts < 5) {
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && code.length === 6 && attempts < 5) {
                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Verifying...
              </>
            ) : (
              '✅ Verify'
            )}
          </button>
        </div>

        {/* Help Text */}
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: isDarkMode ? '#9ca3b8' : '#666',
          textAlign: 'center',
          lineHeight: '1.4',
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            💡 Don't have your device? Use a backup code instead.
          </p>
          <p style={{ margin: 0 }}>
            Code expires in 10 minutes
          </p>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
