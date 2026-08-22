const budgetRepository = require('../repositories/budget.repository');
const expenseRepository = require('../repositories/expense.repository');
const tripRepository = require('../repositories/trip.repository');

async function getTripBudget(tripId, userId) {
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

  const budgetRecord = await budgetRepository.findByTripId(tripId);
  const totalBudget = budgetRecord ? parseFloat(budgetRecord.total_budget) : parseFloat(trip.budget_limit || 0);
  const currency = budgetRecord ? budgetRecord.currency : 'INR';

  const totalSpent = await expenseRepository.getSumByTripId(tripId);
  const remaining = totalBudget - totalSpent;
  const budgetExceeded = remaining < 0;

  return {
    budget: {
      totalBudget,
      totalSpent,
      remaining,
      budgetExceeded,
      currency
    }
  };
}

async function upsertTripBudget(tripId, userId, { totalBudget, currency = 'INR' }) {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  if (trip.user_id !== userId) {
    const error = new Error('Access denied. Only the trip owner can modify the budget.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  // Update trip table budget limit as well for consistency
  await tripRepository.updateTrip(tripId, { budgetLimit: totalBudget });
  await budgetRepository.upsertBudget(tripId, totalBudget, currency);

  return getTripBudget(tripId, userId);
}

module.exports = {
  getTripBudget,
  upsertTripBudget
};
