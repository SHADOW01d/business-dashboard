import React, { useState } from 'react';
import { Store, MapPin, X, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function WelcomeModal({ isDarkMode, onShopCreated, onClose }) {
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shopName.trim()) {
      setError('Shop name is required');
      return;
    }
    
    if (!shopLocation.trim()) {
      setError('Shop location is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/shops/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
        body: JSON.stringify({
          name: shopName.trim(),
          location: shopLocation.trim(),
        }),
      });

      if (response.ok) {
        const newShop = await response.json();
        onShopCreated(newShop);
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create shop');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCookie = (name) => {
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: isDarkMode ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '480px',
        position: 'relative',
        boxShadow: isDarkMode 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = isDarkMode ? '#374151' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
          }}
        >
          <X size={20} />
        </button>

        {/* Welcome Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
            borderRadius: '20px',
            marginBottom: '20px',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
          }}>
            <Store size={36} color="white" />
          </div>
          <h1 style={{
            color: isDarkMode ? '#ffffff' : '#111827',
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '8px',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Welcome to Your Business Dashboard! 🎉
          </h1>
          <p style={{
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: 0,
            maxWidth: '350px',
          }}>
            Every great business starts with a great location. Let's set up your first shop to begin managing your inventory, sales, and expenses like a pro.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Shop Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: isDarkMode ? '#e5e7eb' : '#374151',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              <Store size={18} style={{ marginRight: '10px', color: '#3b82f6' }} />
              Shop Name
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter your business name"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '12px',
                background: isDarkMode ? '#1f2937' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#111827',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s',
                fontWeight: '500',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Shop Location */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: isDarkMode ? '#e5e7eb' : '#374151',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              <MapPin size={18} style={{ marginRight: '10px', color: '#3b82f6' }} />
              Shop Location
            </label>
            <input
              type="text"
              value={shopLocation}
              onChange={(e) => setShopLocation(e.target.value)}
              placeholder="Enter your shop location (e.g., Downtown Mall, Main Street)"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '12px',
                background: isDarkMode ? '#1f2937' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#111827',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s',
                fontWeight: '500',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              padding: '18px 24px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: loading ? 0.8 : 1,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                Creating Your Shop...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={20} />
                Create My First Shop 🚀
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
