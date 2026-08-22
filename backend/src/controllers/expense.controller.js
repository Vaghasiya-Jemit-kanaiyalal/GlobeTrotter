const expenseService = require('../services/expense.service');
const { sendSuccess } = require('../utils/response');

async function createExpense(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const data = await expenseService.createExpense(tripId, req.user.id, req.body);
    return sendSuccess(res, 'Expense recorded successfully', data, 201);
  } catch (error) {
    next(error);
  }
}

async function getExpenses(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const expenses = await expenseService.getExpensesByTripId(tripId, req.user.id);
    return sendSuccess(res, 'Expenses fetched successfully', { expenses }, 200);
  } catch (error) {
    next(error);
  }
}

async function getExpenseById(req, res, next) {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    const expense = await expenseService.getExpenseById(expenseId, req.user.id);
    return sendSuccess(res, 'Expense details retrieved', { expense }, 200);
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    const expense = await expenseService.updateExpense(expenseId, req.user.id, req.body);
    return sendSuccess(res, 'Expense updated successfully', { expense }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    await expenseService.deleteExpense(expenseId, req.user.id);
    return sendSuccess(res, 'Expense deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
}

async function getExpenseSummary(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const summary = await expenseService.getExpenseSummary(tripId, req.user.id);
    return sendSuccess(res, 'Expense summary retrieved', summary, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};
