import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Also log to console so devs can see stack traces
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0b1220', color: 'white' }}>
          <div style={{ maxWidth: 900 }}>
            <h1 style={{ marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ marginBottom: 12, color: '#fca5a5' }}>{this.state.error?.toString()}</p>
            <pre style={{ whiteSpace: 'pre-wrap', color: '#e5e7eb', background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
              {this.state.info?.componentStack || this.state.error?.stack}
            </pre>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', borderRadius: 8, background: '#7c3aed', color: 'white', border: 'none' }}>Reload</button>
              <button onClick={() => { this.setState({ error: null, info: null }); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#374151', color: 'white', border: 'none' }}>Dismiss</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
