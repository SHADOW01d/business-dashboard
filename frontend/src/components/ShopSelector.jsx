import React, { useState, useEffect } from 'react';
import { Store, Plus, Check, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ShopSelector({ isDarkMode, onShopChange, isMobile }) {
  const [shops, setShops] = useState([]);
  const [activeShop, setActiveShop] = useState(null);
  const [showCreateShop, setShowCreateShop] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopLocation, setNewShopLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchShops = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shops/`, {
        credentials: 'include',
      });
      const data = await response.json();
      const shopsArray = Array.isArray(data) ? data : data.results || [];
      setShops(shopsArray);
      
      // Get active shop
      const active = shopsArray.find(shop => shop.is_active);
      if (active) {
        setActiveShop(active);
        onShopChange(active);
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
    }
  };

  useEffect(() => {
    fetchShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!newShopName.trim()) {
      setError('Shop name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/shops/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newShopName.trim(),
          location: newShopLocation.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewShopName('');
        setNewShopLocation('');
        setError('');
        setShowCreateShop(false);
        fetchShops();
      } else {
        // Handle error response
        if (data.name) {
          setError(Array.isArray(data.name) ? data.name[0] : data.name);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Failed to create shop. Please try again.');
        }
        console.error('Error creating shop:', data);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error creating shop:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShop = async (shop) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shops/${shop.id}/set_active/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        setActiveShop(shop);
        onShopChange(shop);
        setShowDropdown(false);
        fetchShops();
      }
    } catch (err) {
      console.error('Error selecting shop:', err);
    }
  };

  const bgColor = isDarkMode ? 'rgba(26, 26, 63, 0.8)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';

  return (
    <div style={{
      background: bgColor,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '10px 16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(139, 92, 246, 0.1)',
    }}>
      {/* Left: Shop Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <Store size={18} color="#8b5cf6" style={{ flexShrink: 0 }} />
        
        {activeShop ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: textColor,
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.3))';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))';
                e.target.style.boxShadow = 'none';
              }}
            >
              {activeShop.name}
              <ChevronDown size={14} style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && shops.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '6px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                boxShadow: isDarkMode 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 12px 40px rgba(139, 92, 246, 0.15)',
                zIndex: 1000,
                minWidth: '180px',
                backdropFilter: 'blur(10px)',
              }}>
                {shops.map((shop, idx) => (
                  <button
                    key={shop.id}
                    onClick={() => handleSelectShop(shop)}
                    style={{
                      width: '100%',
                      background: shop.is_active ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' : 'transparent',
                      color: shop.is_active ? 'white' : textColor,
                      border: 'none',
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      borderBottom: idx < shops.length - 1 ? `1px solid ${borderColor}` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!shop.is_active) {
                        e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!shop.is_active) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: isDarkMode ? '#ffffff' : '#111827' }}>
                        {shop.name}
                      </span>
                      <span style={{ fontSize: '11px', color: isDarkMode ? '#9ca3af' : '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {shop.location}
                      </span>
                    </div>
                    {shop.is_active && <Check size={14} style={{ color: '#10b981' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span style={{ fontSize: '13px', color: secondaryText }}>No shop selected</span>
        )}
      </div>

      {/* Right: Add Shop Button */}
      <button
        onClick={() => setShowCreateShop(!showCreateShop)}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          color: 'white',
          border: 'none',
          padding: '7px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.3s ease',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        <Plus size={14} /> Add
      </button>

      {/* Create Shop Modal */}
      {showCreateShop && (
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
          zIndex: 2000,
          backdropFilter: 'blur(4px)',
        }} onClick={() => setShowCreateShop(false)}>
          <form 
            onSubmit={handleCreateShop} 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '400px',
              boxShadow: isDarkMode 
                ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
                : '0 20px 60px rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: textColor, margin: '0 0 16px 0' }}>
              ✨ Create New Shop
            </h3>
            
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '10px 12px',
                borderRadius: '6px',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: '500',
              }}>
                {error}
              </div>
            )}
            
            <input
              type="text"
              placeholder="Shop name (e.g., Downtown Store)"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '12px',
                background: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = borderColor}
            />
            
            <input
              type="text"
              placeholder="Location (optional)"
              value={newShopLocation}
              onChange={(e) => setNewShopLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '16px',
                background: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = borderColor}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCreateShop(false)}
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? '⏳ Creating...' : '✨ Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
