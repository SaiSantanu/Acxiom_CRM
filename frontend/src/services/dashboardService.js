import api from './api';

export const dashboardService = {
  getStats: () => {
    return api.get('/dashboard/stats');
  },
};

export default dashboardService;
