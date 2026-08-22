/**
 * GlobeTrotter Admin Service API Abstraction Layer
 * Prepares frontend for REST endpoints as specified in Screen 12 (Section 16).
 */
import { MOCK_ADMIN_DATA } from '../data/adminData';

let usersStore = [...MOCK_ADMIN_DATA.users];

export const adminApi = {
  /**
   * GET /api/v1/admin/dashboard?range=30d
   */
  async getDashboardOverview(range = '30d') {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      overview: MOCK_ADMIN_DATA.overview,
      userGrowth: MOCK_ADMIN_DATA.userGrowth[range] || MOCK_ADMIN_DATA.userGrowth['30d'],
      tripActivity: MOCK_ADMIN_DATA.tripActivity['7d'],
      categoryBreakdown: MOCK_ADMIN_DATA.categoryBreakdown,
    };
  },

  /**
   * GET /api/v1/admin/users
   */
  async getUsers(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let results = [...usersStore];

    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'All') {
      results = results.filter((u) => u.status === params.status);
    }

    // Sort
    if (params.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sortBy === 'trips') {
      results.sort((a, b) => b.tripsCount - a.tripsCount);
    } else if (params.sortBy === 'recent') {
      results.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
    }

    return results;
  },

  /**
   * GET /api/v1/admin/users/:id
   */
  async getUserDetails(userId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return usersStore.find((u) => u.id === userId) || usersStore[0];
  },

  /**
   * GET /api/v1/admin/cities/popular
   */
  async getPopularCities(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let results = [...MOCK_ADMIN_DATA.popularCities];
    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
    }
    return results;
  },

  /**
   * GET /api/v1/admin/activities/popular
   */
  async getPopularActivities(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let results = [...MOCK_ADMIN_DATA.popularActivities];
    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
      );
    }
    return results;
  },

  /**
   * PUT /api/v1/admin/users/:id/status
   */
  async updateUserStatus(userId, status) {
    usersStore = usersStore.map((u) => (u.id === userId ? { ...u, status } : u));
    return usersStore.find((u) => u.id === userId);
  },

  /**
   * DELETE /api/v1/admin/users/:id
   */
  async deleteUser(userId) {
    usersStore = usersStore.filter((u) => u.id !== userId);
    return true;
  },
};
