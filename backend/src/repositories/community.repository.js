const { query } = require('../config/database');

function formatPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    postType: row.post_type,
    visibility: row.visibility,
    coverImage: row.cover_image,
    publicShareToken: row.public_share_token,
    createdAt: row.created_at,
    author: {
      id: row.user_id,
      name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Traveler',
      profileImage: row.profile_image
    },
    trip: {
      id: row.trip_id,
      name: row.trip_name,
      destination: row.primary_destination || 'Multi-City',
      startDate: row.start_date,
      endDate: row.end_date
    },
    likes: parseInt(row.likes_count || 0, 10),
    comments: parseInt(row.comments_count || 0, 10),
    views: parseInt(row.views_count || 0, 10)
  };
}

async function createPost(postData) {
  const sql = `
    INSERT INTO community_posts (user_id, trip_id, title, description, post_type, visibility, cover_image, public_share_token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    postData.userId,
    postData.tripId,
    postData.title,
    postData.description,
    postData.postType || 'trip',
    postData.visibility || 'public',
    postData.coverImage || null,
    postData.publicShareToken || null
  ];
  const result = await query(sql, params);
  return findById(result.insertId);
}

async function findById(id) {
  const sql = `
    SELECT cp.*, u.first_name, u.last_name, u.profile_image,
      t.name AS trip_name, t.start_date, t.end_date,
      (SELECT c.name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = t.id ORDER BY ts.stop_order ASC LIMIT 1) AS primary_destination,
      (SELECT COUNT(*) FROM community_post_likes WHERE post_id = cp.id) AS likes_count,
      (SELECT COUNT(*) FROM community_comments WHERE post_id = cp.id) AS comments_count,
      (SELECT COUNT(*) FROM community_post_views WHERE post_id = cp.id) AS views_count
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    JOIN trips t ON cp.trip_id = t.id
    WHERE cp.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return formatPost(rows[0]);
}

async function findByShareToken(token) {
  const sql = `
    SELECT cp.*, u.first_name, u.last_name, u.profile_image,
      t.name AS trip_name, t.start_date, t.end_date,
      (SELECT c.name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = t.id ORDER BY ts.stop_order ASC LIMIT 1) AS primary_destination,
      (SELECT COUNT(*) FROM community_post_likes WHERE post_id = cp.id) AS likes_count,
      (SELECT COUNT(*) FROM community_comments WHERE post_id = cp.id) AS comments_count,
      (SELECT COUNT(*) FROM community_post_views WHERE post_id = cp.id) AS views_count
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    JOIN trips t ON cp.trip_id = t.id
    WHERE cp.public_share_token = ? LIMIT 1
  `;
  const rows = await query(sql, [token]);
  return formatPost(rows[0]);
}

async function findAllPosts({ search, postType, destination, sort = 'newest', page = 1, limit = 20 } = {}) {
  const conditions = ["cp.visibility = 'public'"];
  const params = [];

  if (postType) {
    conditions.push('cp.post_type = ?');
    params.push(postType);
  }

  if (search) {
    conditions.push('(cp.title LIKE ? OR cp.description LIKE ? OR t.name LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (destination) {
    conditions.push(`EXISTS (
      SELECT 1 FROM trip_stops ts JOIN cities c ON ts.city_id = c.id
      WHERE ts.trip_id = cp.trip_id AND (LOWER(c.name) = LOWER(?) OR LOWER(c.country) = LOWER(?))
    )`);
    params.push(destination, destination);
  }

  let orderBy = 'ORDER BY cp.created_at DESC';
  if (sort === 'popular') {
    orderBy = 'ORDER BY (SELECT COUNT(*) FROM community_post_likes WHERE post_id = cp.id) DESC, cp.created_at DESC';
  }

  const validLimit = Math.max(1, parseInt(limit, 10) || 20);
  const offset = Math.max(0, (parseInt(page, 10) - 1) * validLimit);

  const sql = `
    SELECT cp.*, u.first_name, u.last_name, u.profile_image,
      t.name AS trip_name, t.start_date, t.end_date,
      (SELECT c.name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = t.id ORDER BY ts.stop_order ASC LIMIT 1) AS primary_destination,
      (SELECT COUNT(*) FROM community_post_likes WHERE post_id = cp.id) AS likes_count,
      (SELECT COUNT(*) FROM community_comments WHERE post_id = cp.id) AS comments_count,
      (SELECT COUNT(*) FROM community_post_views WHERE post_id = cp.id) AS views_count
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    JOIN trips t ON cp.trip_id = t.id
    WHERE ${conditions.join(' AND ')}
    ${orderBy}
    LIMIT ${validLimit} OFFSET ${offset}
  `;

  const rows = await query(sql, params);
  return rows.map(formatPost);
}

async function updatePost(id, updateData) {
  const fields = [];
  const params = [];

  if (updateData.title !== undefined) {
    fields.push('title = ?');
    params.push(updateData.title);
  }
  if (updateData.description !== undefined) {
    fields.push('description = ?');
    params.push(updateData.description);
  }
  if (updateData.postType !== undefined) {
    fields.push('post_type = ?');
    params.push(updateData.postType);
  }
  if (updateData.visibility !== undefined) {
    fields.push('visibility = ?');
    params.push(updateData.visibility);
  }
  if (updateData.coverImage !== undefined) {
    fields.push('cover_image = ?');
    params.push(updateData.coverImage);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  const sql = `UPDATE community_posts SET ${fields.join(', ')} WHERE id = ?`;
  await query(sql, params);
  return findById(id);
}

async function deletePost(id) {
  const sql = `DELETE FROM community_posts WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

// Likes
async function addLike(postId, userId) {
  const sql = `INSERT IGNORE INTO community_post_likes (post_id, user_id) VALUES (?, ?)`;
  await query(sql, [postId, userId]);
  return getLikesCount(postId);
}

async function removeLike(postId, userId) {
  const sql = `DELETE FROM community_post_likes WHERE post_id = ? AND user_id = ?`;
  await query(sql, [postId, userId]);
  return getLikesCount(postId);
}

async function isLikedByUser(postId, userId) {
  if (!userId) return false;
  const sql = `SELECT 1 FROM community_post_likes WHERE post_id = ? AND user_id = ? LIMIT 1`;
  const rows = await query(sql, [postId, userId]);
  return rows.length > 0;
}

async function getLikesCount(postId) {
  const sql = `SELECT COUNT(*) AS count FROM community_post_likes WHERE post_id = ?`;
  const rows = await query(sql, [postId]);
  return rows[0] ? rows[0].count : 0;
}

// Comments
async function addComment(postId, userId, content) {
  const sql = `INSERT INTO community_comments (post_id, user_id, content) VALUES (?, ?, ?)`;
  const result = await query(sql, [postId, userId, content]);
  return findCommentById(result.insertId);
}

async function getComments(postId) {
  const sql = `
    SELECT cc.*, u.first_name, u.last_name, u.profile_image
    FROM community_comments cc
    JOIN users u ON cc.user_id = u.id
    WHERE cc.post_id = ?
    ORDER BY cc.created_at ASC
  `;
  const rows = await query(sql, [postId]);
  return rows.map(r => ({
    id: r.id,
    postId: r.post_id,
    content: r.content,
    createdAt: r.created_at,
    author: {
      id: r.user_id,
      name: `${r.first_name || ''} ${r.last_name || ''}`.trim() || 'Traveler',
      profileImage: r.profile_image
    }
  }));
}

async function findCommentById(id) {
  const sql = `
    SELECT cc.*, u.first_name, u.last_name, u.profile_image
    FROM community_comments cc
    JOIN users u ON cc.user_id = u.id
    WHERE cc.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: r.id,
    postId: r.post_id,
    content: r.content,
    createdAt: r.created_at,
    author: {
      id: r.user_id,
      name: `${r.first_name || ''} ${r.last_name || ''}`.trim() || 'Traveler',
      profileImage: r.profile_image
    }
  };
}

async function updateComment(id, content) {
  const sql = `UPDATE community_comments SET content = ? WHERE id = ?`;
  await query(sql, [content, id]);
  return findCommentById(id);
}

async function deleteComment(id) {
  const sql = `DELETE FROM community_comments WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

// Views
async function recordView(postId, userId) {
  const sql = `INSERT INTO community_post_views (post_id, user_id) VALUES (?, ?)`;
  await query(sql, [postId, userId || null]);
}

// Trending
async function getTrending() {
  const popularPosts = await findAllPosts({ sort: 'popular', limit: 5 });
  const popularCities = await query(`
    SELECT c.id, c.name, c.country, c.image_url, COUNT(ts.id) AS trip_count
    FROM cities c
    JOIN trip_stops ts ON c.id = ts.city_id
    GROUP BY c.id
    ORDER BY trip_count DESC LIMIT 5
  `);
  const popularActivities = await query(`
    SELECT a.id, a.name, a.category, a.image_url, COUNT(ta.id) AS selection_count
    FROM activities a
    JOIN trip_activities ta ON a.id = ta.activity_id
    GROUP BY a.id
    ORDER BY selection_count DESC LIMIT 5
  `);

  return {
    popularPosts,
    popularCities,
    popularActivities
  };
}

module.exports = {
  createPost,
  findById,
  findByShareToken,
  findAllPosts,
  updatePost,
  deletePost,
  addLike,
  removeLike,
  isLikedByUser,
  getLikesCount,
  addComment,
  getComments,
  findCommentById,
  updateComment,
  deleteComment,
  recordView,
  getTrending
};
