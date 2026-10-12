import React, { useState, useEffect, useCallback } from 'react';
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiUserX,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiBriefcase
} from 'react-icons/fi';
import customerService from '../services/customerService';
import CustomerForm from '../components/CustomerForm';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Deactivate / Delete Confirmation State
  const [actionTarget, setActionTarget] = useState(null); // { customer, type: 'deactivate' | 'delete' }
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await customerService.getAll(query);
      setCustomers(res.data || []);
    } catch (err) {
      showAlert('danger', err.message || 'Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(debouncedSearch);
  }, [debouncedSearch, fetchCustomers]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const handleCreateNew = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSaveCustomer = async (formData) => {
    if (editingCustomer) {
      await customerService.update(editingCustomer.id, formData);
      showAlert('success', `Customer "${formData.customerName}" successfully updated.`);
    } else {
      await customerService.create(formData);
      showAlert('success', `Customer "${formData.customerName}" successfully created.`);
    }
    fetchCustomers(debouncedSearch);
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      if (actionTarget.type === 'deactivate') {
        await customerService.deactivate(actionTarget.customer.id);
        showAlert('success', `Customer "${actionTarget.customer.customerName}" has been deactivated.`);
      } else {
        await customerService.deletePermanent(actionTarget.customer.id);
        showAlert('success', `Customer "${actionTarget.customer.customerName}" has been permanently deleted.`);
      }
      setActionTarget(null);
      fetchCustomers(debouncedSearch);
    } catch (err) {
      showAlert('danger', err.message || 'Failed to complete requested action.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Top Banner Alerts */}
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
            <FiUsers className="text-primary" size={24} />
            <h3 className="fw-bold mb-0" style={{ color: '#0f172a' }}>
              Customer Accounts
            </h3>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-2">
              {customers.length} {customers.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
            Manage client profiles, company relations, and active business accounts.
          </p>
        </div>

        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => fetchCustomers(debouncedSearch)}
            disabled={loading}
            title="Refresh customer list"
          >
            <FiRefreshCw className={loading ? 'spinner-border spinner-border-sm' : ''} size={14} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={handleCreateNew}
          >
            <FiPlus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <FiSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, email, phone, company, or code..."
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
          <div className="col-12 col-md-6 col-lg-7 text-md-end text-muted small">
            {loading ? (
              <span>Querying database...</span>
            ) : (
              <span>Showing {customers.length} customer records</span>
            )}
          </div>
        </div>
      </div>

      {/* Customers Table / Card Container */}
      <div className="crm-card overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading customers...</span>
            </div>
            <div className="text-muted mt-2 small">Loading customer records from MySQL...</div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div
              className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{ width: 60, height: 60, backgroundColor: '#f1f5f9', color: '#64748b' }}
            >
              <FiUsers size={28} />
            </div>
            <h5 className="fw-bold text-dark">No Customers Found</h5>
            <p className="text-muted mx-auto mb-3" style={{ maxWidth: 420, fontSize: '0.9rem' }}>
              {searchTerm
                ? `No customer matched your search query "${searchTerm}". Try a different term or clear the filter.`
                : 'There are currently no customers in the database. Click the button below to add your first customer.'}
            </p>
            {searchTerm ? (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearchTerm('')}
              >
                Clear Search Filter
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleCreateNew}>
                <FiPlus className="me-1" /> Add First Customer
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase text-secondary">
                  <th style={{ width: 140 }}>Code</th>
                  <th>Customer Name</th>
                  <th>Company</th>
                  <th>Contact Details</th>
                  <th>Location</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th className="text-end" style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <code className="text-primary fw-bold" style={{ fontSize: '0.85rem' }}>
                        {c.customerCode}
                      </code>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{c.customerName}</div>
                    </td>
                    <td>
                      {c.companyName ? (
                        <div className="d-flex align-items-center gap-1 text-secondary small">
                          <FiBriefcase size={13} className="text-muted" />
                          <span>{c.companyName}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1 small">
                        <div className="d-flex align-items-center gap-1 text-secondary">
                          <FiMail size={13} className="text-muted" />
                          <span>{c.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 text-secondary">
                          <FiPhone size={13} className="text-muted" />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="small text-secondary">
                        {[c.city, c.state].filter(Boolean).join(', ') || '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === 'ACTIVE'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-secondary-subtle text-secondary border'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          title="Edit Customer"
                          onClick={() => handleEdit(c)}
                        >
                          <FiEdit2 size={13} />
                        </button>
                        {c.status === 'ACTIVE' ? (
                          <button
                            className="btn btn-outline-warning"
                            title="Deactivate Customer"
                            onClick={() => setActionTarget({ customer: c, type: 'deactivate' })}
                          >
                            <FiUserX size={13} />
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-danger"
                            title="Delete Permanently"
                            onClick={() => setActionTarget({ customer: c, type: 'delete' })}
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

      {/* Customer Form Modal */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
      />

      {/* Confirmation Dialog for Deactivate / Delete */}
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
                  {actionTarget.type === 'deactivate' ? 'Deactivate Customer' : 'Delete Customer'}
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
                    Are you sure you want to deactivate{' '}
                    <strong>{actionTarget.customer.customerName}</strong>? The record will remain in
                    the database marked as <code>INACTIVE</code>.
                  </p>
                ) : (
                  <p className="mb-0 text-danger">
                    Are you sure you want to permanently delete{' '}
                    <strong>{actionTarget.customer.customerName}</strong>? This action cannot be
                    undone.
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
                    'Deactivate'
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
