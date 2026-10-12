import React, { useState, useEffect } from 'react';
import {
  FiSettings,
  FiShield,
  FiUsers,
  FiActivity,
  FiRefreshCw,
  FiLock,
  FiDatabase,
  FiPlus,
  FiCheckCircle,
  FiAlertCircle,
  FiToggleLeft,
  FiToggleRight,
  FiUserCheck,
  FiUserX,
} from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'audit', 'security'

  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State for Create User
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'SALES_EXECUTIVE',
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createErrors, setCreateErrors] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/audit-logs');
      setAuditLogs(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit trail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, null, {
        params: { active: !currentStatus },
      });
      setSuccessMsg(`User status updated to ${!currentStatus ? 'Active' : 'Inactive'}.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, null, {
        params: { role: newRole },
      });
      setSuccessMsg(`User role updated to ${newRole}.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const validateCreateUser = () => {
    const errs = {};
    if (!createFormData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!createFormData.username.trim()) errs.username = 'Username is required';
    if (!createFormData.email.trim()) errs.email = 'Valid email is required';
    if (!createFormData.password || createFormData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateCreateUser()) return;
    setCreateSubmitting(true);
    try {
      await api.post('/admin/users', {
        fullName: createFormData.fullName.trim(),
        username: createFormData.username.trim(),
        email: createFormData.email.trim().toLowerCase(),
        password: createFormData.password,
        role: createFormData.role,
      });
      setSuccessMsg(`User '${createFormData.username}' created successfully.`);
      setShowCreateModal(false);
      setCreateFormData({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'SALES_EXECUTIVE',
      });
      fetchUsers();
    } catch (err) {
      setCreateErrors({ submit: err.response?.data?.message || 'Failed to create user account.' });
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FiSettings className="text-primary" />
            <span>Administration & System Settings</span>
          </h3>
          <p className="text-muted small mb-0">
            Enterprise role-based permissions, user provisioning, and security audit log monitoring.
          </p>
        </div>
        <div className="d-flex gap-2">
          {activeTab === 'users' && (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 fw-semibold shadow-sm"
              onClick={() => {
                setCreateErrors({});
                setShowCreateModal(true);
              }}
            >
              <FiPlus size={16} />
              <span>Create New User</span>
            </button>
          )}
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={activeTab === 'users' ? fetchUsers : fetchAuditLogs}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center py-2 px-3 small mb-3">
          <FiCheckCircle className="me-2" size={16} />
          <span className="flex-grow-1">{successMsg}</span>
          <button type="button" className="btn-close py-2" onClick={() => setSuccessMsg('')} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 px-3 small mb-3 d-flex align-items-center gap-2">
          <FiAlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers size={16} />
            <span>Users & Roles ({users.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <FiActivity size={16} />
            <span>Audit Trail Logs ({auditLogs.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiShield size={16} />
            <span>Security Architecture</span>
          </button>
        </li>
      </ul>

      {/* Tab: Users & Roles */}
      {activeTab === 'users' && (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
            <h6 className="fw-bold mb-0 text-dark">Enterprise CRM User Accounts</h6>
            <span className="badge bg-primary-subtle text-primary">{users.length} Total Accounts</span>
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr className="small text-secondary text-uppercase">
                  <th style={{ width: 60 }}>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm me-2 text-primary" />
                      Loading accounts...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={u.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="fw-medium text-dark">{u.fullName}</td>
                      <td><code>{u.username}</code></td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 'fit-content' }}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="SALES_EXECUTIVE">SALES_EXECUTIVE</option>
                        </select>
                      </td>
                      <td>
                        {u.active ? (
                          <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                            <FiUserCheck size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary d-inline-flex align-items-center gap-1">
                            <FiUserX size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className={`btn btn-sm ${u.active ? 'btn-outline-danger' : 'btn-outline-success'} py-0 px-2`}
                          onClick={() => handleToggleStatus(u.id, u.active)}
                          title={u.active ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Audit Trail Logs */}
      {activeTab === 'audit' && (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
            <h6 className="fw-bold mb-0 text-dark">Security & Entity Audit Logs</h6>
            <span className="badge bg-secondary-subtle text-dark">{auditLogs.length} Logged Events</span>
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr className="small text-secondary text-uppercase">
                  <th style={{ width: 60 }}>#</th>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Record ID</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm me-2 text-primary" />
                      Loading audit events...
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, i) => (
                    <tr key={log.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="small text-muted text-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                      </td>
                      <td className="fw-medium text-dark">{log.actorUsername || 'Anonymous'}</td>
                      <td>
                        <span
                          className={`badge ${
                            log.action?.includes('FAIL')
                              ? 'bg-danger'
                              : log.action?.includes('LOGIN')
                              ? 'bg-success'
                              : 'bg-primary'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td><span className="badge bg-light text-dark border">{log.entityType || '-'}</span></td>
                      <td className="small text-muted">{log.recordId || '-'}</td>
                      <td className="small text-muted text-truncate" style={{ maxWidth: 320 }} title={log.details}>
                        {log.details || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Security Details */}
      {activeTab === 'security' && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-3 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 bg-primary-subtle text-primary rounded-3">
                  <FiLock size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Authentication & Password Hashing</h6>
                  <p className="text-muted small mb-0">Spring Security 6.x + BCrypt</p>
                </div>
              </div>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Password Algorithm</span>
                  <span className="badge bg-success-subtle text-success">BCrypt (10 rounds)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Session Storage</span>
                  <span className="badge bg-primary-subtle text-primary">HttpOnly Cookie (JSESSIONID)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Client-Side Token Storage</span>
                  <span className="badge bg-success-subtle text-success">None (Zero LocalStorage tokens)</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>CORS Configuration</span>
                  <span className="badge bg-success-subtle text-success">Allowed Origin with Credentials</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-3 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 bg-success-subtle text-success rounded-3">
                  <FiDatabase size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Database & Persistence</h6>
                  <p className="text-muted small mb-0">MySQL 8.0 & Spring Data JPA</p>
                </div>
              </div>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Database Name</span>
                  <code>acxiom_crm</code>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Tables Managed</span>
                  <span className="badge bg-secondary-subtle text-dark">7 JPA Entities</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Resilient Audit Failure Recovery</span>
                  <span className="badge bg-success-subtle text-success">Non-blocking / Isolated</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <FiUsers className="text-primary" />
                  <span>Provision New User Account</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createSubmitting}
                />
              </div>

              <form onSubmit={handleCreateUserSubmit}>
                <div className="modal-body p-4">
                  {createErrors.submit && (
                    <div className="alert alert-danger py-2 px-3 small mb-3">
                      {createErrors.submit}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-medium">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${createErrors.fullName ? 'is-invalid' : ''}`}
                      placeholder="e.g. Rachel Adams"
                      value={createFormData.fullName}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      autoFocus
                    />
                    {createErrors.fullName && <div className="invalid-feedback">{createErrors.fullName}</div>}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${createErrors.username ? 'is-invalid' : ''}`}
                        placeholder="e.g. radams"
                        value={createFormData.username}
                        onChange={(e) =>
                          setCreateFormData((prev) => ({ ...prev, username: e.target.value }))
                        }
                      />
                      {createErrors.username && <div className="invalid-feedback">{createErrors.username}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium">
                        Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={createFormData.role}
                        onChange={(e) =>
                          setCreateFormData((prev) => ({ ...prev, role: e.target.value }))
                        }
                      >
                        <option value="SALES_EXECUTIVE">SALES_EXECUTIVE</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${createErrors.email ? 'is-invalid' : ''}`}
                      placeholder="e.g. radams@acxiom.com"
                      value={createFormData.email}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                    {createErrors.email && <div className="invalid-feedback">{createErrors.email}</div>}
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-medium">
                      Initial Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${createErrors.password ? 'is-invalid' : ''}`}
                      placeholder="Minimum 6 characters"
                      value={createFormData.password}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({ ...prev, password: e.target.value }))
                      }
                    />
                    {createErrors.password && <div className="invalid-feedback">{createErrors.password}</div>}
                    <div className="form-text small">
                      Password will be securely hashed with BCrypt on the backend.
                    </div>
                  </div>
                </div>

                <div className="modal-footer px-4 py-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowCreateModal(false)}
                    disabled={createSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-3 fw-semibold"
                    disabled={createSubmitting}
                  >
                    {createSubmitting ? 'Creating User...' : 'Provision User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
