// src/features/auth/authAPI.js
import backendAPI from '../../api/backendAPI';

export const authAPI = {
  /**
   * POST /api/auth/login
   * Returns { success, token, user }
   */
  login: async ({ email, password }) => {
    return backendAPI.post('/auth/login', { email, password });
  },

  /**
   * POST /api/auth/register
   * Returns { success, token, user }
   */
  register: async ({ name, email, password }) => {
    return backendAPI.post('/auth/register', { name, email, password });
  },

  /**
   * GET /api/auth/me
   * Returns { success, user }
   */
  getMe: async () => {
    return backendAPI.get('/auth/me');
  },

  /**
   * PUT /api/auth/me
   * Returns { success, user }
   */
  updateMe: async (data) => {
    return backendAPI.put('/auth/me', data);
  },

  /**
   * POST /api/auth/logout
   */
  logout: async () => {
    return backendAPI.post('/auth/logout');
  },
};

export default authAPI;
