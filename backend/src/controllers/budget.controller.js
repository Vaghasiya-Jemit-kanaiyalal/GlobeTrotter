const budgetService = require('../services/budget.service');
const { sendSuccess } = require('../utils/response');

async function getBudget(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const data = await budgetService.getTripBudget(tripId, req.user.id);
    return sendSuccess(res, 'Trip budget retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function upsertBudget(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const data = await budgetService.upsertTripBudget(tripId, req.user.id, req.body);
    return sendSuccess(res, 'Trip budget updated successfully', data, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBudget,
  upsertBudget
};
