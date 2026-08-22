const tripService = require('../services/trip.service');
const { sendSuccess } = require('../utils/response');

async function createTrip(req, res, next) {
  try {
    const trip = await tripService.createTrip(req.user.id, req.body);
    return sendSuccess(res, 'Trip created successfully', { trip }, 201);
  } catch (error) {
    next(error);
  }
}

async function getTrips(req, res, next) {
  try {
    const trips = await tripService.getUserTrips(req.user.id, req.query);
    return sendSuccess(res, 'User trips retrieved', { trips }, 200);
  } catch (error) {
    next(error);
  }
}

async function getTripById(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const trip = await tripService.getTripById(tripId, req.user.id);
    return sendSuccess(res, 'Trip details retrieved', { trip }, 200);
  } catch (error) {
    next(error);
  }
}

async function updateTrip(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const trip = await tripService.updateTrip(tripId, req.user.id, req.body);
    return sendSuccess(res, 'Trip updated successfully', { trip }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    await tripService.deleteTrip(tripId, req.user.id);
    return sendSuccess(res, 'Trip deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
}

async function copyTrip(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const trip = await tripService.copyUserTrip(tripId, req.user.id);
    return sendSuccess(res, 'Trip copied successfully', { trip }, 201);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  copyTrip
};
