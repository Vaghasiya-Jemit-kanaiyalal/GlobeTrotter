const searchService = require('../services/search.service');
const { sendSuccess } = require('../utils/response');

async function search(req, res, next) {
  try {
    const data = await searchService.globalSearch(req.query);
    return sendSuccess(res, 'Global search results fetched', data, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  search
};
