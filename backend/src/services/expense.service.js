const expenseRepository = require('../repositories/expense.repository');
const budgetRepository = require('../repositories/budget.repository');
const tripRepository = require('../repositories/trip.repository');

async function createExpense(tripId, userId, expenseData) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  if (trip.user_id !== userId) {
    const error = new Error('Access denied. Only the trip owner can add expenses.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  // Validate expense date belongs to trip date range
  if (expenseData.expenseDate < trip.start_date || expenseData.expenseDate > trip.end_date) {
    const error = new Error(`Expense date (${expenseData.expenseDate}) must fall within trip date bounds (${trip.start_date} to ${trip.end_date})`);
    error.statusCode = 422;
    error.errorCode = 'INVALID_EXPENSE_DATE';
    throw error;
  }

  const createdExpense = await expenseRepository.createExpense({
    ...expenseData,
    tripId
  });

  const budgetInfo = await budgetRepository.findByTripId(tripId);
  const totalBudget = budgetInfo ? parseFloat(budgetInfo.total_budget) : parseFloat(trip.budget_limit || 0);
  const totalSpent = await expenseRepository.getSumByTripId(tripId);
  const remaining = totalBudget - totalSpent;

  return {
    expense: createdExpense,
    budgetExceeded: remaining < 0,
    remaining
  };
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

async function getExpenseById(expenseId, userId) {
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

  return expense;
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

async function getExpenseSummary(tripId, userId) {
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

  const total = await expenseRepository.getSumByTripId(tripId);
  const categories = await expenseRepository.getCategorySummary(tripId);
  const budgetRecord = await budgetRepository.findByTripId(tripId);

  return {
    total,
    currency: budgetRecord ? budgetRecord.currency : 'INR',
    categories
  };
}

module.exports = {
  createExpense,
  getExpensesByTripId,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};
