import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, Store, Target, Bell, Shield, Palette, Globe, Smartphone, Download, Trash2, Plus, Edit2, Check, X, TrendingUp, Package, Users, CreditCard, BarChart3, Zap, Clock, Mail, MessageSquare, ArrowLeft, User, Camera } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function SettingsPage({ isDarkMode, setIsDarkMode, language, onLanguageChange, isMobile, onClose }) {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState({
    shopName: '',
    shopLocation: '',
    dailyTarget: 1000000,
    currency: 'KES',
    lowStockThreshold: 10,
    taxRate: 16,
    businessHours: {
      open: '08:00',
      close: '18:00'
    },
    profitMargin: 25,
    maxDiscount: 15
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'auto',
    language: language || 'en',
    compactMode: false,
    showCharts: true,
    itemsPerPage: 10,
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: 'KES'
  });

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: null
  });

  useEffect(() => {
    fetchSettings();
    fetchProfile();
    // Load saved daily target from localStorage
    const savedDailyTarget = localStorage.getItem('dailyTarget');
    if (savedDailyTarget) {
      setBusinessSettings(prev => ({ ...prev, dailyTarget: parseInt(savedDailyTarget) }));
    }
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, but don't fail if it doesn't exist
      const response = await fetch(`${API_BASE_URL}/api/settings/my_settings/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // Update relevant settings from API
        if (data.currency) setBusinessSettings(prev => ({ ...prev, currency: data.currency }));
        if (data.language) setDisplaySettings(prev => ({ ...prev, language: data.language }));
        if (data.theme) setDisplaySettings(prev => ({ ...prev, theme: data.theme }));
      }
    } catch (err) {
      console.log('Settings API not available, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProfileSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.log('Profile API not available, using defaults');
    }
  };

  const handleSaveBusinessSettings = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      // Save daily target to localStorage
      localStorage.setItem('dailyTarget', businessSettings.dailyTarget.toString());
      
      // Save other settings to API if needed
      const response = await fetch(`${API_BASE_URL}/api/settings/update_settings/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          currency: businessSettings.currency,
          language: displaySettings.language,
          theme: displaySettings.theme,
          items_per_page: displaySettings.itemsPerPage,
          date_format: displaySettings.dateFormat
        }),
      });

      if (response.ok) {
        setMessage('Business settings saved successfully!');
        // Update theme if changed
        if (displaySettings.theme !== 'auto') {
          setIsDarkMode(displaySettings.theme === 'dark');
        }
        // Update language if changed
        if (displaySettings.language !== language && onLanguageChange) {
          onLanguageChange(displaySettings.language);
        }
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify(profileSettings),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (theme) => {
    setDisplaySettings(prev => ({ ...prev, theme }));
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else if (theme === 'light') {
      setIsDarkMode(false);
    } else {
      // Auto theme - could implement system preference detection
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  };

  const bgGradient = isDarkMode
    ? 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f0f4f8 0%, #e0d5f0 50%, #f0f4f8 100%)';

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)'
    : 'linear-gradient(135deg, #ffffff, #f5f0ff)';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';
  const inputBorder = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)';

  const tabs = [
    { id: 'business', label: 'Business', icon: Store },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: textColor, fontSize: '18px' }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, padding: isMobile ? '10px' : '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: isMobile ? '100%' : '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <Settings size={isMobile ? 24 : 32} color={textColor} />
            <h1 style={{ color: textColor, fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', margin: 0 }}>Settings</h1>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            color: '#22c55e',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Check size={18} />
            {message}
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: isMobile ? '8px' : '16px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            display: 'flex',
            gap: isMobile ? '4px' : '8px',
            overflowX: 'auto',
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: isMobile ? '12px 8px' : '12px 16px',
                    background: activeTab === tab.id
                      ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                      : 'transparent',
                    border: activeTab === tab.id ? 'none' : `1px solid ${inputBorder}`,
                    borderRadius: '8px',
                    color: activeTab === tab.id ? 'white' : textColor,
                    cursor: 'pointer',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    minWidth: isMobile ? '60px' : 'auto',
                  }}
                >
                  <Icon size={isMobile ? 14 : 16} />
                  {!isMobile && tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}>

          {/* Business Settings Tab */}
          {activeTab === 'business' && (
            <div>
              <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Business Configuration</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Shop Name</label>
                  <input
                    type="text"
                    placeholder="Enter your shop name"
                    value={businessSettings.shopName}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, shopName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Shop Location</label>
                  <input
                    type="text"
                    placeholder="Enter shop location/address"
                    value={businessSettings.shopLocation}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, shopLocation: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Default Currency</label>
                  <select
                    value={businessSettings.currency}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, currency: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  >
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="TZS">TZS - Tanzanian Shilling</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Business Hours</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', color: secondaryText, fontSize: '12px', marginBottom: '4px' }}>Opening Time</label>
                      <input
                        type="time"
                        value={businessSettings.businessHours.open}
                        onChange={(e) => setBusinessSettings(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, open: e.target.value }
                        }))}
                        style={{
                          padding: '10px',
                          background: inputBg,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: '6px',
                          color: textColor,
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: secondaryText, fontSize: '12px', marginBottom: '4px' }}>Closing Time</label>
                      <input
                        type="time"
                        value={businessSettings.businessHours.close}
                        onChange={(e) => setBusinessSettings(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, close: e.target.value }
                        }))}
                        style={{
                          padding: '10px',
                          background: inputBg,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: '6px',
                          color: textColor,
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Tax Rate (%)</label>
                    <input
                      type="number"
                      value={businessSettings.taxRate}
                      onChange={(e) => setBusinessSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: '6px',
                        color: textColor,
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Profit Margin (%)</label>
                    <input
                      type="number"
                      value={businessSettings.profitMargin}
                      onChange={(e) => setBusinessSettings(prev => ({ ...prev, profitMargin: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: '6px',
                        color: textColor,
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div>
              <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Display Preferences</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Language</label>
                  <select
                    value={displaySettings.language}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, language: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Theme</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['auto', 'light', 'dark'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleThemeChange(theme)}
                        style={{
                          padding: '10px',
                          background: displaySettings.theme === theme
                            ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                            : inputBg,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: '6px',
                          color: displaySettings.theme === theme ? 'white' : textColor,
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: displaySettings.theme === theme ? '600' : '400',
                        }}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Date Format</label>
                  <select
                    value={displaySettings.dateFormat}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Items Per Page</label>
                  <select
                    value={displaySettings.itemsPerPage}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, itemsPerPage: parseInt(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  >
                    <option value="5">5 items</option>
                    <option value="10">10 items</option>
                    <option value="25">25 items</option>
                    <option value="50">50 items</option>
                  </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={displaySettings.compactMode}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: textColor }}>Compact Mode (Mobile Only)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={displaySettings.showCharts}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, showCharts: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: textColor }}>Show Charts on Dashboard</span>
                </label>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Profile Information</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                  }}>
                    {profileSettings.profileImage ? (
                      <img
                        src={profileSettings.profileImage}
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <User size={48} color={textColor} />
                    )}
                    <button
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Camera size={18} color="white" />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>First Name</label>
                    <input
                      type="text"
                      value={profileSettings.firstName}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, firstName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: '6px',
                        color: textColor,
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Last Name</label>
                    <input
                      type="text"
                      value={profileSettings.lastName}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, lastName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: '6px',
                        color: textColor,
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={profileSettings.phone}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>Bio</label>
                  <textarea
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: '6px',
                      color: textColor,
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {activeTab !== 'profile' && (
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: `1px solid ${inputBorder}` }}>
              <button
                onClick={handleSaveBusinessSettings}
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}

          {/* Profile Save Button */}
          {activeTab === 'profile' && (
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: `1px solid ${inputBorder}` }}>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  width: isMobile ? '100%' : 'auto',
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Save size={18} />
                {saving ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
