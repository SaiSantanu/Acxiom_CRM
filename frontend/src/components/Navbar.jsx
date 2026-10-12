import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiSearch, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import crmService from '../services/crmService';

export default function Navbar({ onToggleSidebar }) {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    message: 'Checking backend status...',
  });

  const checkStatus = async () => {
    setBackendStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await crmService.getHealth();
      if (res && res.data) {
        setBackendStatus({
          loading: false,
          connected: true,
          message: `Backend ${res.data.status} (${res.data.service || 'Operational'})`,
          dbStatus: res.data.databaseStatus,
        });
      } else {
        setBackendStatus({
          loading: false,
          connected: true,
          message: 'Backend Responsive',
        });
      }
    } catch (err) {
      setBackendStatus({
        loading: false,
        connected: false,
        message: 'Backend Offline (port 8080)',
      });
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="crm-navbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary btn-sm d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={18} />
        </button>

        <div className="navbar-search d-none d-md-block">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0">
              <FiSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search leads, accounts, deals..."
            />
          </div>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Backend Connectivity Status Badge */}
        <div
          className={`badge d-flex align-items-center gap-1 py-2 px-3 ${
            backendStatus.loading
              ? 'badge-pending'
              : backendStatus.connected
              ? 'badge-operational'
              : 'badge-error'
          }`}
          title="Spring Boot Health Check Status"
          style={{ cursor: 'pointer' }}
          onClick={checkStatus}
        >
          {backendStatus.loading ? (
            <FiRefreshCw className="spinner-border spinner-border-sm" size={12} />
          ) : backendStatus.connected ? (
            <FiCheckCircle size={14} />
          ) : (
            <FiAlertCircle size={14} />
          )}
          <span className="d-none d-sm-inline">{backendStatus.message}</span>
        </div>

        {/* Notifications Icon */}
        <button
          className="btn btn-light btn-sm rounded-circle p-2 position-relative text-secondary"
          title="Notifications"
        >
          <FiBell size={16} />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>

        {/* User Avatar */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 34, height: 34, fontSize: '0.85rem' }}
          >
            AD
          </div>
          <div className="d-none d-xl-block">
            <div className="fw-semibold text-truncate" style={{ fontSize: '0.85rem', maxWidth: 120 }}>
              Admin User
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              CRM Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
