const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.use(authenticate, requireAdmin);

router.get('/admin/dashboard', adminController.getDashboardOverview);
router.get('/admin/users', adminController.getUsers);
router.get('/admin/users/:userId', adminController.getUserDetails);
router.patch('/admin/users/:userId/status', adminController.updateUserStatus);
router.get('/admin/cities/popular', adminController.getPopularCities);
router.get('/admin/activities/popular', adminController.getPopularActivities);
router.get('/admin/analytics/users', adminController.getUserAnalytics);
router.get('/admin/analytics/trips', adminController.getTripAnalytics);
router.get('/admin/analytics/community', adminController.getCommunityAnalytics);
router.get('/admin/analytics/overview', adminController.getOverviewAnalytics);

module.exports = router;
