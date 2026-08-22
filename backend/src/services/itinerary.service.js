const stopRepository = require('../repositories/stop.repository');
const tripRepository = require('../repositories/trip.repository');
const cityRepository = require('../repositories/city.repository');
const activityRepository = require('../repositories/activity.repository');

async function addStop(tripId, userId, stopData) {
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

  // Validate dates against trip date bounds
  if (stopData.startDate < trip.start_date || stopData.endDate > trip.end_date) {
    const error = new Error(`Stop dates (${stopData.startDate} to ${stopData.endDate}) must fall within trip date bounds (${trip.start_date} to ${trip.end_date})`);
    error.statusCode = 422;
    error.errorCode = 'INVALID_STOP_DATES';
    throw error;
  }

  const city = await cityRepository.findById(stopData.cityId);
  if (!city) {
    const error = new Error('City not found');
    error.statusCode = 404;
    error.errorCode = 'CITY_NOT_FOUND';
    throw error;
  }

  if (!stopData.stopOrder) {
    const existingStops = await stopRepository.findByTripId(tripId);
    stopData.stopOrder = existingStops.length + 1;
  }

  return stopRepository.createStop({
    ...stopData,
    tripId
  });
}

async function getStopsByTripId(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }
  const isOwner = userId && trip.user_id === userId;
  if (!isOwner && !trip.is_public) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }
  return stopRepository.findByTripId(tripId);
}

async function updateStop(stopId, userId, updateData) {
  const stop = await stopRepository.findById(stopId);
  if (!stop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    error.errorCode = 'STOP_NOT_FOUND';
    throw error;
  }

  const trip = await tripRepository.findById(stop.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const startDate = updateData.startDate || stop.start_date;
  const endDate = updateData.endDate || stop.end_date;

  if (startDate < trip.start_date || endDate > trip.end_date) {
    const error = new Error(`Stop dates must fall within trip dates (${trip.start_date} to ${trip.end_date})`);
    error.statusCode = 422;
    error.errorCode = 'INVALID_STOP_DATES';
    throw error;
  }

  return stopRepository.updateStop(stopId, updateData);
}

async function deleteStop(stopId, userId) {
  const stop = await stopRepository.findById(stopId);
  if (!stop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    error.errorCode = 'STOP_NOT_FOUND';
    throw error;
  }

  const trip = await tripRepository.findById(stop.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return stopRepository.deleteStop(stopId);
}

async function reorderStops(tripId, userId, stopIds) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const stopOrders = stopIds.map((id, index) => ({ id, order: index + 1 }));
  await stopRepository.updateStopOrderBatch(stopOrders);
  return stopRepository.findByTripId(tripId);
}

async function addActivityToStop(stopId, userId, activityData) {
  const stop = await stopRepository.findById(stopId);
  if (!stop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    error.errorCode = 'STOP_NOT_FOUND';
    throw error;
  }

  const trip = await tripRepository.findById(stop.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const activity = await activityRepository.findById(activityData.activityId);
  if (!activity) {
    const error = new Error('Activity not found');
    error.statusCode = 404;
    error.errorCode = 'ACTIVITY_NOT_FOUND';
    throw error;
  }

  const actCityId = activity.city_id || (activity.city && activity.city.id);
  if (actCityId !== stop.city_id) {
    const error = new Error(`Activity '${activity.name}' belongs to a different city than stop '${stop.city_name}'`);
    error.statusCode = 422;
    error.errorCode = 'CITY_MISMATCH';
    throw error;
  }

  if (activityData.scheduledDate < stop.start_date || activityData.scheduledDate > stop.end_date) {
    const error = new Error(`Scheduled date (${activityData.scheduledDate}) must fall within stop dates (${stop.start_date} to ${stop.end_date})`);
    error.statusCode = 422;
    error.errorCode = 'INVALID_SCHEDULED_DATE';
    throw error;
  }

  return stopRepository.addScheduledActivity({
    ...activityData,
    tripStopId: stopId
  });
}

async function getStopActivities(stopId, userId) {
  const stop = await stopRepository.findById(stopId);
  if (!stop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    error.errorCode = 'STOP_NOT_FOUND';
    throw error;
  }

  const trip = await tripRepository.findById(stop.trip_id);
  const isOwner = userId && trip.user_id === userId;
  if (!isOwner && !trip.is_public) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return stopRepository.findScheduledActivitiesByStopId(stopId);
}

async function updateScheduledActivity(activityId, userId, updateData) {
  const scheduled = await stopRepository.findScheduledActivityById(activityId);
  if (!scheduled) {
    const error = new Error('Scheduled activity not found');
    error.statusCode = 404;
    error.errorCode = 'SCHEDULED_ACTIVITY_NOT_FOUND';
    throw error;
  }

  const stop = await stopRepository.findById(scheduled.trip_stop_id);
  const trip = await tripRepository.findById(stop.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  if (updateData.scheduledDate) {
    if (updateData.scheduledDate < stop.start_date || updateData.scheduledDate > stop.end_date) {
      const error = new Error(`Scheduled date (${updateData.scheduledDate}) must fall within stop dates (${stop.start_date} to ${stop.end_date})`);
      error.statusCode = 422;
      error.errorCode = 'INVALID_SCHEDULED_DATE';
      throw error;
    }
  }

  return stopRepository.updateScheduledActivity(activityId, updateData);
}

async function deleteScheduledActivity(activityId, userId) {
  const scheduled = await stopRepository.findScheduledActivityById(activityId);
  if (!scheduled) {
    const error = new Error('Scheduled activity not found');
    error.statusCode = 404;
    error.errorCode = 'SCHEDULED_ACTIVITY_NOT_FOUND';
    throw error;
  }

  const stop = await stopRepository.findById(scheduled.trip_stop_id);
  const trip = await tripRepository.findById(stop.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return stopRepository.deleteScheduledActivity(activityId);
}

async function getFullItinerary(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  const isOwner = userId && trip.user_id === userId;
  if (!isOwner && !trip.is_public) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const stops = await stopRepository.findByTripId(tripId);

  for (const stop of stops) {
    stop.activities = await stopRepository.findScheduledActivitiesByStopId(stop.id);
  }

  return {
    trip: {
      id: trip.id,
      name: trip.name,
      startDate: trip.start_date,
      endDate: trip.end_date,
      coverImage: trip.cover_image
    },
    stops: stops.map(s => ({
      id: s.id,
      city: {
        id: s.city_id,
        name: s.city_name,
        country: s.city_country,
        image: s.city_image
      },
      startDate: s.start_date,
      endDate: s.end_date,
      stopOrder: s.stop_order,
      notes: s.notes,
      activities: s.activities.map(a => ({
        id: a.id,
        activityId: a.activity_id,
        name: a.activity_name,
        category: a.category,
        date: a.scheduled_date,
        time: a.scheduled_time,
        duration: a.duration_minutes,
        cost: parseFloat(a.estimated_cost),
        image: a.image_url,
        notes: a.notes
      }))
    }))
  };
}

async function getCalendarEvents(tripId, userId) {
  const itinerary = await getFullItinerary(tripId, userId);
  const events = [];

  for (const stop of itinerary.stops) {
    for (const act of stop.activities) {
      const startTime = act.time || '09:00';
      let endTime = startTime;
      if (act.duration) {
        const [h, m] = startTime.split(':').map(Number);
        const totalMins = h * 60 + m + act.duration;
        const endH = Math.floor(totalMins / 60) % 24;
        const endM = totalMins % 60;
        endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      }

      events.push({
        id: act.id,
        title: act.name,
        date: act.date,
        startTime,
        endTime,
        city: stop.city ? stop.city.name : 'Unknown',
        category: act.category,
        cost: act.cost,
        duration: act.duration,
        notes: act.notes
      });
    }
  }

  return { events };
}

module.exports = {
  addStop,
  getStopsByTripId,
  updateStop,
  deleteStop,
  reorderStops,
  addActivityToStop,
  getStopActivities,
  updateScheduledActivity,
  deleteScheduledActivity,
  getFullItinerary,
  getCalendarEvents
};
