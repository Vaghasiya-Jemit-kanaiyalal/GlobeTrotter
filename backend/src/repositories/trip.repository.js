const { query, transaction } = require('../config/database');
const { calculateTripStatus, calculateDurationDays } = require('../utils/status');
const { generateSlug } = require('../utils/slug');

function formatTrip(row) {
  if (!row) return null;
  const status = calculateTripStatus(row.start_date, row.end_date);
  const duration = calculateDurationDays(row.start_date, row.end_date);
  return {
    ...row,
    status,
    duration,
    stop_count: parseInt(row.stop_count || 0, 10),
    activity_count: parseInt(row.activity_count || 0, 10),
    total_expense: parseFloat(row.total_expense || 0)
  };
}

async function createTrip(tripData) {
  const sql = `
    INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, budget_limit, is_public, public_slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    tripData.userId,
    tripData.name,
    tripData.description || null,
    tripData.startDate,
    tripData.endDate,
    tripData.coverImage || null,
    tripData.budgetLimit || 0,
    tripData.isPublic ? 1 : 0,
    tripData.publicSlug || null
  ];
  const result = await query(sql, params);
  return findById(result.insertId);
}

/**
 * Screen 4: Transactional trip creation with initial city stop
 */
async function createTripWithInitialCity(userId, tripData, cityId) {
  const newTripId = await transaction(async (conn) => {
    const publicSlug = tripData.isPublic ? generateSlug(tripData.name) : null;
    const [tripResult] = await conn.execute(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, budget_limit, is_public, public_slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        tripData.name,
        tripData.description || null,
        tripData.startDate,
        tripData.endDate,
        tripData.coverImage || null,
        tripData.budgetLimit || 0,
        tripData.isPublic ? 1 : 0,
        publicSlug
      ]
    );
    const createdTripId = tripResult.insertId;

    if (cityId) {
      await conn.execute(
        `INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, stop_order, notes)
         VALUES (?, ?, ?, ?, 1, ?)`,
        [createdTripId, cityId, tripData.startDate, tripData.endDate, 'Initial destination']
      );
    }

    return createdTripId;
  });

  return findById(newTripId);
}

async function findById(id) {
  const sql = `
    SELECT t.*, u.first_name AS owner_first_name, u.last_name AS owner_last_name, u.email AS owner_email,
      (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) AS stop_count,
      (SELECT COUNT(*) FROM trip_activities ta JOIN trip_stops ts ON ta.trip_stop_id = ts.id WHERE ts.trip_id = t.id) AS activity_count,
      (SELECT c.name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = t.id ORDER BY ts.stop_order ASC LIMIT 1) AS primary_destination,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = t.id) AS total_expense
    FROM trips t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return formatTrip(rows[0]);
}

async function findByUserId(userId, { status, search, sort = 'newest', destination } = {}) {
  const conditions = ['t.user_id = ?'];
  const params = [userId];

  const today = new Date().toISOString().split('T')[0];
  if (status === 'upcoming') {
    conditions.push('t.start_date > ?');
    params.push(today);
  } else if (status === 'ongoing') {
    conditions.push('t.start_date <= ? AND t.end_date >= ?');
    params.push(today, today);
  } else if (status === 'completed') {
    conditions.push('t.end_date < ?');
    params.push(today);
  }

  if (search) {
    conditions.push(`(t.name LIKE ? OR t.description LIKE ? OR EXISTS (
      SELECT 1 FROM trip_stops ts JOIN cities c ON ts.city_id = c.id 
      WHERE ts.trip_id = t.id AND (c.name LIKE ? OR c.country LIKE ?)
    ))`);
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  if (destination) {
    conditions.push(`EXISTS (
      SELECT 1 FROM trip_stops ts JOIN cities c ON ts.city_id = c.id 
      WHERE ts.trip_id = t.id AND (LOWER(c.name) = LOWER(?) OR LOWER(c.country) = LOWER(?))
    )`);
    params.push(destination, destination);
  }

  let orderBy = 'ORDER BY t.start_date DESC';
  if (sort === 'oldest') orderBy = 'ORDER BY t.start_date ASC';
  if (sort === 'name') orderBy = 'ORDER BY t.name ASC';
  if (sort === 'end_date') orderBy = 'ORDER BY t.end_date DESC';

  const sql = `
    SELECT t.*, 
      (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) AS stop_count,
      (SELECT COUNT(*) FROM trip_activities ta JOIN trip_stops ts ON ta.trip_stop_id = ts.id WHERE ts.trip_id = t.id) AS activity_count,
      (SELECT c.name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = t.id ORDER BY ts.stop_order ASC LIMIT 1) AS primary_destination,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = t.id) AS total_expense
    FROM trips t
    WHERE ${conditions.join(' AND ')}
    ${orderBy}
  `;
  const rows = await query(sql, params);
  return rows.map(formatTrip);
}

async function updateTrip(id, updateData) {
  const fields = [];
  const params = [];

  if (updateData.name !== undefined) {
    fields.push('name = ?');
    params.push(updateData.name);
  }
  if (updateData.description !== undefined) {
    fields.push('description = ?');
    params.push(updateData.description);
  }
  if (updateData.startDate !== undefined) {
    fields.push('start_date = ?');
    params.push(updateData.startDate);
  }
  if (updateData.endDate !== undefined) {
    fields.push('end_date = ?');
    params.push(updateData.endDate);
  }
  if (updateData.coverImage !== undefined) {
    fields.push('cover_image = ?');
    params.push(updateData.coverImage);
  }
  if (updateData.budgetLimit !== undefined) {
    fields.push('budget_limit = ?');
    params.push(updateData.budgetLimit);
  }
  if (updateData.isPublic !== undefined) {
    fields.push('is_public = ?');
    params.push(updateData.isPublic ? 1 : 0);
  }
  if (updateData.publicSlug !== undefined) {
    fields.push('public_slug = ?');
    params.push(updateData.publicSlug);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  const sql = `UPDATE trips SET ${fields.join(', ')} WHERE id = ?`;
  await query(sql, params);
  return findById(id);
}

async function deleteTrip(id) {
  const sql = `DELETE FROM trips WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

/**
 * Screen 7: Copy user's previous trip ("Plan Similar Trip")
 */
async function copyUserTrip(tripId, userId) {
  const sourceTrip = await findById(tripId);
  if (!sourceTrip) return null;

  const newTripId = await transaction(async (conn) => {
    const [tripResult] = await conn.execute(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, budget_limit, is_public, public_slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL)`,
      [
        userId,
        `Copy of ${sourceTrip.name}`,
        sourceTrip.description,
        sourceTrip.start_date,
        sourceTrip.end_date,
        sourceTrip.cover_image,
        sourceTrip.budget_limit
      ]
    );
    const createdId = tripResult.insertId;

    // Fetch source stops
    const [stops] = await conn.execute(
      `SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY stop_order ASC`,
      [tripId]
    );

    for (const stop of stops) {
      const [stopResult] = await conn.execute(
        `INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, stop_order, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [createdId, stop.city_id, stop.start_date, stop.end_date, stop.stop_order, stop.notes]
      );
      const newStopId = stopResult.insertId;

      const [activities] = await conn.execute(
        `SELECT * FROM trip_activities WHERE trip_stop_id = ? ORDER BY activity_order ASC`,
        [stop.id]
      );

      for (const act of activities) {
        await conn.execute(
          `INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, activity_order, notes)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newStopId, act.activity_id, act.scheduled_date, act.scheduled_time, act.activity_order, act.notes]
        );
      }
    }

    return createdId;
  });

  return findById(newTripId);
}

async function countAllTrips() {
  const sql = `SELECT COUNT(*) AS count FROM trips`;
  const rows = await query(sql);
  return rows[0].count;
}

async function countPublicTrips() {
  const sql = `SELECT COUNT(*) AS count FROM trips WHERE is_public = 1`;
  const rows = await query(sql);
  return rows[0].count;
}

module.exports = {
  createTrip,
  createTripWithInitialCity,
  findById,
  findByUserId,
  updateTrip,
  deleteTrip,
  copyUserTrip,
  countAllTrips,
  countPublicTrips
};
