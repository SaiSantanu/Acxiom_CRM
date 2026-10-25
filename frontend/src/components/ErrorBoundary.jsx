import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AcxiomCRM Component Exception Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div
            className="card border-0 rounded-4 shadow-sm mx-auto p-4 p-md-5"
            style={{ maxWidth: 600, backgroundColor: '#ffffff' }}
          >
            <div className="mb-3">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center p-3"
                style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
              >
                <FiAlertTriangle size={36} />
              </div>
            </div>
            <h4 className="fw-bold mb-2" style={{ color: '#032d60' }}>
              Something went wrong in this module
            </h4>
            <p className="text-secondary small mb-3">
              {this.state.error?.message || 'An unexpected runtime error occurred.'}
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm px-3 rounded-pill fw-bold d-flex align-items-center gap-1"
                style={{ backgroundColor: '#0176d3', border: 'none' }}
                onClick={this.handleReset}
              >
                <FiRefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <a
                href="/"
                className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-semibold d-flex align-items-center gap-1"
              >
                <FiHome size={14} />
                <span>Go to Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
