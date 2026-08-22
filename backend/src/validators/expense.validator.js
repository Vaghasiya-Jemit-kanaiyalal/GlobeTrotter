const { z } = require('zod');

const createExpenseSchema = z.object({
  title: z.string().min(1, 'Expense title is required').max(255).optional().default('Expense'),
  description: z.string().optional().nullable(),
  category: z.enum(['Transport', 'Accommodation', 'Food', 'Activity', 'Shopping', 'Other', 'transport', 'stay', 'activities', 'meals', 'other']).transform(val => {
    const map = { transport: 'Transport', stay: 'Accommodation', activities: 'Activity', meals: 'Food', other: 'Other' };
    return map[val] || val;
  }),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().max(10).optional().default('INR'),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expenseDate must be YYYY-MM-DD'),
  tripStopId: z.number().int().positive().optional().nullable(),
  tripActivityId: z.number().int().positive().optional().nullable()
});

const updateExpenseSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  category: z.enum(['Transport', 'Accommodation', 'Food', 'Activity', 'Shopping', 'Other']).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().max(10).optional(),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tripStopId: z.number().int().positive().optional().nullable(),
  tripActivityId: z.number().int().positive().optional().nullable()
});

module.exports = {
  createExpenseSchema,
  updateExpenseSchema
};
