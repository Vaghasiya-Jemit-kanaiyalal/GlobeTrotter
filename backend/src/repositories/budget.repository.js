const { query } = require('../config/database');

async function findByTripId(tripId) {
  const sql = `SELECT * FROM trip_budgets WHERE trip_id = ? LIMIT 1`;
  const rows = await query(sql, [tripId]);
  return rows[0] || null;
}

async function upsertBudget(tripId, totalBudget, currency = 'INR') {
  const existing = await findByTripId(tripId);
  if (existing) {
    const sql = `UPDATE trip_budgets SET total_budget = ?, currency = ? WHERE trip_id = ?`;
    await query(sql, [totalBudget, currency, tripId]);
  } else {
    const sql = `INSERT INTO trip_budgets (trip_id, total_budget, currency) VALUES (?, ?, ?)`;
    await query(sql, [tripId, totalBudget, currency]);
  }
  return findByTripId(tripId);
}

module.exports = {
  findByTripId,
  upsertBudget
};
