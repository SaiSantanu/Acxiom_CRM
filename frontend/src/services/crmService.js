import api from './api';

/**
 * CRM API Service.
 * Phase 1: Provides live health-check connectivity and stubbed service signatures.
 */
export const crmService = {
  // Phase 1 System Health Check
  getHealth: async () => {
    return await api.get('/health');
  },

  // Placeholder methods for upcoming CRM modules (Phase 2+)
  getCustomers: async () => {
    console.warn('Customer module planned for subsequent phase.');
    return { data: [] };
  },

  getLeads: async () => {
    console.warn('Leads module planned for subsequent phase.');
    return { data: [] };
  },

  getOpportunities: async () => {
    console.warn('Opportunities module planned for subsequent phase.');
    return { data: [] };
  },

  getFollowUps: async () => {
    console.warn('Follow-ups module planned for subsequent phase.');
    return { data: [] };
  },

  getActivities: async () => {
    console.warn('Activities module planned for subsequent phase.');
    return { data: [] };
  },

  getReports: async () => {
    console.warn('Reports module planned for subsequent phase.');
    return { data: {} };
  },
};

export default crmService;
