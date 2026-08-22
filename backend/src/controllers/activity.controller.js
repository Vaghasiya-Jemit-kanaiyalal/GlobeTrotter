const activityService = require('../services/activity.service');
const { sendSuccess, sendPaginated } = require('../utils/response');

async function getActivities(req, res, next) {
  try {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 20, 10);
    const { items, total } = await activityService.searchActivities({
      ...req.query,
      page,
      limit
    });
    return sendPaginated(res, 'Activities fetched successfully', items, page, limit, total);
  } catch (error) {
    next(error);
  }
}

async function getActivityById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const activity = await activityService.getActivityById(id);
    return sendSuccess(res, 'Activity details retrieved', { activity }, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActivities,
  getActivityById
};
