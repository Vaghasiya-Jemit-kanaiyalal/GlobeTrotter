/**
 * GlobeTrotter Auth Service
 * Manages persistent user authentication, roles ('user' | 'admin'), and session tokens in localStorage.
 */

const STORAGE_KEY_USER = 'globetrotter_user';
const STORAGE_KEY_TOKEN = 'globetrotter_token';

// Default mock admin and regular user accounts for testing
const MOCK_ACCOUNTS = [
  {
    id: 'usr-admin-1',
    name: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'admin@globetrotter.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    joinedDate: '2025-11-20',
  },
  {
    id: 'usr-regular-1',
    name: 'Jay Sohaliya',
    firstName: 'Jay',
    lastName: 'Sohaliya',
    email: 'jay@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    joinedDate: '2026-01-15',
  },
];

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
    return null; // Null means unauthenticated guest
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
    return Boolean(this.getCurrentUser());
  },

  /**
   * Check if current user has administrator privileges
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return Boolean(user && user.role === 'admin');
  },

  /**
   * User login (Standard traveler login)
   */
  async login(email, password) {
    await new Promise((r) => setTimeout(r, 300));
    
    // Find matching account or fallback to standard user
    let account = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account) {
      account = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        firstName: email.split('@')[0],
        lastName: '',
        email: email,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        joinedDate: new Date().toISOString().split('T')[0],
      };
    }

    const token = `gt_jwt_token_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(account));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return { user: account, token };
  },

  /**
   * Dedicated Admin Login
   */
  async loginAdmin(email, password) {
    await new Promise((r) => setTimeout(r, 400));

    // Admin validation logic
    if (email.toLowerCase().includes('admin') || password === 'admin123' || email.toLowerCase() === 'admin@globetrotter.com') {
      const adminAccount = {
        id: 'usr-admin-1',
        name: 'Alex Morgan',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: email || 'admin@globetrotter.com',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        joinedDate: '2025-11-20',
      };

      const token = `gt_admin_jwt_${Date.now()}`;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminAccount));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);

      return { user: adminAccount, token };
    } else {
      throw new Error('Invalid administrator credentials or role unauthorized.');
    }
  },

  /**
   * User registration
   */
  async register(userData) {
    await new Promise((r) => setTimeout(r, 300));
    const newUser = {
      id: `usr-${Date.now()}`,
      name: `${userData.firstName} ${userData.lastName}`.trim(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const token = `gt_jwt_token_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return { user: newUser, token };
  },

  /**
   * Logout user and clear stored auth tokens
   */
  logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },
};
