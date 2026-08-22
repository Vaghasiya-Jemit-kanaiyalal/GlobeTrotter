const activityRepository = require('../repositories/activity.repository');

async function searchActivities(params) {
  if (params.groupBy) {
    const groups = await activityRepository.findGrouped(params);
    return { groups };
  }

  const { items, total, page, limit } = await activityRepository.findAll(params);
  const totalPages = Math.ceil(total / limit);

  return {
    activities: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: totalPages || 0
    }
  };
}

async function getActivityDetails(activityId) {
  const activity = await activityRepository.findById(activityId);
  if (!activity) {
    const error = new Error('Activity not found');
    error.statusCode = 404;
    error.errorCode = 'ACTIVITY_NOT_FOUND';
    throw error;
  }
  return { activity };
}

async function getRelatedActivities(activityId, limit) {
  const activity = await activityRepository.findById(activityId);
  if (!activity) {
    const error = new Error('Activity not found');
    error.statusCode = 404;
    error.errorCode = 'ACTIVITY_NOT_FOUND';
    throw error;
  }
  const activities = await activityRepository.getRelatedActivities(activityId, limit);
  return { activities };
}

async function getPopularActivities(limit) {
  const activities = await activityRepository.getPopularActivities(limit);
  return { activities };
}

module.exports = {
  searchActivities,
  getActivityDetails,
  getRelatedActivities,
  getPopularActivities
};
