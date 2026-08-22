const profileService = require('../services/profile.service');
const { sendSuccess } = require('../utils/response');

async function getProfile(req, res, next) {
  try {
    const user = await profileService.getProfile(req.user.id);
    return sendSuccess(res, 'User profile retrieved', user, 200);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await profileService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, 'Profile updated successfully', user, 200);
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('No avatar image file uploaded');
      error.statusCode = 400;
      throw error;
    }
    const avatarUrl = `/uploads/profiles/${req.file.filename}`;
    const user = await profileService.updateAvatar(req.user.id, avatarUrl);
    return sendSuccess(res, 'Profile image uploaded successfully', { user, avatarUrl }, 200);
  } catch (error) {
    next(error);
  }
}

async function getProfileTrips(req, res, next) {
  try {
    const data = await profileService.getProfileTrips(req.user.id);
    return sendSuccess(res, 'Profile trips retrieved', data, 200);
  } catch (error) {
    next(error);
  }
}

async function getProfileStats(req, res, next) {
  try {
    const stats = await profileService.getProfileStats(req.user.id);
    return sendSuccess(res, 'Profile travel statistics retrieved', stats, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getProfileTrips,
  getProfileStats
};
