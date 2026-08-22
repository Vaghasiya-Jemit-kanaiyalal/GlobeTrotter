const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { createExpenseSchema, updateExpenseSchema } = require('../validators/expense.validator');

router.post('/trips/:tripId/expenses', authenticate, validate(createExpenseSchema), expenseController.createExpense);
router.get('/trips/:tripId/expenses', authenticate, expenseController.getExpenses);
router.get('/trips/:tripId/expenses/summary', authenticate, expenseController.getExpenseSummary);
router.get('/expenses/:expenseId', authenticate, expenseController.getExpenseById);
router.put('/expenses/:expenseId', authenticate, validate(updateExpenseSchema), expenseController.updateExpense);
router.delete('/expenses/:expenseId', authenticate, expenseController.deleteExpense);

module.exports = router;
