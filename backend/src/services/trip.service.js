const tripRepository = require('../repositories/trip.repository');
const stopRepository = require('../repositories/stop.repository');
const expenseRepository = require('../repositories/expense.repository');
const { generateSlug } = require('../utils/slug');

async function createTrip(userId, tripData) {
  let publicSlug = null;
  if (tripData.isPublic) {
    publicSlug = generateSlug(tripData.name);
  }

  return tripRepository.createTrip({
    ...tripData,
    userId,
    publicSlug
  });
}

async function getUserTrips(userId, queryParams) {
  return tripRepository.findByUserId(userId, queryParams);
}

async function getTripById(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  // Authorization check (Only owner can view private trips)
  if (trip.user_id !== userId && !trip.is_public) {
    const error = new Error('Access denied to private trip');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const stops = await stopRepository.findByTripId(tripId);

  // Attach activities to each stop
  for (const stop of stops) {
    stop.activities = await stopRepository.findScheduledActivitiesByStopId(stop.id);
  }

  const budgetSummary = await expenseRepository.getBudgetSummaryByTripId(tripId);

  return {
    ...trip,
    stops,
    budgetSummary
  };
}

async function updateTrip(tripId, userId, updateData) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  if (trip.user_id !== userId) {
    const error = new Error('Access denied. You do not own this trip.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  if (updateData.isPublic && !trip.public_slug) {
    updateData.publicSlug = generateSlug(updateData.name || trip.name);
  }

  return tripRepository.updateTrip(tripId, updateData);
}

async function deleteTrip(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  if (trip.user_id !== userId) {
    const error = new Error('Access denied. You do not own this trip.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return tripRepository.deleteTrip(tripId);
}

async function verifyTripOwnership(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }
  if (trip.user_id !== userId) {
    const error = new Error('Access denied. You do not own this trip.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }
  return trip;
}

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  verifyTripOwnership
};
