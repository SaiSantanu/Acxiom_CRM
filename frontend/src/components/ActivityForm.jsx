import React, { useState, useEffect } from 'react';
import { FiX, FiActivity, FiUser, FiCalendar, FiFileText } from 'react-icons/fi';
import customerService from '../services/customerService';
import leadService from '../services/leadService';

const ACTIVITY_TYPES = [
  { value: 'CALL', label: 'Call' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'TASK', label: 'Task' },
];

const ACTIVITY_STATUSES = [
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function ActivityForm({ activity, onSubmit, onCancel, loading }) {
  const isEdit = Boolean(activity && activity.id);
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    relatedType: 'CUSTOMER',
    customerId: '',
    leadId: '',
    activityType: 'CALL',
    subject: '',
    description: '',
    activityDate: todayStr,
    assignedTo: '',
    status: 'COMPLETED',
  });

  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [fetchingRefs, setFetchingRefs] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const [cRes, lRes] = await Promise.all([
          customerService.getAll(),
          leadService.getAll(),
        ]);
        setCustomers(cRes.data || []);
        setLeads(lRes.data || []);
      } catch (err) {
        console.error('Error fetching references for activity form:', err);
      } finally {
        setFetchingRefs(false);
      }
    };
    fetchRefs();
  }, []);

  useEffect(() => {
    if (activity) {
      setFormData({
        relatedType: activity.leadId ? 'LEAD' : 'CUSTOMER',
        customerId: activity.customerId || '',
        leadId: activity.leadId || '',
        activityType: activity.activityType || 'CALL',
        subject: activity.subject || '',
        description: activity.description || '',
        activityDate: activity.activityDate || todayStr,
        assignedTo: activity.assignedTo || '',
        status: activity.status || 'COMPLETED',
      });
    }
  }, [activity]);

  const validate = () => {
    const errs = {};
    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      errs.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.activityDate) {
      errs.activityDate = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      activityType: formData.activityType,
      subject: formData.subject.trim(),
      description: formData.description ? formData.description.trim() : null,
      activityDate: formData.activityDate,
      customerId: formData.relatedType === 'CUSTOMER' && formData.customerId ? Number(formData.customerId) : null,
      leadId: formData.relatedType === 'LEAD' && formData.leadId ? Number(formData.leadId) : null,
      assignedTo: formData.assignedTo ? formData.assignedTo.trim() : null,
      status: formData.status,
    };

    onSubmit(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header border-bottom px-4 py-3 bg-light">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <FiActivity className="text-primary" />
              <span>{isEdit ? 'Edit Activity' : 'Log New Activity'}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onCancel}
              disabled={loading}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Association Type */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small text-uppercase">
                  Association (Optional)
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="actRelatedType"
                      id="actRelCustomer"
                      value="CUSTOMER"
                      checked={formData.relatedType === 'CUSTOMER'}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, relatedType: 'CUSTOMER', leadId: '' }))
                      }
                    />
                    <label className="form-check-label fw-medium" htmlFor="actRelCustomer">
                      Customer / Account
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="actRelatedType"
                      id="actRelLead"
                      value="LEAD"
                      checked={formData.relatedType === 'LEAD'}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, relatedType: 'LEAD', customerId: '' }))
                      }
                    />
                    <label className="form-check-label fw-medium" htmlFor="actRelLead">
                      Lead / Prospect
                    </label>
                  </div>
                </div>
              </div>

              {/* CRM Record Dropdown */}
              <div className="row g-3 mb-3">
                {formData.relatedType === 'CUSTOMER' ? (
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Customer</label>
                    <select
                      className="form-select"
                      value={formData.customerId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, customerId: e.target.value }))
                      }
                      disabled={fetchingRefs}
                    >
                      <option value="">-- None / General Activity --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.customerName} ({c.customerCode || c.email})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Lead</label>
                    <select
                      className="form-select"
                      value={formData.leadId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, leadId: e.target.value }))
                      }
                      disabled={fetchingRefs}
                    >
                      <option value="">-- None / General Activity --</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.leadName} {l.companyName ? `(${l.companyName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label fw-medium small">Assigned To</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. sales, Rep name"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="form-label fw-medium small">
                  Subject / Summary <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                  placeholder="e.g. Intro discovery call with VP of Engineering"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                />
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>

              {/* Activity Type, Date & Status */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium small">
                    Activity Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.activityType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, activityType: e.target.value }))
                    }
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium small">
                    Activity Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.activityDate ? 'is-invalid' : ''}`}
                    value={formData.activityDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, activityDate: e.target.value }))
                    }
                  />
                  {errors.activityDate && (
                    <div className="invalid-feedback">{errors.activityDate}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium small">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    {ACTIVITY_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-2">
                <label className="form-label fw-medium small">Notes & Details</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter detailed notes, topics covered, customer reactions, or follow-up items..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="modal-footer px-4 py-3 bg-light border-top">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Saving...
                  </>
                ) : isEdit ? (
                  'Update Activity'
                ) : (
                  'Log Activity'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
