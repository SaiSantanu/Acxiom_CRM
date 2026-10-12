import React, { useState, useEffect, useCallback } from 'react';
import {
  FiUserPlus,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiDollarSign,
  FiFilter,
  FiUser
} from 'react-icons/fi';
import leadService from '../services/leadService';
import LeadForm from '../components/LeadForm';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // Deactivation / Delete Confirmation
  const [actionTarget, setActionTarget] = useState(null); // { lead, type: 'deactivate' | 'delete' }
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLeads = useCallback(async (query = '', status = '') => {
    setLoading(true);
    try {
      const res = await leadService.getAll(query, status);
      setLeads(res.data || []);
    } catch (err) {
      showAlert('danger', err.message || 'Failed to fetch leads from backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(debouncedSearch, statusFilter);
  }, [debouncedSearch, statusFilter, fetchLeads]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const handleCreateNew = () => {
    setEditingLead(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleSaveLead = async (formData) => {
    if (editingLead) {
      await leadService.update(editingLead.id, formData);
      showAlert('success', `Lead "${formData.leadName}" updated successfully.`);
    } else {
      await leadService.create(formData);
      showAlert('success', `Lead "${formData.leadName}" created successfully.`);
    }
    fetchLeads(debouncedSearch, statusFilter);
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      if (actionTarget.type === 'deactivate') {
        await leadService.deactivate(actionTarget.lead.id);
        showAlert('success', `Lead "${actionTarget.lead.leadName}" marked as LOST.`);
      } else {
        await leadService.deletePermanent(actionTarget.lead.id);
        showAlert('success', `Lead "${actionTarget.lead.leadName}" permanently deleted.`);
      }
      setActionTarget(null);
      fetchLeads(debouncedSearch, statusFilter);
    } catch (err) {
      showAlert('danger', err.message || 'Failed to complete requested action.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'QUALIFIED':
      case 'CONVERTED':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'CONTACTED':
        return 'bg-info-subtle text-info border border-info-subtle';
      case 'NEW':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'UNQUALIFIED':
        return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'LOST':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-danger text-white';
      case 'MEDIUM':
        return 'bg-warning text-dark';
      case 'LOW':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark border';
    }
  };

  // Pipeline summary calculation
  const totalPipelineValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.expectedValue) || 0),
    0
  );

  return (
    <div className="container-fluid p-0">
      {/* Top Banner Alert */}
      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-3 shadow-sm`}
          role="alert"
        >
          {alert.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          <div>{alert.message}</div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setAlert(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <FiUserPlus className="text-primary" size={24} />
            <h3 className="fw-bold mb-0" style={{ color: '#0f172a' }}>
              Sales Leads Pipeline
            </h3>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-2">
              {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
            </span>
          </div>
          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
            Capture, qualify, and convert prospects through the active sales pipeline.
          </p>
        </div>

        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => fetchLeads(debouncedSearch, statusFilter)}
            disabled={loading}
            title="Refresh lead list"
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={handleCreateNew}
          >
            <FiPlus size={16} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Keyword Search */}
          <div className="col-12 col-md-5 col-lg-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <FiSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, company, email, phone, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <FiFilter className="text-muted" />
              </span>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="UNQUALIFIED">Unqualified</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>

          {/* Pipeline Value Stats */}
          <div className="col-12 col-sm-6 col-md-3 col-lg-5 text-sm-end text-muted small">
            <span>
              Total Pipeline Value:{' '}
              <strong className="text-dark">
                ${totalPipelineValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="crm-card overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading leads...</span>
            </div>
            <div className="text-muted mt-2 small">Loading leads from MySQL database...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div
              className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{ width: 60, height: 60, backgroundColor: '#f1f5f9', color: '#64748b' }}
            >
              <FiUserPlus size={28} />
            </div>
            <h5 className="fw-bold text-dark">No Leads Found</h5>
            <p className="text-muted mx-auto mb-3" style={{ maxWidth: 420, fontSize: '0.9rem' }}>
              {searchTerm || statusFilter !== 'ALL'
                ? 'No leads matched your search or status filter criteria. Try adjusting or clearing your filters.'
                : 'There are currently no sales leads in the database. Click the button below to add your first prospect.'}
            </p>
            {searchTerm || statusFilter !== 'ALL' ? (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleCreateNew}>
                <FiPlus className="me-1" /> Add First Lead
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase text-secondary">
                  <th style={{ width: 130 }}>Code</th>
                  <th>Lead Name</th>
                  <th>Company</th>
                  <th>Contact Info</th>
                  <th>Source</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 90 }}>Priority</th>
                  <th className="text-end" style={{ width: 130 }}>Expected Value</th>
                  <th>Assigned To</th>
                  <th className="text-end" style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <code className="text-primary fw-bold" style={{ fontSize: '0.85rem' }}>
                        {l.leadCode}
                      </code>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{l.leadName}</div>
                      {l.notes && (
                        <div
                          className="text-muted text-truncate"
                          style={{ maxWidth: 180, fontSize: '0.75rem' }}
                          title={l.notes}
                        >
                          {l.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      {l.companyName ? (
                        <div className="d-flex align-items-center gap-1 text-secondary small">
                          <FiBriefcase size={12} className="text-muted" />
                          <span>{l.companyName}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1 small text-secondary">
                        {l.email && (
                          <div className="d-flex align-items-center gap-1">
                            <FiMail size={12} className="text-muted" />
                            <span>{l.email}</span>
                          </div>
                        )}
                        {l.phone && (
                          <div className="d-flex align-items-center gap-1">
                            <FiPhone size={12} className="text-muted" />
                            <span>{l.phone}</span>
                          </div>
                        )}
                        {!l.email && !l.phone && <span className="text-muted">—</span>}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border small">
                        {l.source || 'OTHER'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${getPriorityBadge(l.priority)}`}
                        style={{ fontSize: '0.72rem', padding: '0.3em 0.55em' }}
                      >
                        {l.priority}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="fw-semibold text-dark small">
                        ${Number(l.expectedValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      {l.assignedTo ? (
                        <div className="d-flex align-items-center gap-1 text-secondary small">
                          <FiUser size={12} className="text-muted" />
                          <span>{l.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">Unassigned</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          title="Edit Lead"
                          onClick={() => handleEdit(l)}
                        >
                          <FiEdit2 size={13} />
                        </button>
                        {l.status !== 'LOST' ? (
                          <button
                            className="btn btn-outline-warning"
                            title="Mark as Lost"
                            onClick={() => setActionTarget({ lead: l, type: 'deactivate' })}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-danger"
                            title="Delete Permanently"
                            onClick={() => setActionTarget({ lead: l, type: 'delete' })}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />

      {/* Confirmation Dialog */}
      {actionTarget && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: 10 }}>
              <div className="modal-header border-bottom py-2 px-3">
                <h6 className="modal-title fw-bold text-dark">
                  {actionTarget.type === 'deactivate' ? 'Mark Lead as Lost' : 'Delete Lead'}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActionTarget(null)}
                  disabled={actionLoading}
                />
              </div>
              <div className="modal-body p-3 text-secondary small">
                {actionTarget.type === 'deactivate' ? (
                  <p className="mb-0">
                    Are you sure you want to transition lead{' '}
                    <strong>{actionTarget.lead.leadName}</strong> to status{' '}
                    <code>LOST</code>? The record will remain archived in the pipeline.
                  </p>
                ) : (
                  <p className="mb-0 text-danger">
                    Are you sure you want to permanently delete lead{' '}
                    <strong>{actionTarget.lead.leadName}</strong>? This action cannot be undone.
                  </p>
                )}
              </div>
              <div className="modal-footer border-top py-2 px-3 bg-light">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setActionTarget(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn btn-${actionTarget.type === 'deactivate' ? 'warning' : 'danger'} btn-sm`}
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : actionTarget.type === 'deactivate' ? (
                    'Mark Lost'
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
