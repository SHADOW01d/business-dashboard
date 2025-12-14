import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function IncomingStockForm({ stock, onClose, onStockUpdated, isDarkMode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [incomingQuantity, setIncomingQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!incomingQuantity || parseInt(incomingQuantity) <= 0) {
      setError('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    try {
      const newQuantity = stock.quantity_in_stock + parseInt(incomingQuantity);
      
      const response = await fetch(`${API_BASE_URL}/api/stocks/${stock.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: stock.name,
          category: stock.category,
          price: stock.price,
          quantity_in_stock: newQuantity,
          min_stock_level: stock.min_stock_level,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onStockUpdated(data);
        setIncomingQuantity('');
      } else {
        if (typeof data === 'object') {
          const errorMsg = data.detail || data.error || Object.values(data)[0] || 'Failed to update stock';
          setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } else {
          setError('Failed to update stock');
        }
        console.error('Stock update error:', data);
      }
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
      console.error('Stock update network error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1))'
    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(34, 197, 94, 0.05))';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';
  const inputBorder = isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.5)';
  const labelColor = isDarkMode ? '#9ca3b8' : '#666';

  return (
    <div style={{
      background: cardBg,
      borderRadius: '12px',
      padding: '20px',
      border: `2px solid rgba(59, 130, 246, 0.5)`,
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, margin: 0 }}>
          ➕ Add Incoming Stock
        </h4>
        <button
          onClick={onClose}
          style={{ background: 'none', color: labelColor, cursor: 'pointer', fontSize: '20px' }}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: labelColor, fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
            How many units are coming in?
          </label>
          <input
            type="number"
            value={incomingQuantity}
            onChange={(e) => {
              setIncomingQuantity(e.target.value);
              setError('');
            }}
            placeholder="Enter quantity"
            min="1"
            style={{
              width: '100%',
              padding: '8px 10px',
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: '6px',
              color: textColor,
              outline: 'none',
              fontSize: '13px',
            }}
          />
          <p style={{ color: labelColor, fontSize: '10px', marginTop: '4px', margin: 0 }}>
            Current: {stock.quantity_in_stock} units → Will become: {stock.quantity_in_stock + (parseInt(incomingQuantity) || 0)} units
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '8px',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '12px',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: isDarkMode ? '#475569' : '#e5e7eb',
              color: textColor,
              padding: '8px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '12px',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '8px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '12px',
              transition: 'all 0.3s',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Plus size={14} /> {loading ? 'Updating...' : 'Add Units'}
          </button>
        </div>
      </form>
    </div>
  );
}
