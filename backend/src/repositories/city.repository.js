const { query } = require('../config/database');

async function findAll({ search, country, region, sort = 'popularity', page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(name LIKE ? OR country LIKE ? OR region LIKE ? OR description LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }
  if (country) {
    conditions.push('country = ?');
    params.push(country);
  }
  if (region) {
    conditions.push('region = ?');
    params.push(region);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderBy = 'ORDER BY popularity_score DESC';
  if (sort === 'cost_asc') orderBy = 'ORDER BY cost_index ASC';
  if (sort === 'cost_desc') orderBy = 'ORDER BY cost_index DESC';
  if (sort === 'name') orderBy = 'ORDER BY name ASC';

  const countSql = `SELECT COUNT(*) AS total FROM cities ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = countRows ? countRows[0].total : 0;

  const validLimit = Math.max(1, parseInt(limit, 10) || 20);
  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (validPage - 1) * validLimit;

  const sql = `SELECT * FROM cities ${whereClause} ${orderBy} LIMIT ${validLimit} OFFSET ${offset}`;
  const items = await query(sql, params);

  return { items, total };
}

async function findById(id) {
  const sql = `SELECT * FROM cities WHERE id = ? LIMIT 1`;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function getRecommendedCities(limit = 6) {
  const validLimit = Math.max(1, parseInt(limit, 10) || 6);
  const sql = `SELECT * FROM cities ORDER BY popularity_score DESC LIMIT ${validLimit}`;
  return query(sql);
}

async function countAllCities() {
  const sql = `SELECT COUNT(*) AS count FROM cities`;
  const rows = await query(sql);
  return rows[0].count;
}

async function getPopularCities(limit = 5) {
  const validLimit = Math.max(1, parseInt(limit, 10) || 5);
  const sql = `
    SELECT c.id, c.name, c.country, c.image_url, COUNT(ts.id) AS trip_count
    FROM cities c
    LEFT JOIN trip_stops ts ON c.id = ts.city_id
    GROUP BY c.id
    ORDER BY trip_count DESC, c.popularity_score DESC
    LIMIT ${validLimit}
  `;
  return query(sql);
}

module.exports = {
  findAll,
  findById,
  getRecommendedCities,
  countAllCities,
  getPopularCities
};
