import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiServer,
  FiDatabase,
  FiLayers,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import crmService from '../services/crmService';
import customerService from '../services/customerService';
import leadService from '../services/leadService';
import opportunityService from '../services/opportunityService';

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [customerCount, setCustomerCount] = useState(null);
  const [leadsCount, setLeadsCount] = useState(null);
  const [oppSummary, setOppSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crmService.getHealth();
      setHealthData(response.data || response);
      try {
        const custRes = await customerService.getAll();
        setCustomerCount(custRes.data?.length ?? 0);
      } catch (e) {}

      try {
        const leadRes = await leadService.getAll();
        const leadList = leadRes.data || [];
        setLeadsCount(leadList.length);
      } catch (e) {}

      try {
        const oppRes = await opportunityService.getSummary();
        setOppSummary(oppRes.data || null);
      } catch (e) {}
    } catch (err) {
      setError(err.message || 'Unable to reach backend health endpoint at http://localhost:8080/api/health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            CRM Dashboard
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            AcxiomCRM Enterprise Management System — Phase 1 Setup & Status
          </p>
        </div>
        <div className="mt-2 mt-sm-0">
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
            onClick={fetchHealth}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            Refresh Health Check
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/customers" className="text-decoration-none">
            <div className="metric-card d-flex align-items-center justify-content-between">
              <div>
                <div className="metric-label">Total Customers</div>
                <div className="metric-value mt-1">{customerCount !== null ? customerCount : '...'}</div>
                <small className="text-success fw-medium">Live from MySQL database</small>
              </div>
              <div className="metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <FiUsers />
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/leads" className="text-decoration-none">
            <div className="metric-card d-flex align-items-center justify-content-between">
              <div>
                <div className="metric-label">Active Leads</div>
                <div className="metric-value mt-1">{leadsCount !== null ? leadsCount : '...'}</div>
                <small className="text-primary fw-medium">Active sales pipeline</small>
              </div>
              <div className="metric-icon-wrap" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <FiUserPlus />
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/opportunities" className="text-decoration-none">
            <div className="metric-card d-flex align-items-center justify-content-between">
              <div>
                <div className="metric-label">Open Pipeline Value</div>
                <div className="metric-value mt-1 text-primary">
                  ${oppSummary?.totalOpenPipeline !== undefined
                    ? Number(oppSummary.totalOpenPipeline).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0.00'}
                </div>
                <small className="text-muted fw-medium">
                  Weighted: ${oppSummary?.weightedOpenPipeline !== undefined
                    ? Number(oppSummary.weightedOpenPipeline).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0.00'}
                </small>
              </div>
              <div className="metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <FiTrendingUp />
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/opportunities" className="text-decoration-none">
            <div className="metric-card d-flex align-items-center justify-content-between">
              <div>
                <div className="metric-label">Closed Won Revenue</div>
                <div className="metric-value mt-1 text-success">
                  ${oppSummary?.totalWonRevenue !== undefined
                    ? Number(oppSummary.totalWonRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0.00'}
                </div>
                <small className="text-success fw-medium">
                  {oppSummary?.wonOpportunities ?? 0} won deals ({oppSummary?.totalOpportunities ?? 0} total)
                </small>
              </div>
              <div className="metric-icon-wrap" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <FiAward />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Health & Architecture Card */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="crm-card">
            <div className="crm-card-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <FiServer className="text-primary" />
                <span className="fw-semibold">System Architecture & Service Health</span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                Phase 1 Verified
              </span>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading health check...</span>
                  </div>
                  <div className="text-muted mt-2">Checking Spring Boot service at /api/health...</div>
                </div>
              ) : error ? (
                <div className="alert alert-warning d-flex align-items-start gap-3 mb-3">
                  <FiAlertTriangle className="flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="fw-bold">Backend Health Check Endpoint Pending Connection</div>
                    <div className="small mt-1">{error}</div>
                    <div className="small text-muted mt-2">
                      Ensure the Spring Boot backend is running via <code>mvn spring-boot:run</code> on port 8080.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-success d-flex align-items-start gap-3 mb-3">
                  <FiCheckCircle className="flex-shrink-0 mt-1 text-success" size={20} />
                  <div>
                    <div className="fw-bold text-success">Spring Boot Backend is Operational</div>
                    <div className="small mt-1 text-dark">
                      Service: <strong>{healthData.service}</strong> | Status: <strong>{healthData.status}</strong> | Version: <strong>{healthData.version}</strong>
                    </div>
                    <div className="small text-muted mt-1">
                      Database Layer: <code>{healthData.databaseStatus || 'Configured via application.properties'}</code>
                    </div>
                  </div>
                </div>
              )}

              <div className="table-responsive mt-3">
                <table className="table table-bordered table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Layer</th>
                      <th>Technology</th>
                      <th>Expected Port</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="fw-medium">Frontend</span></td>
                      <td>React 18 + Vite + Bootstrap 5</td>
                      <td><code>5173</code></td>
                      <td><span className="badge bg-success-subtle text-success">Active & Running</span></td>
                    </tr>
                    <tr>
                      <td><span className="fw-medium">Backend</span></td>
                      <td>Java 21/23 + Spring Boot 3.3.5 + Maven</td>
                      <td><code>8080</code></td>
                      <td>
                        {healthData?.status === 'UP' ? (
                          <span className="badge bg-success-subtle text-success">Active (UP)</span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary">Ready to Start</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><span className="fw-medium">Database</span></td>
                      <td>MySQL 8 Community Server (<code>acxiom_crm</code>)</td>
                      <td><code>3306</code></td>
                      <td>
                        <span className="badge bg-info-subtle text-info">
                          {healthData?.databaseStatus?.includes('CONNECTED') ? 'Connected' : 'Configured (External Credentials)'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><span className="fw-medium">API Base</span></td>
                      <td>Axios REST Client</td>
                      <td><code>/api</code></td>
                      <td><span className="badge bg-success-subtle text-success">CORS http://localhost:5173</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links / Module Roadmap */}
        <div className="col-12 col-lg-4">
          <div className="crm-card h-100">
            <div className="crm-card-header d-flex align-items-center gap-2">
              <FiLayers className="text-primary" />
              <span className="fw-semibold">CRM Modules Roadmap</span>
            </div>
            <div className="p-3">
              <div className="list-group list-group-flush">
                {[
                  { name: 'Dashboard', phase: 'Phase 1', status: 'Implemented' },
                  { name: 'Customers Module', phase: 'Phase 2', status: 'Implemented' },
                  { name: 'Leads Pipeline', phase: 'Phase 3', status: 'Implemented' },
                  { name: 'Opportunities', phase: 'Phase 4', status: 'Implemented' },
                  { name: 'Follow-Ups', phase: 'Phase 5', status: 'Planned' },
                  { name: 'Activities & Tasks', phase: 'Phase 5', status: 'Planned' },
                  { name: 'Reports & Analytics', phase: 'Phase 6', status: 'Planned' },
                  { name: 'Settings & Security', phase: 'Phase 6', status: 'Planned' },
                ].map((item, idx) => (
                  <div key={idx} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-medium" style={{ fontSize: '0.9rem' }}>{item.name}</span>
                      <small className="text-muted d-block">{item.phase}</small>
                    </div>
                    <span
                      className={`badge ${
                        item.status === 'Implemented'
                          ? 'bg-success-subtle text-success'
                          : 'bg-light text-secondary border'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
