const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/calendar', calendarController.getCalendar);
router.get('/calendar/events/:eventType/:eventId', calendarController.getEventDetails);

module.exports = router;
