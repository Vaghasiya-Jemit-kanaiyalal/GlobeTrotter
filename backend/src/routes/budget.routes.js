const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { upsertBudgetSchema } = require('../validators/budget.validator');

router.get('/trips/:tripId/budget', authenticate, budgetController.getBudget);
router.post('/trips/:tripId/budget', authenticate, validate(upsertBudgetSchema), budgetController.upsertBudget);
router.put('/trips/:tripId/budget', authenticate, validate(upsertBudgetSchema), budgetController.upsertBudget);

module.exports = router;
