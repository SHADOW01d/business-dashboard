import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { t } from '../translations';

export default function SettingsPage({ isDarkMode, setIsDarkMode, language, onLanguageChange, isMobile }) {
  const [settings, setSettings] = useState({
    theme: 'auto',
    email_notifications: true,
    sms_notifications: false,
    low_stock_alerts: true,
    daily_report: false,
    currency: 'KES',
    language: language || 'en',
    two_factor_enabled: false,
    session_timeout: 3600,
    items_per_page: 10,
    date_format: 'DD/MM/YYYY',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/my_settings/`, {
        credentials: 'include',
      });
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load settings');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/update_settings/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t(settings.language, 'settingsSaved'));
        // Update theme if changed
        if (settings.theme !== 'auto') {
          setIsDarkMode(settings.theme === 'dark');
        }
        // Update language if changed
        if (settings.language !== language && onLanguageChange) {
          onLanguageChange(settings.language);
        }
      } else {
        setError(data.error || t(settings.language, 'failedToSave'));
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: textColor, fontSize: '18px' }}>{t(settings.language, 'loading')}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={32} color={textColor} />
          <h1 style={{ color: textColor, fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{t(settings.language, 'settings')}</h1>
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
            <span>✓</span>
            {t(settings.language, 'settingsSaved')}
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

        {/* Settings Sections */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Theme Settings */}
          <div style={{
            background: cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{t(settings.language, 'themeSettings')}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>{t(settings.language, 'theme')}</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
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
                  <option value="auto">{t(settings.language, 'themeAuto')}</option>
                  <option value="light">{t(settings.language, 'themeLight')}</option>
                  <option value="dark">{t(settings.language, 'themeDark')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div style={{
            background: cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{t(settings.language, 'notifications')}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={settings.email_notifications}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: textColor }}>{t(settings.language, 'emailNotifications')}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="sms_notifications"
                  checked={settings.sms_notifications}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: textColor }}>{t(settings.language, 'smsNotifications')}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="low_stock_alerts"
                  checked={settings.low_stock_alerts}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: textColor }}>{t(settings.language, 'lowStockAlerts')}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="daily_report"
                  checked={settings.daily_report}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: textColor }}>{t(settings.language, 'dailyReport')}</span>
              </label>
            </div>
          </div>

          {/* Business Settings */}
          <div style={{
            background: cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{t(settings.language, 'businessSettings')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>{t(settings.language, 'currency')}</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
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
                  <option value="KES">KES (Kenyan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>{t(settings.language, 'language')}</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
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
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>{t(settings.language, 'dateFormat')}</label>
                <select
                  name="date_format"
                  value={settings.date_format}
                  onChange={handleChange}
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
                <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>{t(settings.language, 'itemsPerPage')}</label>
                <input
                  type="number"
                  name="items_per_page"
                  value={settings.items_per_page}
                  onChange={handleChange}
                  min="5"
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

          {/* Security Settings */}
          <div style={{
            background: cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ color: textColor, fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{t(settings.language, 'securitySettings')}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="two_factor_enabled"
                  checked={settings.two_factor_enabled}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: textColor }}>{t(settings.language, 'twoFactorAuth')}</span>
              </label>
              <div>
                <label style={{ display: 'block', color: secondaryText, fontSize: '14px', marginBottom: '6px' }}>{t(settings.language, 'sessionTimeout')}</label>
                <input
                  type="number"
                  name="session_timeout"
                  value={settings.session_timeout}
                  onChange={handleChange}
                  min="300"
                  max="86400"
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
                <p style={{ color: secondaryText, fontSize: '12px', marginTop: '6px' }}>Default: 3600 seconds (1 hour)</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
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
            {saving ? t(settings.language, 'saving') : t(settings.language, 'saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
}
