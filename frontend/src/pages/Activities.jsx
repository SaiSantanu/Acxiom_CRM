import React, { useState, useEffect, useMemo } from 'react';
import {
  FiActivity,
  FiPlus,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiUsers,
  FiCheckSquare,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiCalendar,
} from 'react-icons/fi';
import activityService from '../services/activityService';
import ActivityForm from '../components/ActivityForm';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await activityService.getAll(searchTerm, typeFilter);
      setActivities(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchActivities();
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (statusFilter !== 'ALL' && act.status !== statusFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchSubj = act.subject?.toLowerCase().includes(term);
        const matchDesc = act.description?.toLowerCase().includes(term);
        const matchCust = act.customerName?.toLowerCase().includes(term);
        const matchLead = act.leadName?.toLowerCase().includes(term);
        const matchAssigned = act.assignedTo?.toLowerCase().includes(term);
        if (!matchSubj && !matchDesc && !matchCust && !matchLead && !matchAssigned) return false;
      }
      return true;
    });
  }, [activities, searchTerm, statusFilter]);

  // Activity counts
  const stats = useMemo(() => {
    let calls = 0;
    let meetings = 0;
    let emails = 0;
    let tasks = 0;
    activities.forEach((a) => {
      if (a.activityType === 'CALL') calls++;
      else if (a.activityType === 'MEETING') meetings++;
      else if (a.activityType === 'EMAIL') emails++;
      else if (a.activityType === 'TASK') tasks++;
    });
    return {
      total: activities.length,
      calls,
      meetings,
      emails,
      tasks,
    };
  }, [activities]);

  const handleSaveActivity = async (payload) => {
    setFormSubmitting(true);
    try {
      if (editingActivity?.id) {
        await activityService.update(editingActivity.id, payload);
        setSuccessMsg('Activity updated successfully.');
      } else {
        await activityService.create(payload);
        setSuccessMsg('New activity logged successfully.');
      }
      setShowFormModal(false);
      setEditingActivity(null);
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving activity');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity record?')) return;
    try {
      await activityService.delete(id);
      setSuccessMsg('Activity deleted successfully.');
      fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'CALL':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary d-inline-flex align-items-center gap-1">
            <FiPhone size={12} /> Call
          </span>
        );
      case 'MEETING':
        return (
          <span className="badge bg-success-subtle text-success border border-success d-inline-flex align-items-center gap-1">
            <FiUsers size={12} /> Meeting
          </span>
        );
      case 'EMAIL':
        return (
          <span className="badge bg-info-subtle text-info border border-info d-inline-flex align-items-center gap-1">
            <FiMail size={12} /> Email
          </span>
        );
      case 'TASK':
        return (
          <span className="badge bg-warning-subtle text-warning border border-warning d-inline-flex align-items-center gap-1">
            <FiCheckSquare size={12} /> Task
          </span>
        );
      default:
        return <span className="badge bg-secondary">{type}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge bg-success-subtle text-success">Completed</span>;
      case 'PENDING':
        return <span className="badge bg-warning-subtle text-warning">Pending</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-info-subtle text-info">In Progress</span>;
      case 'CANCELLED':
        return <span className="badge bg-secondary-subtle text-secondary">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  return (
    <div className="container-fluid py-2">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FiActivity className="text-primary" />
            <span>Activity Management</span>
          </h3>
          <p className="text-muted small mb-0">
            Log and review interactions, phone conversations, client meetings, emails, and tasks.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2 btn-sm"
            onClick={fetchActivities}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 btn-sm fw-semibold shadow-sm"
            onClick={() => {
              setEditingActivity(null);
              setShowFormModal(true);
            }}
          >
            <FiPlus size={16} />
            <span>Log Activity</span>
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

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Total Activities</span>
                <h4 className="fw-bold mt-1 mb-0 text-dark">{stats.total}</h4>
              </div>
              <div className="p-3 bg-secondary-subtle text-secondary rounded-3">
                <FiActivity size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Calls</span>
                <h4 className="fw-bold mt-1 mb-0 text-primary">{stats.calls}</h4>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3">
                <FiPhone size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Meetings</span>
                <h4 className="fw-bold mt-1 mb-0 text-success">{stats.meetings}</h4>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <FiUsers size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Emails</span>
                <h4 className="fw-bold mt-1 mb-0 text-info">{stats.emails}</h4>
              </div>
              <div className="p-3 bg-info-subtle text-info rounded-3">
                <FiMail size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl">
          <div className="card border-0 shadow-sm rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-medium text-uppercase">Tasks</span>
                <h4 className="fw-bold mt-1 mb-0 text-warning">{stats.tasks}</h4>
              </div>
              <div className="p-3 bg-warning-subtle text-warning rounded-3">
                <FiCheckSquare size={20} />
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
            <div className="col-md-5">
              <form onSubmit={handleSearchSubmit}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FiSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search subject, notes, client, rep..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Type Filter */}
            <div className="col-md-4">
              <div className="btn-group btn-group-sm w-100" role="group">
                <button
                  type="button"
                  className={`btn ${typeFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTypeFilter('ALL')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn ${typeFilter === 'CALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTypeFilter('CALL')}
                >
                  Calls
                </button>
                <button
                  type="button"
                  className={`btn ${typeFilter === 'MEETING' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTypeFilter('MEETING')}
                >
                  Meetings
                </button>
                <button
                  type="button"
                  className={`btn ${typeFilter === 'EMAIL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTypeFilter('EMAIL')}
                >
                  Emails
                </button>
                <button
                  type="button"
                  className={`btn ${typeFilter === 'TASK' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTypeFilter('TASK')}
                >
                  Tasks
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
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr className="small text-secondary text-uppercase">
                <th style={{ width: 60 }}>#</th>
                <th>Type</th>
                <th>Subject & Notes</th>
                <th>Associated With</th>
                <th>Date</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
                    Loading activity records...
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <FiActivity size={36} className="text-secondary opacity-50 mb-2" />
                    <p className="mb-0 fw-medium">No activity records found.</p>
                    <small>Click "Log Activity" to document a customer interaction.</small>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act, idx) => (
                  <tr key={act.id}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td>{getTypeBadge(act.activityType)}</td>
                    <td>
                      <div className="fw-semibold text-dark">{act.subject}</div>
                      {act.description && (
                        <div
                          className="text-muted small text-truncate mt-1"
                          style={{ maxWidth: 320 }}
                          title={act.description}
                        >
                          {act.description}
                        </div>
                      )}
                    </td>
                    <td>
                      {act.customerName ? (
                        <div>
                          <span className="badge bg-light text-dark border me-1">Customer</span>
                          <span className="fw-medium text-dark">{act.customerName}</span>
                        </div>
                      ) : act.leadName ? (
                        <div>
                          <span className="badge bg-light text-dark border me-1">Lead</span>
                          <span className="fw-medium text-dark">{act.leadName}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">General</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 small">
                        <FiCalendar size={13} className="text-muted" />
                        <span>{act.activityDate}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-secondary small">
                        {act.assignedTo || 'Unassigned'}
                      </span>
                    </td>
                    <td>{getStatusBadge(act.status)}</td>
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          title="Edit Activity"
                          onClick={() => {
                            setEditingActivity(act);
                            setShowFormModal(true);
                          }}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Activity"
                          onClick={() => handleDelete(act.id)}
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

      {/* Modal */}
      {showFormModal && (
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleSaveActivity}
          onCancel={() => {
            setShowFormModal(false);
            setEditingActivity(null);
          }}
          loading={formSubmitting}
        />
      )}
    </div>
  );
}
