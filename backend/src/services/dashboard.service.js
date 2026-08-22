const userRepository = require('../repositories/user.repository');
const tripRepository = require('../repositories/trip.repository');
const cityRepository = require('../repositories/city.repository');

async function getDashboardData(userId) {
  const user = await userRepository.findById(userId);
  const allTrips = await tripRepository.findByUserId(userId);

  const today = new Date().toISOString().split('T')[0];

  const upcomingTrips = allTrips.filter(t => t.start_date >= today);
  const recentTrips = allTrips.filter(t => t.start_date < today);

  const recommendedCities = await cityRepository.getRecommendedCities(6);

  // Overall budget highlights
  const totalBudgetLimit = allTrips.reduce((acc, t) => acc + parseFloat(t.budget_limit || 0), 0);
  const totalSpent = allTrips.reduce((acc, t) => acc + parseFloat(t.total_expense || 0), 0);

  const budgetHighlights = {
    totalTripsCount: allTrips.length,
    upcomingTripsCount: upcomingTrips.length,
    totalBudgetLimit,
    totalSpent,
    remainingBudget: Math.max(0, totalBudgetLimit - totalSpent)
  };

  return {
    user,
    upcomingTrips,
    recentTrips,
    recommendedCities,
    budgetHighlights
  };
}

module.exports = {
  getDashboardData
};
