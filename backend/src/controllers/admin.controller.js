const adminService = require('../services/admin.service');
const { sendSuccess, sendPaginated } = require('../utils/response');

async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    return sendSuccess(res, 'Admin analytics dashboard statistics retrieved', stats, 200);
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 20, 10);
    const { users, total } = await adminService.getAllUsers(page, limit);
    return sendPaginated(res, 'Users retrieved successfully', users, page, limit, total);
  } catch (error) {
    next(error);
  }
}

async function getPopularCities(req, res, next) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    return sendSuccess(res, 'Popular cities retrieved', { popularCities: stats.popularCities }, 200);
  } catch (error) {
    next(error);
  }
}

async function getPopularActivities(req, res, next) {
  try {
    const stats = await adminService.getAdminDashboardStats();
    return sendSuccess(res, 'Popular activities retrieved', { popularActivities: stats.popularActivities }, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  getPopularCities,
  getPopularActivities
};
