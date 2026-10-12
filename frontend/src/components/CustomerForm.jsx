import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

const initialFormData = {
  customerName: '',
  email: '',
  phone: '',
  companyName: '',
  address: '',
  city: '',
  state: '',
  status: 'ACTIVE',
};

export default function CustomerForm({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        companyName: initialData.companyName || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        status: initialData.status || 'ACTIVE',
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

    if (!formData.customerName.trim()) {
      errs.customerName = 'Customer name is required.';
    } else if (formData.customerName.trim().length > 150) {
      errs.customerName = 'Customer name cannot exceed 150 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address (e.g., name@domain.com).';
    } else if (formData.email.trim().length > 150) {
      errs.email = 'Email cannot exceed 150 characters.';
    }

    const phoneRegex = /^[0-9+()\s-]{7,20}$/;
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number format (7 to 20 digits/symbols).';
    }

    if (formData.companyName && formData.companyName.trim().length > 150) {
      errs.companyName = 'Company name cannot exceed 150 characters.';
    }

    if (formData.address && formData.address.trim().length > 255) {
      errs.address = 'Address cannot exceed 255 characters.';
    }

    if (formData.city && formData.city.trim().length > 100) {
      errs.city = 'City cannot exceed 100 characters.';
    }

    if (formData.state && formData.state.trim().length > 100) {
      errs.state = 'State cannot exceed 100 characters.';
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
      await onSave(formData);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save customer.';
      setServerError(msg);
      // Map validation errors if returned from backend
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
              {isEditMode ? 'Edit Customer Record' : 'Add New Customer'}
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

              {isEditMode && initialData?.customerCode && (
                <div className="mb-3 p-2 bg-light rounded border text-muted small">
                  <strong>Customer Code:</strong> <code>{initialData.customerCode}</code> (Auto-assigned & Read-only)
                </div>
              )}

              <div className="row g-3">
                {/* Customer Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Customer Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
                    placeholder="e.g., Sarah Jenkins"
                    value={formData.customerName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.customerName && (
                    <div className="invalid-feedback">{errors.customerName}</div>
                  )}
                </div>

                {/* Company Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                    placeholder="e.g., Acxiom Global Corp"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.companyName && (
                    <div className="invalid-feedback">{errors.companyName}</div>
                  )}
                </div>

                {/* Email Address */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="e.g., sarah.jenkins@example.com"
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
                  <label className="form-label fw-semibold small">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="e.g., +1 (555) 234-5678"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                {/* Address */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="e.g., 450 Innovation Parkway, Suite 200"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>

                {/* City */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">City</label>
                  <input
                    type="text"
                    name="city"
                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    placeholder="e.g., Austin"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>

                {/* State */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                    placeholder="e.g., TX"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.state && (
                    <div className="invalid-feedback">{errors.state}</div>
                  )}
                </div>

                {/* Status */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
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
                    <span>{isEditMode ? 'Update Customer' : 'Create Customer'}</span>
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
