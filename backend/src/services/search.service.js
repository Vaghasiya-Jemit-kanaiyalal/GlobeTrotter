const cityRepository = require('../repositories/city.repository');
const activityRepository = require('../repositories/activity.repository');

async function globalSearch({ q = '', type = 'all', page = 1, limit = 10 }) {
  const allowedTypes = ['activity', 'city', 'all'];
  if (!allowedTypes.includes(type)) {
    const error = new Error(`Invalid search type '${type}'. Allowed types: ${allowedTypes.join(', ')}`);
    error.statusCode = 400;
    error.errorCode = 'INVALID_SEARCH_TYPE';
    throw error;
  }

  const result = {
    cities: [],
    activities: []
  };

  if (type === 'city' || type === 'all') {
    const cityRes = await cityRepository.findAll({ search: q, page, limit });
    result.cities = cityRes.items;
  }

  if (type === 'activity' || type === 'all') {
    const actRes = await activityRepository.findAll({ search: q, page, limit });
    result.activities = actRes.items;
  }

  return result;
}

module.exports = {
  globalSearch
};
