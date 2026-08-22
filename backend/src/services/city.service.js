const cityRepository = require('../repositories/city.repository');

async function searchCities(queryParams) {
  return cityRepository.findAll(queryParams);
}

async function getCityById(id) {
  const city = await cityRepository.findById(id);
  if (!city) {
    const error = new Error('City not found');
    error.statusCode = 404;
    error.errorCode = 'CITY_NOT_FOUND';
    throw error;
  }
  return city;
}

async function getRecommendations(limit = 6) {
  return cityRepository.getRecommendedCities(limit);
}

module.exports = {
  searchCities,
  getCityById,
  getRecommendations
};
