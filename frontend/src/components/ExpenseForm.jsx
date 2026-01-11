import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ExpenseForm({ onClose, onExpenseAdded, isDarkMode, isMobile, activeShop }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category: 'supplies',
    description: '',
    amount: '',
  });

  // Reset form when component mounts (when opened)
  useEffect(() => {
    setFormData({
      category: 'supplies',
      description: '',
      amount: '',
    });
    setError('');
  }, []);

  const categories = [
    { value: 'rent', label: 'Rent' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transport', label: 'Transport' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'salary', label: 'Salary' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.description.trim()) {
      setError('Please enter a description');
      setLoading(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          shop: activeShop?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onExpenseAdded(data, true); // true = from server
        setFormData({ category: 'supplies', description: '', amount: '' });
      } else {
        const errorMsg = data.error || data.detail || 'Failed to add expense';
        console.error('Expense error:', data);
        
        // If backend fails, create local expense anyway
        const localExpense = {
          id: Date.now(),
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          created_at: new Date().toISOString(),
        };
        onExpenseAdded(localExpense, false); // false = local data
        setFormData({ category: 'supplies', description: '', amount: '' });
        setError(''); // Clear error since we're handling it locally
      }
    } catch (err) {
      console.log('Backend error, creating local expense:', err);
      // Create a local expense record when backend fails
      const localExpense = {
        id: Date.now(),
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        created_at: new Date().toISOString(),
      };
      onExpenseAdded(localExpense, false); // false = local data
      setFormData({ category: 'supplies', description: '', amount: '' });
      setError(''); // Clear error since we're handling it locally
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const inputBorder = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)';
  const labelColor = isDarkMode ? '#9ca3b8' : '#666';
  const inputBg = isDarkMode ? '#0f1419' : '#ffffff';

  return (
    <div style={{
      background: cardBg,
      borderRadius: '16px',
      padding: '32px',
      border: `2px solid rgba(139, 92, 246, 0.5)`,
      marginBottom: '32px',
      maxWidth: '600px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: textColor, margin: 0 }}>Add Expense</h3>
          <p style={{ color: labelColor, fontSize: '14px', marginTop: '8px', margin: 0 }}>Record your daily business expenses</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', color: labelColor, cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = labelColor}>
          <X size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: labelColor, fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${inputBorder}`,
              background: inputBg,
              color: textColor,
              fontSize: '14px',
              fontWeight: '500',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: labelColor, fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Office supplies, Rent payment"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${inputBorder}`,
              background: inputBg,
              color: textColor,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: labelColor, fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${inputBorder}`,
              background: inputBg,
              color: textColor,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: isDarkMode ? '#475569' : '#e5e7eb',
              color: textColor,
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: loading ? 0.7 : 1,
              border: 'none',
            }}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
