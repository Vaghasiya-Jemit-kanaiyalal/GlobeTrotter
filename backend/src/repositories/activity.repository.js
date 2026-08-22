const { query } = require('../config/database');

async function findAll({ cityId, category, minCost, maxCost, minDuration, maxDuration, search, sort = 'rating', page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];

  if (cityId) {
    conditions.push('a.city_id = ?');
    params.push(parseInt(cityId, 10));
  }
  if (category) {
    conditions.push('LOWER(a.category) = LOWER(?)');
    params.push(category);
  }
  if (minCost !== undefined && minCost !== null && minCost !== '') {
    conditions.push('a.estimated_cost >= ?');
    params.push(parseFloat(minCost));
  }
  if (maxCost !== undefined && maxCost !== null && maxCost !== '') {
    conditions.push('a.estimated_cost <= ?');
    params.push(parseFloat(maxCost));
  }
  if (minDuration !== undefined && minDuration !== null && minDuration !== '') {
    conditions.push('a.duration_minutes >= ?');
    params.push(parseInt(minDuration, 10));
  }
  if (maxDuration !== undefined && maxDuration !== null && maxDuration !== '') {
    conditions.push('a.duration_minutes <= ?');
    params.push(parseInt(maxDuration, 10));
  }
  if (search) {
    conditions.push('(a.name LIKE ? OR a.description LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'ORDER BY a.rating DESC';
  if (sort === 'cost_asc') orderBy = 'ORDER BY a.estimated_cost ASC';
  if (sort === 'cost_desc') orderBy = 'ORDER BY a.estimated_cost DESC';
  if (sort === 'duration_asc') orderBy = 'ORDER BY a.duration_minutes ASC';

  const countSql = `SELECT COUNT(*) AS total FROM activities a ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = countRows ? countRows[0].total : 0;

  const validLimit = Math.max(1, parseInt(limit, 10) || 20);
  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (validPage - 1) * validLimit;

  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    ${whereClause}
    ${orderBy}
    LIMIT ${validLimit} OFFSET ${offset}
  `;
  const items = await query(sql, params);

  return { items, total };
}

async function findById(id) {
  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    WHERE a.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function getPopularActivities(limit = 5) {
  const validLimit = Math.max(1, parseInt(limit, 10) || 5);
  const sql = `
    SELECT a.id, a.name, a.category, a.estimated_cost, c.name AS city_name, COUNT(ta.id) AS selection_count
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    LEFT JOIN trip_activities ta ON a.id = ta.activity_id
    GROUP BY a.id
    ORDER BY selection_count DESC, a.rating DESC
    LIMIT ${validLimit}
  `;
  return query(sql);
}

module.exports = {
  findAll,
  findById,
  getPopularActivities
};
