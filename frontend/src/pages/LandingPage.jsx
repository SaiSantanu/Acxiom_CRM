import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiArrowRight,
  FiShield,
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiAward,
  FiBookOpen,
  FiMapPin,
  FiLock,
  FiServer,
  FiDatabase,
  FiLogIn,
} from 'react-icons/fi';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: '#0a0f1d',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg py-3 px-4 border-bottom sticky-top"
        style={{
          backgroundColor: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 fw-bold text-white shadow-sm"
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                fontSize: '1.25rem',
              }}
            >
              A
            </div>
            <div>
              <span className="fw-bold fs-5 text-white tracking-tight">
                Acxiom<span style={{ color: '#60a5fa' }}>CRM</span>
              </span>
              <span
                className="badge ms-2 bg-primary-subtle text-primary border border-primary-subtle"
                style={{ fontSize: '0.68rem' }}
              >
                Enterprise v1.0
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <a
              href="#developer"
              className="d-none d-md-inline-block text-decoration-none text-light opacity-75 small fw-medium text-hover-white me-2"
            >
              About Developer
            </a>
            <a
              href="#modules"
              className="d-none d-md-inline-block text-decoration-none text-light opacity-75 small fw-medium text-hover-white me-2"
            >
              Modules
            </a>

            {isAuthenticated ? (
              <Link
                to="/"
                className="btn btn-primary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                }}
              >
                <span>Enter Dashboard ({user?.username})</span>
                <FiArrowRight size={15} />
              </Link>
            ) : (
              <Link
                to="/login"
                id="landing-login-btn"
                className="btn btn-primary btn-sm px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <FiLogIn size={15} />
                <span>Go to Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 px-3 position-relative overflow-hidden">
        {/* Glow background circles */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(10, 15, 29, 0) 70%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <div className="container py-4 position-relative" style={{ zIndex: 1, maxWidth: 1050 }}>
          {/* Badge */}
          <div className="text-center mb-3">
            <span
              className="d-inline-flex align-items-center gap-2 py-1 px-3 rounded-pill text-white small"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <FiShield className="text-info" size={14} />
              <span>Enterprise Grade &bull; Spring Security &bull; Role-Based Access Control</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h1
              className="fw-extrabold display-5 mb-3 tracking-tight"
              style={{
                fontWeight: 800,
                background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Enterprise Client Relationship & Pipeline Management
            </h1>
            <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: 720, fontSize: '1.15rem' }}>
              AcxiomCRM empowers modern sales organizations to capture leads, accelerate deals,
              schedule date-validated follow-ups, and log communications with resilient MySQL persistence and
              role-level authorization.
            </p>

            {/* Main Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <Link
                to="/login"
                id="hero-login-button"
                className="btn btn-primary btn-lg px-4 py-2 d-flex align-items-center gap-2 fw-bold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
                }}
              >
                <span>Go to Login Page</span>
                <FiArrowRight size={18} />
              </Link>
              <a
                href="#developer"
                className="btn btn-outline-light btn-lg px-4 py-2 d-flex align-items-center gap-2 small fw-semibold"
                style={{ borderColor: 'rgba(255, 255, 255, 0.2)', fontSize: '1.05rem' }}
              >
                <FiAward size={18} className="text-warning" />
                <span>Meet the Developer</span>
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div
            className="rounded-4 p-4 p-md-5 mt-2 shadow-2xl"
            style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="row g-3 text-center mb-4">
              <div className="col-6 col-md-3">
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <FiUsers size={24} className="text-primary mb-2" />
                  <div className="small text-muted text-uppercase fw-semibold">Customer Mgmt</div>
                  <div className="fw-bold fs-5 text-white">360° Accounts</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <FiUserPlus size={24} className="text-success mb-2" />
                  <div className="small text-muted text-uppercase fw-semibold">Leads Pipeline</div>
                  <div className="fw-bold fs-5 text-white">Stage Conversion</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <FiTrendingUp size={24} className="text-info mb-2" />
                  <div className="small text-muted text-uppercase fw-semibold">Opportunities</div>
                  <div className="fw-bold fs-5 text-white">Deal Forecasts</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <FiClock size={24} className="text-warning mb-2" />
                  <div className="small text-muted text-uppercase fw-semibold">Follow-Ups</div>
                  <div className="fw-bold fs-5 text-white">Automated Tasks</div>
                </div>
              </div>
            </div>

            {/* Quick Login Banner inside Preview */}
            <div
              className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-3"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle p-2 bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                >
                  <FiLock size={18} />
                </div>
                <div>
                  <div className="fw-bold text-white small">Secure Multi-Role Access Ready</div>
                  <div className="text-secondary small">
                    Admin, Sales Manager, and Sales Executive accounts ready for test verification.
                  </div>
                </div>
              </div>
              <Link to="/login" className="btn btn-outline-primary btn-sm px-3 mt-2 mt-sm-0 fw-semibold">
                Sign In Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Attribution & Institution Section */}
      <section id="developer" className="py-5 px-3" style={{ backgroundColor: '#0d1326' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div
            className="card border-0 rounded-4 overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #172554 0%, #1e293b 60%, #0f172a 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="row align-items-center g-4">
                <div className="col-md-3 text-center">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow-lg mb-2"
                    style={{
                      width: 110,
                      height: 110,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      fontSize: '2.5rem',
                      border: '4px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    Sai
                  </div>
                  <div className="badge bg-warning text-dark fw-bold px-3 py-1">
                    Lead Developer
                  </div>
                </div>

                <div className="col-md-9">
                  <div className="d-flex align-items-center gap-2 text-primary-subtle small fw-bold text-uppercase tracking-wider mb-1">
                    <FiAward className="text-warning" size={16} />
                    <span>Project Creator & Engineer</span>
                  </div>

                  <h2 className="fw-bold text-white mb-1">
                    Sai Santanu Sahoo
                  </h2>

                  <div className="d-flex align-items-center gap-2 text-info mb-3 fw-medium">
                    <FiMapPin size={16} />
                    <span>C.V. Raman Global University, Bhubaneswar</span>
                  </div>

                  <p className="text-light opacity-75 small mb-4" style={{ lineHeight: 1.6 }}>
                    Architected and developed <strong>AcxiomCRM</strong> as a modern enterprise
                    full-stack customer management system. Engineered with Spring Boot, Spring Security,
                    Hibernate JPA, MySQL 8, and a modular React 18 client architecture featuring
                    role-based access control, pipeline tracking, date-validated follow-ups, and resilient audit logging.
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-dark border border-secondary px-3 py-2 text-light">
                      Java 21 / 23
                    </span>
                    <span className="badge bg-dark border border-secondary px-3 py-2 text-light">
                      Spring Boot 3.3.5
                    </span>
                    <span className="badge bg-dark border border-secondary px-3 py-2 text-light">
                      Spring Security & BCrypt
                    </span>
                    <span className="badge bg-dark border border-secondary px-3 py-2 text-light">
                      React + Vite
                    </span>
                    <span className="badge bg-dark border border-secondary px-3 py-2 text-light">
                      MySQL 8.0
                    </span>
                    <span className="badge bg-dark border border-secondary px-3 py-2 text-light">
                      C.V. Raman Global University
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Feature Grid */}
      <section id="modules" className="py-5 px-3">
        <div className="container" style={{ maxWidth: 1050 }}>
          <div className="text-center mb-5">
            <h6 className="text-primary text-uppercase fw-bold tracking-wider small">
              Functional Capabilities
            </h6>
            <h2 className="fw-bold text-white">Comprehensive Enterprise Modules</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: 600 }}>
              Built to standard enterprise CRM patterns with validation, clean JPA entities, and intuitive UI modals.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 p-4 border-0 rounded-4"
                style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="rounded-3 p-3 d-inline-flex mb-3"
                  style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa', width: 'fit-content' }}
                >
                  <FiUsers size={22} />
                </div>
                <h5 className="fw-bold text-white mb-2">Customer Management</h5>
                <p className="text-secondary small mb-0">
                  Full 360-degree account repository with unique customer codes, email/phone format validation, and status tracking.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 p-4 border-0 rounded-4"
                style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="rounded-3 p-3 d-inline-flex mb-3"
                  style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', width: 'fit-content' }}
                >
                  <FiUserPlus size={22} />
                </div>
                <h5 className="fw-bold text-white mb-2">Lead Lifecycle Pipeline</h5>
                <p className="text-secondary small mb-0">
                  Track prospect sources (Website, Referral, Campaign) with New, Contacted, Qualified, and Unqualified states.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 p-4 border-0 rounded-4"
                style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="rounded-3 p-3 d-inline-flex mb-3"
                  style={{ backgroundColor: 'rgba(147, 51, 234, 0.15)', color: '#c084fc', width: 'fit-content' }}
                >
                  <FiTrendingUp size={22} />
                </div>
                <h5 className="fw-bold text-white mb-2">Opportunity Tracking</h5>
                <p className="text-secondary small mb-0">
                  Monetary deal forecasting with BigDecimal precision, stage progression (Qualification &rarr; Proposal &rarr; Closed Won).
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 p-4 border-0 rounded-4"
                style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="rounded-3 p-3 d-inline-flex mb-3"
                  style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15', width: 'fit-content' }}
                >
                  <FiClock size={22} />
                </div>
                <h5 className="fw-bold text-white mb-2">Follow-Up Management</h5>
                <p className="text-secondary small mb-0">
                  Schedule meetings, calls, and email follow-ups with date checks (past dates rejected) and quick completion actions.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 p-4 border-0 rounded-4"
                style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="rounded-3 p-3 d-inline-flex mb-3"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', width: 'fit-content' }}
                >
                  <FiActivity size={22} />
                </div>
                <h5 className="fw-bold text-white mb-2">Activity Logging</h5>
                <p className="text-secondary small mb-0">
                  Document client calls, meetings, and tasks directly attached to customers or leads for a complete audit trail.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 p-4 border-0 rounded-4"
                style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="rounded-3 p-3 d-inline-flex mb-3"
                  style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', width: 'fit-content' }}
                >
                  <FiShield size={22} />
                </div>
                <h5 className="fw-bold text-white mb-2">Role-Based Security</h5>
                <p className="text-secondary small mb-0">
                  ADMIN, MANAGER, and SALES_EXECUTIVE role tiers enforced at the Spring Security layer with zero plain-text storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-5 px-3">
        <div className="container" style={{ maxWidth: 900 }}>
          <div
            className="p-5 rounded-4 text-center position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 35px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h2 className="fw-bold text-white mb-2">
              Ready to Access AcxiomCRM?
            </h2>
            <p className="text-light opacity-75 small mb-4 mx-auto" style={{ maxWidth: 500 }}>
              Sign in with your enterprise account or use one-click demo credentials to explore the live platform.
            </p>
            <Link
              to="/login"
              id="cta-login-btn"
              className="btn btn-primary btn-lg px-5 py-2 fw-bold shadow-lg d-inline-flex align-items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.4)',
              }}
            >
              <span>Go to Login Page</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-4 px-3 border-top text-center text-secondary small"
        style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#070b14' }}
      >
        <div className="container">
          <div className="mb-2">
            <strong className="text-white">AcxiomCRM</strong> &bull; Enterprise Customer Relationship Management
          </div>
          <div className="text-muted">
            Designed & Developed by <span className="text-info fw-semibold">Sai Santanu Sahoo</span> &bull;{' '}
            <span>C.V. Raman Global University, Bhubaneswar</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
