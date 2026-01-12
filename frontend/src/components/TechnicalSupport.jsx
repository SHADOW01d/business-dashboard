import React, { useState } from 'react';
import { MessageCircle, Phone, HelpCircle, X, ChevronDown, ChevronUp, Book, Settings, AlertCircle, CheckCircle } from 'lucide-react';

export default function TechnicalSupport({ isDarkMode, isMobile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('contact');

  const whatsappNumber = '+254712345678'; // Replace with your actual WhatsApp number
  const whatsappMessage = 'Hi! I need technical support for Business Dashboard. I\'m having issues with: ';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const instructions = [
    {
      title: 'Getting Started',
      icon: Book,
      steps: [
        '1. Sign in with your credentials',
        '2. Select your shop from the dropdown',
        '3. Add your products to inventory',
        '4. Start recording sales and expenses',
        '5. View analytics and reports'
      ]
    },
    {
      title: 'Dashboard Navigation',
      icon: Settings,
      steps: [
        'Dashboard: Overview of your business',
        'Stocks: Manage inventory and products',
        'Sales: Record daily sales transactions',
        'Expenses: Track business expenses',
        'Analytics: View detailed reports'
      ]
    },
    {
      title: 'Common Issues',
      icon: AlertCircle,
      steps: [
        'Can\'t login: Check credentials and internet',
        'Data not loading: Refresh the page',
        'Slow performance: Clear browser cache',
        'Mobile issues: Use latest browser version',
        'Sync problems: Check internet connection'
      ]
    }
  ];

  const quickTips = [
    { icon: CheckCircle, text: 'Always save your work before leaving' },
    { icon: CheckCircle, text: 'Use desktop for better experience' },
    { icon: CheckCircle, text: 'Keep your browser updated' },
    { icon: CheckCircle, text: 'Backup your data regularly' }
  ];

  if (isMobile) {
    console.log('TechnicalSupport: Mobile view detected, rendering floating button');
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        {/* Floating Support Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <MessageCircle size={24} />
        </button>

        {/* Mobile Support Panel */}
        {isExpanded && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            width: '320px',
            maxHeight: '400px',
            background: isDarkMode ? '#1a1a3f' : '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
          }}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ 
                margin: 0, 
                color: isDarkMode ? '#ffffff' : '#1f2937',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Technical Support
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '16px', maxHeight: '280px', overflowY: 'auto' }}>
              {/* WhatsApp Contact */}
              <div style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle size={20} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Chat on WhatsApp</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Get instant support</div>
                  </div>
                </a>
              </div>

              {/* Quick Instructions */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  color: isDarkMode ? '#ffffff' : '#1f2937',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Quick Tips:
                </h4>
                {quickTips.slice(0, 2).map((tip, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <tip.icon size={14} color={isDarkMode ? '#10b981' : '#059669'} />
                    <span style={{ 
                      fontSize: '12px', 
                      color: isDarkMode ? '#d1d5db' : '#4b5563'
                    }}>
                      {tip.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div style={{
                background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '6px',
                padding: '10px'
              }}>
                <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  <div style={{ marginBottom: '4px' }}>📱 Available: 9AM - 6PM</div>
                  <div>⚡ Response time: ~5 minutes</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div style={{
      background: isDarkMode ? '#1a1a3f' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      padding: '24px',
      margin: '20px 0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HelpCircle size={20} color="white" />
          </div>
          <div>
            <h3 style={{ 
              margin: 0, 
              color: isDarkMode ? '#ffffff' : '#1f2937',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Technical Support Center
            </h3>
            <p style={{ 
              margin: 0, 
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              fontSize: '14px'
            }}>
              Get help and learn how to use the platform
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
      }}>
        {['contact', 'instructions', 'tips'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              color: activeSection === tab 
                ? (isDarkMode ? '#3b82f6' : '#2563eb')
                : (isDarkMode ? '#9ca3af' : '#6b7280'),
              borderBottom: activeSection === tab 
                ? `2px solid ${isDarkMode ? '#3b82f6' : '#2563eb'}`
                : 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeSection === tab ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ minHeight: '300px' }}>
        {activeSection === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* WhatsApp Contact */}
            <div style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white'
            }}>
              <MessageCircle size={32} style={{ marginBottom: '16px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                WhatsApp Support
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9 }}>
                Get instant help from our technical team via WhatsApp
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <Phone size={16} />
                Start Chat
              </a>
            </div>

            {/* Contact Info */}
            <div style={{
              background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
            }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                color: isDarkMode ? '#ffffff' : '#1f2937',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Support Information
              </h4>
              <div style={{ color: isDarkMode ? '#d1d5db' : '#4b5563', fontSize: '14px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>📱 Available Hours:</strong> 9:00 AM - 6:00 PM
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>⚡ Response Time:</strong> Usually within 5 minutes
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>🌍 Language:</strong> English & Swahili
                </div>
                <div>
                  <strong>🎯 Priority Support:</strong> Available for premium users
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'instructions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {instructions.map((section, index) => (
              <div key={index} style={{
                background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <section.icon size={24} color={isDarkMode ? '#3b82f6' : '#2563eb'} />
                  <h4 style={{ 
                    margin: 0, 
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {section.title}
                  </h4>
                </div>
                <div style={{ color: isDarkMode ? '#d1d5db' : '#4b5563', fontSize: '14px' }}>
                  {section.steps.map((step, stepIndex) => (
                    <div key={stepIndex} style={{ marginBottom: '8px', lineHeight: '1.5' }}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'tips' && (
          <div>
            <div style={{
              background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`
            }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                color: isDarkMode ? '#ffffff' : '#1f2937',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Pro Tips for Better Experience
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {quickTips.map((tip, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: isDarkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.02)',
                    borderRadius: '8px'
                  }}>
                    <tip.icon size={20} color={isDarkMode ? '#10b981' : '#059669'} />
                    <span style={{ 
                      color: isDarkMode ? '#d1d5db' : '#4b5563',
                      fontSize: '14px'
                    }}>
                      {tip.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
