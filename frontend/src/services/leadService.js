import api from './api';

/**
 * Service handling Lead API operations.
 */
export const leadService = {
  /**
   * Retrieve leads with optional keyword search and status filter.
   */
  getAll: (search = '', status = '') => {
    const params = {};
    if (search && search.trim()) {
      params.search = search.trim();
    }
    if (status && status.trim() && status !== 'ALL') {
      params.status = status.trim();
    }
    return api.get('/leads', { params });
  },

  /**
   * Retrieve single lead by ID.
   */
  getById: (id) => {
    return api.get(`/leads/${id}`);
  },

  /**
   * Create a new lead.
   */
  create: (data) => {
    return api.post('/leads', data);
  },

  /**
   * Update an existing lead by ID.
   */
  update: (id, data) => {
    return api.put(`/leads/${id}`, data);
  },

  /**
   * Deactivate a lead (marks status as LOST).
   */
  deactivate: (id) => {
    return api.delete(`/leads/${id}`);
  },

  /**
   * Permanently delete a lead.
   */
  deletePermanent: (id) => {
    return api.delete(`/leads/${id}`, { params: { permanent: true } });
  },
};

export default leadService;
