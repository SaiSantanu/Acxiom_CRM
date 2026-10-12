import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiBarChart2,
  FiSettings,
  FiX,
  FiLogOut,
  FiShield,
  FiHome,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const allNavItems = [
  { path: '/', label: 'Dashboard', icon: FiGrid, roles: ['ADMIN', 'MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/customers', label: 'Customers', icon: FiUsers, roles: ['ADMIN', 'MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/leads', label: 'Leads', icon: FiUserPlus, roles: ['ADMIN', 'MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/opportunities', label: 'Opportunities', icon: FiTrendingUp, roles: ['ADMIN', 'MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/follow-ups', label: 'Follow-Ups', icon: FiClock, roles: ['ADMIN', 'MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/activities', label: 'Activities', icon: FiActivity, roles: ['ADMIN', 'MANAGER', 'SALES_EXECUTIVE'] },
  { path: '/reports', label: 'Reports', icon: FiBarChart2, roles: ['ADMIN', 'MANAGER'] },
  { path: '/settings', label: 'Settings', icon: FiSettings, roles: ['ADMIN'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'SALES_EXECUTIVE';

  const visibleNavItems = allNavItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {isOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose}></div>}
      <aside className={`crm-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header justify-content-between">
          <div className="d-flex align-items-center">
            <span className="brand-badge">A</span>
            <span className="brand-name">AcxiomCRM</span>
            <span className="brand-tag">v1.0</span>
          </div>
          <button
            className="btn btn-sm text-white-50 d-lg-none p-0"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="nav-section-title mt-3">General</div>
          <Link
            to="/landing"
            className="sidebar-link"
            onClick={onClose}
          >
            <FiHome size={18} />
            <span>Landing Page</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <FiShield size={14} className="text-primary-subtle" />
              <small className="fw-semibold text-white-50">Role</small>
            </div>
            <span
              className={`badge ${
                user?.role === 'ADMIN'
                  ? 'bg-danger'
                  : user?.role === 'MANAGER'
                  ? 'bg-primary'
                  : 'bg-success'
              }`}
            >
              {user?.role || 'SALES_EXECUTIVE'}
            </span>
          </div>
          <button
            onClick={logout}
            className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-1"
          >
            <FiLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
