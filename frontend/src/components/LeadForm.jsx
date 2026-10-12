import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';

const initialFormData = {
  leadName: '',
  companyName: '',
  email: '',
  phone: '',
  source: 'WEBSITE',
  status: 'NEW',
  priority: 'MEDIUM',
  expectedValue: '0.00',
  assignedTo: '',
  notes: '',
};

export default function LeadForm({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        leadName: initialData.leadName || '',
        companyName: initialData.companyName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        source: initialData.source || 'WEBSITE',
        status: initialData.status || 'NEW',
        priority: initialData.priority || 'MEDIUM',
        expectedValue: initialData.expectedValue !== undefined && initialData.expectedValue !== null
          ? String(initialData.expectedValue)
          : '0.00',
        assignedTo: initialData.assignedTo || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
    setServerError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    if (!formData.leadName.trim()) {
      errs.leadName = 'Lead name is required.';
    } else if (formData.leadName.trim().length > 150) {
      errs.leadName = 'Lead name cannot exceed 150 characters.';
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please provide a valid email format (e.g., lead@example.com).';
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[0-9+()\s-]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errs.phone = 'Please provide a valid phone format (7-20 digits).';
      }
    }

    if (formData.expectedValue !== '' && formData.expectedValue !== null) {
      const val = parseFloat(formData.expectedValue);
      if (isNaN(val) || val < 0) {
        errs.expectedValue = 'Expected value cannot be negative.';
      }
    }

    if (formData.companyName && formData.companyName.trim().length > 150) {
      errs.companyName = 'Company name cannot exceed 150 characters.';
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
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');
    try {
      const payload = {
        ...formData,
        expectedValue: formData.expectedValue !== '' ? parseFloat(formData.expectedValue) : 0,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save lead.';
      setServerError(msg);
      if (err.response?.data?.validationErrors) {
        setErrors((prev) => ({ ...prev, ...err.response.data.validationErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: 12 }}>
          <div className="modal-header border-bottom py-3 px-4 bg-light">
            <h5 className="modal-title fw-bold text-dark">
              {isEditMode ? 'Edit Lead Record' : 'Capture New Sales Lead'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              disabled={isSubmitting}
            />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body px-4 py-3">
              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
                  <FiAlertCircle className="flex-shrink-0" size={18} />
                  <div>{serverError}</div>
                </div>
              )}

              {isEditMode && initialData?.leadCode && (
                <div className="mb-3 p-2 bg-light rounded border text-muted small">
                  <strong>Lead Code:</strong> <code>{initialData.leadCode}</code> (Auto-assigned & Read-only)
                </div>
              )}

              <div className="row g-3">
                {/* Lead Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Lead / Prospect Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="leadName"
                    className={`form-control ${errors.leadName ? 'is-invalid' : ''}`}
                    placeholder="e.g., Jonathan Drake"
                    value={formData.leadName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.leadName && (
                    <div className="invalid-feedback">{errors.leadName}</div>
                  )}
                </div>

                {/* Company Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                    placeholder="e.g., Horizon Logistics"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.companyName && (
                    <div className="invalid-feedback">{errors.companyName}</div>
                  )}
                </div>

                {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="e.g., jonathan@horizon.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="e.g., +1 (555) 345-6789"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                {/* Lead Source */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Lead Source</label>
                  <select
                    name="source"
                    className="form-select"
                    value={formData.source}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="WEBSITE">Website</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="CAMPAIGN">Campaign</option>
                    <option value="COLD_CALL">Cold Call</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Lead Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="UNQUALIFIED">Unqualified</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Priority</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                {/* Expected Value */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Expected Deal Value ($)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="expectedValue"
                      className={`form-control ${errors.expectedValue ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                      value={formData.expectedValue}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.expectedValue && (
                      <div className="invalid-feedback">{errors.expectedValue}</div>
                    )}
                  </div>
                </div>

                {/* Assigned To */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Assigned Representative</label>
                  <input
                    type="text"
                    name="assignedTo"
                    className={`form-control ${errors.assignedTo ? 'is-invalid' : ''}`}
                    placeholder="e.g., Alex Mercer"
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
                  <label className="form-label fw-semibold small">Discovery Notes & Background</label>
                  <textarea
                    name="notes"
                    rows="3"
                    className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                    placeholder="Add qualification notes, interest areas, or timeline..."
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.notes && (
                    <div className="invalid-feedback">{errors.notes}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer border-top py-3 px-4 bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    <span>{isEditMode ? 'Update Lead' : 'Create Lead'}</span>
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
