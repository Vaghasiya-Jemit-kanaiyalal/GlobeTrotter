const itineraryService = require('../services/itinerary.service');
const { sendSuccess } = require('../utils/response');

async function addActivityToStop(req, res, next) {
  try {
    const stopId = parseInt(req.params.stopId, 10);
    const scheduledActivity = await itineraryService.addActivityToStop(stopId, req.user.id, req.body);
    return sendSuccess(res, 'Activity scheduled successfully', { scheduledActivity }, 201);
  } catch (error) {
    next(error);
  }
}

async function getStopActivities(req, res, next) {
  try {
    const stopId = parseInt(req.params.stopId, 10);
    const activities = await itineraryService.getStopActivities(stopId, req.user.id);
    return sendSuccess(res, 'Stop activities retrieved', { activities }, 200);
  } catch (error) {
    next(error);
  }
}

async function updateScheduledActivity(req, res, next) {
  try {
    const activityId = parseInt(req.params.activityId, 10);
    const scheduledActivity = await itineraryService.updateScheduledActivity(activityId, req.user.id, req.body);
    return sendSuccess(res, 'Scheduled activity updated', { scheduledActivity }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteScheduledActivity(req, res, next) {
  try {
    const activityId = parseInt(req.params.activityId, 10);
    await itineraryService.deleteScheduledActivity(activityId, req.user.id);
    return sendSuccess(res, 'Scheduled activity deleted', null, 200);
  } catch (error) {
    next(error);
  }
}

async function getFullItinerary(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const itinerary = await itineraryService.getFullItinerary(tripId, req.user.id);
    return sendSuccess(res, 'Full itinerary fetched successfully', itinerary, 200);
  } catch (error) {
    next(error);
  }
}

async function getCalendarEvents(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const calendar = await itineraryService.getCalendarEvents(tripId, req.user.id);
    return sendSuccess(res, 'Calendar events fetched successfully', calendar, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addActivityToStop,
  getStopActivities,
  updateScheduledActivity,
  deleteScheduledActivity,
  getFullItinerary,
  getCalendarEvents
};
