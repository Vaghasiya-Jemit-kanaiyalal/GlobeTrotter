const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itinerary.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { scheduleActivitySchema, updateScheduledActivitySchema } = require('../validators/activity.validator');

// Stop Activities
router.post('/stops/:stopId/activities', authenticate, validate(scheduleActivitySchema), itineraryController.addActivityToStop);
router.get('/stops/:stopId/activities', optionalAuthenticate, itineraryController.getStopActivities);
router.put('/trip-activities/:activityId', authenticate, validate(updateScheduledActivitySchema), itineraryController.updateScheduledActivity);
router.delete('/trip-activities/:activityId', authenticate, itineraryController.deleteScheduledActivity);

// Full Itinerary & Calendar
router.get('/trips/:tripId/itinerary', optionalAuthenticate, itineraryController.getFullItinerary);
router.get('/trips/:tripId/calendar', optionalAuthenticate, itineraryController.getCalendarEvents);

module.exports = router;
