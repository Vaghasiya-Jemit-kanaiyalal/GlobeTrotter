const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { addExpenseSchema, updateExpenseSchema } = require('../validators/expense.validator');

router.post('/trips/:tripId/expenses', authenticate, validate(addExpenseSchema), expenseController.addExpense);
router.get('/trips/:tripId/expenses', authenticate, expenseController.getExpenses);
router.put('/expenses/:expenseId', authenticate, validate(updateExpenseSchema), expenseController.updateExpense);
router.delete('/expenses/:expenseId', authenticate, expenseController.deleteExpense);

module.exports = router;
