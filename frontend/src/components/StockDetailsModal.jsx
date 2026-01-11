import React, { useState } from 'react';
import { X, Package, TrendingDown, TrendingUp, Save, Edit2 } from 'lucide-react';

export default function StockDetailsModal({ stock, onClose, isDarkMode, isMobile, onStockUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(stock.price);
  const [editedStock, setEditedStock] = useState(stock.quantity_in_stock);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)'
    : 'linear-gradient(135deg, #ffffff, #f5f0ff)';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)';
  const overlayBg = isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)';

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventory/stocks/${stock.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: parseFloat(editedPrice),
          quantity_in_stock: parseInt(editedStock)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update stock');
      }
      
      const updatedStock = await response.json();
      onStockUpdated && onStockUpdated(updatedStock);
      setIsEditing(false);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedPrice(stock.price);
    setEditedStock(stock.quantity_in_stock);
    setIsEditing(false);
    setError('');
  };

  const totalUnits = isEditing ? parseInt(editedStock) + stock.quantity_sold : stock.quantity_in_stock + stock.quantity_sold;
  const percentageSold = totalUnits > 0 ? ((stock.quantity_sold / totalUnits) * 100).toFixed(1) : 0;
  const percentageRemaining = totalUnits > 0 ? ((isEditing ? parseInt(editedStock) : stock.quantity_in_stock) / totalUnits * 100).toFixed(1) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: overlayBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: cardBg,
        borderRadius: '16px',
        padding: '32px',
        border: `1px solid ${borderColor}`,
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: textColor, margin: 0, marginBottom: '8px' }}>
              {stock.name}
            </h2>
            <p style={{ fontSize: '14px', color: secondaryText, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} /> {stock.category}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                <Edit2 size={16} /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    background: loading ? 'rgba(16, 185, 129, 0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  <Save size={16} /> {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    background: isDarkMode ? '#475569' : '#e5e7eb',
                    color: textColor,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                color: secondaryText,
                cursor: 'pointer',
                fontSize: '28px',
                border: 'none',
                padding: 0,
              }}
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div style={{
          background: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          border: `1px solid ${borderColor}`,
        }}>
          <p style={{ fontSize: '12px', color: secondaryText, margin: 0, marginBottom: '8px' }}>Price per Unit</p>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'white',
                  border: `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                  outline: 'none',
                  width: '150px'
                }}
              />
              <span style={{ color: textColor, fontSize: '16px' }}>RWF</span>
            </div>
          ) : (
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
              {stock.price.toLocaleString()}
            </p>
          )}
        </div>

        {/* Units Overview */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} /> Units Overview
          </h3>

          {/* Total Units Card */}
          <div style={{
            background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: `1px solid ${borderColor}`,
          }}>
            <p style={{ fontSize: '12px', color: secondaryText, margin: 0, marginBottom: '4px' }}>Total Units</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
              {totalUnits}
            </p>
          </div>

          {/* Remaining Units Card */}
          <div style={{
            background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '12px', color: secondaryText, margin: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} color="#10b981" /> Available in Stock
                </p>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      value={editedStock}
                      onChange={(e) => setEditedStock(parseInt(e.target.value) || 0)}
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#10b981',
                        background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'white',
                        border: `2px solid ${borderColor}`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        outline: 'none',
                        width: '120px'
                      }}
                    />
                    <span style={{ color: textColor, fontSize: '14px' }}>units</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                    {stock.quantity_in_stock}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: secondaryText, margin: 0 }}>Percentage</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                  {percentageRemaining}%
                </p>
              </div>
            </div>
            <div style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              height: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #10b981, #059669)',
                height: '100%',
                width: `${percentageRemaining}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          {/* Sold Units Card */}
          <div style={{
            background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '12px', color: secondaryText, margin: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingDown size={16} color="#ef4444" /> Already Sold
                </p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>
                  {stock.quantity_sold}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: secondaryText, margin: 0 }}>Percentage</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>
                  {percentageSold}%
                </p>
              </div>
            </div>
            <div style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              height: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                height: '100%',
                width: `${percentageSold}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{
            background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${borderColor}`,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', color: secondaryText, margin: 0, marginBottom: '8px' }}>Min Stock Level</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: textColor, margin: 0 }}>
              {stock.min_stock_level}
            </p>
          </div>

          <div style={{
            background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${borderColor}`,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', color: secondaryText, margin: 0, marginBottom: '8px' }}>Status</p>
            <p style={{
              fontSize: '14px',
              fontWeight: 'bold',
              margin: 0,
              color: stock.quantity_in_stock < stock.min_stock_level ? '#ef4444' : '#10b981',
            }}>
              {stock.quantity_in_stock < stock.min_stock_level ? '⚠️ Low Stock' : '✅ In Stock'}
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            width: '100%',
            background: isEditing ? 'rgba(139, 92, 246, 0.3)' : 'linear-gradient(135deg, #a855f7, #9333ea)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            border: 'none',
            cursor: loading || isEditing ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {isEditing ? 'Finish Editing First' : 'Close Details'}
        </button>
      </div>
    </div>
  );
}
