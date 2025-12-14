import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ProfitAnalysis({ isDarkMode }) {
  const [loading, setLoading] = useState(true);
  const [profitData, setProfitData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfitAnalysis();
  }, []);

  const fetchProfitAnalysis = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/profit_margin_analysis/`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProfitData(data);
      } else {
        setError('Failed to fetch profit analysis');
      }
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
      console.error('Error fetching profit analysis:', err);
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

  const getMarginColor = (margin) => {
    if (margin >= 40) return '#10b981'; // Green - Excellent
    if (margin >= 25) return '#3b82f6'; // Blue - Good
    if (margin >= 10) return '#f59e0b'; // Amber - Fair
    return '#ef4444'; // Red - Poor
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: secondaryText }}>
        Loading profit analysis...
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

  if (!profitData || profitData.products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: secondaryText }}>
        No sales data available. Record some sales to see profit analysis.
      </div>
    );
  }

  const overall = profitData.overall_metrics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overall Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Overall Profit Margin
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: getMarginColor(overall.overall_margin_percent),
            margin: 0,
          }}>
            {overall.overall_margin_percent.toFixed(1)}%
          </p>
        </div>

        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Total Revenue
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            ₹{overall.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Total Profit
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            ₹{overall.total_profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div style={{
          background: cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${borderColor}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
            Products Analyzed
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
            {overall.product_count}
          </p>
        </div>
      </div>

      {/* Product Details Table */}
      <div style={{
        background: cardBg,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${borderColor}`,
        overflowX: 'auto',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', margin: 0 }}>
          Profit Margin by Product
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
              <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>
                Product
              </th>
              <th style={{ textAlign: 'right', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>
                Qty Sold
              </th>
              <th style={{ textAlign: 'right', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>
                Revenue
              </th>
              <th style={{ textAlign: 'right', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>
                Cost
              </th>
              <th style={{ textAlign: 'right', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>
                Profit
              </th>
              <th style={{ textAlign: 'center', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>
                Margin %
              </th>
            </tr>
          </thead>
          <tbody>
            {profitData.products.map((product) => (
              <tr key={product.product_id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                <td style={{ padding: '12px', color: textColor, fontSize: '14px', fontWeight: '500' }}>
                  {product.product_name}
                </td>
                <td style={{ padding: '12px', color: textColor, fontSize: '14px', textAlign: 'right' }}>
                  {product.quantity_sold}
                </td>
                <td style={{ padding: '12px', color: '#3b82f6', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>
                  ₹{product.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </td>
                <td style={{ padding: '12px', color: secondaryText, fontSize: '14px', textAlign: 'right' }}>
                  ₹{product.total_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </td>
                <td style={{
                  padding: '12px',
                  color: product.total_profit >= 0 ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'right',
                }}>
                  ₹{product.total_profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </td>
                <td style={{
                  padding: '12px',
                  color: getMarginColor(product.profit_margin_percent),
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}>
                  {product.profit_margin_percent >= 25 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {product.profit_margin_percent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '12px',
        color: secondaryText,
      }}>
        <p style={{ margin: 0, marginBottom: '8px', fontWeight: '600' }}>Profit Margin Guide:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10b981' }}></div>
            <span>40%+ Excellent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#3b82f6' }}></div>
            <span>25-40% Good</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f59e0b' }}></div>
            <span>10-25% Fair</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ef4444' }}></div>
            <span>&lt;10% Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
