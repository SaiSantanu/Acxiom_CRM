import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiAlertTriangle } from 'react-icons/fi';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}
      >
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: 42, height: 42 }}>
          <span className="visually-hidden">Authenticating...</span>
        </div>
        <h6 className="fw-semibold text-secondary">Verifying enterprise session...</h6>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return (
      <div className="container py-5 text-center">
        <div className="p-5 bg-white rounded shadow-sm border mx-auto" style={{ maxWidth: 500 }}>
          <FiAlertTriangle size={48} className="text-warning mb-3" />
          <h4 className="fw-bold text-dark">Access Denied</h4>
          <p className="text-muted small">
            Your role (<strong>{user?.role}</strong>) does not have authorization to view this module.
          </p>
          <a href="/" className="btn btn-primary btn-sm mt-2">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
