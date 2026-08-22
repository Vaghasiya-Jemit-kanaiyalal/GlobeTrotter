const adminRepository = require('../repositories/admin.repository');
const userRepository = require('../repositories/user.repository');

async function getDashboardOverview() {
  return adminRepository.getDashboardOverview();
}

async function getUsers(queryParams) {
  return adminRepository.getUsers(queryParams);
}

async function getUserDetails(userId) {
  const details = await adminRepository.getUserDetails(userId);
  if (!details) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'USER_NOT_FOUND';
    throw error;
  }
  return details;
}

async function updateUserStatus(userId, status) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'USER_NOT_FOUND';
    throw error;
  }

  return adminRepository.updateUserStatus(userId, status);
}

async function getPopularCities(queryParams) {
  return adminRepository.getPopularCities(queryParams);
}

async function getPopularActivities(queryParams) {
  return adminRepository.getPopularActivities(queryParams);
}

async function getUserAnalytics(range) {
  return adminRepository.getUserAnalytics(range);
}

async function getTripAnalytics(range) {
  return adminRepository.getTripAnalytics(range);
}

async function getCommunityAnalytics() {
  return adminRepository.getCommunityAnalytics();
}

async function getOverviewAnalytics() {
  return adminRepository.getOverviewAnalytics();
}

module.exports = {
  getDashboardOverview,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getPopularCities,
  getPopularActivities,
  getUserAnalytics,
  getTripAnalytics,
  getCommunityAnalytics,
  getOverviewAnalytics
};
