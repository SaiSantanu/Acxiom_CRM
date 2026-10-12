import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiFileText, FiAlertCircle } from 'react-icons/fi';
import customerService from '../services/customerService';
import leadService from '../services/leadService';

const FOLLOW_UP_TYPES = [
  { value: 'CALL', label: 'Phone Call' },
  { value: 'MEETING', label: 'Client Meeting' },
  { value: 'EMAIL', label: 'Email Correspondence' },
  { value: 'VISIT', label: 'On-site Visit' },
];

const FOLLOW_UP_STATUSES = [
  { value: 'PLANNED', label: 'Planned' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'MISSED', label: 'Missed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function FollowUpForm({ followUp, onSubmit, onCancel, loading }) {
  const isEdit = Boolean(followUp && followUp.id);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    relatedType: 'CUSTOMER', // 'CUSTOMER' or 'LEAD'
    customerId: '',
    leadId: '',
    followUpDate: todayStr,
    followUpType: 'CALL',
    subject: '',
    remarks: '',
    status: 'PLANNED',
    assignedTo: '',
  });

  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [fetchingRefs, setFetchingRefs] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const [cRes, lRes] = await Promise.all([
          customerService.getAll(),
          leadService.getAll(),
        ]);
        setCustomers(cRes.data || []);
        setLeads(lRes.data || []);
      } catch (err) {
        console.error('Error fetching customers/leads for follow-up form:', err);
      } finally {
        setFetchingRefs(false);
      }
    };
    fetchReferences();
  }, []);

  useEffect(() => {
    if (followUp) {
      setFormData({
        relatedType: followUp.leadId ? 'LEAD' : 'CUSTOMER',
        customerId: followUp.customerId || '',
        leadId: followUp.leadId || '',
        followUpDate: followUp.followUpDate || todayStr,
        followUpType: followUp.followUpType || 'CALL',
        subject: followUp.subject || '',
        remarks: followUp.remarks || '',
        status: followUp.status || 'PLANNED',
        assignedTo: followUp.assignedTo || '',
      });
    }
  }, [followUp]);

  const validate = () => {
    const errs = {};
    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      errs.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.followUpDate) {
      errs.followUpDate = 'Follow-up date is required';
    } else if (!isEdit && formData.status === 'PLANNED' && formData.followUpDate < todayStr) {
      errs.followUpDate = 'A new planned follow-up cannot be scheduled in the past';
    }

    if (formData.relatedType === 'CUSTOMER' && !formData.customerId) {
      errs.customerId = 'Please select an associated customer';
    } else if (formData.relatedType === 'LEAD' && !formData.leadId) {
      errs.leadId = 'Please select an associated lead';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      customerId: formData.relatedType === 'CUSTOMER' ? Number(formData.customerId) : null,
      leadId: formData.relatedType === 'LEAD' ? Number(formData.leadId) : null,
      followUpDate: formData.followUpDate,
      followUpType: formData.followUpType,
      subject: formData.subject.trim(),
      remarks: formData.remarks ? formData.remarks.trim() : null,
      status: formData.status,
      assignedTo: formData.assignedTo ? formData.assignedTo.trim() : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header border-bottom px-4 py-3 bg-light">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <FiClock className="text-primary" />
              <span>{isEdit ? 'Edit Follow-Up' : 'Schedule New Follow-Up'}</span>
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
              {/* Association Type Selector */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small text-uppercase">
                  Associate With <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="relatedType"
                      id="relCustomer"
                      value="CUSTOMER"
                      checked={formData.relatedType === 'CUSTOMER'}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          relatedType: 'CUSTOMER',
                          leadId: '',
                        }))
                      }
                    />
                    <label className="form-check-label fw-medium" htmlFor="relCustomer">
                      Customer / Account
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="relatedType"
                      id="relLead"
                      value="LEAD"
                      checked={formData.relatedType === 'LEAD'}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          relatedType: 'LEAD',
                          customerId: '',
                        }))
                      }
                    />
                    <label className="form-check-label fw-medium" htmlFor="relLead">
                      Lead / Prospect
                    </label>
                  </div>
                </div>
              </div>

              {/* CRM Record Dropdown */}
              <div className="row g-3 mb-3">
                {formData.relatedType === 'CUSTOMER' ? (
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">
                      Customer <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
                      value={formData.customerId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, customerId: e.target.value }))
                      }
                      disabled={fetchingRefs}
                    >
                      <option value="">-- Select Customer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.customerName} ({c.customerCode || c.email})
                        </option>
                      ))}
                    </select>
                    {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
                  </div>
                ) : (
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">
                      Lead <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.leadId ? 'is-invalid' : ''}`}
                      value={formData.leadId}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, leadId: e.target.value }))
                      }
                      disabled={fetchingRefs}
                    >
                      <option value="">-- Select Lead --</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.leadName} {l.companyName ? `(${l.companyName})` : ''}
                        </option>
                      ))}
                    </select>
                    {errors.leadId && <div className="invalid-feedback">{errors.leadId}</div>}
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label fw-medium small">Assigned To</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. sales, John Doe"
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
                  Subject / Topic <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                  placeholder="e.g. Quarterly review call or product pricing follow-up"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                />
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>

              {/* Date, Type & Status */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium small">
                    Follow-Up Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.followUpDate ? 'is-invalid' : ''}`}
                    min={!isEdit && formData.status === 'PLANNED' ? todayStr : undefined}
                    value={formData.followUpDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, followUpDate: e.target.value }))
                    }
                  />
                  {errors.followUpDate && <div className="invalid-feedback">{errors.followUpDate}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium small">
                    Follow-Up Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.followUpType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, followUpType: e.target.value }))
                    }
                  >
                    {FOLLOW_UP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
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
                    {FOLLOW_UP_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-2">
                <label className="form-label fw-medium small">Remarks / Meeting Agenda</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter details, discussion notes, or next steps..."
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, remarks: e.target.value }))
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
                  'Update Follow-Up'
                ) : (
                  'Create Follow-Up'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
