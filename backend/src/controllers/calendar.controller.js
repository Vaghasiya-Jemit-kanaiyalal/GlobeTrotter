const calendarService = require('../services/calendar.service');
const { sendSuccess } = require('../utils/response');

async function getCalendar(req, res, next) {
  try {
    const data = await calendarService.getCalendar(req.user.id, req.query);
    return sendSuccess(res, 'Calendar events fetched successfully', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getEventDetails(req, res, next) {
  try {
    const { eventType, eventId } = req.params;
    const data = await calendarService.getEventDetails(eventType, parseInt(eventId, 10), req.user.id);
    return sendSuccess(res, 'Calendar event details fetched successfully', data, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCalendar,
  getEventDetails
};
