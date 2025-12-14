import React, { useState } from 'react';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function StockForm({ onClose, onStockAdded, isDarkMode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity_in_stock: '',
    min_stock_level: '10',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.category || !formData.price || formData.quantity_in_stock === '') {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    if (parseInt(formData.quantity_in_stock) < 0) {
      setError('Quantity in stock cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/stocks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category.trim(),
          price: parseFloat(formData.price),
          quantity_in_stock: parseInt(formData.quantity_in_stock),
          min_stock_level: parseInt(formData.min_stock_level),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onStockAdded(data);
        setFormData({ name: '', category: '', price: '', quantity_in_stock: '', min_stock_level: '10' });
      } else {
        // Handle different error response formats
        if (typeof data === 'object') {
          const errorMsg = data.detail || data.error || Object.values(data)[0] || 'Failed to add stock';
          setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } else {
          setError('Failed to add stock');
        }
        console.error('Stock creation error:', data);
      }
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
      console.error('Stock creation network error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';
  const inputBorder = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)';
  const labelColor = isDarkMode ? '#9ca3b8' : '#666';

  return (
    <div style={{
      background: cardBg,
      borderRadius: '16px',
      padding: '32px',
      border: `2px solid rgba(139, 92, 246, 0.5)`,
      marginBottom: '32px',
      maxWidth: '600px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: textColor, margin: 0 }}>Add New Stock</h3>
        <button
          onClick={onClose}
          style={{ background: 'none', color: labelColor, cursor: 'pointer', fontSize: '24px' }}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Shirts, Pants, Shoes"
            style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Clothing, Footwear, Accessories"
            style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Quantity in Stock (Available in Shop)</label>
          <input
            type="number"
            name="quantity_in_stock"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
          />
          <p style={{ color: labelColor, fontSize: '11px', marginTop: '4px', margin: 0 }}>How many units do you have in stock right now?</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: labelColor, fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Min Stock Level (Alert Threshold)</label>
          <input
            type="number"
            name="min_stock_level"
            value={formData.min_stock_level}
            onChange={handleChange}
            placeholder="10"
            min="1"
            style={{ width: '100%', padding: '10px 12px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '8px', color: textColor, outline: 'none', fontSize: '14px' }}
          />
          <p style={{ color: labelColor, fontSize: '11px', marginTop: '4px', margin: 0 }}>You'll get alerts when stock falls below this level</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: isDarkMode ? '#475569' : '#e5e7eb',
              color: textColor,
              padding: '10px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Adding...' : 'Add Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}
