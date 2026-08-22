const activityRepository = require('../repositories/activity.repository');

async function searchActivities(queryParams) {
  return activityRepository.findAll(queryParams);
}

async function getActivityById(id) {
  const activity = await activityRepository.findById(id);
  if (!activity) {
    const error = new Error('Activity not found');
    error.statusCode = 404;
    error.errorCode = 'ACTIVITY_NOT_FOUND';
    throw error;
  }
  return activity;
}

module.exports = {
  searchActivities,
  getActivityById
};
