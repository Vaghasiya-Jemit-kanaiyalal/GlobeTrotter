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

  return stopRepository.addScheduledActivity({
    ...activityData,
    tripStopId: stopId
  });
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

  const daysMap = {};
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    daysMap[dateStr] = {
      date: dateStr,
      city: null,
      activities: []
    };
  }

  for (const stop of stops) {
    const activities = await stopRepository.findScheduledActivitiesByStopId(stop.id);

    const stopStart = new Date(stop.start_date);
    const stopEnd = new Date(stop.end_date);

    for (let d = new Date(stopStart); d <= stopEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (daysMap[dateStr]) {
        daysMap[dateStr].city = {
          id: stop.city_id,
          name: stop.city_name,
          country: stop.city_country,
          image: stop.city_image
        };
      }
    }

    for (const act of activities) {
      const dateStr = act.scheduled_date;
      if (daysMap[dateStr]) {
        daysMap[dateStr].activities.push({
          id: act.id,
          activityId: act.activity_id,
          name: act.activity_name,
          category: act.category,
          time: act.scheduled_time,
          duration: act.duration_minutes,
          cost: parseFloat(act.estimated_cost),
          image: act.image_url,
          notes: act.notes
        });
      }
    }
  }

  return {
    trip: {
      id: trip.id,
      name: trip.name,
      startDate: trip.start_date,
      endDate: trip.end_date,
      coverImage: trip.cover_image
    },
    days: Object.values(daysMap)
  };
}

async function getCalendarEvents(tripId, userId) {
  const itinerary = await getFullItinerary(tripId, userId);
  const events = [];

  for (const day of itinerary.days) {
    for (const act of day.activities) {
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
        date: day.date,
        startTime,
        endTime,
        city: day.city ? day.city.name : 'Unknown',
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
  updateScheduledActivity,
  deleteScheduledActivity,
  getFullItinerary,
  getCalendarEvents
};
