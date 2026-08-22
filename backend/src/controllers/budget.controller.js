const budgetService = require('../services/budget.service');
const { sendSuccess } = require('../utils/response');

async function getTripBudget(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const budgetSummary = await budgetService.getTripBudgetSummary(tripId, req.user.id);
    return sendSuccess(res, 'Trip budget calculation retrieved', budgetSummary, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTripBudget
};
