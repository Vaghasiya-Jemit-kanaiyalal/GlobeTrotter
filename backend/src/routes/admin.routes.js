const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.use(authenticate, requireAdmin);

router.get('/admin/dashboard', adminController.getDashboardStats);
router.get('/admin/users', adminController.getUsers);
router.get('/admin/cities/popular', adminController.getPopularCities);
router.get('/admin/activities/popular', adminController.getPopularActivities);

module.exports = router;
