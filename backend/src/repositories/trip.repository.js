const { query } = require('../config/database');

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

async function findById(id) {
  const sql = `
    SELECT t.*, u.first_name AS owner_first_name, u.last_name AS owner_last_name, u.email AS owner_email
    FROM trips t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function findByUserId(userId, { status, search, sort = 'newest' } = {}) {
  const conditions = ['t.user_id = ?'];
  const params = [userId];

  const today = new Date().toISOString().split('T')[0];
  if (status === 'upcoming') {
    conditions.push('t.start_date >= ?');
    params.push(today);
  } else if (status === 'completed') {
    conditions.push('t.end_date < ?');
    params.push(today);
  }

  if (search) {
    conditions.push('(t.name LIKE ? OR t.description LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern);
  }

  let orderBy = 'ORDER BY t.start_date DESC';
  if (sort === 'oldest') orderBy = 'ORDER BY t.start_date ASC';
  if (sort === 'name') orderBy = 'ORDER BY t.name ASC';

  const sql = `
    SELECT t.*, 
      (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) AS stop_count,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = t.id) AS total_expense
    FROM trips t
    WHERE ${conditions.join(' AND ')}
    ${orderBy}
  `;
  return query(sql, params);
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
  findById,
  findByUserId,
  updateTrip,
  deleteTrip,
  countAllTrips,
  countPublicTrips
};
