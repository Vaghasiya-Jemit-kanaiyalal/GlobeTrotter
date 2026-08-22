/**
 * GlobeTrotter Centralized API Client
 * Manages HTTP communication with Express Backend (http://localhost:5000/api/v1).
 * Automatically injects JWT Bearer authorization tokens and parses API JSON responses.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const STORAGE_KEY_TOKEN = 'globetrotter_token';
export const STORAGE_KEY_USER = 'globetrotter_user';

export const apiClient = {
  /**
   * Helper to build request headers with Authorization Bearer token
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  /**
   * Process API fetch responses
   */
  async handleResponse(response) {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data?.error?.code || 'API_ERROR';
      error.details = data?.error?.details || null;
      throw error;
    }

    return data?.data !== undefined ? data.data : data;
  },

  /**
   * HTTP GET Request
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  },

  /**
   * HTTP POST Request
   */
  async post(endpoint, body = {}, customHeaders = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(customHeaders),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  },

  /**
   * HTTP PUT Request
   */
  async put(endpoint, body = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  },

  /**
   * HTTP DELETE Request
   */
  async del(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  },

  /**
   * Multipart / Form-Data Upload POST Request
   */
  async upload(endpoint, formData) {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return this.handleResponse(response);
  },
};
