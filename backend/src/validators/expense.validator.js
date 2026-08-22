const { z } = require('zod');

const expenseCategoryEnum = z.enum(['transport', 'stay', 'activities', 'meals', 'other']);

const addExpenseSchema = z.object({
  category: expenseCategoryEnum,
  amount: z.number({ required_error: 'amount is required' }).nonnegative('amount must be >= 0'),
  description: z.string().optional().nullable(),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expenseDate must be YYYY-MM-DD')
});

const updateExpenseSchema = z.object({
  category: expenseCategoryEnum.optional(),
  amount: z.number().nonnegative().optional(),
  description: z.string().optional().nullable(),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

module.exports = {
  addExpenseSchema,
  updateExpenseSchema
};
