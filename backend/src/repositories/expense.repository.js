const { query } = require('../config/database');

async function createExpense(expenseData) {
  const sql = `
    INSERT INTO expenses (trip_id, category, amount, description, expense_date)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    expenseData.tripId,
    expenseData.category,
    expenseData.amount,
    expenseData.description || null,
    expenseData.expenseDate
  ];
  const result = await query(sql, params);
  return findById(result.insertId);
}

async function findById(id) {
  const sql = `SELECT * FROM expenses WHERE id = ? LIMIT 1`;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function findByTripId(tripId) {
  const sql = `
    SELECT * FROM expenses 
    WHERE trip_id = ?
    ORDER BY expense_date DESC, created_at DESC
  `;
  return query(sql, [tripId]);
}

async function getBudgetSummaryByTripId(tripId) {
  const sql = `
    SELECT 
      category,
      COALESCE(SUM(amount), 0) AS total_amount
    FROM expenses
    WHERE trip_id = ?
    GROUP BY category
  `;
  const rows = await query(sql, [tripId]);

  const summary = {
    transport: 0,
    stay: 0,
    activities: 0,
    meals: 0,
    other: 0,
    total: 0
  };

  rows.forEach(row => {
    const val = parseFloat(row.total_amount);
    if (summary[row.category] !== undefined) {
      summary[row.category] = val;
    }
    summary.total += val;
  });

  return summary;
}

async function updateExpense(id, updateData) {
  const fields = [];
  const params = [];

  if (updateData.category !== undefined) {
    fields.push('category = ?');
    params.push(updateData.category);
  }
  if (updateData.amount !== undefined) {
    fields.push('amount = ?');
    params.push(updateData.amount);
  }
  if (updateData.description !== undefined) {
    fields.push('description = ?');
    params.push(updateData.description);
  }
  if (updateData.expenseDate !== undefined) {
    fields.push('expense_date = ?');
    params.push(updateData.expenseDate);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  const sql = `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`;
  await query(sql, params);
  return findById(id);
}

async function deleteExpense(id) {
  const sql = `DELETE FROM expenses WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createExpense,
  findById,
  findByTripId,
  getBudgetSummaryByTripId,
  updateExpense,
  deleteExpense
};
