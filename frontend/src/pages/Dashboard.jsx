import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Plus, BarChart3, Settings, Menu, Calendar, Search, Moon, Sun, LogOut } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StockForm from '../components/StockForm';
import SalesForm from '../components/SalesForm';
import ExpenseForm from '../components/ExpenseForm';
import IncomingStockForm from '../components/IncomingStockForm';
import StockDetailsModal from '../components/StockDetailsModal';
import ShopSelector from '../components/ShopSelector';
import KPIDashboard from '../components/KPIDashboard';
import ReportGenerator from '../components/ReportGenerator';
import ProfitAnalysis from '../components/ProfitAnalysis';
import LowStockAlerts from '../components/LowStockAlerts';
import SettingsPage from './SettingsPage';
import { API_BASE_URL } from '../config';
import { t } from '../translations';

export default function Dashboard({ user, onLogout, isDarkMode, setIsDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeShop, setActiveShop] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIncomingStockForm, setShowIncomingStockForm] = useState(null);
  const [selectedStockDetails, setSelectedStockDetails] = useState(null);
  const [language, setLanguage] = useState('en');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [weeklyChartData, setWeeklyChartData] = useState([]);

  const generateWeekData = useCallback(() => {
    const data = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const dayName = dayNames[i];
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      data.push({
        date: date.toISOString().split('T')[0],
        day: `${dayName}, ${dateStr}`,
        income: 0,
        expenses: 0,
      });
    }
    
    return data;
  }, []);

  const fetchData = useCallback(async (shop = activeShop) => {
    try {
      const [stocksRes, salesRes, expensesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stocks/`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/sales/`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/expenses/`, { credentials: 'include' }),
      ]);

      if (stocksRes.ok) {
        const stocksData = await stocksRes.json();
        setStocks(Array.isArray(stocksData) ? stocksData : stocksData.results || []);
      }

      let allSales = [];
      if (salesRes.ok) {
        const salesData = await salesRes.json();
        allSales = Array.isArray(salesData) ? salesData : salesData.results || [];
        setSales(allSales);
      }

      let allExpenses = [];
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        allExpenses = Array.isArray(expensesData) ? expensesData : expensesData.results || [];
        setExpenses(allExpenses);
      }

      // Generate and populate weekly chart data
      const weekData = generateWeekData();
      
      // Helper function to get date in local timezone (YYYY-MM-DD)
      const getLocalDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      // Populate sales data
      allSales.forEach(sale => {
        const saleDate = getLocalDate(sale.created_at);
        const dayData = weekData.find(d => d.date === saleDate);
        if (dayData) {
          dayData.income += parseFloat(sale.total_amount || 0);
        }
      });

      // Populate expenses data
      allExpenses.forEach(expense => {
        const expenseDate = getLocalDate(expense.created_at);
        const dayData = weekData.find(d => d.date === expenseDate);
        if (dayData) {
          dayData.expenses += parseFloat(expense.amount || 0);
        }
      });

      // Update state with weekly data
      setWeeklyChartData(weekData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [activeShop, generateWeekData]);

  useEffect(() => {
    fetchData();
    // Fetch user settings to get language preference
    fetchUserSettings();
  }, [fetchData]);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/settings/my_settings/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setLanguage(data.language || 'en');
      } else {
        console.log('Settings not found, using default language');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleShopChange = (shop) => {
    setActiveShop(shop);
    // Refresh data for the selected shop
    fetchData(shop);
  };

  const handleStockAdded = (newStock) => {
    setStocks([newStock, ...stocks]);
    setShowStockForm(false);
  };

  const handleSaleAdded = (newSale, fromServer = false) => {
    setSales([newSale, ...sales]);
    setShowSalesForm(false);
    setSelectedStock(null); // Clear selected stock after sale
    
    // Update weekly chart data immediately
    setWeeklyChartData(prevData => {
      return prevData.map(dayData => {
        const saleDate = new Date(newSale.created_at).toISOString().split('T')[0];
        if (dayData.date === saleDate) {
          return {
            ...dayData,
            income: dayData.income + parseFloat(newSale.total_amount || 0)
          };
        }
        return dayData;
      });
    });

    // Only refresh from server if the data came from server
    if (fromServer) {
      setTimeout(() => fetchData(), 1000); // Delay to allow server to process
    }
  };

  const handleExpenseAdded = (newExpense, fromServer = false) => {
    setExpenses([newExpense, ...expenses]);
    setShowExpenseForm(false);
    
    // Update weekly chart data immediately
    setWeeklyChartData(prevData => {
      return prevData.map(dayData => {
        const expenseDate = new Date(newExpense.created_at).toISOString().split('T')[0];
        if (dayData.date === expenseDate) {
          return {
            ...dayData,
            expenses: dayData.expenses + parseFloat(newExpense.amount || 0)
          };
        }
        return dayData;
      });
    });

    // Only refresh from server if the data came from server
    if (fromServer) {
      setTimeout(() => fetchData(), 1000); // Delay to allow server to process
    }
  };

  const handleDeleteStock = async (stockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stocks/${stockId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setStocks(stocks.filter(s => s.id !== stockId));
      }
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  const handleStockUpdated = (updatedStock) => {
    setStocks(stocks.map(s => s.id === updatedStock.id ? updatedStock : s));
    setShowIncomingStockForm(null);
  };

  const bgGradient = isDarkMode
    ? 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f0f4f8 0%, #e0d5f0 50%, #f0f4f8 100%)';

  const cardBg = isDarkMode
    ? 'linear-gradient(135deg, #1a1a3f, #2d1b4e)'
    : 'linear-gradient(135deg, #ffffff, #f5f0ff)';

  const textColor = isDarkMode ? 'white' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';
  const borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)';

  const navItems = [
    { id: 'dashboard', label: t(language, 'dashboard'), icon: BarChart3 },
    { id: 'stocks', label: t(language, 'myStocks'), icon: ShoppingCart },
    { id: 'sales', label: t(language, 'sales'), icon: Calendar },
    { id: 'expenses', label: t(language, 'expenses'), icon: DollarSign },
    { id: 'analytics', label: t(language, 'analytics'), icon: TrendingUp },
  ];

  // Use the weekly chart data from state (persists across days)
  const dailyData = weeklyChartData.length > 0 ? weeklyChartData : [];

  // Calculate totals from this week's data - reactive to weeklyChartData changes
  const todayIncome = useMemo(() => 
    dailyData.reduce((sum, day) => sum + day.income, 0), 
    [dailyData]
  );
  const totalExpensesAmount = useMemo(() => 
    dailyData.reduce((sum, day) => sum + day.expenses, 0), 
    [dailyData]
  );
  const netProfit = useMemo(() => 
    todayIncome - totalExpensesAmount, 
    [todayIncome, totalExpensesAmount]
  );

  // Filter sales and expenses based on search term
  const filteredSales = sales.filter(sale =>
    sale.stock_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${bgGradient}; }
        button { cursor: pointer; border: none; }
        input { font-family: inherit; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 4px; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '256px' : '80px',
        background: isDarkMode ? 'linear-gradient(to bottom, #0f0f1f, #1a0f3f)' : 'linear-gradient(to bottom, #f5f0ff, #ede9fe)',
        borderRight: `1px solid ${borderColor}`,
        transition: 'all 0.3s',
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.5)',
        zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart color="white" size={24} />
          </div>
          {sidebarOpen && <span style={{ color: textColor, fontWeight: 'bold', fontSize: '20px' }}>ProShop</span>}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: activeNav === item.id ? 'linear-gradient(135deg, #3b82f6, #a855f7)' : 'transparent',
                  color: activeNav === item.id ? 'white' : secondaryText,
                  transition: 'all 0.3s',
                  fontSize: '14px',
                  fontWeight: activeNav === item.id ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (activeNav !== item.id) {
                    e.target.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                    e.target.style.color = textColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeNav !== item.id) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = secondaryText;
                  }
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div style={{ padding: '12px 8px', borderTop: `1px solid ${borderColor}`, marginTop: 'auto' }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: sidebarOpen ? 'space-between' : 'center',
              gap: '8px', 
              padding: '10px 12px', 
              color: textColor, 
              borderRadius: '8px', 
              background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)',
              transition: 'all 0.3s', 
              fontSize: '12px',
              fontWeight: '600',
              border: isDarkMode ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(139, 92, 246, 0.3)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.25)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarOpen ? (
              <>
                <span>← Collapse</span>
                <Menu size={18} />
              </>
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarOpen ? '256px' : '80px', flex: 1, transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
        {/* Header - Sticky */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: isDarkMode ? 'linear-gradient(to right, #0f172a, #4c0519, #0f172a)' : 'linear-gradient(to right, #f0f4f8, #e0d5f0, #f0f4f8)', borderBottom: `1px solid ${borderColor}`, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
            {/* Left Section - Title */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Dashboard</h1>
              <p style={{ color: secondaryText, fontSize: '14px', marginTop: '4px' }}>Welcome, {user.first_name || user.username}!</p>
            </div>

            {/* Center Section - Action Buttons */}
            {activeNav === 'dashboard' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowSalesForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  title="Add new sale"
                >
                  + Sale
                </button>
                <button
                  onClick={() => setShowExpenseForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  title="Add new expense"
                >
                  + Expense
                </button>
                <button
                  onClick={() => setShowStockForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  title="Add new stock"
                >
                  + Stock
                </button>
              </div>
            )}

            {/* Right Section - Report & User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              <ReportGenerator isDarkMode={isDarkMode} />
              
              {/* User Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    width: '44px',
                    height: '44px',
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: 'none',
                    boxShadow: showUserMenu ? '0 6px 20px rgba(139, 92, 246, 0.4)' : 'none',
                    transform: showUserMenu ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!showUserMenu) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showUserMenu) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  title={user.username}
                >
                  {user.username.substring(0, 2).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: isDarkMode ? '#1a1a3f' : '#ffffff',
                      border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                      zIndex: 1000,
                      minWidth: '200px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* User Info */}
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
                        color: secondaryText,
                        fontSize: '12px',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: '600', color: textColor }}>👤 {user.username}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px' }}>{user.email || 'No email'}</p>
                    </div>

                    {/* Theme Toggle Option */}
                    <button
                      onClick={() => {
                        setIsDarkMode(!isDarkMode);
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        color: textColor,
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    {/* Settings Option */}
                    <button
                      onClick={() => {
                        setActiveNav('settings');
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        color: textColor,
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
          {activeNav === 'dashboard' && (
            <>
              {/* Shop Selector */}
              <ShopSelector isDarkMode={isDarkMode} onShopChange={handleShopChange} />

              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {[
                  { label: "Today's Revenue", value: todayIncome.toLocaleString(), icon: DollarSign, color: '#10b981', trend: 'Total revenue' },
                  { label: 'Total Expenses', value: totalExpensesAmount.toLocaleString(), icon: BarChart3, color: '#ef4444', trend: 'All expenses' },
                  { label: 'Net Profit', value: netProfit.toLocaleString(), icon: TrendingUp, color: '#3b82f6', trend: 'Income - Expenses' },
                  { label: 'Total Stocks', value: stocks.length, icon: ShoppingCart, color: '#f97316', trend: 'Active products' },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}`, transition: 'all 0.3s', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ color: secondaryText, fontSize: '13px', fontWeight: '500', margin: 0 }}>{card.label}</p>
                          <p style={{ fontSize: '32px', fontWeight: 'bold', color: textColor, marginTop: '12px', marginBottom: 0 }}>{card.value}</p>
                          <p style={{ color: card.color, fontSize: '12px', marginTop: '12px', margin: 0 }}>↑ {card.trend}</p>
                        </div>
                        <div style={{ background: `rgba(${card.color === '#10b981' ? '16, 185, 129' : card.color === '#3b82f6' ? '59, 130, 246' : card.color === '#a855f7' ? '168, 85, 247' : '249, 115, 22'}, 0.15)`, padding: '16px', borderRadius: '12px' }}>
                          <Icon color={card.color} size={28} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* KPI Dashboard */}
              <KPIDashboard sales={sales} isDarkMode={isDarkMode} />

              {/* Low Stock Alerts Widget */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚠️ Stock Alerts
                </h3>
                <LowStockAlerts isDarkMode={isDarkMode} />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                <div style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}`, gridColumn: 'span 2' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp color="#60a5fa" /> Revenue & Expenses Comparison
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData} margin={{ top: 20, right: 30, left: 60, bottom: 0 }}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#d1d5db'} />
                      <XAxis dataKey="day" stroke={secondaryText} style={{ fontSize: '12px' }} />
                      <YAxis 
                        stroke={secondaryText}
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => {
                          if (value >= 1000000) return (value / 1000000).toFixed(0) + 'M';
                          if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                          return value.toString();
                        }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                          border: `1px solid ${borderColor}`, 
                          borderRadius: '8px', 
                          color: textColor 
                        }} 
                        formatter={(value) => value.toLocaleString()}
                        labelStyle={{ color: textColor }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="square"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#22c55e" 
                        fill="url(#incomeGradient)" 
                        name="Revenue"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        fill="url(#expensesGradient)" 
                        name="Expenses"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingCart color="#c084fc" /> Stock Value
                  </h2>
                  <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                    <p style={{ color: secondaryText, fontSize: '12px', margin: 0, marginBottom: '8px' }}>Total Inventory Value</p>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#a855f7', margin: 0 }}>
                      {(stocks.reduce((sum, stock) => sum + (parseFloat(stock.quantity || 0) * parseFloat(stock.unit_price || 0)), 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeNav === 'stocks' && (
            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <ShoppingCart color="#60a5fa" /> My Stocks
                </h2>
                <button
                  onClick={() => setShowStockForm(true)}
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={20} /> Add Stock
                </button>
              </div>

              {showStockForm && <StockForm onClose={() => setShowStockForm(false)} onStockAdded={handleStockAdded} isDarkMode={isDarkMode} />}

              {stocks.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}>
                  <ShoppingCart color={secondaryText} size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
                  <p style={{ color: secondaryText, fontSize: '18px' }}>No stocks yet. Add your first product!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {stocks.map(stock => (
                    <div key={stock.id} style={{ background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: '20px', border: `1px solid ${borderColor}`, transition: 'all 0.3s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontWeight: 'bold', color: textColor, fontSize: '16px', margin: 0 }}>{stock.name}</h3>
                          <p style={{ fontSize: '12px', color: secondaryText, marginTop: '4px', margin: 0 }}>{stock.category}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteStock(stock.id)}
                          style={{ background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}
                        >
                          ×
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', background: 'rgba(168, 85, 247, 0.3)', color: '#d8b4fe', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>{stock.price.toLocaleString()}</span>
                        <span style={{ fontSize: '12px', color: secondaryText }}>Sold: {stock.quantity_sold}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '8px', background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '6px' }}>
                        <span style={{ fontSize: '12px', color: secondaryText }}>📦 Remaining:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>{stock.quantity_in_stock} units</span>
                      </div>

                      {showIncomingStockForm === stock.id && (
                        <IncomingStockForm
                          stock={stock}
                          onClose={() => setShowIncomingStockForm(null)}
                          onStockUpdated={handleStockUpdated}
                          isDarkMode={isDarkMode}
                        />
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                        <button
                          onClick={() => setShowIncomingStockForm(stock.id)}
                          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}
                        >
                          ➕ Add
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStock(stock);
                            setShowSalesForm(true);
                          }}
                          style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: 'white', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}
                        >
                          📤 Sale
                        </button>
                        <button
                          onClick={() => setSelectedStockDetails(stock)}
                          style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}
                        >
                          👁️ Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}


              {selectedStockDetails && (
                <StockDetailsModal
                  stock={selectedStockDetails}
                  onClose={() => setSelectedStockDetails(null)}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          )}

          {activeNav === 'sales' && (
            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Calendar color="#60a5fa" /> Today's Sales
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', padding: '8px 16px', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                  <Search size={18} color={secondaryText} />
                  <input
                    type="text"
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: textColor, outline: 'none', fontSize: '14px', width: '200px' }}
                  />
                </div>
              </div>

              {filteredSales.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}>
                  <Calendar color={secondaryText} size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
                  <p style={{ color: secondaryText, fontSize: '18px' }}>{searchTerm ? 'No sales found' : 'No sales recorded yet'}</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Product</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Quantity</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Price/Unit</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Total</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map(sale => (
                        <tr key={sale.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td style={{ padding: '12px', color: textColor, fontSize: '14px' }}>{sale.stock_name}</td>
                          <td style={{ padding: '12px', color: textColor, fontSize: '14px' }}>{sale.quantity}</td>
                          <td style={{ padding: '12px', color: textColor, fontSize: '14px' }}>{sale.price_per_unit.toLocaleString()}</td>
                          <td style={{ padding: '12px', color: '#10b981', fontSize: '14px', fontWeight: '600' }}>{sale.total_amount.toLocaleString()}</td>
                          <td style={{ padding: '12px', color: secondaryText, fontSize: '12px' }}>{new Date(sale.created_at).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeNav === 'expenses' && (
            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <DollarSign color="#ef4444" /> Daily Expenses
                </h2>
                <button
                  onClick={() => setShowExpenseForm(true)}
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
                >
                  <Plus size={20} /> Add Expense
                </button>
              </div>

              {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} onExpenseAdded={handleExpenseAdded} isDarkMode={isDarkMode} isMobile={isMobile} activeShop={activeShop} />}

              {filteredExpenses.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}>
                  <DollarSign color={secondaryText} size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
                  <p style={{ color: secondaryText, fontSize: '18px' }}>{searchTerm ? 'No expenses found' : 'No expenses recorded yet'}</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Description</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Category</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Amount</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: secondaryText, fontWeight: '600', fontSize: '12px' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map(expense => (
                        <tr key={expense.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td style={{ padding: '12px', color: textColor, fontSize: '14px' }}>{expense.description}</td>
                          <td style={{ padding: '12px', color: textColor, fontSize: '14px', textTransform: 'capitalize' }}>{expense.category}</td>
                          <td style={{ padding: '12px', color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>₹{expense.amount.toLocaleString()}</td>
                          <td style={{ padding: '12px', color: secondaryText, fontSize: '12px' }}>{new Date(expense.created_at).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeNav === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp color="#60a5fa" /> Profit Margin Analysis
              </h2>
              <ProfitAnalysis isDarkMode={isDarkMode} />
            </div>
          )}

          {activeNav === 'settings' && (
            <SettingsPage 
              isDarkMode={isDarkMode} 
              setIsDarkMode={setIsDarkMode} 
              language={language} 
              onLanguageChange={(newLang) => { setLanguage(newLang); fetchUserSettings(); }} 
              onClose={() => setActiveNav('dashboard')}
            />
          )}
        </div>
      </div>

      {/* Sales Form Modal - Outside content area */}
      {showSalesForm && activeNav === 'dashboard' && (
        <>
          {!selectedStock ? (
            // Stock Selection Modal
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                background: isDarkMode ? '#1a1a3f' : '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'auto',
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: textColor, margin: 0 }}>Select Product</h2>
                  <button
                    onClick={() => {
                      setShowSalesForm(false);
                      setSelectedStock(null);
                    }}
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textColor }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                  {stocks.map(stock => (
                    <button
                      key={stock.id}
                      onClick={() => setSelectedStock(stock)}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${borderColor}`,
                        background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                        color: textColor,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontWeight: '600',
                        fontSize: '13px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)';
                        e.currentTarget.style.borderColor = '#a855f7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                        e.currentTarget.style.borderColor = borderColor;
                      }}
                    >
                      {stock.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <SalesForm
              stock={selectedStock}
              onClose={() => {
                setShowSalesForm(false);
                setSelectedStock(null);
              }}
              onSaleAdded={handleSaleAdded}
              isDarkMode={isDarkMode}
              activeShop={activeShop}
            />
          )}
        </>
      )}

      {/* Expense Form Modal - Outside content area */}
      {showExpenseForm && activeNav === 'dashboard' && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onExpenseAdded={handleExpenseAdded}
          isDarkMode={isDarkMode}
          isMobile={isMobile}
          activeShop={activeShop}
        />
      )}

      {/* Stock Form Modal - Outside content area */}
      {showStockForm && activeNav === 'dashboard' && (
        <StockForm
          onClose={() => setShowStockForm(false)}
          onStockAdded={handleStockAdded}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
