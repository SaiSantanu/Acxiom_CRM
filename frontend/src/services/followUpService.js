import api from './api';

export const followUpService = {
  getAll: (search = '', status = '', fromDate = '', toDate = '', customerId = '', leadId = '') => {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (status && status !== 'ALL') params.status = status;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (customerId) params.customerId = customerId;
    if (leadId) params.leadId = leadId;
    return api.get('/followups', { params });
  },

  getById: (id) => {
    return api.get(`/followups/${id}`);
  },

  create: (data) => {
    return api.post('/followups', data);
  },

  update: (id, data) => {
    return api.put(`/followups/${id}`, data);
  },

  complete: (id, remarks = '') => {
    return api.patch(`/followups/${id}/complete`, null, { params: { remarks } });
  },

  delete: (id) => {
    return api.delete(`/followups/${id}`);
  },
};

export default followUpService;
