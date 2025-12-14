import React from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { Home, Package, ShoppingCart, DollarSign, Settings, BarChart3, Store } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, show, handleClose, isDarkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'stocks', label: 'My Stocks', icon: Package },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'shops', label: 'Shops', icon: Store },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="d-none d-lg-flex flex-column"
        style={{
          width: '250px',
          height: '100vh',
          backgroundColor: isDarkMode ? '#2d2d44' : '#f8f9fa',
          borderRight: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
          padding: '20px 0',
          position: 'fixed',
          left: 0,
          top: '60px',
          overflowY: 'auto'
        }}
      >
        <Nav className="flex-column gap-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Nav.Link
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="d-flex align-items-center gap-2"
                style={{
                  backgroundColor: activeTab === item.id 
                    ? isDarkMode ? '#8b5cf6' : '#6366f1'
                    : 'transparent',
                  color: activeTab === item.id 
                    ? 'white'
                    : isDarkMode ? '#e0e0e0' : '#333',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem'
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="d-lg-none"
        style={{
          backgroundColor: isDarkMode ? '#2d2d44' : '#f8f9fa'
        }}
      >
        <Offcanvas.Header closeButton style={{ borderBottom: `1px solid ${isDarkMode ? '#444' : '#ddd'}` }}>
          <Offcanvas.Title style={{ color: isDarkMode ? '#e0e0e0' : '#333' }}>
            🏪 Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Nav.Link
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    handleClose();
                  }}
                  className="d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: activeTab === item.id 
                      ? isDarkMode ? '#8b5cf6' : '#6366f1'
                      : 'transparent',
                    color: activeTab === item.id 
                      ? 'white'
                      : isDarkMode ? '#e0e0e0' : '#333',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Nav.Link>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
