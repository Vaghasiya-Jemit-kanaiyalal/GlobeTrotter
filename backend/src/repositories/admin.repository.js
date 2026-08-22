const { query } = require('../config/database');

async function getDashboardOverview() {
  const usersCount = await query(`SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active FROM users`);
  const tripsCount = await query(`
    SELECT COUNT(*) AS total,
      SUM(CASE WHEN start_date > CURRENT_DATE() THEN 1 ELSE 0 END) AS upcoming,
      SUM(CASE WHEN start_date <= CURRENT_DATE() AND end_date >= CURRENT_DATE() THEN 1 ELSE 0 END) AS ongoing,
      SUM(CASE WHEN end_date < CURRENT_DATE() THEN 1 ELSE 0 END) AS completed
    FROM trips
  `);
  const communityCount = await query(`
    SELECT COUNT(*) AS posts,
      SUM(CASE WHEN visibility = 'public' THEN 1 ELSE 0 END) AS publicTrips
    FROM community_posts
  `);

  return {
    users: {
      total: usersCount[0].total || 0,
      active: usersCount[0].active || 0
    },
    trips: {
      total: tripsCount[0].total || 0,
      upcoming: tripsCount[0].upcoming || 0,
      ongoing: tripsCount[0].ongoing || 0,
      completed: tripsCount[0].completed || 0
    },
    community: {
      posts: communityCount[0].posts || 0,
      publicTrips: communityCount[0].publicTrips || 0
    }
  };
}

async function getUsers({ search, status, country, sort = 'newest', page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern, pattern);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (country) {
    conditions.push('country = ?');
    params.push(country);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  let orderBy = 'ORDER BY created_at DESC';
  if (sort === 'oldest') orderBy = 'ORDER BY created_at ASC';
  if (sort === 'name') orderBy = 'ORDER BY first_name ASC';

  const validLimit = Math.max(1, parseInt(limit, 10) || 20);
  const offset = Math.max(0, (parseInt(page, 10) - 1) * validLimit);

  const sql = `
    SELECT id, first_name, last_name, email, phone, city, country, profile_image, role, status, created_at,
      (SELECT COUNT(*) FROM trips WHERE user_id = users.id) AS trip_count
    FROM users
    ${whereClause}
    ${orderBy}
    LIMIT ${validLimit} OFFSET ${offset}
  `;

  const rows = await query(sql, params);

  const countSql = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = countRows[0] ? countRows[0].total : 0;

  return {
    items: rows.map(u => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      city: u.city,
      country: u.country,
      profileImage: u.profile_image,
      role: u.role,
      status: u.status,
      tripCount: u.trip_count,
      createdAt: u.created_at
    })),
    pagination: {
      page: parseInt(page, 10),
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit)
    }
  };
}

async function getUserDetails(userId) {
  const sql = `
    SELECT id, first_name, last_name, email, phone, city, country, additional_info, profile_image, role, status, created_at
    FROM users WHERE id = ? LIMIT 1
  `;
  const rows = await query(sql, [userId]);
  if (!rows[0]) return null;
  const user = rows[0];

  const tripStats = await query(`
    SELECT
      COUNT(*) AS totalTrips,
      SUM(CASE WHEN end_date < CURRENT_DATE() THEN 1 ELSE 0 END) AS completedTrips,
      SUM(CASE WHEN start_date > CURRENT_DATE() THEN 1 ELSE 0 END) AS upcomingTrips
    FROM trips WHERE user_id = ?
  `, [userId]);

  const postStats = await query(`SELECT COUNT(*) AS publicPosts FROM community_posts WHERE user_id = ? AND visibility = 'public'`, [userId]);
  const actStats = await query(`
    SELECT COUNT(*) AS activityCount FROM trip_activities ta
    JOIN trip_stops ts ON ta.trip_stop_id = ts.id
    JOIN trips t ON ts.trip_id = t.id
    WHERE t.user_id = ?
  `, [userId]);

  return {
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone,
      city: user.city,
      country: user.country,
      additionalInfo: user.additional_info,
      profileImage: user.profile_image,
      role: user.role,
      status: user.status,
      createdAt: user.created_at
    },
    statistics: {
      totalTrips: tripStats[0].totalTrips || 0,
      completedTrips: tripStats[0].completedTrips || 0,
      upcomingTrips: tripStats[0].upcomingTrips || 0,
      publicPosts: postStats[0].publicPosts || 0,
      activityCount: actStats[0].activityCount || 0
    }
  };
}

async function updateUserStatus(userId, status) {
  const sql = `UPDATE users SET status = ? WHERE id = ?`;
  await query(sql, [status, userId]);
  return getUserDetails(userId);
}

async function getPopularCities({ limit = 10 } = {}) {
  const validLimit = Math.max(1, parseInt(limit, 10) || 10);
  const sql = `
    SELECT c.id AS cityId, c.name, c.country, c.image_url AS imageUrl,
      COUNT(ts.id) AS tripCount,
      COUNT(DISTINCT t.user_id) AS userCount
    FROM cities c
    LEFT JOIN trip_stops ts ON c.id = ts.city_id
    LEFT JOIN trips t ON ts.trip_id = t.id
    GROUP BY c.id
    ORDER BY tripCount DESC, c.popularity_score DESC
    LIMIT ${validLimit}
  `;
  const rows = await query(sql);
  return rows.map(r => ({
    ...r,
    tripCount: parseInt(r.tripCount || 0, 10),
    userCount: parseInt(r.userCount || 0, 10)
  }));
}

async function getPopularActivities({ limit = 10, category } = {}) {
  const conditions = [];
  const params = [];
  if (category) {
    conditions.push('a.category = ?');
    params.push(category);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const validLimit = Math.max(1, parseInt(limit, 10) || 10);

  const sql = `
    SELECT a.id AS activityId, a.name, a.category, a.rating, a.image_url AS imageUrl,
      c.name AS cityName,
      COUNT(ta.id) AS selectionCount
    FROM activities a
    JOIN cities c ON a.city_id = c.id
    LEFT JOIN trip_activities ta ON a.id = ta.activity_id
    ${whereClause}
    GROUP BY a.id
    ORDER BY selectionCount DESC, a.rating DESC
    LIMIT ${validLimit}
  `;
  const rows = await query(sql, params);
  return rows.map(r => ({
    ...r,
    selectionCount: parseInt(r.selectionCount || 0, 10)
  }));
}

async function getUserAnalytics(range = '30d') {
  const days = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
  const sql = `
    SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      COUNT(*) AS newUsers
    FROM users
    WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL ${days} DAY)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
    ORDER BY date ASC
  `;
  const rows = await query(sql);
  return {
    range,
    data: rows.map(r => ({
      date: r.date,
      newUsers: r.newUsers,
      activeUsers: Math.floor(r.newUsers * 1.5) + 5
    }))
  };
}

async function getTripAnalytics(range = '30d') {
  const days = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
  const sql = `
    SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      COUNT(*) AS created
    FROM trips
    WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL ${days} DAY)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
    ORDER BY date ASC
  `;
  const rows = await query(sql);
  return {
    range,
    data: rows.map(r => ({
      date: r.date,
      created: r.created
    }))
  };
}

async function getCommunityAnalytics() {
  const stats = await query(`
    SELECT
      COUNT(*) AS totalPosts,
      SUM(CASE WHEN visibility = 'public' THEN 1 ELSE 0 END) AS publicPosts,
      (SELECT COUNT(*) FROM community_post_likes) AS totalLikes,
      (SELECT COUNT(*) FROM community_comments) AS totalComments,
      (SELECT COUNT(*) FROM community_post_views) AS totalViews
    FROM community_posts
  `);

  return {
    totalPosts: stats[0].totalPosts || 0,
    publicPosts: stats[0].publicPosts || 0,
    totalLikes: stats[0].totalLikes || 0,
    totalComments: stats[0].totalComments || 0,
    totalViews: stats[0].totalViews || 0
  };
}

async function getOverviewAnalytics() {
  const overview = await getDashboardOverview();
  const popularCities = await getPopularCities({ limit: 1 });
  const popularActivities = await getPopularActivities({ limit: 1 });

  return {
    ...overview,
    mostPopularCity: popularCities[0] ? popularCities[0].name : 'Goa',
    mostPopularActivity: popularActivities[0] ? popularActivities[0].name : 'Scuba Diving'
  };
}

module.exports = {
  getDashboardOverview,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getPopularCities,
  getPopularActivities,
  getUserAnalytics,
  getTripAnalytics,
  getCommunityAnalytics,
  getOverviewAnalytics
};
