const { query } = require('../config/database');

async function findByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  const rows = await query(sql, [email]);
  return rows[0] || null;
}

async function findById(id) {
  const sql = `
    SELECT id, first_name, last_name, email, phone, city, country, additional_info, profile_image, language, role, created_at, updated_at
    FROM users WHERE id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function createUser(userData) {
  const sql = `
    INSERT INTO users (first_name, last_name, email, password_hash, phone, city, country, additional_info, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.passwordHash,
    userData.phone || null,
    userData.city || null,
    userData.country || null,
    userData.additionalInfo || null,
    userData.role || 'user'
  ];
  const result = await query(sql, params);
  return findById(result.insertId);
}

async function updateUser(id, updateData) {
  const fields = [];
  const params = [];

  if (updateData.firstName !== undefined) {
    fields.push('first_name = ?');
    params.push(updateData.firstName);
  }
  if (updateData.lastName !== undefined) {
    fields.push('last_name = ?');
    params.push(updateData.lastName);
  }
  if (updateData.phone !== undefined) {
    fields.push('phone = ?');
    params.push(updateData.phone);
  }
  if (updateData.city !== undefined) {
    fields.push('city = ?');
    params.push(updateData.city);
  }
  if (updateData.country !== undefined) {
    fields.push('country = ?');
    params.push(updateData.country);
  }
  if (updateData.additionalInfo !== undefined) {
    fields.push('additional_info = ?');
    params.push(updateData.additionalInfo);
  }
  if (updateData.profileImage !== undefined) {
    fields.push('profile_image = ?');
    params.push(updateData.profileImage);
  }
  if (updateData.language !== undefined) {
    fields.push('language = ?');
    params.push(updateData.language);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  await query(sql, params);
  return findById(id);
}

async function deleteUser(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

async function getSavedDestinations(userId) {
  const sql = `
    SELECT c.*, sd.created_at AS saved_at
    FROM saved_destinations sd
    JOIN cities c ON sd.city_id = c.id
    WHERE sd.user_id = ?
    ORDER BY sd.created_at DESC
  `;
  return query(sql, [userId]);
}

async function addSavedDestination(userId, cityId) {
  const sql = `INSERT IGNORE INTO saved_destinations (user_id, city_id) VALUES (?, ?)`;
  await query(sql, [userId, cityId]);
  return getSavedDestinations(userId);
}

async function removeSavedDestination(userId, cityId) {
  const sql = `DELETE FROM saved_destinations WHERE user_id = ? AND city_id = ?`;
  await query(sql, [userId, cityId]);
  return getSavedDestinations(userId);
}

async function countAllUsers() {
  const sql = `SELECT COUNT(*) AS count FROM users WHERE role = 'user'`;
  const rows = await query(sql);
  return rows[0].count;
}

async function findAllUsers(limit = 20, offset = 0) {
  const validLimit = Math.max(1, parseInt(limit, 10) || 20);
  const validOffset = Math.max(0, parseInt(offset, 10) || 0);
  const sql = `
    SELECT id, first_name, last_name, email, phone, city, country, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT ${validLimit} OFFSET ${validOffset}
  `;
  return query(sql);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
  deleteUser,
  getSavedDestinations,
  addSavedDestination,
  removeSavedDestination,
  countAllUsers,
  findAllUsers
};
