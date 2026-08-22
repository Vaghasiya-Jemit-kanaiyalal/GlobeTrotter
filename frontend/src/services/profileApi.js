/**
 * REST API Service Layer for GlobeTrotter User Profile Management
 */

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let profileStore = {
  id: 'usr-1',
  firstName: 'Jay',
  lastName: 'Sohaliya',
  name: 'Jay Sohaliya',
  email: 'jay@example.com',
  phone: '+91 98765 43210',
  city: 'Ahmedabad',
  country: 'India',
  additionalInfo: 'Passionate adventure traveler, food enthusiast, and photography lover exploring cultural heritage sites.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  memberSince: '2024',
};

export const profileApi = {
  // GET /api/v1/profile
  async getProfile() {
    await delay(200);
    return {
      success: true,
      data: { ...profileStore },
    };
  },

  // PUT /api/v1/profile
  async updateProfile(updatedData) {
    await delay(300);
    profileStore = {
      ...profileStore,
      ...updatedData,
      name: `${updatedData.firstName || profileStore.firstName} ${updatedData.lastName || profileStore.lastName}`.trim(),
    };
    return {
      success: true,
      message: 'Profile updated successfully',
      data: { ...profileStore },
    };
  },

  // POST /api/v1/profile/avatar
  async updateAvatar(avatarUrl) {
    await delay(250);
    profileStore.avatarUrl = avatarUrl;
    return {
      success: true,
      avatarUrl: profileStore.avatarUrl,
    };
  },

  // DELETE /api/v1/profile
  async deleteAccount() {
    await delay(350);
    return {
      success: true,
      message: 'Account deleted successfully',
    };
  },
};
