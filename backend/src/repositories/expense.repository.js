const { query } = require('../config/database');

async function createExpense(expenseData) {
  const sql = `
    INSERT INTO expenses (trip_id, trip_stop_id, trip_activity_id, title, description, category, amount, currency, expense_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    expenseData.tripId,
    expenseData.tripStopId || null,
    expenseData.tripActivityId || null,
    expenseData.title || 'Expense',
    expenseData.description || null,
    expenseData.category || 'Other',
    expenseData.amount,
    expenseData.currency || 'INR',
    expenseData.expenseDate
  ];
  const result = await query(sql, params);
  return findById(result.insertId);
}

async function findById(id) {
  const sql = `SELECT * FROM expenses WHERE id = ? LIMIT 1`;
  const rows = await query(sql, [id]);
  if (!rows[0]) return null;
  return {
    ...rows[0],
    amount: parseFloat(rows[0].amount)
  };
}

async function findByTripId(tripId) {
  const sql = `SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date DESC, id DESC`;
  const rows = await query(sql, [tripId]);
  return rows.map(r => ({
    ...r,
    amount: parseFloat(r.amount)
  }));
}

async function updateExpense(id, updateData) {
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
  if (updateData.category !== undefined) {
    fields.push('category = ?');
    params.push(updateData.category);
  }
  if (updateData.amount !== undefined) {
    fields.push('amount = ?');
    params.push(updateData.amount);
  }
  if (updateData.currency !== undefined) {
    fields.push('currency = ?');
    params.push(updateData.currency);
  }
  if (updateData.expenseDate !== undefined) {
    fields.push('expense_date = ?');
    params.push(updateData.expenseDate);
  }
  if (updateData.tripStopId !== undefined) {
    fields.push('trip_stop_id = ?');
    params.push(updateData.tripStopId);
  }
  if (updateData.tripActivityId !== undefined) {
    fields.push('trip_activity_id = ?');
    params.push(updateData.tripActivityId);
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

async function getCategorySummary(tripId) {
  const sql = `
    SELECT category, COALESCE(SUM(amount), 0) AS categoryTotal
    FROM expenses
    WHERE trip_id = ?
    GROUP BY category
  `;
  const rows = await query(sql, [tripId]);

  const categories = {
    Transport: 0,
    Accommodation: 0,
    Food: 0,
    Activity: 0,
    Shopping: 0,
    Other: 0
  };

  rows.forEach(r => {
    // Map legacy categories to standard casing if necessary
    const keyMap = {
      transport: 'Transport',
      stay: 'Accommodation',
      activities: 'Activity',
      meals: 'Food',
      other: 'Other'
    };
    const catName = keyMap[r.category] || r.category;
    if (categories[catName] !== undefined) {
      categories[catName] += parseFloat(r.categoryTotal);
    } else {
      categories[catName] = parseFloat(r.categoryTotal);
    }
  });

  return categories;
}

async function getSumByTripId(tripId) {
  const sql = `SELECT COALESCE(SUM(amount), 0) AS totalSpent FROM expenses WHERE trip_id = ?`;
  const rows = await query(sql, [tripId]);
  return parseFloat(rows[0].totalSpent || 0);
}

module.exports = {
  createExpense,
  findById,
  findByTripId,
  updateExpense,
  deleteExpense,
  getCategorySummary,
  getSumByTripId
};
