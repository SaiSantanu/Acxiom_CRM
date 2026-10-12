import React from 'react';
import { FiClock, FiPlus, FiFilter, FiDownload } from 'react-icons/fi';

export default function PlaceholderPage({ title, description, icon: Icon, modulePhase = 'Phase 2' }) {
  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            {Icon && <Icon className="text-primary" size={24} />}
            <h3 className="fw-bold mb-0" style={{ color: '#0f172a' }}>
              {title}
            </h3>
          </div>
          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
            {description}
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" disabled>
            <FiFilter size={14} /> Filter
          </button>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" disabled>
            <FiDownload size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" disabled>
            <FiPlus size={14} /> Add {title.replace(/s$/, '')}
          </button>
        </div>
      </div>

      {/* Placeholder State Card */}
      <div className="crm-card p-5 text-center">
        <div
          className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
          style={{ width: 64, height: 64, backgroundColor: '#eff6ff', color: '#2563eb' }}
        >
          {Icon ? <Icon size={32} /> : <FiClock size={32} />}
        </div>
        <h5 className="fw-bold text-dark">{title} Module</h5>
        <p className="text-muted mx-auto" style={{ maxWidth: 480, fontSize: '0.92rem' }}>
          The foundation and routing for <strong>{title}</strong> have been configured in Phase 1. Full data entity modeling, REST API controllers, and interactive UI forms are scheduled for <strong>{modulePhase}</strong>.
        </p>
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
            Scheduled for {modulePhase} Implementation
          </span>
        </div>
      </div>
    </div>
  );
}
