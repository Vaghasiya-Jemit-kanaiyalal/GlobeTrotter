const userRepository = require('../repositories/user.repository');
const tripRepository = require('../repositories/trip.repository');
const { query } = require('../config/database');

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
  if (updateData.email) {
    const existing = await userRepository.findByEmail(updateData.email);
    if (existing && existing.id !== userId) {
      const error = new Error('Email is already in use by another account');
      error.statusCode = 409;
      error.errorCode = 'EMAIL_EXISTS';
      throw error;
    }
  }

  return userRepository.updateUser(userId, updateData);
}

async function updateAvatar(userId, avatarPath) {
  return userRepository.updateUser(userId, { profileImage: avatarPath });
}

/**
 * Screen 7: Profile Trips (Preplanned vs Previous Trips)
 */
async function getProfileTrips(userId) {
  const allTrips = await tripRepository.findByUserId(userId);
  const today = new Date().toISOString().split('T')[0];

  const preplannedTrips = allTrips.filter(t => t.start_date >= today);
  const previousTrips = allTrips.filter(t => t.start_date < today);

  return {
    preplannedTrips,
    previousTrips
  };
}

/**
 * Screen 7: Profile Travel Statistics
 */
async function getProfileStats(userId) {
  const allTrips = await tripRepository.findByUserId(userId);
  const today = new Date().toISOString().split('T')[0];

  const totalTrips = allTrips.length;
  const upcomingTrips = allTrips.filter(t => t.start_date > today).length;
  const completedTrips = allTrips.filter(t => t.end_date < today).length;

  const destinationsRows = await query(
    `SELECT COUNT(DISTINCT city_id) AS visitedCount FROM trip_stops ts JOIN trips t ON ts.trip_id = t.id WHERE t.user_id = ?`,
    [userId]
  );
  const destinationsVisited = destinationsRows[0] ? destinationsRows[0].visitedCount : 0;

  const activitiesRows = await query(
    `SELECT COUNT(*) AS actCount FROM trip_activities ta JOIN trip_stops ts ON ta.trip_stop_id = ts.id JOIN trips t ON ts.trip_id = t.id WHERE t.user_id = ?`,
    [userId]
  );
  const activitiesCompleted = activitiesRows[0] ? activitiesRows[0].actCount : 0;

  return {
    totalTrips,
    upcomingTrips,
    completedTrips,
    destinationsVisited,
    activitiesCompleted
  };
}

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  getProfileTrips,
  getProfileStats
};
