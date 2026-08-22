const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    return sendSuccess(res, 'Profile retrieved', { user }, 200);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, 'Profile updated successfully', { user }, 200);
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('No image file provided');
      error.statusCode = 400;
      throw error;
    }
    const avatarUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await userService.updateAvatar(req.user.id, avatarUrl);
    return sendSuccess(res, 'Profile image uploaded successfully', { user, avatarUrl }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const result = await userService.deleteProfile(req.user.id);
    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
}

async function getSavedDestinations(req, res, next) {
  try {
    const destinations = await userService.getSavedDestinations(req.user.id);
    return sendSuccess(res, 'Saved destinations fetched', { destinations }, 200);
  } catch (error) {
    next(error);
  }
}

async function addSavedDestination(req, res, next) {
  try {
    const { cityId } = req.body;
    const destinations = await userService.addSavedDestination(req.user.id, cityId);
    return sendSuccess(res, 'Destination saved successfully', { destinations }, 201);
  } catch (error) {
    next(error);
  }
}

async function removeSavedDestination(req, res, next) {
  try {
    const cityId = parseInt(req.params.cityId, 10);
    const destinations = await userService.removeSavedDestination(req.user.id, cityId);
    return sendSuccess(res, 'Destination removed from saved', { destinations }, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteProfile,
  getSavedDestinations,
  addSavedDestination,
  removeSavedDestination
};
