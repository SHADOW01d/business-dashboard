import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Plus, BarChart3, Settings, Menu, Calendar, Search, Moon, Sun, LogOut, Home, Package, PieChart, RefreshCw, X } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import StockForm from '../components/StockForm';
import SalesForm from '../components/SalesForm';
import ExpenseForm from '../components/ExpenseForm';
import IncomingStockForm from '../components/IncomingStockForm';
import StockDetailsModal from '../components/StockDetailsModal';
import KPIDashboard from '../components/KPIDashboard';
import ReportGenerator from '../components/ReportGenerator';
import IncomeExpensesChart from '../components/IncomeExpensesChart';
import ProfitAnalysis from '../components/ProfitAnalysis';
import LowStockAlerts from '../components/LowStockAlerts';
import SettingsPage from './SettingsPage';
import { API_BASE_URL } from '../config';
import { t } from '../translations';

export default function Dashboard({ user, onLogout, isDarkMode, setIsDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 400);
  const [refreshing, setRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const sidebarRef = useRef(null);
  const touchStartRef = useRef(0);
  const lastScrollY = useRef(0);

  // Keep sidebar closed by default on all devices
  useEffect(() => {
    setSidebarOpen(false);
  }, [isMobile]);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const smallMobile = window.innerWidth <= 400;
      setIsMobile(mobile);
      setIsSmallMobile(smallMobile);
          };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide/show bottom nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowBottomNav(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowBottomNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Swipe gestures for sidebar
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (isMobile) {
        const touchX = e.touches[0].clientX;
        const diff = touchX - touchStartRef.current;
        
        // If swiping right from left edge, open sidebar
        if (touchStartRef.current < 100 && diff > 25) {
          setSidebarOpen(true);
        }
        // If swiping left while sidebar is open, close it
        if (sidebarOpen && diff < -30) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, sidebarOpen]);

  // Pull-to-refresh functionality
  useEffect(() => {
    let startY = 0;
    let pulled = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].pageY;
      pulled = false;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].pageY;
      const diff = currentY - startY;

      if (window.scrollY === 0 && diff > 50 && !pulled) {
        setRefreshing(true);
        pulled = true;
        
        // Simulate refresh with timeout
        setTimeout(() => {
          fetchDataRef.current();
          setRefreshing(false);
        }, 1000);
      }
    };

    if (isMobile) {
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      
      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isMobile]);

  const generateWeekData = useCallback(() => {
    const data = [];
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Show 3 days before today, today, and 4 days after today (8 days total)
    for (let i = -3; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay();
      const dayName = dayNames[dayOfWeek];
      const shortDayName = shortDayNames[dayOfWeek];
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let displayLabel;
      if (i === -1) {
        displayLabel = `Yesterday (${shortDayName})`;
      } else if (i === 0) {
        displayLabel = `Today (${shortDayName})`;
      } else if (i === 1) {
        displayLabel = `Tomorrow (${shortDayName})`;
      } else {
        displayLabel = `${dayName}, ${dateStr}`;
      }

      data.push({
        date: date.toISOString().split('T')[0],
        day: displayLabel,
        shortDay: shortDayName,
        dayOffset: i,
        isToday: i === 0,
        isPast: i < 0,
        isFuture: i > 0,
        income: 0,
        expenses: 0,
      });
    }

    return data;
  }, []);

  const fetchDataRef = useRef();

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
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    // Fetch user settings to get language preference
    fetchUserSettings();
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const smallMobile = window.innerWidth <= 400;
      setIsMobile(mobile);
      setIsSmallMobile(smallMobile);
          };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide/show bottom nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowBottomNav(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowBottomNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Pull-to-refresh functionality
  useEffect(() => {
    let startY = 0;
    let pulled = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].pageY;
      pulled = false;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].pageY;
      const diff = currentY - startY;

      if (window.scrollY === 0 && diff > 50 && !pulled) {
        setRefreshing(true);
        pulled = true;
        
        // Simulate refresh with timeout
        setTimeout(() => {
          fetchDataRef.current();
          setRefreshing(false);
        }, 1000);
      }
    };

    if (isMobile) {
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      
      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isMobile]);

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
    console.log('handleSaleAdded called with:', newSale, 'fromServer:', fromServer);
    setSales([newSale, ...sales]);
    setShowSalesForm(false);
    setSelectedStock(null); // Clear selected stock after sale
    
    // Show success message
    setSuccessMessage(`Sale recorded: ${newSale.quantity} × ${newSale.stock_name}`);
    setTimeout(() => setSuccessMessage(''), 3000);
    
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
    
    // Update stock immediately in local state
    setStocks(prevStocks => {
      console.log('Current stocks:', prevStocks);
      return prevStocks.map(stock => {
        const stockId = typeof newSale.stock === 'object' ? newSale.stock.id : newSale.stock;
        console.log('Comparing:', stock.id, 'vs', stockId, 'for stock:', stock.name);
        
        if (stock.id == stockId || stock.name === newSale.stock_name) {
          console.log('✓ Updating stock:', stock.name);
          return {
            ...stock,
            quantity_in_stock: Math.max(0, stock.quantity_in_stock - newSale.quantity),
            quantity_sold: (stock.quantity_sold || 0) + newSale.quantity,
            // Add a temporary flag to show visual feedback
            _justUpdated: true
          };
        }
        return stock;
      });
    });
    
    // Remove the visual feedback flag after animation
    setTimeout(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => ({ ...stock, _justUpdated: false }))
      );
    }, 1000);

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

  const handleDownloadReport = async (period) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/analytics/report_data/?type=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create a simple text report
        const reportContent = `
BUSINESS REPORT - ${period.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

PERIOD: ${data.date_range.start} to ${data.date_range.end}

SUMMARY:
- Total Income: ₹${data.summary.total_income.toLocaleString('en-IN')}
- Total Expenses: ₹${data.summary.total_expenses.toLocaleString('en-IN')}
- Net Income: ₹${data.summary.net_profit.toLocaleString('en-IN')}
- Total Sales: ${data.summary.total_sales}
- Total Items Sold: ${data.summary.total_items_sold}
- Total Stocks: ${data.summary.total_stocks}

Generated by ProShop Business Dashboard
        `.trim();

        // Create and download the report as a text file
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `business-report-${period}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to generate report');
        alert('Failed to generate report. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please check your connection and try again.');
    }
    setShowReportDropdown(false);
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
    { id: 'dashboard', label: t(language, 'dashboard'), icon: Home },
    { id: 'stocks', label: t(language, 'myStocks'), icon: Package },
    { id: 'sales', label: t(language, 'sales'), icon: Calendar },
    { id: 'expenses', label: t(language, 'expenses'), icon: DollarSign },
    { id: 'analytics', label: t(language, 'analytics'), icon: PieChart },
  ];

  // Use the weekly chart data from state (persists across days)
  const dailyData = weeklyChartData.length > 0 ? weeklyChartData : [];

  // Calculate totals from this week's data - reactive to weeklyChartData changes
  const todayRevenue = useMemo(() => 
    dailyData.reduce((sum, day) => sum + day.income, 0), 
    [dailyData]
  );
  const totalExpensesAmount = useMemo(() => 
    dailyData.reduce((sum, day) => sum + day.expenses, 0), 
    [dailyData]
  );
  const netIncome = useMemo(() => 
    todayRevenue - totalExpensesAmount, 
    [todayRevenue, totalExpensesAmount]
  );

  // Filter sales and expenses based on search term
  const filteredSales = sales.filter(sale =>
    sale.stock_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobile-optimized card layouts for tables
  const renderSalesCards = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {filteredSales.map(sale => (
        <div
          key={sale.id}
          style={{
            background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${borderColor}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', color: textColor, fontSize: '16px' }}>{sale.stock_name}</span>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '16px' }}>{sale.total_amount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: secondaryText, fontSize: '14px' }}>Quantity: {sale.quantity}</span>
            <span style={{ color: secondaryText, fontSize: '14px' }}>Price: {sale.price_per_unit.toLocaleString()}</span>
          </div>
          <div style={{ color: secondaryText, fontSize: '12px', textAlign: 'right' }}>
            {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderExpenseCards = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {filteredExpenses.map(expense => (
        <div
          key={expense.id}
          style={{
            background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', color: textColor, fontSize: '16px' }}>{expense.description}</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '16px' }}>₹{expense.amount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ 
              background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
              color: isDarkMode ? '#d8b4fe' : '#7c3aed',
              padding: '4px 8px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {expense.category}
            </span>
          </div>
          <div style={{ color: secondaryText, fontSize: '12px', textAlign: 'right' }}>
            {new Date(expense.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );

  // Mobile action sheet (like WhatsApp)
  const ActionSheet = () => (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: isDarkMode ? '#1a1a3f' : '#ffffff',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: '20px',
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)',
      zIndex: 2000,
      maxHeight: '80vh',
      overflowY: 'auto',
    }}>
      {/* Draggable handle */}
      <div style={{
        width: '40px',
        height: '4px',
        background: secondaryText,
        borderRadius: '2px',
        margin: '0 auto 20px auto',
        opacity: 0.5
      }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => {
            setShowActionSheet(false);
            setShowSalesForm(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'none',
            border: 'none',
            color: textColor,
            fontSize: '16px',
            width: '100%',
            textAlign: 'left',
            borderRadius: '12px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plus color="white" size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>New Sale</div>
            <div style={{ fontSize: '12px', color: secondaryText }}>Record a product sale</div>
          </div>
        </button>

        <button
          onClick={() => {
            setShowActionSheet(false);
            setShowExpenseForm(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'none',
            border: 'none',
            color: textColor,
            fontSize: '16px',
            width: '100%',
            textAlign: 'left',
            borderRadius: '12px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign color="white" size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>New Expense</div>
            <div style={{ fontSize: '12px', color: secondaryText }}>Add business expense</div>
          </div>
        </button>

        <button
          onClick={() => {
            setShowActionSheet(false);
            setShowStockForm(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'none',
            border: 'none',
            color: textColor,
            fontSize: '16px',
            width: '100%',
            textAlign: 'left',
            borderRadius: '12px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingCart color="white" size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>New Stock</div>
            <div style={{ fontSize: '12px', color: secondaryText }}>Add new product to inventory</div>
          </div>
        </button>
      </div>

      <button
        onClick={() => setShowActionSheet(false)}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '16px',
          background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          color: textColor,
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        Cancel
      </button>
    </div>
  );

  // Pull-to-refresh indicator
  const PullToRefreshIndicator = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      zIndex: 1001,
      transform: refreshing ? 'translateY(0)' : 'translateY(-50px)',
      transition: 'transform 0.3s ease'
    }}>
      <div style={{
        background: isDarkMode ? 'rgba(139, 92, 246, 0.9)' : 'rgba(139, 92, 246, 0.8)',
        borderRadius: '20px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
        {refreshing ? 'Refreshing...' : 'Pull to refresh'}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: bgGradient, 
      display: 'flex', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      paddingBottom: isMobile ? '70px' : '0' // Space for bottom nav
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${bgGradient}; }
        button { cursor: pointer; border: none; font-family: inherit; }
        input { font-family: inherit; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 4px; }
        
        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          input, button, select, textarea {
            font-size: 16px !important; /* Prevents iOS zoom */
          }
        }
        
        /* Success message animation */
        @keyframes slideInDown {
          from {
            transform: translate(-50%, -100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        /* Touch targets */
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
        
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>

      {/* Pull-to-refresh indicator */}
      {isMobile && <PullToRefreshIndicator />}

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '14px',
          zIndex: 2000,
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          animation: 'slideInDown 0.3s ease'
        }}>
          ✓ {successMessage}
        </div>
      )}

      
      {/* Sidebar - Hidden on mobile */}
      <div 
        ref={sidebarRef}
        style={{
          width: isMobile ? '0' : (sidebarOpen ? '256px' : '80px'),
          background: isDarkMode ? 'linear-gradient(to bottom, #0f0f1f, #1a0f3f)' : 'linear-gradient(to bottom, #f5f0ff, #ede9fe)',
          borderRight: isMobile ? 'none' : `1px solid ${borderColor}`,
          transition: 'transform 0.3s ease, width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
          zIndex: 1000,
          transform: isMobile ? 'translateX(-100%)' : 'translateX(0)',
          overflow: 'hidden'
        }}
      >
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
                onClick={() => {
                  setActiveNav(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className="touch-target no-select"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: activeNav === item.id ? 'linear-gradient(135deg, #3b82f6, #a855f7)' : 'transparent',
                  color: activeNav === item.id ? 'white' : secondaryText,
                  transition: 'all 0.3s',
                  fontSize: '16px',
                  fontWeight: activeNav === item.id ? '600' : '400',
                  minHeight: '56px'
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
                <Icon size={24} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
          
          {/* Sidebar Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="touch-target no-select"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                borderRadius: '12px',
                background: 'transparent',
                color: secondaryText,
                transition: 'all 0.3s',
                fontSize: '16px',
                fontWeight: '400',
                minHeight: '56px',
                marginTop: 'auto',
                border: 'none'
              }}
            >
              <Menu size={24} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </button>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: isMobile ? '0' : (sidebarOpen ? '256px' : '80px'), 
        flex: 1, 
        transition: 'all 0.3s', 
        display: 'flex', 
        flexDirection: 'column',
        width: isMobile ? '100%' : 'auto',
        position: 'relative'
      }}>
        {/* Header - Sticky */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          background: isDarkMode ? 'linear-gradient(to right, #0f172a, #4c0519, #0f172a)' : 'linear-gradient(to right, #f0f4f8, #e0d5f0, #f0f4f8)', 
          borderBottom: `1px solid ${borderColor}`, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            padding: isMobile ? '16px' : '24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: isMobile ? '12px' : '24px' 
          }}>
            {/* Left Section - Title Only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ 
                fontSize: isMobile ? '20px' : '32px', 
                fontWeight: 'bold', 
                background: 'linear-gradient(to right, #60a5fa, #c084fc)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                margin: 0 
              }}>
                {activeNav === 'dashboard' ? 'Dashboard' : 
                 activeNav === 'stocks' ? 'Stocks' :
                 activeNav === 'sales' ? 'Sales' :
                 activeNav === 'expenses' ? 'Expenses' :
                 activeNav === 'analytics' ? 'Analytics' : 'Settings'}
              </h1>
              {activeNav === 'dashboard' && (
                <p style={{ 
                  color: secondaryText, 
                  fontSize: isMobile ? '12px' : '14px', 
                  marginTop: '2px',
                  display: isMobile ? 'none' : 'block'
                }}>
                  Welcome, {user.first_name || user.username}!
                </p>
              )}
            </div>

            {/* Right Section - Download Report + Add Sale + User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Download Report Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowReportModal(true)}
                  style={{
                    background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#1a1a1a',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                  }}
                >
                  📊 Report
                </button>
              </div>
              
              {/* Add Sale Button - Desktop Only */}
              {!isMobile && (
                <button
                  onClick={() => setShowSalesForm(true)}
                  className="touch-target no-select"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s',
                    minHeight: '44px'
                  }}
                >
                  <Plus size={20} />
                  Add Sale
                </button>
              )}
              
              {/* Three Dots Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="touch-target no-select"
                  style={{
                    width: '44px',
                    height: '44px',
                    background: 'transparent',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      background: textColor 
                    }}></div>
                    <div style={{ 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      background: textColor 
                    }}></div>
                    <div style={{ 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      background: textColor 
                    }}></div>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'transparent',
                        zIndex: 999
                      }}
                      onClick={() => setShowUserMenu(false)}
                    />
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
                      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${borderColor}` }}>
                        <p style={{ margin: 0, fontWeight: '600', color: textColor, fontSize: '14px' }}>{user.username}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: secondaryText }}>{user.email || 'No email'}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsDarkMode(!isDarkMode);
                          setShowUserMenu(false);
                        }}
                        className="touch-target no-select"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'none',
                          color: textColor,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNav('settings');
                          setShowUserMenu(false);
                        }}
                        className="touch-target no-select"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'none',
                          color: textColor,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={onLogout}
                        className="touch-target no-select"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'none',
                          color: '#ef4444',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          padding: isMobile ? '16px' : '32px', 
          overflowY: 'auto', 
          maxHeight: 'calc(100vh - 100px)',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
        }}>
          {activeNav === 'dashboard' && (
            <>
              {/* Low Stock Alerts */}
              <LowStockAlerts isDarkMode={isDarkMode} isMobile={isMobile} />

              {/* Stats Cards - Mobile optimized */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isSmallMobile ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))'), 
                gap: isMobile ? '12px' : '24px', 
                marginBottom: '24px' 
              }}>
                {[
                  { label: "Today's Revenue", value: todayRevenue.toLocaleString(), icon: DollarSign, color: '#10b981', trend: 'Revenue' },
                  { label: 'Expenses', value: totalExpensesAmount.toLocaleString(), icon: BarChart3, color: '#ef4444', trend: 'Costs' },
                  { label: 'Net Profit', value: netIncome.toLocaleString(), icon: TrendingUp, color: '#3b82f6', trend: 'Revenue - Expenses' },
                  { label: 'Total Stocks', value: stocks.length, icon: ShoppingCart, color: '#f97316', trend: 'Products' },
                ].map((card, index) => (
                  <div
                    key={index}
                    style={{
                      background: cardBg,
                      borderRadius: '16px',
                      padding: isMobile ? '20px' : '24px',
                      border: `1px solid ${borderColor}`,
                      boxShadow: isDarkMode 
                        ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                        : '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          color: secondaryText, 
                          fontSize: isMobile ? '12px' : '13px', 
                          margin: '0 0 8px 0',
                          fontWeight: '500'
                        }}>
                          {card.label}
                        </p>
                        <h3 style={{ 
                          color: textColor, 
                          fontSize: isMobile ? '24px' : '32px', 
                          fontWeight: 'bold', 
                          margin: '0 0 4px 0',
                          lineHeight: '1.2'
                        }}>
                          {card.value}
                        </h3>
                        <p style={{ 
                          color: card.color, 
                          fontSize: isMobile ? '11px' : '12px', 
                          margin: 0,
                          display: isMobile ? 'none' : 'block'
                        }}>
                          ↑ {card.trend}
                        </p>
                      </div>
                      <div style={{ 
                        background: `rgba(${card.color === '#10b981' ? '16, 185, 129' : card.color === '#3b82f6' ? '59, 130, 246' : card.color === '#a855f7' ? '168, 85, 247' : '249, 115, 22'}, 0.15)`, 
                        padding: isMobile ? '12px' : '16px', 
                        borderRadius: '12px',
                        minWidth: isMobile ? '44px' : 'auto',
                        minHeight: isMobile ? '44px' : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <card.icon color={card.color} size={isMobile ? 20 : 28} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* KPI Dashboard */}
              <div style={{ marginBottom: '24px' }}>
                <KPIDashboard sales={sales} isDarkMode={isDarkMode} isMobile={isMobile} />
              </div>

              {/* Income & Expenses Chart */}
              <IncomeExpensesChart 
                isDarkMode={isDarkMode} 
                isMobile={isMobile} 
                data={weeklyChartData}
                todayIncome={todayRevenue}
                totalExpenses={totalExpensesAmount}
              />
            </>
          )}

          {/* Report Selection Modal */}
          {showReportModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}>
              <div style={{
                background: isDarkMode ? '#1a1a3f' : '#ffffff',
                borderRadius: '16px',
                padding: isMobile ? '24px' : '32px',
                maxWidth: '400px',
                width: '100%',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    color: isDarkMode ? '#ffffff' : '#1a1a1a',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📊 Download Report
                  </h3>
                  <button
                    onClick={() => setShowReportModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#9ca3b8' : '#666',
                      fontSize: '24px',
                      cursor: 'pointer',
                      padding: '0',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    color: isDarkMode ? '#ffffff' : '#1a1a1a',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    📅 Report Period
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px'
                  }}>
                    {[
                      { value: 'daily', label: 'Daily', icon: '📄' },
                      { value: 'weekly', label: 'Weekly', icon: '📊' },
                      { value: 'monthly', label: 'Monthly', icon: '🗓️' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedPeriod(option.value)}
                        style={{
                          background: selectedPeriod === option.value 
                            ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                            : isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                          color: selectedPeriod === option.value ? 'white' : (isDarkMode ? '#ffffff' : '#1a1a1a'),
                          padding: '12px',
                          borderRadius: '8px',
                          border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    color: isDarkMode ? '#ffffff' : '#1a1a1a',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    📄 File Format
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    {[
                      { value: 'pdf', label: 'PDF Document', icon: '📄', desc: 'Best for printing and sharing' },
                      { value: 'docx', label: 'Word Document', icon: '📝', desc: 'Editable format' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedFormat(option.value)}
                        style={{
                          background: selectedFormat === option.value 
                            ? 'linear-gradient(135deg, #10b981, #059669)' 
                            : isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                          color: selectedFormat === option.value ? 'white' : (isDarkMode ? '#ffffff' : '#1a1a1a'),
                          padding: '16px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{option.icon}</span>
                        <div>{option.label}</div>
                        <div style={{ 
                          fontSize: '11px', 
                          opacity: 0.8,
                          fontWeight: '400'
                        }}>{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setShowReportModal(false)}
                    style={{
                      background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                      color: isDarkMode ? '#ffffff' : '#1a1a1a',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadReport(selectedPeriod);
                      setShowReportModal(false);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    📥 Download {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} {selectedFormat.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'stocks' && (
            <div style={{ 
              background: cardBg, 
              borderRadius: '16px', 
              padding: isMobile ? '20px' : '32px', 
              border: `1px solid ${borderColor}` 
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <h2 style={{ 
                  fontSize: isMobile ? '20px' : '24px', 
                  fontWeight: 'bold', 
                  color: textColor, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  margin: 0 
                }}>
                  <ShoppingCart color="#60a5fa" /> My Stocks
                </h2>
                <button
                  onClick={() => setShowStockForm(true)}
                  className="touch-target no-select"
                  style={{ 
                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                    color: 'white', 
                    padding: isMobile ? '12px 16px' : '10px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    fontSize: isMobile ? '14px' : '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '44px'
                  }}
                >
                  <Plus size={20} /> Add Stock
                </button>
              </div>

              {showStockForm && <StockForm onClose={() => setShowStockForm(false)} onStockAdded={handleStockAdded} isDarkMode={isDarkMode} isMobile={isMobile} />}
              
              {showIncomingStockForm && (
                <IncomingStockForm 
                  stockId={showIncomingStockForm} 
                  onClose={() => setShowIncomingStockForm(null)} 
                  onStockUpdated={handleStockUpdated} 
                  isDarkMode={isDarkMode} 
                  isMobile={isMobile} 
                />
              )}
              
              {showSalesForm && (
                <SalesForm 
                  stocks={stocks} 
                  selectedStock={selectedStock}
                  onClose={() => setShowSalesForm(false)} 
                  onSaleAdded={handleSaleAdded} 
                  isDarkMode={isDarkMode} 
                  isMobile={isMobile}
                  activeShop={activeShop}
                />
              )}

              {stocks.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                  <ShoppingCart color={secondaryText} size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
                  <p style={{ color: secondaryText, fontSize: '16px' }}>No stocks yet. Add your first product!</p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isSmallMobile ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))'), 
                  gap: isMobile ? '8px' : '16px' 
                }}>
                  {stocks.map(stock => (
                    <div 
                      key={stock.id} 
                      className="touch-target"
                      style={{ 
                        background: stock._justUpdated 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))' 
                          : (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'), 
                        borderRadius: '10px', 
                        padding: isMobile ? '10px' : '16px', 
                        border: stock._justUpdated 
                          ? '2px solid #10b981' 
                          : `1px solid ${borderColor}`,
                        transition: 'all 0.3s',
                        minHeight: isMobile ? '110px' : 'auto',
                        transform: stock._justUpdated ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: stock._justUpdated 
                          ? '0 4px 20px rgba(16, 185, 129, 0.3)' 
                          : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            fontWeight: 'bold', 
                            color: textColor, 
                            fontSize: isMobile ? '12px' : '14px', 
                            margin: 0,
                            marginBottom: '2px',
                            lineHeight: 1.1
                          }}>
                            {stock.name}
                          </h3>
                          <p style={{ 
                            fontSize: isMobile ? '10px' : '11px', 
                            color: secondaryText, 
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {stock.category}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteStock(stock.id)}
                          className="touch-target no-select"
                          style={{ 
                            background: 'none', 
                            color: '#ef4444', 
                            fontSize: '24px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '8px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ 
                          fontSize: isMobile ? '10px' : '11px', 
                          background: 'rgba(168, 85, 247, 0.3)', 
                          color: '#d8b4fe', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontWeight: '600' 
                        }}>
                          {stock.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: isMobile ? '10px' : '11px', color: secondaryText }}>Sold: {stock.quantity_sold}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '8px', 
                        padding: '4px 6px', 
                        background: stock._justUpdated 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))' 
                          : (isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'), 
                        borderRadius: '4px',
                        transition: 'all 0.3s'
                      }}>
                        <span style={{ fontSize: isMobile ? '10px' : '11px', color: secondaryText }}>📦 Remaining:</span>
                        <span style={{ 
                          fontSize: isMobile ? '12px' : '13px', 
                          fontWeight: 'bold', 
                          color: stock._justUpdated ? '#059669' : '#10b981',
                          animation: stock._justUpdated ? 'pulse 1s ease-in-out' : 'none'
                        }}>
                          {stock.quantity_in_stock} units
                          {stock._justUpdated && <span style={{ marginLeft: '8px', fontSize: '12px' }}>✓</span>}
                        </span>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '4px', 
                        marginBottom: '0' 
                      }}>
                        <button
                          onClick={() => setShowIncomingStockForm(stock.id)}
                          className="touch-target no-select"
                          style={{ 
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
                            color: 'white', 
                            padding: isMobile ? '6px 4px' : '8px 6px', 
                            borderRadius: '6px', 
                            fontSize: isMobile ? '14px' : '16px', 
                            fontWeight: '600', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            minHeight: '32px'
                          }}
                        >
                          ➕
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStock(stock);
                            setShowSalesForm(true);
                          }}
                          className="touch-target no-select"
                          style={{ 
                            background: 'linear-gradient(135deg, #a855f7, #9333ea)', 
                            color: 'white', 
                            padding: isMobile ? '6px 4px' : '8px 6px', 
                            borderRadius: '6px', 
                            fontSize: isMobile ? '14px' : '16px', 
                            fontWeight: '600',
                            minHeight: '32px'
                          }}
                        >
                          📤
                        </button>
                        <button
                          onClick={() => setSelectedStockDetails(stock)}
                          className="touch-target no-select"
                          style={{ 
                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
                            color: 'white', 
                            padding: isMobile ? '6px 4px' : '8px 6px', 
                            borderRadius: '6px', 
                            fontSize: isMobile ? '14px' : '16px', 
                            fontWeight: '600',
                            minHeight: '32px'
                          }}
                        >
                          👁️
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
                  isMobile={isMobile}
                />
              )}
            </div>
          )}

          {activeNav === 'sales' && (
            <div style={{ 
              background: cardBg, 
              borderRadius: '16px', 
              padding: isMobile ? '20px' : '32px', 
              border: `1px solid ${borderColor}` 
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <h2 style={{ 
                  fontSize: isMobile ? '20px' : '24px', 
                  fontWeight: 'bold', 
                  color: textColor, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  margin: 0 
                }}>
                  <Calendar color="#60a5fa" /> Today's Sales
                </h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', 
                  padding: isMobile ? '12px' : '8px 16px', 
                  borderRadius: '8px', 
                  border: `1px solid ${borderColor}`,
                  minHeight: '44px'
                }}>
                  <Search size={18} color={secondaryText} style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: textColor, 
                      outline: 'none', 
                      fontSize: '14px', 
                      width: '100%',
                      minHeight: '20px'
                    }}
                  />
                </div>
              </div>

              {filteredSales.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                  <Calendar color={secondaryText} size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
                  <p style={{ color: secondaryText, fontSize: '16px' }}>{searchTerm ? 'No sales found' : 'No sales recorded yet'}</p>
                </div>
              ) : isMobile ? (
                renderSalesCards()
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
            <div style={{ 
              background: cardBg, 
              borderRadius: '16px', 
              padding: isMobile ? '20px' : '32px', 
              border: `1px solid ${borderColor}` 
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <h2 style={{ 
                  fontSize: isMobile ? '20px' : '24px', 
                  fontWeight: 'bold', 
                  color: textColor, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  margin: 0 
                }}>
                  <DollarSign color="#ef4444" /> Daily Expenses
                </h2>
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="touch-target no-select"
                  style={{ 
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                    color: 'white', 
                    padding: isMobile ? '12px 16px' : '10px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '44px'
                  }}
                >
                  <Plus size={20} /> Add Expense
                </button>
              </div>

              {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} onExpenseAdded={handleExpenseAdded} isDarkMode={isDarkMode} isMobile={isMobile} activeShop={activeShop} />}

              {filteredExpenses.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                  <DollarSign color={secondaryText} size={48} style={{ margin: '0 auto', marginBottom: '16px' }} />
                  <p style={{ color: secondaryText, fontSize: '16px' }}>{searchTerm ? 'No expenses found' : 'No expenses recorded yet'}</p>
                </div>
              ) : isMobile ? (
                renderExpenseCards()
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
              <h2 style={{ 
                fontSize: isMobile ? '20px' : '24px', 
                fontWeight: 'bold', 
                color: textColor, 
                marginBottom: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <TrendingUp color="#60a5fa" /> Profit Margin Analysis
              </h2>
              <ProfitAnalysis isDarkMode={isDarkMode} isMobile={isMobile} />
            </div>
          )}

          {activeNav === 'settings' && (
            <SettingsPage 
              isDarkMode={isDarkMode} 
              setIsDarkMode={setIsDarkMode} 
              language={language} 
              onLanguageChange={(newLang) => { setLanguage(newLang); fetchUserSettings(); }}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && showBottomNav && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: isDarkMode ? 'rgba(26, 26, 63, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${borderColor}`,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          zIndex: 1000,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="touch-target no-select"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  color: activeNav === item.id ? (isDarkMode ? '#a855f7' : '#7c3aed') : secondaryText,
                  fontSize: '10px',
                  fontWeight: '500',
                  minWidth: '60px',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Action Sheet Modal (Mobile Only) */}
      {isMobile && showActionSheet && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1999,
              animation: 'fadeIn 0.2s ease'
            }}
            onClick={() => setShowActionSheet(false)}
          />
          <ActionSheet />
        </>
      )}

      {/* Sales Form Modal */}
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
              zIndex: 2000,
              padding: isMobile ? '16px' : '0'
            }}>
              <div style={{
                background: isDarkMode ? '#1a1a3f' : '#ffffff',
                borderRadius: isMobile ? '20px' : '16px',
                padding: isMobile ? '20px' : '32px',
                width: isMobile ? '100%' : '600px',
                maxHeight: isMobile ? '90vh' : '80vh',
                overflowY: 'auto',
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: textColor, margin: 0 }}>Select Product</h2>
                  <button
                    onClick={() => {
                      setShowSalesForm(false);
                      setSelectedStock(null);
                    }}
                    className="touch-target no-select"
                    style={{ background: 'none', border: 'none', fontSize: '24px', color: textColor, width: '44px', height: '44px' }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                  {stocks.map(stock => (
                    <button
                      key={stock.id}
                      onClick={() => setSelectedStock(stock)}
                      className="touch-target no-select"
                      style={{
                        padding: isMobile ? '20px 16px' : '16px',
                        borderRadius: '12px',
                        border: `2px solid ${borderColor}`,
                        background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                        color: textColor,
                        transition: 'all 0.3s',
                        fontWeight: '600',
                        fontSize: isMobile ? '14px' : '13px',
                        minHeight: isMobile ? '60px' : 'auto'
                      }}
                    >
                      {stock.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Sales Form Modal
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
              zIndex: 2000,
              padding: isMobile ? '16px' : '0'
            }}>
              <div style={{
                background: isDarkMode ? '#1a1a3f' : '#ffffff',
                borderRadius: isMobile ? '20px' : '16px',
                padding: isMobile ? '0' : '32px',
                width: isMobile ? '100%' : '600px',
                maxHeight: isMobile ? '95vh' : '80vh',
                overflowY: 'auto',
                border: `1px solid ${borderColor}`,
              }}>
                <SalesForm
                  stock={selectedStock}
                  onClose={() => {
                    setShowSalesForm(false);
                    setSelectedStock(null);
                  }}
                  onSaleAdded={handleSaleAdded}
                  isDarkMode={isDarkMode}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && activeNav === 'dashboard' && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onExpenseAdded={handleExpenseAdded}
          isDarkMode={isDarkMode}
          isMobile={isMobile}
          activeShop={activeShop}
        />
      )}

      {/* Stock Form Modal */}
      {showStockForm && activeNav === 'dashboard' && (
        <StockForm
          onClose={() => setShowStockForm(false)}
          onStockAdded={handleStockAdded}
          isDarkMode={isDarkMode}
          isMobile={isMobile}
        />
      )}

      <>
      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: isDarkMode ? '#1a1a3f' : '#ffffff',
          borderTop: `1px solid ${borderColor}`,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 0',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'stocks', label: 'Stocks', icon: ShoppingCart },
            { id: 'sales', label: 'Sales', icon: Calendar },
            { id: 'expenses', label: 'Expenses', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'none',
                  border: 'none',
                  color: activeNav === item.id ? (isDarkMode ? '#a855f7' : '#7c3aed') : secondaryText,
                  fontSize: '10px',
                  fontWeight: '500',
                  minWidth: '60px',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile FAB - Fixed at bottom right */}
      {isMobile && activeNav === 'dashboard' && (
        <button
          onClick={() => setShowSalesForm(true)}
          className="touch-target no-select"
          style={{
            position: 'fixed',
            bottom: '80px', // Above bottom nav (70px) + 10px gap
            right: '20px',
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
            zIndex: 1001, // Above bottom nav (1000)
            border: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={24} />
        </button>
      )}
      </>
    </div>
  );
}