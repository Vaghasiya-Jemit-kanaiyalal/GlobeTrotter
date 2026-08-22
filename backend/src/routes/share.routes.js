const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public route - no auth required
router.get('/public/trips/:slug', shareController.getPublicTrip);

// Protected routes
router.post('/trips/:tripId/share', authenticate, shareController.shareTrip);
router.post('/public/trips/:slug/copy', authenticate, shareController.copyTrip);

module.exports = router;
