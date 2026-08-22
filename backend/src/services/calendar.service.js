const calendarRepository = require('../repositories/calendar.repository');
const tripRepository = require('../repositories/trip.repository');
const stopRepository = require('../repositories/stop.repository');

async function getCalendar(userId, { month, year, tripId, search } = {}) {
  const currentDate = new Date();
  const currentMonth = month ? parseInt(month, 10) : currentDate.getMonth() + 1;
  const currentYear = year ? parseInt(year, 10) : currentDate.getFullYear();

  const { trips, activities } = await calendarRepository.getCalendarEventsForUser(userId, {
    month: currentMonth,
    year: currentYear,
    tripId,
    search
  });

  const events = [];

  // Map trips to multi-day calendar events
  for (const t of trips) {
    events.push({
      id: `trip-${t.id}`,
      type: 'trip',
      title: t.name,
      startDate: t.start_date,
      endDate: t.end_date,
      destination: t.primary_destination || 'Multi-City',
      coverImage: t.cover_image,
      tripId: t.id
    });
  }

  // Map scheduled activities to single-day calendar events
  for (const a of activities) {
    const startTime = a.scheduled_time ? String(a.scheduled_time).substr(0, 5) : '09:00';
    let endTime = startTime;
    if (a.duration_minutes) {
      const [h, m] = startTime.split(':').map(Number);
      const totalMins = h * 60 + m + a.duration_minutes;
      const endH = Math.floor(totalMins / 60) % 24;
      const endM = totalMins % 60;
      endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    }

    events.push({
      id: `activity-${a.id}`,
      type: 'activity',
      title: a.activity_name,
      startDate: a.scheduled_date,
      endDate: a.scheduled_date,
      startTime,
      endTime,
      city: a.city_name,
      category: a.category,
      cost: parseFloat(a.estimated_cost || 0),
      duration: a.duration_minutes,
      notes: a.notes,
      tripId: a.trip_id,
      tripName: a.trip_name
    });
  }

  return {
    month: currentMonth,
    year: currentYear,
    events
  };
}

async function getEventDetails(eventType, eventId, userId) {
  if (eventType === 'trip') {
    const trip = await tripRepository.findById(eventId);
    if (!trip || (trip.user_id !== userId && !trip.is_public)) {
      const error = new Error('Event not found or access denied');
      error.statusCode = 404;
      throw error;
    }
    return {
      type: 'trip',
      event: trip
    };
  } else if (eventType === 'activity') {
    const scheduled = await stopRepository.findScheduledActivityById(eventId);
    if (!scheduled) {
      const error = new Error('Activity event not found');
      error.statusCode = 404;
      throw error;
    }
    return {
      type: 'activity',
      event: scheduled
    };
  } else {
    const error = new Error('Invalid event type');
    error.statusCode = 400;
    throw error;
  }
}

module.exports = {
  getCalendar,
  getEventDetails
};
