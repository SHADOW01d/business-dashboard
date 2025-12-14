import React, { useState, useEffect } from 'react';
import { Shield, Mail, Phone, Key, Copy, Check, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function TwoFactorSettings({ isDarkMode, user }) {
  const [twofa, setTwofa] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [method, setMethod] = useState('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  useEffect(() => {
    fetchTwoFAStatus();
  }, []);

  const fetchTwoFAStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/2fa/status/`, {
        credentials: 'include',
      });
      const data = await response.json();
      setTwofa(data);
      setIsEnabled(data.is_enabled);
      setMethod(data.method);
      setPhoneNumber(data.phone_number || '');
    } catch (err) {
      console.error('Error fetching 2FA status:', err);
      setMessage('❌ Error loading 2FA settings');
      setMessageType('error');
    }
  };

  const handleEnable = async () => {
    if (method === 'sms' && !phoneNumber.trim()) {
      setMessage('❌ Phone number required for SMS method');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/2fa/enable/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          method,
          phone_number: phoneNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBackupCodes(data.backup_codes);
        setShowBackupCodes(true);
        setMessage('✅ 2FA enabled! Save your backup codes');
        setMessageType('success');
        setIsEnabled(true);
        fetchTwoFAStatus();
      } else {
        setMessage(`❌ ${data.error || 'Error enabling 2FA'}`);
        setMessageType('error');
      }
    } catch (err) {
      setMessage('❌ Error enabling 2FA');
      setMessageType('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!window.confirm('⚠️ Are you sure? This will disable 2FA on your account.')) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/2fa/disable/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1] || '',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('✅ 2FA disabled');
        setMessageType('success');
        setIsEnabled(false);
        setShowBackupCodes(false);
        fetchTwoFAStatus();
      } else {
        setMessage('❌ Error disabling 2FA');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('❌ Error disabling 2FA');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    const text = backupCodes.join('\n');
    navigator.clipboard.writeText(text);
    setMessage('✅ Backup codes copied to clipboard');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'backup_codes.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setMessage('✅ Backup codes downloaded');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const bgColor = isDarkMode ? '#1a1a3f' : '#ffffff';
  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '600px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Shield size={28} color="#8b5cf6" />
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: textColor, margin: 0 }}>
          🔐 Two-Factor Authentication
        </h2>
      </div>

      {/* Message Alert */}
      {message && (
        <div style={{
          background: messageType === 'success' 
            ? 'rgba(34, 197, 94, 0.1)' 
            : messageType === 'error'
            ? 'rgba(239, 68, 68, 0.1)'
            : 'rgba(139, 92, 246, 0.1)',
          border: `1px solid ${
            messageType === 'success'
            ? 'rgba(34, 197, 94, 0.3)'
            : messageType === 'error'
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(139, 92, 246, 0.3)'
          }`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '14px',
          color: messageType === 'success'
            ? '#22c55e'
            : messageType === 'error'
            ? '#ef4444'
            : textColor,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={16} />
          {message}
        </div>
      )}

      {/* Status Card */}
      <div style={{
        background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(139, 92, 246, 0.05)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '14px', color: textColor, margin: '0 0 12px 0' }}>
          <strong>Status:</strong> {isEnabled ? '✅ Enabled' : '❌ Disabled'}
        </p>
        {isEnabled && (
          <>
            <p style={{ fontSize: '14px', color: textColor, margin: '0 0 8px 0' }}>
              <strong>Method:</strong> {
                method === 'email' ? '📧 Email' : 
                method === 'sms' ? '📱 SMS' : 
                '🔑 Authenticator App'
              }
            </p>
            {method === 'sms' && phoneNumber && (
              <p style={{ fontSize: '14px', color: textColor, margin: '0' }}>
                <strong>Phone:</strong> {phoneNumber}
              </p>
            )}
          </>
        )}
      </div>

      {/* Settings Form */}
      {!isEnabled ? (
        <div>
          {/* Method Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: textColor, display: 'block', marginBottom: '8px' }}>
              Choose Verification Method:
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="email">📧 Email - Receive codes via email</option>
              <option value="sms">📱 SMS - Receive codes via text message</option>
              <option value="authenticator">🔑 Authenticator App - Use Google/Microsoft Authenticator</option>
            </select>
          </div>

          {/* Phone Number Input (for SMS) */}
          {method === 'sms' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: textColor, display: 'block', marginBottom: '8px' }}>
                Phone Number:
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: inputBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Info Message */}
          <div style={{
            background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            fontSize: '12px',
            color: textColor,
          }}>
            <strong>ℹ️ Note:</strong> You'll receive a 6-digit code to verify your identity when logging in.
          </div>

          {/* Enable Button */}
          <button
            onClick={handleEnable}
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? '⏳ Enabling...' : '✅ Enable 2FA'}
          </button>
        </div>
      ) : (
        /* Disable Button */
        <button
          onClick={handleDisable}
          disabled={loading}
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '12px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = 'rgba(239, 68, 68, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
            }
          }}
        >
          {loading ? '⏳ Disabling...' : '❌ Disable 2FA'}
        </button>
      )}

      {/* Backup Codes Section */}
      {showBackupCodes && backupCodes.length > 0 && (
        <div style={{
          marginTop: '20px',
          background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e', margin: '0 0 12px 0' }}>
            ⚠️ Save Your Backup Codes
          </h3>
          <p style={{ fontSize: '12px', color: textColor, margin: '0 0 12px 0' }}>
            Save these codes in a safe place. You can use them to access your account if you lose access to your 2FA device.
          </p>
          
          {/* Codes Display */}
          <div style={{
            background: inputBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '12px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: textColor,
            maxHeight: '200px',
            overflow: 'auto',
          }}>
            {backupCodes.map((code, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>
                {idx + 1}. {code}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={copyBackupCodes}
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.2)'}
            >
              <Copy size={14} /> Copy
            </button>
            <button
              onClick={downloadBackupCodes}
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.2)'}
            >
              <Check size={14} /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
