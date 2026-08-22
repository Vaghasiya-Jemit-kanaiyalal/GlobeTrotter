const adminService = require('../services/admin.service');
const { sendSuccess } = require('../utils/response');

async function getDashboardOverview(req, res, next) {
  try {
    const summary = await adminService.getDashboardOverview();
    return sendSuccess(res, 'Admin dashboard summary retrieved', summary, 200);
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getUsers(req.query);
    return sendSuccess(res, 'Admin users list retrieved', users, 200);
  } catch (error) {
    next(error);
  }
}

async function getUserDetails(req, res, next) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const details = await adminService.getUserDetails(userId);
    return sendSuccess(res, 'Admin user details retrieved', details, 200);
  } catch (error) {
    next(error);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { status } = req.body;
    const details = await adminService.updateUserStatus(userId, status);
    return sendSuccess(res, `User status updated to ${status}`, details, 200);
  } catch (error) {
    next(error);
  }
}

async function getPopularCities(req, res, next) {
  try {
    const cities = await adminService.getPopularCities(req.query);
    return sendSuccess(res, 'Popular cities retrieved', { cities }, 200);
  } catch (error) {
    next(error);
  }
}

async function getPopularActivities(req, res, next) {
  try {
    const activities = await adminService.getPopularActivities(req.query);
    return sendSuccess(res, 'Popular activities retrieved', { activities }, 200);
  } catch (error) {
    next(error);
  }
}

async function getUserAnalytics(req, res, next) {
  try {
    const data = await adminService.getUserAnalytics(req.query.range);
    return sendSuccess(res, 'User growth analytics retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getTripAnalytics(req, res, next) {
  try {
    const data = await adminService.getTripAnalytics(req.query.range);
    return sendSuccess(res, 'Trip creation analytics retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getCommunityAnalytics(req, res, next) {
  try {
    const data = await adminService.getCommunityAnalytics();
    return sendSuccess(res, 'Community analytics retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getOverviewAnalytics(req, res, next) {
  try {
    const data = await adminService.getOverviewAnalytics();
    return sendSuccess(res, 'Platform overview analytics retrieved', data, 200);
  } catch (error) {
    next(error);
  }
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
