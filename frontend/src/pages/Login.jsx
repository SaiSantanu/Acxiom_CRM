import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiShield,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiAward,
} from 'react-icons/fi';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!usernameOrEmail.trim()) {
      errs.usernameOrEmail = 'Username or email is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(usernameOrEmail.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid username/email or password. Please try again.'
          : 'Unable to connect to authentication service.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user, pass) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setValidationErrors({});
    setError('');
    setLoading(true);
    try {
      await login(user, pass);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 px-3"
      style={{
        background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 45%, #1e293b 100%)',
        color: '#f8fafc',
      }}
    >
      <div className="w-100" style={{ maxWidth: 460 }}>
        {/* Back to landing page link */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Link
            to="/landing"
            className="text-decoration-none d-inline-flex align-items-center gap-1 small text-info opacity-75 text-hover-underline"
            style={{ transition: 'opacity 0.2s' }}
          >
            <FiArrowLeft size={14} />
            <span>Back to Landing Page</span>
          </Link>
          <span className="badge bg-secondary-subtle text-light small" style={{ fontSize: '0.7rem' }}>
            Enterprise v1.0
          </span>
        </div>

        {/* Branding header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 shadow-lg mb-3"
            style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontSize: '1.85rem',
              fontWeight: 800,
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
            }}
          >
            A
          </div>
          <h2 className="fw-bold tracking-tight mb-1 text-white">
            Acxiom<span style={{ color: '#60a5fa' }}>CRM</span>
          </h2>
          <p className="text-secondary small mb-0">
            Enterprise Client & Opportunity Relationship Management
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="card-body p-4 p-md-4">
            <h5 className="fw-bold text-white mb-1">Sign In to Your Workspace</h5>
            <p className="text-muted small mb-4">
              Enter your credentials to access your CRM modules.
            </p>

            {error && (
              <div
                className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-4"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.18)', color: '#fca5a5' }}
              >
                <FiAlertCircle size={18} className="flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username/Email */}
              <div className="mb-3">
                <label className="form-label text-light small fw-medium">
                  Username or Email <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text border-0"
                    style={{ backgroundColor: '#334155', color: '#94a3b8' }}
                  >
                    <FiUser size={16} />
                  </span>
                  <input
                    type="text"
                    className={`form-control border-0 text-white ${
                      validationErrors.usernameOrEmail ? 'is-invalid' : ''
                    }`}
                    style={{ backgroundColor: '#334155' }}
                    placeholder="e.g. admin or admin@acxiom.com"
                    value={usernameOrEmail}
                    onChange={(e) => {
                      setUsernameOrEmail(e.target.value);
                      if (validationErrors.usernameOrEmail) {
                        setValidationErrors((prev) => ({ ...prev, usernameOrEmail: null }));
                      }
                    }}
                    autoFocus
                  />
                </div>
                {validationErrors.usernameOrEmail && (
                  <div className="text-danger small mt-1" style={{ fontSize: '0.8rem' }}>
                    {validationErrors.usernameOrEmail}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label text-light small fw-medium">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text border-0"
                    style={{ backgroundColor: '#334155', color: '#94a3b8' }}
                  >
                    <FiLock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control border-0 text-white ${
                      validationErrors.password ? 'is-invalid' : ''
                    }`}
                    style={{ backgroundColor: '#334155' }}
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors((prev) => ({ ...prev, password: null }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn border-0"
                    style={{ backgroundColor: '#334155', color: '#94a3b8' }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <div className="text-danger small mt-1" style={{ fontSize: '0.8rem' }}>
                    {validationErrors.password}
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CRM</span>
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div
                className="text-muted small fw-semibold text-uppercase tracking-wider mb-2"
                style={{ fontSize: '0.72rem' }}
              >
                Quick Demo Access (Phase 5 Seed Accounts)
              </div>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-sm text-start d-flex align-items-center justify-content-between px-3 py-2 border-0"
                  style={{ backgroundColor: '#334155', color: '#f1f5f9' }}
                  onClick={() => handleQuickLogin('admin', 'Admin#1234')}
                  disabled={loading}
                >
                  <div>
                    <span className="badge bg-danger me-2">ADMIN</span>
                    <span className="fw-medium">admin</span>
                  </div>
                  <span className="text-muted small">Full Admin Access &rarr;</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm text-start d-flex align-items-center justify-content-between px-3 py-2 border-0"
                  style={{ backgroundColor: '#334155', color: '#f1f5f9' }}
                  onClick={() => handleQuickLogin('manager', 'Manager#1234')}
                  disabled={loading}
                >
                  <div>
                    <span className="badge bg-primary me-2">MANAGER</span>
                    <span className="fw-medium">manager</span>
                  </div>
                  <span className="text-muted small">Team Management &rarr;</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm text-start d-flex align-items-center justify-content-between px-3 py-2 border-0"
                  style={{ backgroundColor: '#334155', color: '#f1f5f9' }}
                  onClick={() => handleQuickLogin('sales', 'Sales#1234')}
                  disabled={loading}
                >
                  <div>
                    <span className="badge bg-success me-2">SALES</span>
                    <span className="fw-medium">sales</span>
                  </div>
                  <span className="text-muted small">Sales Rep Access &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Developer attribution card requested by user */}
        <div
          className="mt-3 p-3 rounded-3 text-center"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="d-flex align-items-center justify-content-center gap-1 small text-white-50">
            <FiAward className="text-warning" />
            <span>Developed by:</span>
            <strong className="text-white">Sai Santanu Sahoo</strong>
          </div>
          <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
            C.V. Raman Global University, Bhubaneswar
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-3 text-secondary small" style={{ fontSize: '0.78rem' }}>
          <FiShield className="me-1 text-primary" />
          <span>Spring Security Session Protection Active &bull; BCrypt Hashing</span>
        </div>
      </div>
    </div>
  );
}
