const { query } = require('../config/database');

const ALLOWED_ACTIVITY_SORTS = {
  relevance: 'selection_count DESC, a.rating DESC',
  popular: 'selection_count DESC, a.rating DESC',
  rating: 'a.rating DESC',
  price_low: 'a.estimated_cost ASC',
  price_high: 'a.estimated_cost DESC',
  duration_short: 'a.duration_minutes ASC',
  duration_long: 'a.duration_minutes DESC',
  name_asc: 'a.name ASC',
  name_desc: 'a.name DESC'
};

function formatActivityRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    city_id: r.city_id,
    name: r.name,
    description: r.description,
    category: r.category,
    city: {
      id: r.city_id,
      name: r.city_name,
      country: r.city_country
    },
    durationMinutes: r.duration_minutes,
    estimatedCost: parseFloat(r.estimated_cost || 0),
    currency: r.currency || 'INR',
    rating: parseFloat(r.rating || 4.5),
    imageUrl: r.image_url,
    selectionCount: parseInt(r.selection_count || 0, 10)
  };
}

async function findAll({ cityId, country, category, minCost, maxCost, minDuration, maxDuration, minRating, search, sort = 'relevance', page = 1, limit = 10 }) {
  const conditions = [];
  const params = [];

  if (cityId) {
    conditions.push('a.city_id = ?');
    params.push(parseInt(cityId, 10));
  }
  if (country) {
    conditions.push('LOWER(c.country) = LOWER(?)');
    params.push(country);
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
  if (minRating !== undefined && minRating !== null && minRating !== '') {
    conditions.push('a.rating >= ?');
    params.push(parseFloat(minRating));
  }
  if (search) {
    conditions.push('(a.name LIKE ? OR a.description LIKE ? OR a.category LIKE ? OR c.name LIKE ? OR c.country LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderBy = ALLOWED_ACTIVITY_SORTS[sort] || ALLOWED_ACTIVITY_SORTS.relevance;

  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (validPage - 1) * validLimit;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    ${whereClause}
  `;
  const countRows = await query(countSql, params);
  const total = countRows ? countRows[0].total : 0;

  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country,
      (SELECT COUNT(*) FROM trip_activities WHERE activity_id = a.id) AS selection_count
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ${validLimit} OFFSET ${offset}
  `;
  const rows = await query(sql, params);
  const items = rows.map(formatActivityRow);

  return { items, total, page: validPage, limit: validLimit };
}

async function findGrouped({ groupBy, search, cityId, country, category, minCost, maxCost, minDuration, maxDuration, minRating }) {
  const allowedGroupBy = ['category', 'city', 'rating', 'price_range'];
  if (!allowedGroupBy.includes(groupBy)) {
    const error = new Error(`Invalid groupBy value '${groupBy}'. Allowed values: ${allowedGroupBy.join(', ')}`);
    error.statusCode = 400;
    error.errorCode = 'INVALID_GROUP_BY';
    throw error;
  }

  const { items } = await findAll({ search, cityId, country, category, minCost, maxCost, minDuration, maxDuration, minRating, limit: 50 });

  const groupsMap = {};
  items.forEach(act => {
    let key = 'Other';
    if (groupBy === 'category') key = act.category || 'General';
    if (groupBy === 'city') key = act.city ? act.city.name : 'Unknown';
    if (groupBy === 'rating') {
      const r = act.rating;
      if (r >= 4.8) key = 'Top Rated (4.8+)';
      else if (r >= 4.5) key = 'Highly Rated (4.5-4.8)';
      else key = 'Good (4.0-4.5)';
    }
    if (groupBy === 'price_range') {
      const cost = act.estimatedCost;
      if (cost === 0) key = 'Free';
      else if (cost <= 1000) key = 'Budget (under ₹1,000)';
      else if (cost <= 3000) key = 'Moderate (₹1,000 - ₹3,000)';
      else key = 'Premium (above ₹3,000)';
    }

    if (!groupsMap[key]) {
      groupsMap[key] = { group: key, count: 0, activities: [] };
    }
    groupsMap[key].count += 1;
    groupsMap[key].activities.push(act);
  });

  return Object.values(groupsMap);
}

async function findById(id) {
  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country,
      (SELECT COUNT(*) FROM trip_activities WHERE activity_id = a.id) AS selection_count
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    WHERE a.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return formatActivityRow(rows[0]);
}

async function getRelatedActivities(activityId, limit = 5) {
  const target = await findById(activityId);
  if (!target) return [];

  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 5));
  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country,
      (SELECT COUNT(*) FROM trip_activities WHERE activity_id = a.id) AS selection_count
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    WHERE a.id != ? AND (a.city_id = ? OR LOWER(a.category) = LOWER(?))
    ORDER BY (a.city_id = ?) DESC, a.rating DESC
    LIMIT ${validLimit}
  `;
  const rows = await query(sql, [activityId, target.city.id, target.category, target.city.id]);
  return rows.map(formatActivityRow);
}

async function getPopularActivities(limit = 10) {
  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country,
      COUNT(ta.id) AS selection_count
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    LEFT JOIN trip_activities ta ON a.id = ta.activity_id
    GROUP BY a.id
    ORDER BY selection_count DESC, a.rating DESC
    LIMIT ${validLimit}
  `;
  const rows = await query(sql);
  return rows.map(r => ({
    id: r.id,
    city_id: r.city_id,
    name: r.name,
    category: r.category,
    city: r.city_name,
    country: r.city_country,
    selectionCount: parseInt(r.selection_count || 0, 10),
    rating: parseFloat(r.rating || 4.5),
    estimatedCost: parseFloat(r.estimated_cost || 0),
    imageUrl: r.image_url
  }));
}

module.exports = {
  findAll,
  findGrouped,
  findById,
  getRelatedActivities,
  getPopularActivities
};
