import api from './api';

/**
 * Service handling Opportunity API operations.
 */
export const opportunityService = {
  /**
   * Retrieve opportunities with optional search, stage, status, and customer filter.
   */
  getAll: (search = '', stage = '', status = '', customerId = '') => {
    const params = {};
    if (search && search.trim()) {
      params.search = search.trim();
    }
    if (stage && stage !== 'ALL') {
      params.stage = stage;
    }
    if (status && status !== 'ALL') {
      params.status = status;
    }
    if (customerId) {
      params.customerId = customerId;
    }
    return api.get('/opportunities', { params });
  },

  /**
   * Retrieve sales pipeline summary metrics.
   */
  getSummary: () => {
    return api.get('/opportunities/summary');
  },

  /**
   * Retrieve single opportunity by ID.
   */
  getById: (id) => {
    return api.get(`/opportunities/${id}`);
  },

  /**
   * Create a new opportunity.
   */
  create: (data) => {
    return api.post('/opportunities', data);
  },

  /**
   * Update an existing opportunity.
   */
  update: (id, data) => {
    return api.put(`/opportunities/${id}`, data);
  },

  /**
   * Soft deactivate opportunity (marks as LOST).
   */
  deactivate: (id) => {
    return api.delete(`/opportunities/${id}`);
  },

  /**
   * Permanently delete an opportunity.
   */
  deletePermanent: (id) => {
    return api.delete(`/opportunities/${id}`, { params: { permanent: true } });
  },
};

export default opportunityService;
