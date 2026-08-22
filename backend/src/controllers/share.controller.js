const shareService = require('../services/share.service');
const { sendSuccess } = require('../utils/response');

async function shareTrip(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const result = await shareService.generateShareLink(tripId, req.user.id);
    return sendSuccess(res, 'Trip shared successfully', result, 200);
  } catch (error) {
    next(error);
  }
}

async function getPublicTrip(req, res, next) {
  try {
    const { slug } = req.params;
    const publicTrip = await shareService.getPublicTripBySlug(slug);
    return sendSuccess(res, 'Public itinerary fetched successfully', { trip: publicTrip }, 200);
  } catch (error) {
    next(error);
  }
}

async function copyTrip(req, res, next) {
  try {
    const { slug } = req.params;
    const newTrip = await shareService.copyPublicTrip(slug, req.user.id);
    return sendSuccess(res, 'Itinerary copied to your account successfully', { trip: newTrip }, 201);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  shareTrip,
  getPublicTrip,
  copyTrip
};
