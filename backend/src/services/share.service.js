const shareRepository = require('../repositories/share.repository');
const tripRepository = require('../repositories/trip.repository');
const stopRepository = require('../repositories/stop.repository');
const expenseRepository = require('../repositories/expense.repository');
const { generateSlug } = require('../utils/slug');
const { transaction } = require('../config/database');

async function generateShareLink(tripId, userId) {
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

  let slug = trip.public_slug;
  if (!slug) {
    slug = generateSlug(trip.name);
    await tripRepository.updateTrip(tripId, { isPublic: true, publicSlug: slug });
  } else if (!trip.is_public) {
    await tripRepository.updateTrip(tripId, { isPublic: true });
  }

  return {
    isPublic: true,
    publicSlug: slug,
    shareUrl: `/public/trips/${slug}`
  };
}

async function getPublicTripBySlug(slug) {
  const trip = await shareRepository.findByPublicSlug(slug);
  if (!trip) {
    const error = new Error('Public itinerary not found or is private');
    error.statusCode = 404;
    error.errorCode = 'PUBLIC_TRIP_NOT_FOUND';
    throw error;
  }

  const stops = await stopRepository.findByTripId(trip.id);
  for (const stop of stops) {
    stop.activities = await stopRepository.findScheduledActivitiesByStopId(stop.id);
  }

  const budgetSummary = await expenseRepository.getBudgetSummaryByTripId(trip.id);

  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.start_date,
    endDate: trip.end_date,
    coverImage: trip.cover_image,
    publicSlug: trip.public_slug,
    stops,
    budgetSummary
  };
}

async function copyPublicTrip(slug, newOwnerId) {
  const sourceTrip = await getPublicTripBySlug(slug);

  const newTripId = await transaction(async (conn) => {
    // 1. Create new trip
    const newSlug = generateSlug(`Copy of ${sourceTrip.name}`);
    const [tripResult] = await conn.execute(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, budget_limit, is_public, public_slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newOwnerId,
        `Copy of ${sourceTrip.name}`,
        sourceTrip.description || null,
        sourceTrip.startDate,
        sourceTrip.endDate,
        sourceTrip.coverImage || null,
        0,
        0, // Copied trip defaults to private
        newSlug
      ]
    );
    const createdTripId = tripResult.insertId;

    // 2. Copy stops and activities
    for (const stop of sourceTrip.stops) {
      const [stopResult] = await conn.execute(
        `INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, stop_order, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [createdTripId, stop.city_id, stop.start_date, stop.end_date, stop.stop_order, stop.notes || null]
      );
      const newStopId = stopResult.insertId;

      if (stop.activities && stop.activities.length > 0) {
        for (const act of stop.activities) {
          await conn.execute(
            `INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, activity_order, notes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [newStopId, act.activity_id, act.scheduled_date, act.scheduled_time, act.activity_order, act.notes || null]
          );
        }
      }
    }

    return createdTripId;
  });

  return tripRepository.findById(newTripId);
}

module.exports = {
  generateShareLink,
  getPublicTripBySlug,
  copyPublicTrip
};
