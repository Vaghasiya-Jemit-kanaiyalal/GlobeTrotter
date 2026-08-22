const { query } = require('../config/database');

async function findByPublicSlug(slug) {
  const sql = `
    SELECT id, name, description, start_date, end_date, cover_image, budget_limit, public_slug, created_at
    FROM trips
    WHERE public_slug = ? AND is_public = 1
    LIMIT 1
  `;
  const rows = await query(sql, [slug]);
  return rows[0] || null;
}

module.exports = {
  findByPublicSlug
};
