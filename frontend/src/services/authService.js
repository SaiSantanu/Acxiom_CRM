import api from './api';

export const authService = {
  login: (usernameOrEmail, password) => {
    return api.post('/auth/login', { usernameOrEmail, password });
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  getMe: () => {
    return api.get('/auth/me');
  },
};

export default authService;
