const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/trips/:tripId/budget', authenticate, budgetController.getTripBudget);

module.exports = router;
