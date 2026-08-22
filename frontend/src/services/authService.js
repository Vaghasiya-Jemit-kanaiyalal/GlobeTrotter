/**
 * GlobeTrotter Auth Service
 * Connects frontend directly to Express Backend (/api/v1/auth) with JWT Bearer session persistence.
 */

import { apiClient, STORAGE_KEY_TOKEN, STORAGE_KEY_USER } from './apiClient';

export const authService = {
  /**
   * Returns current authenticated user from localStorage if present
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading user session:', e);
    }
    return null;
  },

  /**
   * Returns session token
   */
  getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
  },

  /**
   * Check if current user is logged in
   */
  isAuthenticated() {
    return Boolean(this.getCurrentUser() && this.getToken());
  },

  /**
   * Check if current user has administrator privileges
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return Boolean(user && user.role === 'admin' && this.getToken());
  },

  /**
   * Verify session token with backend endpoint GET /api/v1/auth/me
   */
  async verifySession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await apiClient.get('/auth/me');
      if (res && res.user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
        return res.user;
      }
    } catch (err) {
      console.warn('Session token verification failed, clearing auth:', err.message);
      this.logout();
    }
    return null;
  },

  /**
   * User login (Standard traveler login)
   */
  async login(email, password) {
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      if (data && data.user && data.token) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        return data;
      }
      throw new Error('Invalid login response from server');
    } catch (err) {
      throw err;
    }
  },

  /**
   * Dedicated Admin Login with server-side role verification
   */
  async loginAdmin(email, password) {
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      if (!data || !data.user || !data.token) {
        throw new Error('Invalid server response');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Access denied: User account does not have administrator privileges.');
      }

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      return data;
    } catch (err) {
      throw err;
    }
  },

  /**
   * User registration (POST /api/v1/auth/register)
   */
  async register(userData) {
    try {
      const payload = {
        email: userData.email,
        password: userData.password || 'password123',
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || 'Traveler',
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
      };

      const data = await apiClient.post('/auth/register', payload);
      if (data && data.user && data.token) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        return data;
      }
      throw new Error('Invalid registration response from server');
    } catch (err) {
      throw err;
    }
  },

  /**
   * Logout user and clear stored session
   */
  logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },
};
