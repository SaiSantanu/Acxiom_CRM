import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiActivity,
  FiBarChart2,
  FiSettings,
  FiX
} from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'Dashboard', icon: FiGrid },
  { path: '/customers', label: 'Customers', icon: FiUsers },
  { path: '/leads', label: 'Leads', icon: FiUserPlus },
  { path: '/opportunities', label: 'Opportunities', icon: FiTrendingUp },
  { path: '/follow-ups', label: 'Follow-Ups', icon: FiClock },
  { path: '/activities', label: 'Activities', icon: FiActivity },
  { path: '/reports', label: 'Reports', icon: FiBarChart2 },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar({ isOpen, onClose }) {
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
          {navItems.map((item) => {
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
        </nav>

        <div className="sidebar-footer">
          <div className="d-flex align-items-center justify-content-between">
            <small>Enterprise Edition</small>
            <span className="badge bg-secondary-subtle text-light-emphasis">Phase 1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
