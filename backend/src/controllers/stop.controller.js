const itineraryService = require('../services/itinerary.service');
const { sendSuccess } = require('../utils/response');

async function addStop(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const stop = await itineraryService.addStop(tripId, req.user.id, req.body);
    return sendSuccess(res, 'Stop added to trip successfully', { stop }, 201);
  } catch (error) {
    next(error);
  }
}

async function getStops(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const stops = await itineraryService.getStopsByTripId(tripId, req.user.id);
    return sendSuccess(res, 'Trip stops retrieved', { stops }, 200);
  } catch (error) {
    next(error);
  }
}

async function updateStop(req, res, next) {
  try {
    const stopId = parseInt(req.params.stopId, 10);
    const stop = await itineraryService.updateStop(stopId, req.user.id, req.body);
    return sendSuccess(res, 'Trip stop updated', { stop }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteStop(req, res, next) {
  try {
    const stopId = parseInt(req.params.stopId, 10);
    await itineraryService.deleteStop(stopId, req.user.id);
    return sendSuccess(res, 'Trip stop deleted', null, 200);
  } catch (error) {
    next(error);
  }
}

async function reorderStops(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const { stopIds } = req.body;
    const stops = await itineraryService.reorderStops(tripId, req.user.id, stopIds);
    return sendSuccess(res, 'Stops reordered successfully', { stops }, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addStop,
  getStops,
  updateStop,
  deleteStop,
  reorderStops
};
