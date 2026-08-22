const userRepository = require('../repositories/user.repository');
const tripRepository = require('../repositories/trip.repository');
const cityRepository = require('../repositories/city.repository');
const activityRepository = require('../repositories/activity.repository');

async function getAdminDashboardStats() {
  const totalUsers = await userRepository.countAllUsers();
  const totalTrips = await tripRepository.countAllTrips();
  const publicTrips = await tripRepository.countPublicTrips();
  const totalCities = await cityRepository.countAllCities();
  const popularCities = await cityRepository.getPopularCities(5);
  const popularActivities = await activityRepository.getPopularActivities(5);

  return {
    totalUsers,
    totalTrips,
    publicTrips,
    privateTrips: totalTrips - publicTrips,
    totalCities,
    popularCities,
    popularActivities
  };
}

async function getAllUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const users = await userRepository.findAllUsers(limit, offset);
  const total = await userRepository.countAllUsers();
  return { users, total, page, limit };
}

module.exports = {
  getAdminDashboardStats,
  getAllUsers
};
