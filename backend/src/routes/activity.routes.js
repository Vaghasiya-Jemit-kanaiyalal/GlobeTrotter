const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

// IMPORTANT ROUTE ORDER: Declare static endpoints and sub-resources before parameterized :activityId
router.get('/activities/popular', activityController.getPopularActivities);
router.get('/activities/:activityId/related', activityController.getRelatedActivities);
router.get('/activities', activityController.getActivities);
router.get('/activities/:activityId', activityController.getActivityById);

module.exports = router;
