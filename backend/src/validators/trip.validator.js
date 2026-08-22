const { z } = require('zod');

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(255),
  description: z.string().optional().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD'),
  coverImage: z.string().optional().nullable(),
  budgetLimit: z.number().nonnegative().optional().default(0),
  isPublic: z.boolean().optional().default(false)
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Start date must be less than or equal to end date',
  path: ['endDate']
});

const updateTripSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  coverImage: z.string().optional().nullable(),
  budgetLimit: z.number().nonnegative().optional(),
  isPublic: z.boolean().optional()
});

module.exports = {
  createTripSchema,
  updateTripSchema
};
