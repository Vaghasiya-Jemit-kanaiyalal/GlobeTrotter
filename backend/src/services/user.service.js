const userRepository = require('../repositories/user.repository');

async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
}

async function updateProfile(userId, updateData) {
  return userRepository.updateUser(userId, updateData);
}

async function updateAvatar(userId, avatarPath) {
  return userRepository.updateUser(userId, { profileImage: avatarPath });
}

async function deleteProfile(userId) {
  const success = await userRepository.deleteUser(userId);
  if (!success) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'USER_NOT_FOUND';
    throw error;
  }
  return { message: 'Account deleted successfully' };
}

async function getSavedDestinations(userId) {
  return userRepository.getSavedDestinations(userId);
}

async function addSavedDestination(userId, cityId) {
  return userRepository.addSavedDestination(userId, cityId);
}

async function removeSavedDestination(userId, cityId) {
  return userRepository.removeSavedDestination(userId, cityId);
}

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteProfile,
  getSavedDestinations,
  addSavedDestination,
  removeSavedDestination
};
