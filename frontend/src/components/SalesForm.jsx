import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { getCsrfToken } from '../utils/csrf';

export default function SalesForm({ stock, onClose, onSaleAdded, isDarkMode, isMobile, activeShop }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Reset form state when stock changes
  useEffect(() => {
    setQuantity(0);
    setTotalAmount(0);
    setError('');
  }, [stock]);

  const handleQuantityClick = (value) => {
    if (!stock || !stock.price) return;
    const newQuantity = quantity + value;
    setQuantity(newQuantity);
    setTotalAmount(newQuantity * parseFloat(stock.price));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setTotalAmount(value === '' ? 0 : Number(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (quantity === 0) {
      setError('Please select a quantity');
      setLoading(false);
      return;
    }

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${API_BASE_URL}/api/sales/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          stock: stock?.id,
          quantity: quantity,
          unit_price: stock?.price,
          total_amount: totalAmount,
          shop: activeShop?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSaleAdded(data, true); // true = from server
        setQuantity(0);
        setTotalAmount(0);
        setError(''); // Clear any previous errors
      } else {
        const errorMsg = data.error || data.detail || 'Failed to record sale';
        console.error('Sale error:', data);
        
        // If backend fails, create local sale anyway
        const localSale = {
          id: Date.now(),
          stock: stock ? { id: stock.id, name: stock.name } : null,
          stock_name: stock?.name || 'Unknown',
          quantity: quantity,
          price_per_unit: stock && stock.price ? parseFloat(stock.price) : 0,
          total_amount: totalAmount || (stock && stock.price ? quantity * parseFloat(stock.price) : 0),
          created_at: new Date().toISOString(),
        };
        onSaleAdded(localSale, false); // false = local data
        setQuantity(0);
        setTotalAmount(0);
        setError(''); // Clear error since we're handling it locally
      }
    } catch (err) {
      console.log('Backend error, creating local sale:', err);
      // Create a local sale record when backend fails
      const localSale = {
        id: Date.now(),
        stock: stock ? { id: stock.id, name: stock.name } : null,
        stock_name: stock?.name || 'Unknown',
        quantity: quantity,
        price_per_unit: stock && stock.price ? parseFloat(stock.price) : 0,
        total_amount: totalAmount || (stock && stock.price ? quantity * parseFloat(stock.price) : 0),
        created_at: new Date().toISOString(),
      };
      onSaleAdded(localSale, false); // false = local data
      setQuantity(0);
      setTotalAmount(0);
      setError(''); // Clear error since we're handling it locally
    } finally {
      setLoading(false);
    }
  };

  const defaultTotalPrice = stock && stock.price ? quantity * parseFloat(stock.price) : 0;
  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const inputBorder = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)';
  const labelColor = isDarkMode ? '#9ca3b8' : '#666';

  return (
    <div style={{
      background: cardBg,
      borderRadius: isMobile ? '16px' : '16px',
      padding: isMobile ? '20px' : '32px',
      border: `2px solid rgba(139, 92, 246, 0.5)`,
      marginBottom: isMobile ? '0' : '32px',
      maxWidth: isMobile ? '100%' : '600px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '20px' : '32px' }}>
        <div>
          <h3 style={{ fontSize: isMobile ? '20px' : '32px', fontWeight: 'bold', color: textColor, margin: 0 }}>{stock?.name || 'Select Stock'}</h3>
          <p style={{ color: labelColor, fontSize: isMobile ? '12px' : '14px', marginTop: '4px', margin: 0 }}>{stock?.category || ''}</p>
          <p style={{ color: '#a855f7', fontSize: isMobile ? '14px' : '18px', fontWeight: '600', marginTop: '8px', margin: 0 }}>
            {stock && stock.price ? parseFloat(stock.price).toLocaleString() : '0'} per unit
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'none', color: labelColor, cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = labelColor}>
          <X size={isMobile ? 24 : 28} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
          <p style={{ color: textColor, fontWeight: '600', marginBottom: isMobile ? '16px' : '24px', fontSize: isMobile ? '16px' : '18px' }}>How many items? <span style={{ color: '#a855f7' }}>Total: {quantity}</span></p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '16px' }}>
            {[1, 5, 10].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuantityClick(val)}
                style={{
                  background: val === 1 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : val === 5 ? 'linear-gradient(135deg, #a855f7, #7e22ce)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: isMobile ? '12px' : '16px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '16px' : '20px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: isMobile ? '20px' : '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '12px' : '16px' }}>
          <div style={{ background: isDarkMode ? 'rgba(15, 20, 25, 0.5)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: isMobile ? '12px' : '16px', border: `1px solid ${inputBorder}` }}>
            <p style={{ color: labelColor, fontSize: isMobile ? '10px' : '12px', marginBottom: '6px', margin: 0 }}>System Price</p>
            <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>
              {defaultTotalPrice.toLocaleString()}
            </p>
          </div>
          <div style={{ background: isDarkMode ? 'rgba(15, 20, 25, 0.5)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: isMobile ? '12px' : '16px', border: `1px solid ${inputBorder}` }}>
            <p style={{ color: labelColor, fontSize: isMobile ? '10px' : '12px', marginBottom: '6px', margin: 0 }}>Actual Price (Edit if needed)</p>
            <input
              type="text"
              inputMode="numeric"
              value={totalAmount === 0 ? '' : totalAmount}
              onChange={handleAmountChange}
              placeholder={defaultTotalPrice.toLocaleString()}
              style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '8px', padding: '6px 10px', width: '100%', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ background: isDarkMode ? 'rgba(15, 20, 25, 0.5)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: isMobile ? '16px' : '24px', marginBottom: isMobile ? '20px' : '32px', border: `1px solid ${inputBorder}` }}>
          <p style={{ color: labelColor, fontSize: isMobile ? '11px' : '13px', marginBottom: '6px', margin: 0 }}>Final Total Amount</p>
          <p style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            {(totalAmount || defaultTotalPrice).toLocaleString()}
          </p>
          {totalAmount !== defaultTotalPrice && totalAmount > 0 && (
            <p style={{ color: '#10b981', fontSize: isMobile ? '10px' : '12px', marginTop: '6px', margin: 0 }}>
              ✓ Price adjusted by {(totalAmount - defaultTotalPrice > 0 ? '+' : '')}{(totalAmount - defaultTotalPrice).toLocaleString()}
            </p>
          )}
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: isMobile ? '10px' : '12px', borderRadius: '8px', marginBottom: isMobile ? '12px' : '16px', fontSize: isMobile ? '12px' : '14px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '12px' : '16px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: isDarkMode ? '#475569' : '#e5e7eb',
              color: textColor,
              padding: isMobile ? '10px' : '12px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '16px',
              transition: 'all 0.3s',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={quantity === 0 || loading}
            style={{
              background: quantity === 0 ? 'rgba(16, 185, 129, 0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: isMobile ? '10px' : '12px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '16px',
              cursor: quantity === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '6px' : '8px',
            }}
          >
            <Plus size={isMobile ? 18 : 20} /> {loading ? 'Recording...' : 'Confirm Sale'}
          </button>
        </div>
      </form>
    </div>
  );
}
