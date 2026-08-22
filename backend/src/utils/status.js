/**
 * Calculate dynamic trip status based on current date
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {'upcoming' | 'ongoing' | 'completed'}
 */
function calculateTripStatus(startDate, endDate) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr < startDate) {
    return 'upcoming';
  } else if (todayStr >= startDate && todayStr <= endDate) {
    return 'ongoing';
  } else {
    return 'completed';
  }
}

/**
 * Calculate trip duration in days
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {number}
 */
function calculateDurationDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

module.exports = {
  calculateTripStatus,
  calculateDurationDays
};
