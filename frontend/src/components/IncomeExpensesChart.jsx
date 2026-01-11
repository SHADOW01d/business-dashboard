import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function IncomeExpensesChart({ isDarkMode, isMobile, data = [], todayIncome = 0, totalExpenses = 0 }) {
  // Use real data if provided, otherwise use sample data as fallback
  const chartData = data.length > 0 ? data : [
    { day: 'Thu', income: 500, expenses: 200, isToday: false },
    { day: 'Fri', income: 800, expenses: 300, isToday: false },
    { day: 'Yesterday (Sat)', income: 4200, expenses: 2100, isToday: false },
    { day: 'Today (Sun)', income: 28500, expenses: 8300, isToday: true },
    { day: 'Tomorrow (Mon)', income: 1200, expenses: 800, isToday: false },
    { day: 'Tue', income: 2100, expenses: 1500, isToday: false },
    { day: 'Wed', income: 1800, expenses: 1200, isToday: false },
    { day: 'Thu', income: 2500, expenses: 1800, isToday: false },
  ];

  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)';

  // Calculate dynamic Y-axis domain based on data
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.income || 0, d.expenses || 0))
  );
  const yAxisDomain = [0, Math.ceil(maxValue * 1.2 / 1000) * 1000]; // Add 20% padding and round to nearest 1000
  const formatMoney = (value) => {
    if (value >= 1000000) {
      return `₹${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    } else {
      return `₹${value}`;
    }
  };

  return (
    <div style={{
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)' 
        : 'linear-gradient(135deg, #ffffff, #f5f0ff)',
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)'}`,
      marginBottom: '24px',
    }}>
      <h2 style={{
        fontSize: isMobile ? '18px' : '20px',
        fontWeight: 'bold',
        color: textColor,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: '#60a5fa' }}>📈</span> Revenue & Expenses
      </h2>
      
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <LineChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={gridColor}
            strokeWidth={1}
          />
          
          <XAxis 
            dataKey="day" 
            stroke={secondaryText}
            style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: '500' }}
            tick={{ fill: secondaryText }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          
          <YAxis 
            stroke={secondaryText}
            style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: '500' }}
            tick={{ fill: secondaryText }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
            tickFormatter={formatMoney}
            domain={yAxisDomain}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
              border: `1px solid ${gridColor}`, 
              borderRadius: '12px', 
              color: textColor,
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }} 
            formatter={(value, name) => [
              formatMoney(value), 
              name === 'Revenue' ? '💰 Revenue' : '💸 Expenses'
            ]}
            labelFormatter={(label) => `📅 ${label}`}
          />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px', 
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '500'
            }}
            iconType="line"
            iconSize={12}
          />
          
          {/* Reference line for Today */}
          <ReferenceLine 
            x="Today (Sun)" 
            stroke="#fbbf24" 
            strokeWidth={2} 
            strokeDasharray="8 4"
            label={{ 
              value: "TODAY", 
              position: "top", 
              style: { 
                textAnchor: 'middle',
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: 'bold',
                fill: '#fbbf24'
              }
            }}
          />
          
          {/* Income Line */}
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={3}
            name="Revenue"
            dot={(props) => {
              const { payload } = props;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={payload?.isToday ? 6 : 4}
                  fill="#10b981"
                  stroke={isDarkMode ? '#ffffff' : '#ffffff'}
                  strokeWidth={payload?.isToday ? 3 : 2}
                />
              );
            }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: isDarkMode ? '#1e293b' : '#ffffff' }}
          />
          
          {/* Expenses Line */}
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444" 
            strokeWidth={3}
            name="Expenses"
            dot={(props) => {
              const { payload } = props;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={payload?.isToday ? 6 : 4}
                  fill="#ef4444"
                  stroke={isDarkMode ? '#ffffff' : '#ffffff'}
                  strokeWidth={payload?.isToday ? 3 : 2}
                />
              );
            }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: isDarkMode ? '#1e293b' : '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '16px',
        marginTop: '24px',
      }}>
        <div style={{
          background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', margin: 0, marginBottom: '4px' }}>Today's Revenue</p>
          <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{formatMoney(todayIncome)}</p>
        </div>
        
        <div style={{
          background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', margin: 0, marginBottom: '4px' }}>Today's Expenses</p>
          <p style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{formatMoney(totalExpenses)}</p>
        </div>
        
        <div style={{
          background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
        }}>
          <p style={{ color: secondaryText, fontSize: '12px', margin: 0, marginBottom: '4px' }}>Net Revenue</p>
          <p style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{formatMoney(todayIncome - totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
}
