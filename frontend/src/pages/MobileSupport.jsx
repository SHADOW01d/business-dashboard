import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, CheckCircle, AlertCircle, Book, Settings, HelpCircle, RefreshCw, Wifi, Clock, Shield, Star, ChevronRight, X } from 'lucide-react';

export default function MobileSupport({ isDarkMode, onClose }) {
  const [activeSection, setActiveSection] = useState('instructions');
  const whatsappNumber = '+2550626655098'; // Tanzania WhatsApp number
  const developerName = 'Shadow'; // Developer name
  const whatsappMessage = `Hi ${developerName}! I need technical support for Business Dashboard. I\'m having issues with: `;
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const quickSolutions = [
    {
      title: 'Can\'t Login?',
      icon: Shield,
      steps: ['Check internet connection', 'Verify username/password', 'Clear browser cache', 'Try different browser'],
      color: '#ef4444'
    },
    {
      title: 'App Loading Slow?',
      icon: RefreshCw,
      steps: ['Clear browser cache', 'Check internet speed', 'Close unused tabs', 'Restart browser'],
      color: '#f59e0b'
    },
    {
      title: 'Data Not Syncing?',
      icon: Wifi,
      steps: ['Check internet connection', 'Refresh the page', 'Wait 30 seconds', 'Try again'],
      color: '#3b82f6'
    },
    {
      title: 'Buttons Not Working?',
      icon: AlertCircle,
      steps: ['Tap firmly on buttons', 'Clean screen', 'Restart app', 'Update browser'],
      color: '#8b5cf6'
    }
  ];

  const instructions = [
    {
      title: 'Getting Started',
      icon: Book,
      steps: [
        '1. Tap menu (☰) to open navigation',
        '2. Select your shop from dropdown',
        '3. Add products to inventory first',
        '4. Record sales and expenses daily',
        '5. Check analytics for insights'
      ]
    },
    {
      title: 'Daily Usage',
      icon: Settings,
      steps: [
        'Morning: Check yesterday\'s summary',
        'Afternoon: Add new stock if needed',
        'Evening: Record all sales',
        'Night: Review daily reports',
        'Always: Backup important data'
      ]
    },
    {
      title: 'Mobile Tips',
      icon: HelpCircle,
      steps: [
        'Use Wi-Fi for faster loading',
        'Keep app updated for best performance',
        'Pin app to home screen for quick access',
        'Use landscape mode for better view',
        'Enable auto-rotate for convenience'
      ]
    }
  ];

  const features = [
    { icon: Star, text: 'Fast WhatsApp Support', color: '#25D366' },
    { icon: Clock, text: 'Quick Response Time', color: '#10b981' },
    { icon: Shield, text: 'Secure & Reliable', color: '#3b82f6' },
    { icon: RefreshCw, text: 'Always Improving', color: '#8b5cf6' }
  ];

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#ffffff' : '#1f2937'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: isDarkMode ? '#1a1a3f' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        zIndex: 100,
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            color: isDarkMode ? '#ffffff' : '#1f2937'
          }}>
            Technical Support
          </h3>
          <div style={{ width: '40px' }}></div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', paddingBottom: '100px' }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          overflowX: 'auto'
        }}>
          {['instructions', 'solutions', 'features'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              style={{
                padding: '12px 16px',
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
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeSection === 'instructions' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {instructions.map((section, index) => (
              <div key={index} style={{
                background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <section.icon size={20} color={isDarkMode ? '#3b82f6' : '#2563eb'} />
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

        {activeSection === 'solutions' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {quickSolutions.map((solution, index) => (
              <div key={index} style={{
                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: solution.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <solution.icon size={20} color="white" />
                  </div>
                  <h4 style={{ 
                    margin: 0, 
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {solution.title}
                  </h4>
                </div>
                <div style={{ color: isDarkMode ? '#d1d5db' : '#4b5563', fontSize: '14px' }}>
                  {solution.steps.map((step, stepIndex) => (
                    <div key={stepIndex} style={{ 
                      marginBottom: '6px', 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <CheckCircle size={14} color={isDarkMode ? '#10b981' : '#059669'} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'features' && (
          <div style={{
            background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
          }}>
            <h4 style={{ 
              margin: '0 0 16px 0', 
              color: isDarkMode ? '#ffffff' : '#1f2937',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Why Choose Our Support?
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px'
                }}>
                  <feature.icon size={20} color={feature.color} />
                  <span style={{ 
                    fontSize: '14px', 
                    color: isDarkMode ? '#d1d5db' : '#4b5563'
                  }}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Contact Card - Smaller and at bottom */}
        <div style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <MessageCircle size={18} />
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                Still Need Help?
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                Contact {developerName} directly
              </p>
            </div>
          </div>
          
          <button
            onClick={handleWhatsAppClick}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              padding: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Phone size={14} />
            Chat on WhatsApp
          </button>
          
          <div style={{ 
            marginTop: '8px', 
            fontSize: '10px', 
            opacity: 0.8,
            textAlign: 'center'
          }}>
            📞 {whatsappNumber} | ⚡ ~5min response | 🕐 9AM-6PM
          </div>
        </div>
      </div>
    </div>
  );
}
