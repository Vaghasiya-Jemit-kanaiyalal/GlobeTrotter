const cityService = require('../services/city.service');
const { sendSuccess, sendPaginated } = require('../utils/response');

async function getCities(req, res, next) {
  try {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 20, 10);
    const { items, total } = await cityService.searchCities({
      ...req.query,
      page,
      limit
    });
    return sendPaginated(res, 'Cities fetched successfully', items, page, limit, total);
  } catch (error) {
    next(error);
  }
}

async function getCityById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const city = await cityService.getCityById(id);
    return sendSuccess(res, 'City details retrieved', { city }, 200);
  } catch (error) {
    next(error);
  }
}

async function getRecommendations(req, res, next) {
  try {
    const limit = parseInt(req.query.limit || 6, 10);
    const recommendations = await cityService.getRecommendations(limit);
    return sendSuccess(res, 'Recommended destinations retrieved', { cities: recommendations }, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCities,
  getCityById,
  getRecommendations
};
