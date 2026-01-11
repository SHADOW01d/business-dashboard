import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, AlertCircle } from 'lucide-react';

export default function KPIHeader({ todayIncome, totalExpenses, netProfit, totalStocks, lowStockCount, isDarkMode }) {
  const bg = isDarkMode ? 'linear-gradient(135deg, #111827, #2b0b3a)' : 'linear-gradient(135deg, #ffffff, #f3f0ff)';
  const cardBg = isDarkMode ? '#0f172a' : '#ffffff';
  const textColor = isDarkMode ? '#e6edf3' : '#111827';

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${isDarkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.12)'}`,
    borderRadius: 12,
    padding: '18px',
    minWidth: 180,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    color: textColor,
  };

  const valueStyle = { fontSize: 20, fontWeight: 700 };
  const labelStyle = { fontSize: 12, color: isDarkMode ? '#9ca3b8' : '#6b7280' };

  const fmt = (v) => {
    if (v == null) return '0';
    return Number(v).toLocaleString();
  };

  return (
    <div style={{ width: '100%', padding: '16px 24px', background: bg, borderRadius: 12, marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelStyle}>Today's Revenue</div>
            <div style={{ background: '#10b981', color: 'white', padding: 8, borderRadius: 8 }}><DollarSign size={18} /></div>
          </div>
          <div style={valueStyle}>{fmt(todayIncome)}</div>
          <div style={{ fontSize: 12, color: labelStyle.color }}>Total revenue today</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelStyle}>Total Expenses</div>
            <div style={{ background: '#ef4444', color: 'white', padding: 8, borderRadius: 8 }}><TrendingUp size={18} /></div>
          </div>
          <div style={valueStyle}>{fmt(totalExpenses)}</div>
          <div style={{ fontSize: 12, color: labelStyle.color }}>All expenses</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelStyle}>Net Profit</div>
            <div style={{ background: '#3b82f6', color: 'white', padding: 8, borderRadius: 8 }}><DollarSign size={18} /></div>
          </div>
          <div style={valueStyle}>{fmt(netProfit)}</div>
          <div style={{ fontSize: 12, color: labelStyle.color }}>Income - Expenses</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelStyle}>Total Stocks</div>
            <div style={{ background: '#7c3aed', color: 'white', padding: 8, borderRadius: 8 }}><ShoppingCart size={18} /></div>
          </div>
          <div style={valueStyle}>{fmt(totalStocks)}</div>
          <div style={{ fontSize: 12, color: labelStyle.color }}>Active products</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelStyle}>Low Stock Alerts</div>
            <div style={{ background: '#f97316', color: 'white', padding: 8, borderRadius: 8 }}><AlertCircle size={18} /></div>
          </div>
          <div style={valueStyle}>{fmt(lowStockCount)}</div>
          <div style={{ fontSize: 12, color: labelStyle.color }}>Products below min level</div>
        </div>
      </div>
    </div>
  );
}
