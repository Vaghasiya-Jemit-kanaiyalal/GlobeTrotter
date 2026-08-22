const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

router.get('/activities', activityController.getActivities);
router.get('/activities/:id', activityController.getActivityById);

module.exports = router;
