import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiDollarSign, FiPercent, FiTrendingUp } from 'react-icons/fi';
import customerService from '../services/customerService';
import leadService from '../services/leadService';

const STAGE_DEFAULTS = {
  QUALIFICATION: { probability: 20, status: 'OPEN', label: 'Qualification' },
  PROPOSAL: { probability: 50, status: 'OPEN', label: 'Proposal' },
  NEGOTIATION: { probability: 75, status: 'OPEN', label: 'Negotiation' },
  WON: { probability: 100, status: 'WON', label: 'Closed Won' },
  LOST: { probability: 0, status: 'LOST', label: 'Closed Lost' },
};

const initialFormData = {
  opportunityName: '',
  customerId: '',
  leadId: '',
  amount: '',
  stage: 'QUALIFICATION',
  probability: 20,
  expectedCloseDate: '',
  source: 'WEBSITE',
  assignedTo: '',
  notes: '',
};

export default function OpportunityForm({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Foreign key dropdown options
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const isEditMode = Boolean(initialData && initialData.id);

  // Format today's date as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Active opportunity check: stage is not WON and not LOST
  const isActive = formData.stage !== 'WON' && formData.stage !== 'LOST';

  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
      if (initialData) {
        setFormData({
          opportunityName: initialData.opportunityName || '',
          customerId: initialData.customerId ? String(initialData.customerId) : '',
          leadId: initialData.leadId ? String(initialData.leadId) : '',
          amount: initialData.amount !== undefined && initialData.amount !== null ? String(initialData.amount) : '',
          stage: initialData.stage || 'QUALIFICATION',
          probability: initialData.probability !== undefined && initialData.probability !== null ? initialData.probability : 20,
          expectedCloseDate: initialData.expectedCloseDate || '',
          source: initialData.source || 'WEBSITE',
          assignedTo: initialData.assignedTo || '',
          notes: initialData.notes || '',
        });
      } else {
        // Set default expected close date to 30 days from today
        const defaultClose = new Date();
        defaultClose.setDate(defaultClose.getDate() + 30);
        const defaultCloseStr = defaultClose.toISOString().split('T')[0];

        setFormData({
          ...initialFormData,
          expectedCloseDate: defaultCloseStr,
        });
      }
      setErrors({});
      setServerError('');
    }
  }, [initialData, isOpen]);

  const loadDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [custRes, leadRes] = await Promise.all([
        customerService.getAll(),
        leadService.getAll(),
      ]);
      setCustomers(custRes.data || []);
      setLeads(leadRes.data || []);
    } catch (err) {
      console.warn('Could not load all customer/lead options:', err.message);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  if (!isOpen) return null;

  // Handle stage change and auto-adjust probability & status
  const handleStageChange = (e) => {
    const newStage = e.target.value;
    const defaults = STAGE_DEFAULTS[newStage];
    setFormData((prev) => ({
      ...prev,
      stage: newStage,
      probability: defaults ? defaults.probability : prev.probability,
    }));
    if (errors.stage) {
      setErrors((prev) => ({ ...prev, stage: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.opportunityName.trim()) {
      errs.opportunityName = 'Opportunity name is required.';
    } else if (formData.opportunityName.trim().length > 150) {
      errs.opportunityName = 'Opportunity name cannot exceed 150 characters.';
    }

    const amountVal = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountVal)) {
      errs.amount = 'Amount is required.';
    } else if (amountVal <= 0) {
      errs.amount = 'Amount must be greater than zero for an active opportunity.';
    }

    const probVal = parseInt(formData.probability, 10);
    if (isNaN(probVal) || probVal < 0 || probVal > 100) {
      errs.probability = 'Probability must be between 0 and 100 inclusive.';
    }

    // Active opportunity check: stage not WON and not LOST
    if (isActive && formData.expectedCloseDate) {
      if (formData.expectedCloseDate < todayStr) {
        errs.expectedCloseDate = 'Expected close date cannot be in the past for an active opportunity.';
      }
    }

    if (formData.source && formData.source.trim().length > 50) {
      errs.source = 'Source cannot exceed 50 characters.';
    }

    if (formData.assignedTo && formData.assignedTo.trim().length > 100) {
      errs.assignedTo = 'Assigned user cannot exceed 100 characters.';
    }

    if (formData.notes && formData.notes.trim().length > 1000) {
      errs.notes = 'Notes cannot exceed 1000 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        opportunityName: formData.opportunityName.trim(),
        customerId: formData.customerId ? Number(formData.customerId) : null,
        leadId: formData.leadId ? Number(formData.leadId) : null,
        amount: parseFloat(formData.amount),
        stage: formData.stage,
        probability: parseInt(formData.probability, 10),
        expectedCloseDate: formData.expectedCloseDate || null,
        source: formData.source ? formData.source.trim() : null,
        assignedTo: formData.assignedTo ? formData.assignedTo.trim() : null,
        notes: formData.notes ? formData.notes.trim() : null,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to save opportunity record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live calculations
  const parsedAmt = parseFloat(formData.amount) || 0;
  const parsedProb = parseInt(formData.probability, 10) || 0;
  const liveWeighted = ((parsedAmt * parsedProb) / 100).toFixed(2);
  const currentStatus = formData.stage === 'WON' ? 'WON' : formData.stage === 'LOST' ? 'LOST' : 'OPEN';

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: 12 }}>
          {/* Header */}
          <div className="modal-header border-bottom py-3 px-4 bg-light">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 34, height: 34, backgroundColor: '#eff6ff', color: '#2563eb' }}
              >
                <FiTrendingUp size={18} />
              </div>
              <h5 className="modal-title fw-bold text-dark mb-0">
                {isEditMode ? 'Edit Opportunity' : 'Add New Opportunity'}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              disabled={isSubmitting}
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body px-4 py-3" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
                  <FiAlertCircle className="flex-shrink-0" size={18} />
                  <div>{serverError}</div>
                </div>
              )}

              {isEditMode && initialData?.opportunityCode && (
                <div className="mb-3 p-2 bg-light rounded border text-muted small d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Opportunity Code:</strong> <code>{initialData.opportunityCode}</code>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary border">System Assigned</span>
                </div>
              )}

              {/* Deal Summary Live Badge strip */}
              <div className="p-3 mb-3 rounded border" style={{ backgroundColor: '#f8fafc' }}>
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <small className="text-muted d-block">Stage & Status</small>
                    <span
                      className={`badge mt-1 ${
                        currentStatus === 'WON'
                          ? 'bg-success'
                          : currentStatus === 'LOST'
                          ? 'bg-danger'
                          : 'bg-primary'
                      }`}
                    >
                      {formData.stage} ({currentStatus})
                    </span>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Deal Amount</small>
                    <strong className="text-dark">
                      ${parsedAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Weighted Pipeline</small>
                    <strong className="text-primary">
                      ${Number(liveWeighted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                {/* Opportunity Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">
                    Opportunity Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="opportunityName"
                    className={`form-control ${errors.opportunityName ? 'is-invalid' : ''}`}
                    placeholder="e.g., Enterprise Cloud Migration 2026"
                    value={formData.opportunityName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.opportunityName && (
                    <div className="invalid-feedback">{errors.opportunityName}</div>
                  )}
                </div>

                {/* Customer Dropdown */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Associated Customer</label>
                  <select
                    name="customerId"
                    className="form-select"
                    value={formData.customerId}
                    onChange={handleChange}
                    disabled={isSubmitting || loadingDropdowns}
                  >
                    <option value="">-- No Customer / Prospective --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.customerName} ({c.customerCode || `#${c.id}`})
                      </option>
                    ))}
                  </select>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Links deal to customer account
                  </small>
                </div>

                {/* Lead Dropdown */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Originating Lead</label>
                  <select
                    name="leadId"
                    className="form-select"
                    value={formData.leadId}
                    onChange={handleChange}
                    disabled={isSubmitting || loadingDropdowns}
                  >
                    <option value="">-- No Originating Lead --</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.leadName} ({l.leadCode || `#${l.id}`})
                      </option>
                    ))}
                  </select>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Optional source lead conversion link
                  </small>
                </div>

                {/* Amount */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Deal Amount ($) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiDollarSign size={15} />
                    </span>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min="0.01"
                      className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                      placeholder="e.g., 50000.00"
                      value={formData.amount}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                  </div>
                </div>

                {/* Stage */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Pipeline Stage <span className="text-danger">*</span>
                  </label>
                  <select
                    name="stage"
                    className={`form-select ${errors.stage ? 'is-invalid' : ''}`}
                    value={formData.stage}
                    onChange={handleStageChange}
                    disabled={isSubmitting}
                  >
                    <option value="QUALIFICATION">Qualification (20%)</option>
                    <option value="PROPOSAL">Proposal (50%)</option>
                    <option value="NEGOTIATION">Negotiation (75%)</option>
                    <option value="WON">Closed Won (100%)</option>
                    <option value="LOST">Closed Lost (0%)</option>
                  </select>
                  {errors.stage && <div className="invalid-feedback">{errors.stage}</div>}
                </div>

                {/* Probability */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small d-flex justify-content-between">
                    <span>
                      Win Probability (%) <span className="text-danger">*</span>
                    </span>
                    <span className="text-primary fw-bold">{formData.probability}%</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiPercent size={14} />
                    </span>
                    <input
                      type="number"
                      name="probability"
                      min="0"
                      max="100"
                      className={`form-control ${errors.probability ? 'is-invalid' : ''}`}
                      value={formData.probability}
                      onChange={handleChange}
                      disabled={isSubmitting || formData.stage === 'WON' || formData.stage === 'LOST'}
                    />
                    {errors.probability && (
                      <div className="invalid-feedback">{errors.probability}</div>
                    )}
                  </div>
                  <input
                    type="range"
                    className="form-range mt-1"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.probability}
                    name="probability"
                    onChange={handleChange}
                    disabled={isSubmitting || formData.stage === 'WON' || formData.stage === 'LOST'}
                  />
                </div>

                {/* Expected Close Date */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Expected Close Date</label>
                  <input
                    type="date"
                    name="expectedCloseDate"
                    className={`form-control ${errors.expectedCloseDate ? 'is-invalid' : ''}`}
                    value={formData.expectedCloseDate}
                    onChange={handleChange}
                    min={isActive ? todayStr : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.expectedCloseDate && (
                    <div className="invalid-feedback">{errors.expectedCloseDate}</div>
                  )}
                  {isActive && (
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Cannot be in the past for active deals
                    </small>
                  )}
                </div>

                {/* Source */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Lead Source</label>
                  <select
                    name="source"
                    className={`form-select ${errors.source ? 'is-invalid' : ''}`}
                    value={formData.source}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="WEBSITE">Website</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="CAMPAIGN">Campaign</option>
                    <option value="PARTNER">Partner</option>
                    <option value="DIRECT">Direct Sales</option>
                    <option value="OUTREACH">Cold Outreach</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.source && <div className="invalid-feedback">{errors.source}</div>}
                </div>

                {/* Assigned To */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Assigned Representative</label>
                  <input
                    type="text"
                    name="assignedTo"
                    className={`form-control ${errors.assignedTo ? 'is-invalid' : ''}`}
                    placeholder="e.g., Alex Johnson"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.assignedTo && (
                    <div className="invalid-feedback">{errors.assignedTo}</div>
                  )}
                </div>

                {/* Notes */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Deal Notes & Strategy</label>
                  <textarea
                    name="notes"
                    rows="3"
                    className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                    placeholder="Key stakeholders, budget status, next negotiation meeting date..."
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top py-3 px-4 bg-light d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <FiX className="me-1" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm px-4 d-flex align-items-center gap-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck className="me-1" />
                    {isEditMode ? 'Update Opportunity' : 'Create Opportunity'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
