const budgetService = require('../services/budget.service');
const { sendSuccess } = require('../utils/response');

async function addExpense(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const expense = await budgetService.addExpense(tripId, req.user.id, req.body);
    return sendSuccess(res, 'Expense added successfully', { expense }, 201);
  } catch (error) {
    next(error);
  }
}

async function getExpenses(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const expenses = await budgetService.getExpensesByTripId(tripId, req.user.id);
    return sendSuccess(res, 'Trip expenses fetched', { expenses }, 200);
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    const expense = await budgetService.updateExpense(expenseId, req.user.id, req.body);
    return sendSuccess(res, 'Expense updated successfully', { expense }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    await budgetService.deleteExpense(expenseId, req.user.id);
    return sendSuccess(res, 'Expense deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
