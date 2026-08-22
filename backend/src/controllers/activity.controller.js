const activityService = require('../services/activity.service');
const { sendSuccess } = require('../utils/response');

async function getActivities(req, res, next) {
  try {
    const data = await activityService.searchActivities(req.query);
    return sendSuccess(res, 'Activities fetched successfully', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getActivityById(req, res, next) {
  try {
    const activityId = parseInt(req.params.activityId, 10);
    const data = await activityService.getActivityDetails(activityId);
    return sendSuccess(res, 'Activity details retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getRelatedActivities(req, res, next) {
  try {
    const activityId = parseInt(req.params.activityId, 10);
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const data = await activityService.getRelatedActivities(activityId, limit);
    return sendSuccess(res, 'Related activities retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getPopularActivities(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const data = await activityService.getPopularActivities(limit);
    return sendSuccess(res, 'Popular activities retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActivities,
  getActivityById,
  getRelatedActivities,
  getPopularActivities
};
