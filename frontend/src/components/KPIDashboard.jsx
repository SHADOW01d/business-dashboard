import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Star } from 'lucide-react';

export default function KPIDashboard({ sales, isDarkMode, isMobile }) {
  const [dailyTarget, setDailyTarget] = useState(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem('dailyTarget');
    return saved ? parseInt(saved) : 1000000;
  });
  const [showTargetInput, setShowTargetInput] = useState(false);
  const [tempTarget, setTempTarget] = useState(dailyTarget);
  const [yesterdayIncome, setYesterdayIncome] = useState(0);

  // Update tempTarget when dailyTarget changes
  useEffect(() => {
    setTempTarget(dailyTarget);
  }, [dailyTarget]);

  // Fetch yesterday's sales data
  useEffect(() => {
    const fetchYesterdayData = async () => {
      try {
        const response = await fetch('/api/sales/yesterday_summary/', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setYesterdayIncome(parseFloat(data.total_amount || 0));
        }
      } catch (err) {
        console.error('Error fetching yesterday data:', err);
      }
    };
    
    fetchYesterdayData();
  }, []);

  // Calculate metrics
  const currentIncome = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
  const achievementPercent = dailyTarget > 0 ? (currentIncome / dailyTarget * 100).toFixed(1) : 0;

  // Calculate top product today
  const productSales = {};
  sales.forEach(sale => {
    const productName = sale.stock_name || 'Unknown';
    const category = sale.category || 'Uncategorized';
    if (!productSales[productName]) {
      productSales[productName] = {
        name: productName,
        category: category,
        quantity: 0,
        revenue: 0,
      };
    }
    productSales[productName].quantity += sale.quantity;
    productSales[productName].revenue += parseFloat(sale.total_amount || 0);
  });

  const topProduct = Object.values(productSales).length > 0
    ? Object.values(productSales).reduce((max, product) => 
        product.revenue > max.revenue ? product : max
      )
    : null;

  const topProductPercent = currentIncome > 0 && topProduct 
    ? ((topProduct.revenue / currentIncome) * 100).toFixed(1)
    : 0;

  // Get real yesterday's income from backend
  const comparisonAmount = currentIncome - yesterdayIncome;
  const comparisonPercent = yesterdayIncome > 0 ? (comparisonAmount / yesterdayIncome * 100).toFixed(1) : 0;

  const handleSaveTarget = () => {
    setDailyTarget(parseInt(tempTarget));
    setShowTargetInput(false);
    localStorage.setItem('dailyTarget', tempTarget);
  };

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)'
    : 'linear-gradient(135deg, #ffffff, #f5f0ff)';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)';

  // Progress bar color based on achievement
  const getProgressColor = (percent) => {
    if (percent >= 100) return '#10b981'; // Green - target met
    if (percent >= 75) return '#3b82f6'; // Blue - on track
    if (percent >= 50) return '#f59e0b'; // Amber - warning
    return '#ef4444'; // Red - critical
  };

  const progressColor = getProgressColor(achievementPercent);

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Target size={20} color="#3b82f6" /> KPI Dashboard
      </h3>

      {/* Main KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Daily Target Card */}
        <div style={{
          background: cardBg,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          border: `1px solid ${borderColor}`,
          transition: 'all 0.3s',
          cursor: 'pointer',
          position: 'relative',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <p style={{ color: secondaryText, fontSize: isMobile ? '10px' : '12px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>DAILY TARGET</p>
              <p style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                {dailyTarget.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                setShowTargetInput(!showTargetInput);
                setTempTarget(dailyTarget);
              }}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              ✏️ Edit
            </button>
          </div>

          {showTargetInput && (
            <div style={{ marginTop: '12px', padding: '12px', background: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(59, 130, 246, 0.05)', borderRadius: '8px' }}>
              <input
                type="number"
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  background: isDarkMode ? '#0f1419' : '#ffffff',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  color: textColor,
                  fontSize: '14px',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => setShowTargetInput(false)}
                  style={{
                    background: isDarkMode ? '#475569' : '#e5e7eb',
                    color: textColor,
                    border: 'none',
                    padding: '6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTarget}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <p style={{ color: secondaryText, fontSize: '11px', marginTop: '12px', margin: 0 }}>
            Click "Edit" to set your daily sales goal
          </p>
        </div>

        {/* Current Achievement Card */}
        <div style={{
          background: cardBg,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          border: `1px solid ${borderColor}`,
          transition: 'all 0.3s',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <p style={{ color: secondaryText, fontSize: isMobile ? '10px' : '12px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>CURRENT ACHIEVEMENT</p>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: textColor, margin: 0 }}>
                {currentIncome.toLocaleString()}
              </p>
              <p style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: progressColor, margin: 0 }}>
                {achievementPercent}%
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              height: '12px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}>
              <div style={{
                background: progressColor,
                height: '100%',
                width: `${Math.min(achievementPercent, 100)}%`,
                transition: 'width 0.5s ease',
                borderRadius: '8px',
              }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ color: secondaryText, fontSize: '10px', margin: 0, marginBottom: '2px' }}>Achieved</p>
              <p style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                {currentIncome.toLocaleString()}
              </p>
            </div>
            <div style={{ background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ color: secondaryText, fontSize: '10px', margin: 0, marginBottom: '2px' }}>Remaining</p>
              <p style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                {Math.max(0, dailyTarget - currentIncome).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Top Product Today Card */}
        <div style={{
          background: cardBg,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          border: `1px solid ${borderColor}`,
          transition: 'all 0.3s',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Star size={isMobile ? 14 : 16} color="#f59e0b" fill="#f59e0b" />
            <p style={{ color: secondaryText, fontSize: isMobile ? '10px' : '12px', fontWeight: '600', margin: 0 }}>TOP PRODUCT TODAY</p>
          </div>
          
          {topProduct ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: textColor, margin: 0, marginBottom: '4px' }}>
                  {topProduct.name}
                </p>
                <p style={{ color: secondaryText, fontSize: isMobile ? '10px' : '12px', margin: 0 }}>
                  {topProduct.category}
                </p>
              </div>

              <div style={{ marginBottom: '16px', padding: isMobile ? '8px' : '12px', background: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <p style={{ color: secondaryText, fontSize: isMobile ? '8px' : '10px', margin: 0, marginBottom: '2px' }}>Units Sold</p>
                    <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                      {topProduct.quantity}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: secondaryText, fontSize: isMobile ? '8px' : '10px', margin: 0, marginBottom: '2px' }}>Revenue</p>
                    <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                      {topProduct.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                height: '12px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div style={{
                  background: '#f59e0b',
                  height: '100%',
                  width: `${Math.min(topProductPercent, 100)}%`,
                  transition: 'width 0.5s ease',
                  borderRadius: '8px',
                }} />
              </div>

              <p style={{ color: secondaryText, fontSize: '11px', margin: 0 }}>
                {topProductPercent}% of today's income
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: secondaryText, fontSize: '12px', margin: 0 }}>
                No sales yet today
              </p>
            </div>
          )}
        </div>

        {/* Comparison Card */}
        <div style={{
          background: cardBg,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          border: `1px solid ${borderColor}`,
          transition: 'all 0.3s',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <p style={{ color: secondaryText, fontSize: isMobile ? '10px' : '12px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>VS YESTERDAY</p>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <p style={{ color: secondaryText, fontSize: isMobile ? '9px' : '11px', margin: 0, marginBottom: '2px' }}>Today</p>
                <p style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: textColor, margin: 0 }}>
                  {currentIncome.toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: secondaryText, fontSize: isMobile ? '9px' : '11px', margin: 0, marginBottom: '2px' }}>Yesterday</p>
                <p style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: secondaryText, margin: 0 }}>
                  {yesterdayIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: comparisonAmount >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: isMobile ? '8px' : '12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {comparisonAmount >= 0 ? (
              <>
                <TrendingUp size={isMobile ? 14 : 16} color="#10b981" />
                <p style={{ color: '#10b981', fontSize: isMobile ? '10px' : '12px', margin: 0, fontWeight: '600' }}>
                  ↑ {comparisonAmount.toLocaleString()} ({comparisonPercent}%)
                </p>
              </>
            ) : (
              <>
                <TrendingDown size={isMobile ? 14 : 16} color="#ef4444" />
                <p style={{ color: '#ef4444', fontSize: isMobile ? '10px' : '12px', margin: 0, fontWeight: '600' }}>
                  ↓ {Math.abs(comparisonAmount).toLocaleString()} ({comparisonPercent}%)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{
        marginTop: '16px',
        background: cardBg,
        borderRadius: '16px',
        padding: isMobile ? '12px 16px' : '16px 24px',
        border: `1px solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: isMobile ? '8px' : '16px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: secondaryText, fontSize: isMobile ? '9px' : '11px', margin: 0, marginBottom: '4px' }}>Target</p>
          <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            {dailyTarget.toLocaleString()}
          </p>
        </div>
        <div style={{ width: '1px', height: isMobile ? '30px' : '40px', background: borderColor }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: secondaryText, fontSize: isMobile ? '9px' : '11px', margin: 0, marginBottom: '4px' }}>Current</p>
          <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: progressColor, margin: 0 }}>
            {currentIncome.toLocaleString()}
          </p>
        </div>
        <div style={{ width: '1px', height: isMobile ? '30px' : '40px', background: borderColor }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: secondaryText, fontSize: isMobile ? '9px' : '11px', margin: 0, marginBottom: '4px' }}>Top Product</p>
          <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
            {topProduct ? `${topProductPercent}%` : '—'}
          </p>
        </div>
        <div style={{ width: '1px', height: isMobile ? '30px' : '40px', background: borderColor }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: secondaryText, fontSize: isMobile ? '9px' : '11px', margin: 0, marginBottom: '4px' }}>vs Yesterday</p>
          <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: comparisonAmount >= 0 ? '#10b981' : '#ef4444', margin: 0 }}>
            {comparisonAmount >= 0 ? '+' : ''}{comparisonAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
