import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Package } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function LowStockAlerts({ isDarkMode }) {
  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLowStockAlerts();
  }, []);

  const fetchLowStockAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/low_stock_alerts/`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAlertData(data);
      } else {
        setError('Failed to fetch low stock alerts');
      }
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
      console.error('Error fetching low stock alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)'
    : 'linear-gradient(135deg, #ffffff, #f5f0ff)';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: secondaryText }}>
        Loading stock alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        color: '#ef4444',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        {error}
      </div>
    );
  }

  if (!alertData || alertData.total_alerts === 0) {
    return (
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid #10b981',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <Package color="#10b981" size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
        <p style={{ color: '#10b981', fontSize: '16px', fontWeight: '600', margin: 0 }}>
          ✓ All Stock Levels Healthy
        </p>
        <p style={{ color: secondaryText, fontSize: '14px', marginTop: '8px', margin: 0 }}>
          No low stock alerts at this time
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Alert Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #ef4444',
          textAlign: 'center',
        }}>
          <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Critical Alerts
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>
            {alertData.critical_alerts}
          </p>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #f59e0b',
          textAlign: 'center',
        }}>
          <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Warning Alerts
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
            {alertData.warning_alerts}
          </p>
        </div>

        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
          textAlign: 'center',
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Total Alerts
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: textColor, margin: 0 }}>
            {alertData.total_alerts}
          </p>
        </div>
      </div>

      {/* Alert Items */}
      <div style={{
        background: cardBg,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${borderColor}`,
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', margin: 0 }}>
          Low Stock Items
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alertData.items.map((item) => (
            <div
              key={item.product_id}
              style={{
                background: item.alert_level === 'critical'
                  ? 'rgba(239, 68, 68, 0.05)'
                  : 'rgba(245, 158, 11, 0.05)',
                border: `1px solid ${item.alert_level === 'critical' ? '#ef4444' : '#f59e0b'}`,
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                {item.alert_level === 'critical' ? (
                  <AlertCircle color="#ef4444" size={24} />
                ) : (
                  <AlertTriangle color="#f59e0b" size={24} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ color: textColor, fontSize: '14px', fontWeight: '600', margin: 0 }}>
                    {item.product_name}
                  </p>
                  <p style={{ color: secondaryText, fontSize: '12px', margin: 0, marginTop: '4px' }}>
                    {item.category}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                textAlign: 'right',
              }}>
                <div>
                  <p style={{ color: secondaryText, fontSize: '11px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
                    Current Stock
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: item.current_stock === 0 ? '#ef4444' : textColor,
                    margin: 0,
                  }}>
                    {item.current_stock}
                  </p>
                </div>

                <div>
                  <p style={{ color: secondaryText, fontSize: '11px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
                    Min Level
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, margin: 0 }}>
                    {item.min_stock_level}
                  </p>
                </div>

                <div>
                  <p style={{ color: secondaryText, fontSize: '11px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
                    Deficit
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: item.alert_level === 'critical' ? '#ef4444' : '#f59e0b',
                    margin: 0,
                  }}>
                    -{item.stock_deficit}
                  </p>
                </div>

                <div>
                  <p style={{ color: secondaryText, fontSize: '11px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
                    Price
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                    ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '12px',
        color: secondaryText,
      }}>
        <p style={{ margin: 0, marginBottom: '8px', fontWeight: '600' }}>Alert Levels:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ef4444' }}></div>
            <span>Critical: Stock = 0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f59e0b' }}></div>
            <span>Warning: Stock &lt; Min Level</span>
          </div>
        </div>
        <p style={{ margin: 0, marginTop: '12px', fontStyle: 'italic' }}>
          💡 Tip: Update min stock levels in your stock settings to receive alerts earlier
        </p>
      </div>
    </div>
  );
}
