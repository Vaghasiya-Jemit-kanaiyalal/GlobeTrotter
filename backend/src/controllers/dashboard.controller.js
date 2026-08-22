const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/response');

async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboardData(req.user.id);
    return sendSuccess(res, 'Dashboard data retrieved successfully', data, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard
};
