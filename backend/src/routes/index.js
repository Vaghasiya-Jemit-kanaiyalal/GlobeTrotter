const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const cityRoutes = require('./city.routes');
const activityRoutes = require('./activity.routes');
const tripRoutes = require('./trip.routes');
const stopRoutes = require('./stop.routes');
const itineraryRoutes = require('./itinerary.routes');
const expenseRoutes = require('./expense.routes');
const budgetRoutes = require('./budget.routes');
const shareRoutes = require('./share.routes');
const dashboardRoutes = require('./dashboard.routes');
const adminRoutes = require('./admin.routes');

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    return res.status(200).json({
      success: true,
      message: 'GlobeTrotter API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'GlobeTrotter API health check failed',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Mount modular sub-routes
router.use('/auth', authRoutes);
router.use('/', userRoutes);
router.use('/', cityRoutes);
router.use('/', activityRoutes);
router.use('/', tripRoutes);
router.use('/', stopRoutes);
router.use('/', itineraryRoutes);
router.use('/', expenseRoutes);
router.use('/', budgetRoutes);
router.use('/', shareRoutes);
router.use('/', dashboardRoutes);
router.use('/', adminRoutes);

module.exports = router;
