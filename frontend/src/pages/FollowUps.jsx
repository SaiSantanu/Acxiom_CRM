import React, { useState, useEffect, useMemo } from 'react';
import {
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiUsers,
  FiMapPin,
  FiCheck,
} from 'react-icons/fi';
import followUpService from '../services/followUpService';
import FollowUpForm from '../components/FollowUpForm';

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timingFilter, setTimingFilter] = useState('ALL'); // ALL, UPCOMING, OVERDUE, TODAY

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Complete modal state
  const [completingId, setCompletingId] = useState(null);
  const [completionRemarks, setCompletionRemarks] = useState('');
  const [completingLoading, setCompletingLoading] = useState(false);

  // Today ISO string
  const todayStr = new Date().toISOString().split('T')[0];

  const fetchFollowUps = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await followUpService.getAll(searchTerm, statusFilter);
      setFollowUps(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load follow-ups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFollowUps();
  };

  // Filter list by timing (Upcoming vs Overdue vs Today)
  const filteredFollowUps = useMemo(() => {
    return followUps.filter((f) => {
      // Local keyword matching
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchSubj = f.subject?.toLowerCase().includes(term);
        const matchCust = f.customerName?.toLowerCase().includes(term);
        const matchLead = f.leadName?.toLowerCase().includes(term);
        const matchAssigned = f.assignedTo?.toLowerCase().includes(term);
        if (!matchSubj && !matchCust && !matchLead && !matchAssigned) return false;
      }

      if (timingFilter === 'UPCOMING') {
        return f.status === 'PLANNED' && f.followUpDate >= todayStr;
      }
      if (timingFilter === 'OVERDUE') {
        return f.status === 'PLANNED' && f.followUpDate < todayStr;
      }
      if (timingFilter === 'TODAY') {
        return f.followUpDate === todayStr;
      }
      return true;
    });
  }, [followUps, searchTerm, timingFilter, todayStr]);

  // Stats calculation
  const stats = useMemo(() => {
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;
    followUps.forEach((f) => {
      if (f.status === 'COMPLETED') completed++;
      else if (f.status === 'PLANNED') {
        if (f.followUpDate < todayStr) overdue++;
        else upcoming++;
      }
    });
    return {
      total: followUps.length,
      upcoming,
      overdue,
      completed,
    };
  }, [followUps, todayStr]);

  // Create or Update
  const handleSaveFollowUp = async (payload) => {
    setFormSubmitting(true);
    try {
      if (editingFollowUp?.id) {
        await followUpService.update(editingFollowUp.id, payload);
        setSuccessMsg('Follow-up updated successfully.');
      } else {
        await followUpService.create(payload);
        setSuccessMsg('New follow-up scheduled successfully.');
      }
      setShowFormModal(false);
      setEditingFollowUp(null);
      fetchFollowUps();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving follow-up');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Quick Complete
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completingId) return;
    setCompletingLoading(true);
    try {
      await followUpService.complete(completingId, completionRemarks);
      setSuccessMsg('Follow-up marked as completed.');
      setCompletingId(null);
      setCompletionRemarks('');
      fetchFollowUps();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete follow-up');
    } finally {
      setCompletingLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this follow-up?')) return;
    try {
      await followUpService.delete(id);
      setSuccessMsg('Follow-up deleted successfully.');
      fetchFollowUps();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete follow-up');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CALL':
        return <FiPhone className="text-primary me-1" />;
      case 'MEETING':
        return <FiUsers className="text-success me-1" />;
      case 'EMAIL':
        return <FiMail className="text-info me-1" />;
      case 'VISIT':
        return <FiMapPin className="text-warning me-1" />;
      default:
        return <FiClock className="text-secondary me-1" />;
    }
  };

  const getStatusBadge = (status, date) => {
    if (status === 'PLANNED') {
      if (date < todayStr) {
        return <span className="badge bg-danger-subtle text-danger border border-danger">OVERDUE</span>;
      }
      if (date === todayStr) {
        return <span className="badge bg-warning-subtle text-warning border border-warning">DUE TODAY</span>;
      }
      return <span className="badge bg-primary-subtle text-primary border border-primary">PLANNED</span>;
    }
    if (status === 'COMPLETED') {
      return <span className="badge bg-success-subtle text-success border border-success">COMPLETED</span>;
    }
    if (status === 'MISSED') {
      return <span className="badge bg-danger-subtle text-danger border border-danger">MISSED</span>;
    }
    return <span className="badge bg-secondary-subtle text-secondary border border-secondary">CANCELLED</span>;
  };

  return (
    <div className="container-fluid py-2">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FiClock className="text-primary" />
            <span>Follow-Up Management</span>
          </h3>
          <p className="text-muted small mb-0">
            Track, schedule, and complete sales communications with leads and customers.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2 btn-sm"
            onClick={fetchFollowUps}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 btn-sm fw-semibold shadow-sm"
            onClick={() => {
              setEditingFollowUp(null);
              setShowFormModal(true);
            }}
          >
            <FiPlus size={16} />
            <span>Schedule Follow-Up</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center py-2 px-3 small mb-3">
          <FiCheckCircle className="me-2" size={16} />
          <span>{successMsg}</span>
          <button
            type="button"
            className="btn-close py-2"
            onClick={() => setSuccessMsg('')}
            aria-label="Close"
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Total Follow-Ups</span>
                <h4 className="fw-bold mt-1 mb-0 text-dark">{stats.total}</h4>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3">
                <FiCalendar size={22} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Upcoming</span>
                <h4 className="fw-bold mt-1 mb-0 text-primary">{stats.upcoming}</h4>
              </div>
              <div className="p-3 bg-info-subtle text-info rounded-3">
                <FiClock size={22} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Overdue</span>
                <h4 className="fw-bold mt-1 mb-0 text-danger">{stats.overdue}</h4>
              </div>
              <div className="p-3 bg-danger-subtle text-danger rounded-3">
                <FiAlertTriangle size={22} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Completed</span>
                <h4 className="fw-bold mt-1 mb-0 text-success">{stats.completed}</h4>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <FiCheckCircle size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-md-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FiSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search subject, client, assigned..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Timing Filter Chips */}
            <div className="col-md-5">
              <div className="btn-group btn-group-sm w-100" role="group">
                <button
                  type="button"
                  className={`btn ${timingFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTimingFilter('ALL')}
                >
                  All ({followUps.length})
                </button>
                <button
                  type="button"
                  className={`btn ${timingFilter === 'TODAY' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTimingFilter('TODAY')}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`btn ${timingFilter === 'UPCOMING' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTimingFilter('UPCOMING')}
                >
                  Upcoming ({stats.upcoming})
                </button>
                <button
                  type="button"
                  className={`btn ${timingFilter === 'OVERDUE' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setTimingFilter('OVERDUE')}
                >
                  Overdue ({stats.overdue})
                </button>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="col-md-3">
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
                  <option value="PLANNED">Planned</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="MISSED">Missed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-Ups Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr className="small text-secondary text-uppercase">
                <th style={{ width: 60 }}>#</th>
                <th>Subject & Type</th>
                <th>Associated With</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
                    Loading follow-up records...
                  </td>
                </tr>
              ) : filteredFollowUps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <FiClock size={36} className="text-secondary opacity-50 mb-2" />
                    <p className="mb-0 fw-medium">No follow-ups match your filter criteria.</p>
                    <small>Click "Schedule Follow-Up" to create one.</small>
                  </td>
                </tr>
              ) : (
                filteredFollowUps.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td>
                      <div className="fw-semibold text-dark d-flex align-items-center">
                        {getTypeIcon(item.followUpType)}
                        <span>{item.subject}</span>
                      </div>
                      {item.remarks && (
                        <div
                          className="text-muted small text-truncate mt-1"
                          style={{ maxWidth: 300 }}
                          title={item.remarks}
                        >
                          {item.remarks}
                        </div>
                      )}
                    </td>
                    <td>
                      {item.customerName ? (
                        <div>
                          <span className="badge bg-light text-dark border me-1">Customer</span>
                          <span className="fw-medium text-dark">{item.customerName}</span>
                        </div>
                      ) : item.leadName ? (
                        <div>
                          <span className="badge bg-light text-dark border me-1">Lead</span>
                          <span className="fw-medium text-dark">{item.leadName}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <FiCalendar size={13} className="text-muted" />
                        <span className={item.followUpDate < todayStr && item.status === 'PLANNED' ? 'text-danger fw-bold' : ''}>
                          {item.followUpDate}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(item.status, item.followUpDate)}</td>
                    <td>
                      <span className="text-secondary small">
                        {item.assignedTo || 'Unassigned'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        {item.status === 'PLANNED' && (
                          <button
                            className="btn btn-outline-success btn-sm"
                            title="Mark as Completed"
                            onClick={() => {
                              setCompletingId(item.id);
                              setCompletionRemarks('');
                            }}
                          >
                            <FiCheck size={14} className="me-1" />
                            <span>Done</span>
                          </button>
                        )}
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          title="Edit Follow-Up"
                          onClick={() => {
                            setEditingFollowUp(item);
                            setShowFormModal(true);
                          }}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Follow-Up"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FiTrash2 size={14} />
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

      {/* Create / Edit Modal */}
      {showFormModal && (
        <FollowUpForm
          followUp={editingFollowUp}
          onSubmit={handleSaveFollowUp}
          onCancel={() => {
            setShowFormModal(false);
            setEditingFollowUp(null);
          }}
          loading={formSubmitting}
        />
      )}

      {/* Complete Confirmation Modal */}
      {completingId && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <FiCheckCircle className="text-success" />
                  <span>Mark Follow-Up as Completed</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCompletingId(null)}
                  disabled={completingLoading}
                />
              </div>
              <form onSubmit={handleCompleteSubmit}>
                <div className="modal-body p-4">
                  <p className="text-muted small mb-3">
                    Record any closing remarks, meeting summary, or action items from this follow-up.
                  </p>
                  <div className="mb-2">
                    <label className="form-label fw-medium small">Completion Remarks</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Client agreed to proposal; contract scheduled for review on Monday..."
                      value={completionRemarks}
                      onChange={(e) => setCompletionRemarks(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer px-4 py-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setCompletingId(null)}
                    disabled={completingLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm px-3 fw-semibold"
                    disabled={completingLoading}
                  >
                    {completingLoading ? 'Completing...' : 'Mark as Completed'}
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
