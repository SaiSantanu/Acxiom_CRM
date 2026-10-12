import api from './api';

/**
 * Service handling customer API operations.
 */
export const customerService = {
  /**
   * Retrieve customers with optional search term (name, email, phone, company, code).
   */
  getAll: (search = '') => {
    const params = search && search.trim() ? { search: search.trim() } : {};
    return api.get('/customers', { params });
  },

  /**
   * Retrieve a single customer by ID.
   */
  getById: (id) => {
    return api.get(`/customers/${id}`);
  },

  /**
   * Create a new customer.
   */
  create: (data) => {
    return api.post('/customers', data);
  },

  /**
   * Update an existing customer by ID.
   */
  update: (id, data) => {
    return api.put(`/customers/${id}`, data);
  },

  /**
   * Deactivate a customer.
   */
  deactivate: (id) => {
    return api.delete(`/customers/${id}`);
  },

  /**
   * Permanently delete a customer record.
   */
  deletePermanent: (id) => {
    return api.delete(`/customers/${id}`, { params: { permanent: true } });
  },
};

export default customerService;
