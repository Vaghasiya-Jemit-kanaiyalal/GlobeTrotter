const cityService = require('../services/city.service');
const { sendSuccess } = require('../utils/response');

async function getCities(req, res, next) {
  try {
    const data = await cityService.searchCities(req.query);
    return sendSuccess(res, 'Cities fetched successfully', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getCityById(req, res, next) {
  try {
    const cityId = parseInt(req.params.cityId, 10);
    const data = await cityService.getCityDetails(cityId);
    return sendSuccess(res, 'City details retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getCityActivities(req, res, next) {
  try {
    const cityId = parseInt(req.params.cityId, 10);
    const data = await cityService.getCityActivities(cityId, req.query);
    return sendSuccess(res, 'City activities retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getPopularCities(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cities = await cityService.getPopularCities(limit);
    return sendSuccess(res, 'Popular cities retrieved', { cities }, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCities,
  getCityById,
  getCityActivities,
  getPopularCities
};
