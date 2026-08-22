const { z } = require('zod');

const upsertBudgetSchema = z.object({
  totalBudget: z.number().min(0, 'totalBudget must be greater than or equal to 0'),
  currency: z.string().min(1).max(10).optional().default('INR')
});

module.exports = {
  upsertBudgetSchema
};
