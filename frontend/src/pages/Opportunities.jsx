import React, { useState, useEffect, useCallback } from 'react';
import {
  FiTrendingUp,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiFilter,
  FiCalendar,
  FiUser,
  FiPieChart,
  FiAward,
  FiXCircle,
  FiLayers
} from 'react-icons/fi';
import opportunityService from '../services/opportunityService';
import customerService from '../services/customerService';
import OpportunityForm from '../components/OpportunityForm';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('');

  // Alerts
  const [alert, setAlert] = useState(null);

  // Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);

  // Deactivation / Delete Action Confirmation Modal
  const [actionTarget, setActionTarget] = useState(null); // { opp, type: 'deactivate' | 'delete' }
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load customer list once for filter dropdown
  useEffect(() => {
    customerService.getAll().then((res) => {
      setCustomers(res.data || []);
    }).catch((err) => {
      console.warn('Failed to load customers for filter:', err);
    });
  }, []);

  const fetchOpportunities = useCallback(async (query = '', stage = '', status = '', custId = '') => {
    setLoading(true);
    try {
      const [oppRes, sumRes] = await Promise.all([
        opportunityService.getAll(query, stage, status, custId),
        opportunityService.getSummary(),
      ]);
      setOpportunities(oppRes.data || []);
      setSummary(sumRes.data || null);
    } catch (err) {
      showAlert('danger', err.message || 'Failed to fetch opportunities from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities(debouncedSearch, stageFilter, statusFilter, customerFilter);
  }, [debouncedSearch, stageFilter, statusFilter, customerFilter, fetchOpportunities]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const handleCreateNew = () => {
    setEditingOpp(null);
    setIsFormOpen(true);
  };

  const handleEdit = (opp) => {
    setEditingOpp(opp);
    setIsFormOpen(true);
  };

  const handleSaveOpportunity = async (payload) => {
    if (editingOpp) {
      await opportunityService.update(editingOpp.id, payload);
      showAlert('success', `Opportunity "${payload.opportunityName}" updated successfully.`);
    } else {
      await opportunityService.create(payload);
      showAlert('success', `Opportunity "${payload.opportunityName}" created successfully.`);
    }
    fetchOpportunities(debouncedSearch, stageFilter, statusFilter, customerFilter);
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      if (actionTarget.type === 'deactivate') {
        await opportunityService.deactivate(actionTarget.opp.id);
        showAlert('success', `Opportunity "${actionTarget.opp.opportunityName}" marked as LOST.`);
      } else {
        await opportunityService.deletePermanent(actionTarget.opp.id);
        showAlert('success', `Opportunity "${actionTarget.opp.opportunityName}" permanently deleted.`);
      }
      setActionTarget(null);
      fetchOpportunities(debouncedSearch, stageFilter, statusFilter, customerFilter);
    } catch (err) {
      showAlert('danger', err.message || 'Failed to complete requested action.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'QUALIFICATION':
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Qualification (20%)</span>;
      case 'PROPOSAL':
        return <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">Proposal (50%)</span>;
      case 'NEGOTIATION':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">Negotiation (75%)</span>;
      case 'WON':
        return <span className="badge bg-success-subtle text-success border border-success-subtle fw-bold">Won (100%)</span>;
      case 'LOST':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Lost (0%)</span>;
      default:
        return <span className="badge bg-light text-dark">{stage}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge bg-primary">OPEN</span>;
      case 'WON':
        return <span className="badge bg-success">WON</span>;
      case 'LOST':
        return <span className="badge bg-danger">LOST</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Alert Notification */}
      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4 shadow-sm`}
          role="alert"
        >
          {alert.type === 'success' ? (
            <FiCheckCircle size={20} className="flex-shrink-0 text-success" />
          ) : (
            <FiAlertCircle size={20} className="flex-shrink-0 text-danger" />
          )}
          <div className="flex-grow-1">{alert.message}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            Opportunity Management
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Pipeline tracking, deal progression, win probabilities, and weighted forecasts.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3 mt-sm-0">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => fetchOpportunities(debouncedSearch, stageFilter, statusFilter, customerFilter)}
            disabled={loading}
            title="Refresh opportunities"
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            Refresh
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={handleCreateNew}
          >
            <FiPlus size={16} />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Pipeline KPI Cards */}
      <div className="row g-3 mb-4">
        {/* Open Pipeline */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card d-flex align-items-center justify-content-between">
            <div>
              <div className="metric-label">Open Pipeline Value</div>
              <div className="metric-value mt-1 text-primary">
                ${summary?.totalOpenPipeline !== undefined
                  ? Number(summary.totalOpenPipeline).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '0.00'}
              </div>
              <small className="text-muted fw-medium">
                {summary?.openOpportunities ?? 0} active open deals
              </small>
            </div>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <FiDollarSign />
            </div>
          </div>
        </div>

        {/* Weighted Pipeline */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card d-flex align-items-center justify-content-between">
            <div>
              <div className="metric-label">Weighted Pipeline Value</div>
              <div className="metric-value mt-1" style={{ color: '#7c3aed' }}>
                ${summary?.weightedOpenPipeline !== undefined
                  ? Number(summary.weightedOpenPipeline).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '0.00'}
              </div>
              <small className="text-muted fw-medium">Probability-adjusted revenue</small>
            </div>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <FiPieChart />
            </div>
          </div>
        </div>

        {/* Total Won Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card d-flex align-items-center justify-content-between">
            <div>
              <div className="metric-label">Closed Won Revenue</div>
              <div className="metric-value mt-1 text-success">
                ${summary?.totalWonRevenue !== undefined
                  ? Number(summary.totalWonRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '0.00'}
              </div>
              <small className="text-success fw-medium">
                {summary?.wonOpportunities ?? 0} deals won
              </small>
            </div>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <FiAward />
            </div>
          </div>
        </div>

        {/* Total Opportunities */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="metric-card d-flex align-items-center justify-content-between">
            <div>
              <div className="metric-label">Total Tracked Deals</div>
              <div className="metric-value mt-1 text-dark">
                {summary?.totalOpportunities ?? 0}
              </div>
              <small className="text-danger fw-medium">
                {summary?.lostOpportunities ?? 0} lost deals
              </small>
            </div>
            <div className="metric-icon-wrap" style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
              <FiLayers />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search deals, code, customer, lead, rep..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Stage Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="ALL">All Stages</option>
              <option value="QUALIFICATION">Qualification</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Closed Won</option>
              <option value="LOST">Closed Lost</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Deals</option>
              <option value="WON">Won Deals</option>
              <option value="LOST">Lost Deals</option>
            </select>
          </div>

          {/* Customer Filter */}
          <div className="col-12 col-md-3">
            <select
              className="form-select form-select-sm"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <option value="">All Customer Accounts</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="col-12 col-md-1 text-md-end">
            {(searchTerm || stageFilter !== 'ALL' || statusFilter !== 'ALL' || customerFilter) && (
              <button
                className="btn btn-link btn-sm text-decoration-none p-0 text-muted"
                onClick={() => {
                  setSearchTerm('');
                  setStageFilter('ALL');
                  setStatusFilter('ALL');
                  setCustomerFilter('');
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="crm-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th className="ps-4">Deal / Code</th>
                <th>Account & Lead</th>
                <th>Stage & Status</th>
                <th className="text-end">Amount</th>
                <th className="text-center">Probability</th>
                <th className="text-end">Weighted Value</th>
                <th>Close Date</th>
                <th>Assigned Rep</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
                    Loading opportunities from database...
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <div className="text-muted mb-3">
                      <FiTrendingUp size={44} className="opacity-25" />
                    </div>
                    <h6 className="fw-semibold text-secondary">No opportunities found</h6>
                    <p className="text-muted small mb-3">
                      {searchTerm || stageFilter !== 'ALL' || statusFilter !== 'ALL' || customerFilter
                        ? 'No deals match the specified filter criteria.'
                        : 'Get started by creating your first sales opportunity.'}
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={handleCreateNew}>
                      <FiPlus size={14} className="me-1" />
                      Add Opportunity
                    </button>
                  </td>
                </tr>
              ) : (
                opportunities.map((opp) => (
                  <tr key={opp.id}>
                    {/* Deal Name & Code */}
                    <td className="ps-4">
                      <div className="fw-semibold text-dark">{opp.opportunityName}</div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <code className="text-muted small">{opp.opportunityCode}</code>
                        {opp.source && (
                          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.65rem' }}>
                            {opp.source}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer & Lead */}
                    <td>
                      {opp.customerName ? (
                        <div className="fw-medium text-dark small">{opp.customerName}</div>
                      ) : (
                        <span className="text-muted small fst-italic">No Customer</span>
                      )}
                      {opp.leadName && (
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          Lead: {opp.leadName}
                        </div>
                      )}
                    </td>

                    {/* Stage & Status */}
                    <td>
                      <div className="mb-1">{getStageBadge(opp.stage)}</div>
                      <div>{getStatusBadge(opp.status)}</div>
                    </td>

                    {/* Amount */}
                    <td className="text-end">
                      <span className="fw-bold text-dark">
                        ${Number(opp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Probability */}
                    <td className="text-center">
                      <div className="fw-semibold small">{opp.probability}%</div>
                      <div className="progress mt-1 mx-auto" style={{ height: 4, width: 48 }}>
                        <div
                          className={`progress-bar ${
                            opp.stage === 'WON'
                              ? 'bg-success'
                              : opp.stage === 'LOST'
                              ? 'bg-danger'
                              : 'bg-primary'
                          }`}
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                    </td>

                    {/* Weighted Value */}
                    <td className="text-end">
                      <span className="fw-semibold text-primary">
                        ${Number(opp.weightedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Expected Close Date */}
                    <td>
                      {opp.expectedCloseDate ? (
                        <span className="small text-secondary">
                          <FiCalendar className="me-1 opacity-50" size={12} />
                          {opp.expectedCloseDate}
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>

                    {/* Assigned Rep */}
                    <td>
                      {opp.assignedTo ? (
                        <span className="small text-dark">
                          <FiUser className="me-1 opacity-50" size={12} />
                          {opp.assignedTo}
                        </span>
                      ) : (
                        <span className="text-muted small fst-italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary btn-sm py-1 px-2"
                          onClick={() => handleEdit(opp)}
                          title="Edit Opportunity"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        {opp.stage !== 'LOST' && (
                          <button
                            className="btn btn-outline-warning btn-sm py-1 px-2"
                            onClick={() => setActionTarget({ opp, type: 'deactivate' })}
                            title="Mark as Lost (Deactivate)"
                          >
                            <FiXCircle size={13} />
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm py-1 px-2"
                          onClick={() => setActionTarget({ opp, type: 'delete' })}
                          title="Permanent Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity Add/Edit Modal */}
      <OpportunityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveOpportunity}
        initialData={editingOpp}
      />

      {/* Deactivate / Delete Confirmation Modal */}
      {actionTarget && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow border-0" style={{ borderRadius: 12 }}>
              <div className="modal-header border-bottom py-2 px-3 bg-light">
                <h6 className="modal-title fw-bold text-dark mb-0">
                  {actionTarget.type === 'deactivate' ? 'Deactivate Opportunity' : 'Delete Opportunity'}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActionTarget(null)}
                  disabled={actionLoading}
                />
              </div>
              <div className="modal-body p-3 text-center">
                {actionTarget.type === 'deactivate' ? (
                  <>
                    <FiXCircle size={36} className="text-warning mb-2" />
                    <p className="small text-muted mb-0">
                      Are you sure you want to mark <strong>{actionTarget.opp.opportunityName}</strong> as <strong>LOST</strong>?
                    </p>
                  </>
                ) : (
                  <>
                    <FiTrash2 size={36} className="text-danger mb-2" />
                    <p className="small text-muted mb-0">
                      Are you sure you want to <strong>permanently delete</strong> <strong>{actionTarget.opp.opportunityName}</strong> from MySQL? This action cannot be undone.
                    </p>
                  </>
                )}
              </div>
              <div className="modal-footer border-top py-2 px-3 bg-light d-flex justify-content-end gap-2">
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
                  className={`btn btn-sm ${actionTarget.type === 'deactivate' ? 'btn-warning' : 'btn-danger'}`}
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : actionTarget.type === 'deactivate' ? 'Mark as Lost' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
