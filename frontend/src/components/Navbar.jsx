import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Moon, Sun, LogOut } from 'lucide-react';

const BootstrapNavbar = ({ isDarkMode, setIsDarkMode, user, onLogout }) => {
  const [expanded, setExpanded] = useState(false);

  const navBg = isDarkMode ? '#0f172a' : '#ffffff';
  const navBorder = isDarkMode ? '#333' : '#e5e7eb';
  const textColor = isDarkMode ? '#e0e0e0' : '#1a1a1a';
  const secondaryText = isDarkMode ? '#9ca3b8' : '#666';

  return (
    <Navbar 
      expand="lg" 
      sticky="top"
      style={{
        backgroundColor: navBg,
        borderBottom: `2px solid ${navBorder}`,
        padding: '12px 0',
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        zIndex: 1000,
        position: 'relative'
      }}
    >
      <Container fluid style={{ paddingLeft: '20px', paddingRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Navbar.Brand 
          href="#" 
          className="fw-bold"
          style={{ 
            fontSize: '1.6rem', 
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginRight: '30px'
          }}
        >
          🏪 ProShop
        </Navbar.Brand>
        
        {/* Hamburger Toggle */}
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          style={{ 
            borderColor: isDarkMode ? '#666' : '#ccc',
            outline: 'none'
          }}
        />
        
        {/* Navigation Items */}
        <Navbar.Collapse id="basic-navbar-nav" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Nav className="ms-auto align-items-center" style={{ gap: '12px', display: 'flex', alignItems: 'center' }}>
            {/* User Info */}
            {user && (
              <div 
                style={{ 
                  color: secondaryText,
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  marginRight: '16px',
                  paddingRight: '16px',
                  borderRight: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`
                }}
              >
                👤 <span style={{ color: textColor }}>{user.username}</span>
              </div>
            )}
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
                  : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                whiteSpace: 'nowrap',
                zIndex: 1001,
                position: 'relative',
                visibility: 'visible'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun size={16} style={{ flexShrink: 0 }} />
                  <span className="d-none d-sm-inline">Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} style={{ flexShrink: 0 }} />
                  <span className="d-none d-sm-inline">Dark</span>
                </>
              )}
            </button>
            
            {/* Logout Button */}
            {user && (
              <button
                onClick={onLogout}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #f87171)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  whiteSpace: 'nowrap',
                  zIndex: 1001,
                  position: 'relative',
                  visibility: 'visible'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
                title="Logout from your account"
              >
                <LogOut size={16} style={{ flexShrink: 0 }} />
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BootstrapNavbar;
