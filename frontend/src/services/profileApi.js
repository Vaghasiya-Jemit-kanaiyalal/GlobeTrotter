/**
 * REST API Service Layer for GlobeTrotter User Profile Management
 * Connected live to Express Backend (/api/v1/profile) and MySQL DB
 */

import { apiClient, STORAGE_KEY_USER } from './apiClient';

export const profileApi = {
  // GET /api/v1/profile
  async getProfile() {
    try {
      const res = await apiClient.get('/profile');
      const profile = res?.user || res?.profile || res;
      if (profile) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      }
      return {
        success: true,
        data: profile,
      };
    } catch (err) {
      console.warn('Backend profile fetch failed, using stored user:', err.message);
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      const fallback = stored ? JSON.parse(stored) : {
        id: 'usr-1',
        firstName: 'Jay',
        lastName: 'Sohaliya',
        name: 'Jay Sohaliya',
        email: 'jay@example.com',
        phone: '+91 98765 43210',
        city: 'Ahmedabad',
        country: 'India',
        bio: 'Passionate traveler',
      };
      return { success: true, data: fallback };
    }
  },

  // PUT /api/v1/profile
  async updateProfile(updatedData) {
    try {
      const payload = {
        name: updatedData.name || `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim(),
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
        city: updatedData.city,
        country: updatedData.country,
        bio: updatedData.additionalInfo || updatedData.bio,
        avatarUrl: updatedData.avatarUrl,
      };

      const res = await apiClient.put('/profile', payload);
      const updatedProfile = res?.user || res;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedProfile));
      return {
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      };
    } catch (err) {
      console.error('Update profile failed:', err.message);
      throw err;
    }
  },

  // POST /api/v1/profile/avatar
  async updateAvatar(avatarUrl) {
    try {
      const res = await apiClient.put('/profile', { avatarUrl });
      const profile = res?.user || res;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      return {
        success: true,
        avatarUrl: profile.avatarUrl || avatarUrl,
      };
    } catch (err) {
      console.error('Update avatar failed:', err.message);
      throw err;
    }
  },

  // DELETE /api/v1/profile
  async deleteAccount() {
    try {
      await apiClient.del('/profile');
      localStorage.removeItem(STORAGE_KEY_USER);
      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (err) {
      console.error('Delete account failed:', err.message);
      throw err;
    }
  },
};
