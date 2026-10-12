import api from './api';

export const activityService = {
  getAll: (search = '', type = '', customerId = '', leadId = '') => {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (type && type !== 'ALL') params.type = type;
    if (customerId) params.customerId = customerId;
    if (leadId) params.leadId = leadId;
    return api.get('/activities', { params });
  },

  getById: (id) => {
    return api.get(`/activities/${id}`);
  },

  create: (data) => {
    return api.post('/activities', data);
  },

  update: (id, data) => {
    return api.put(`/activities/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/activities/${id}`);
  },
};

export default activityService;
