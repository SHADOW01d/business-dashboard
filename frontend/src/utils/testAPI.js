// Quick API Test Script
import { API_BASE_URL } from '../config';
import { getCsrfToken } from './csrf';

export const testLowStockAlerts = async () => {
  console.log('🧪 Testing Low Stock Alerts API...');
  
  try {
    // First test if we can get CSRF token
    console.log('🔐 Getting CSRF token...');
    const csrfToken = await getCsrfToken();
    console.log('✅ CSRF token obtained:', csrfToken ? `${csrfToken.substring(0, 10)}...` : 'None');
    
    // Test the low stock alerts endpoint
    console.log('📡 Testing GET /api/sales/low_stock_alerts/');
    const response = await fetch(`${API_BASE_URL}/api/sales/low_stock_alerts/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Data:', data);
      console.log('📈 Total alerts:', data.total_alerts);
      console.log('📦 Alert items:', data.items?.length || 0);
      return { success: true, data };
    } else {
      console.log('❌ Failed with status:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('📄 Error data:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    return { success: false, error: error.message };
  }
};

export const testStockCreation = async () => {
  console.log('🧪 Testing Stock Creation API...');
  
  try {
    const csrfToken = await getCsrfToken();
    console.log('✅ CSRF token for stock test:', csrfToken ? `${csrfToken.substring(0, 10)}...` : 'None');
    
    const testData = {
      name: 'Test Product',
      category: 'Test Category',
      price: 100,
      quantity_in_stock: 5,
      min_stock_level: 10,
      shop: 1, // Assuming shop ID 1 exists
    };
    
    console.log('📦 Creating test stock:', testData);
    
    const response = await fetch(`${API_BASE_URL}/api/stocks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
      body: JSON.stringify(testData),
    });
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Stock created successfully:', data);
      return { success: true, data };
    } else {
      console.log('❌ Stock creation failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('📄 Error data:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('💥 Stock creation error:', error);
    return { success: false, error: error.message };
  }
};

export const testSalesCreation = async () => {
  console.log('🧪 Testing Sales Creation API...');
  
  try {
    const csrfToken = await getCsrfToken();
    console.log('✅ CSRF token for sales test:', csrfToken ? `${csrfToken.substring(0, 10)}...` : 'None');
    
    const testData = {
      stock: 1, // Assuming stock ID 1 exists
      quantity: 2,
      unit_price: 50,
      total_amount: 100,
      shop: 1, // Assuming shop ID 1 exists
    };
    
    console.log('💰 Creating test sale:', testData);
    
    const response = await fetch(`${API_BASE_URL}/api/sales/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
      body: JSON.stringify(testData),
    });
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sale created successfully:', data);
      return { success: true, data };
    } else {
      console.log('❌ Sale creation failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('📄 Error data:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('💥 Sales creation error:', error);
    return { success: false, error: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Starting API Test Suite');
  console.log('=====================================');
  
  await testLowStockAlerts();
  console.log('-------------------------------------');
  
  await testStockCreation();
  console.log('-------------------------------------');
  
  await testSalesCreation();
  console.log('-------------------------------------');
  
  console.log('✅ Test suite complete!');
  console.log('=====================================');
};

// Make available in window for easy testing
if (typeof window !== 'undefined') {
  window.testAPI = {
    testLowStockAlerts,
    testStockCreation,
    testSalesCreation,
    runAllTests
  };
  
  console.log('🧪 API tests available. Run:');
  console.log('  window.testAPI.runAllTests()');
  console.log('  window.testAPI.testLowStockAlerts()');
  console.log('  window.testAPI.testStockCreation()');
  console.log('  window.testAPI.testSalesCreation()');
}
