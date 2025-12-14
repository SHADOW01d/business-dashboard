import React, { useState } from 'react';
import { User, Lock, Shield, LogOut, ChevronLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';
import TwoFactorSettings from '../components/TwoFactorSettings';

export default function UserProfile({ isDarkMode, user, onLogout, onBack }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error'
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const bgColor = isDarkMode ? '#1a1a3f' : '#ffffff';
  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';
  const tabBg = isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)';
  const activeTabBg = 'linear-gradient(135deg, #8b5cf6, #a855f7)';

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Note: This endpoint would need to be created in the backend
      // For now, we'll show a placeholder message
      setMessage('✅ Profile update feature coming soon');
      setMessageType('success');
    } catch (err) {
      setMessage('❌ Error updating profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('❌ Passwords do not match');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      // Note: This endpoint would need to be created in the backend
      // For now, we'll show a placeholder message
      setMessage('✅ Password change feature coming soon');
      setMessageType('success');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      setMessage('❌ Error changing password');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f0f4f8 0%, #e0d5f0 50%, #f0f4f8 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={onBack}
          style={{
            background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
            border: `1px solid ${borderColor}`,
            color: textColor,
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)';
          }}
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: textColor, margin: 0 }}>
          👤 User Settings
        </h1>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: '24px',
      }}>
        {/* Sidebar */}
        <div style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          padding: '16px',
          height: 'fit-content',
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              width: '100%',
              background: activeTab === 'profile' ? activeTabBg : tabBg,
              color: activeTab === 'profile' ? 'white' : textColor,
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              transition: 'all 0.2s',
            }}
          >
            <User size={16} /> Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={{
              width: '100%',
              background: activeTab === 'security' ? activeTabBg : tabBg,
              color: activeTab === 'security' ? 'white' : textColor,
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Lock size={16} /> Security
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            style={{
              width: '100%',
              background: activeTab === '2fa' ? activeTabBg : tabBg,
              color: activeTab === '2fa' ? 'white' : textColor,
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Shield size={16} /> 2FA
          </button>
          <div style={{ borderTop: `1px solid ${borderColor}`, marginTop: '16px', paddingTop: '16px' }}>
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          padding: '24px',
        }}>
          {/* Message Alert */}
          {message && (
            <div style={{
              background: messageType === 'success'
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${
                messageType === 'success'
                  ? 'rgba(34, 197, 94, 0.3)'
                  : 'rgba(239, 68, 68, 0.3)'
              }`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px',
              color: messageType === 'success' ? '#22c55e' : '#ef4444',
            }}>
              {message}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: textColor, marginBottom: '24px', margin: '0 0 24px 0' }}>
                📋 Profile Information
              </h2>

              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: secondaryText, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: inputBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        color: textColor,
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: secondaryText, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: inputBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        color: textColor,
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: inputBg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      color: textColor,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
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
                  {loading ? '⏳ Updating...' : '💾 Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: textColor, marginBottom: '24px', margin: '0 0 24px 0' }}>
                🔒 Change Password
              </h2>

              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        paddingRight: '40px',
                        background: inputBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        color: textColor,
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: secondaryText,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        paddingRight: '40px',
                        background: inputBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        color: textColor,
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: secondaryText,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        paddingRight: '40px',
                        background: inputBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        color: textColor,
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: secondaryText,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
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
                  {loading ? '⏳ Updating...' : '🔐 Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* 2FA Tab */}
          {activeTab === '2fa' && (
            <div>
              <TwoFactorSettings isDarkMode={isDarkMode} user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
