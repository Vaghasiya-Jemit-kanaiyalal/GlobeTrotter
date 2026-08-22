const cityRepository = require('../repositories/city.repository');
const activityRepository = require('../repositories/activity.repository');

async function searchCities(params) {
  if (params.groupBy) {
    const groups = await cityRepository.findGrouped(params);
    return { groups };
  }

  const { items, total, page, limit } = await cityRepository.findAll(params);
  const totalPages = Math.ceil(total / limit);

  return {
    cities: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: totalPages || 0
    }
  };
}

async function getCityDetails(cityId) {
  const data = await cityRepository.findById(cityId);
  if (!data) {
    const error = new Error('City destination not found');
    error.statusCode = 404;
    error.errorCode = 'CITY_NOT_FOUND';
    throw error;
  }
  return data;
}

async function getCityActivities(cityId, params) {
  const cityData = await cityRepository.findById(cityId);
  if (!cityData) {
    const error = new Error('City destination not found');
    error.statusCode = 404;
    error.errorCode = 'CITY_NOT_FOUND';
    throw error;
  }

  const result = await activityRepository.findAll({
    ...params,
    cityId
  });

  const totalPages = Math.ceil(result.total / result.limit);

  return {
    city: cityData.city,
    activities: result.items,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: totalPages || 0
    }
  };
}

async function getPopularCities(limit) {
  return cityRepository.getPopularCities(limit);
}

module.exports = {
  searchCities,
  getCityDetails,
  getCityActivities,
  getPopularCities
};
