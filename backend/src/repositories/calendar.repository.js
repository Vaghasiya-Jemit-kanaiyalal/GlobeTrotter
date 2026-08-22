const { query } = require('../config/database');

async function getCalendarEventsForUser(userId, { month, year, tripId, search } = {}) {
  const conditions = ['t.user_id = ?'];
  const params = [userId];

  if (tripId) {
    conditions.push('t.id = ?');
    params.push(tripId);
  }

  if (search) {
    conditions.push('(t.name LIKE ? OR c.name LIKE ? OR a.name LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Filter trips overlapping month & year if provided
  if (month && year) {
    const startDateOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    // Last day of month math
    const nextMonth = month == 12 ? 1 : parseInt(month, 10) + 1;
    const nextYear = month == 12 ? parseInt(year, 10) + 1 : year;
    const endDateOfMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    conditions.push('(t.start_date < ? AND t.end_date >= ?)');
    params.push(endDateOfMonth, startDateOfMonth);
  }

  // Fetch Trips
  const tripSql = `
    SELECT t.id, t.name, t.start_date, t.end_date, t.cover_image,
      (SELECT c.name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = t.id ORDER BY ts.stop_order ASC LIMIT 1) AS primary_destination
    FROM trips t
    LEFT JOIN trip_stops ts ON t.id = ts.trip_id
    LEFT JOIN cities c ON ts.city_id = c.id
    WHERE ${conditions.join(' AND ')}
    GROUP BY t.id
    ORDER BY t.start_date ASC
  `;
  const trips = await query(tripSql, params);

  // Fetch Scheduled Activities for these trips
  const actConditions = ['t.user_id = ?'];
  const actParams = [userId];

  if (tripId) {
    actConditions.push('t.id = ?');
    actParams.push(tripId);
  }

  if (month && year) {
    const monthPattern = `${year}-${String(month).padStart(2, '0')}-%`;
    actConditions.push('ta.scheduled_date LIKE ?');
    actParams.push(monthPattern);
  }

  const actSql = `
    SELECT ta.id, ta.scheduled_date, ta.scheduled_time, ta.notes,
      a.name AS activity_name, a.category, a.duration_minutes, a.estimated_cost,
      c.name AS city_name, t.id AS trip_id, t.name AS trip_name
    FROM trip_activities ta
    JOIN trip_stops ts ON ta.trip_stop_id = ts.id
    JOIN trips t ON ts.trip_id = t.id
    JOIN cities c ON ts.city_id = c.id
    JOIN activities a ON ta.activity_id = a.id
    WHERE ${actConditions.join(' AND ')}
    ORDER BY ta.scheduled_date ASC, ta.scheduled_time ASC
  `;
  const activities = await query(actSql, actParams);

  return {
    trips,
    activities
  };
}

module.exports = {
  getCalendarEventsForUser
};
