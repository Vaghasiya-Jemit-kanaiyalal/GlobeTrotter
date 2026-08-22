const expenseRepository = require('../repositories/expense.repository');
const tripRepository = require('../repositories/trip.repository');

async function addExpense(tripId, userId, expenseData) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }
  if (trip.user_id !== userId) {
    const error = new Error('Access denied. You do not own this trip.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return expenseRepository.createExpense({
    ...expenseData,
    tripId
  });
}

async function getExpensesByTripId(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }
  if (trip.user_id !== userId && !trip.is_public) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }
  return expenseRepository.findByTripId(tripId);
}

async function updateExpense(expenseId, userId, updateData) {
  const expense = await expenseRepository.findById(expenseId);
  if (!expense) {
    const error = new Error('Expense not found');
    error.statusCode = 404;
    error.errorCode = 'EXPENSE_NOT_FOUND';
    throw error;
  }

  const trip = await tripRepository.findById(expense.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return expenseRepository.updateExpense(expenseId, updateData);
}

async function deleteExpense(expenseId, userId) {
  const expense = await expenseRepository.findById(expenseId);
  if (!expense) {
    const error = new Error('Expense not found');
    error.statusCode = 404;
    error.errorCode = 'EXPENSE_NOT_FOUND';
    throw error;
  }

  const trip = await tripRepository.findById(expense.trip_id);
  if (trip.user_id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return expenseRepository.deleteExpense(expenseId);
}

async function getTripBudgetSummary(tripId, userId) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }
  if (trip.user_id !== userId && !trip.is_public) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const summary = await expenseRepository.getBudgetSummaryByTripId(tripId);

  // Calculate trip duration in days
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const averagePerDay = parseFloat((summary.total / totalDays).toFixed(2));
  const budgetLimit = parseFloat(trip.budget_limit || 0);

  const isOverBudget = budgetLimit > 0 && summary.total > budgetLimit;
  const difference = budgetLimit > 0 ? parseFloat(Math.abs(summary.total - budgetLimit).toFixed(2)) : 0;

  return {
    ...summary,
    totalDays,
    averagePerDay,
    budgetLimit,
    isOverBudget,
    difference
  };
}

module.exports = {
  addExpense,
  getExpensesByTripId,
  updateExpense,
  deleteExpense,
  getTripBudgetSummary
};
