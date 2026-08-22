const { query } = require('../config/database');

const ALLOWED_CITY_SORTS = {
  popularity: 'c.popularity_score DESC',
  name_asc: 'c.name ASC',
  name_desc: 'c.name DESC',
  activities_count: 'activities_count DESC'
};

async function findAll({ search, country, region, minPopularity, sort = 'popularity', page = 1, limit = 10 }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(c.name LIKE ? OR c.country LIKE ? OR c.region LIKE ? OR c.description LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }
  if (country) {
    conditions.push('LOWER(c.country) = LOWER(?)');
    params.push(country);
  }
  if (region) {
    conditions.push('LOWER(c.region) = LOWER(?)');
    params.push(region);
  }
  if (minPopularity !== undefined && minPopularity !== null && minPopularity !== '') {
    conditions.push('c.popularity_score >= ?');
    params.push(parseFloat(minPopularity));
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderBy = ALLOWED_CITY_SORTS[sort] || ALLOWED_CITY_SORTS.popularity;

  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (validPage - 1) * validLimit;

  const countSql = `SELECT COUNT(*) AS total FROM cities c ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = countRows ? countRows[0].total : 0;

  const sql = `
    SELECT c.*,
      (SELECT COUNT(*) FROM activities WHERE city_id = c.id) AS activities_count
    FROM cities c
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ${validLimit} OFFSET ${offset}
  `;
  const rows = await query(sql, params);

  const items = rows.map(r => ({
    id: r.id,
    name: r.name,
    country: r.country,
    region: r.region,
    description: r.description,
    imageUrl: r.image_url,
    latitude: r.latitude ? parseFloat(r.latitude) : null,
    longitude: r.longitude ? parseFloat(r.longitude) : null,
    costIndex: parseFloat(r.cost_index || 1),
    popularityScore: parseFloat(r.popularity_score || 0),
    activitiesCount: parseInt(r.activities_count || 0, 10)
  }));

  return { items, total, page: validPage, limit: validLimit };
}

async function findGrouped({ groupBy, search, country, region, minPopularity }) {
  const allowedGroupBy = ['country', 'region', 'popularity'];
  if (!allowedGroupBy.includes(groupBy)) {
    const error = new Error(`Invalid groupBy value '${groupBy}'. Allowed values: ${allowedGroupBy.join(', ')}`);
    error.statusCode = 400;
    error.errorCode = 'INVALID_GROUP_BY';
    throw error;
  }

  const { items } = await findAll({ search, country, region, minPopularity, limit: 50 });

  const groupsMap = {};
  items.forEach(city => {
    let key = 'Other';
    if (groupBy === 'country') key = city.country || 'Unknown';
    if (groupBy === 'region') key = city.region || 'Unknown';
    if (groupBy === 'popularity') {
      const score = city.popularityScore;
      if (score >= 9) key = 'Top Rated (9+)';
      else if (score >= 7) key = 'Popular (7-9)';
      else key = 'Emerging (<7)';
    }

    if (!groupsMap[key]) {
      groupsMap[key] = { group: key, count: 0, cities: [] };
    }
    groupsMap[key].count += 1;
    groupsMap[key].cities.push(city);
  });

  return Object.values(groupsMap);
}

async function findById(id) {
  const sql = `
    SELECT c.*,
      (SELECT COUNT(*) FROM activities WHERE city_id = c.id) AS activities_count
    FROM cities c
    WHERE c.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    city: {
      id: r.id,
      name: r.name,
      country: r.country,
      region: r.region,
      description: r.description,
      imageUrl: r.image_url,
      latitude: r.latitude ? parseFloat(r.latitude) : null,
      longitude: r.longitude ? parseFloat(r.longitude) : null,
      costIndex: parseFloat(r.cost_index || 1),
      popularityScore: parseFloat(r.popularity_score || 0)
    },
    activitiesCount: parseInt(r.activities_count || 0, 10)
  };
}

async function getPopularCities(limit = 10) {
  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const sql = `
    SELECT c.id, c.name, c.country, c.region, c.description, c.image_url AS imageUrl, c.popularity_score AS popularityScore,
      COUNT(ts.id) AS tripCount
    FROM cities c
    LEFT JOIN trip_stops ts ON c.id = ts.city_id
    GROUP BY c.id
    ORDER BY tripCount DESC, c.popularity_score DESC
    LIMIT ${validLimit}
  `;
  const rows = await query(sql);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    country: r.country,
    region: r.region,
    description: r.description,
    imageUrl: r.imageUrl,
    popularityScore: parseFloat(r.popularityScore || 0),
    tripCount: parseInt(r.tripCount || 0, 10)
  }));
}

module.exports = {
  findAll,
  findGrouped,
  findById,
  getPopularCities
};
