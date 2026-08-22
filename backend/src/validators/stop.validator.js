const { z } = require('zod');

const addStopSchema = z.object({
  cityId: z.number({ required_error: 'cityId is required' }).int().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD'),
  stopOrder: z.number().int().positive().optional(),
  notes: z.string().optional().nullable()
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Start date must be less than or equal to end date',
  path: ['endDate']
});

const updateStopSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  stopOrder: z.number().int().positive().optional(),
  notes: z.string().optional().nullable()
});

const reorderStopsSchema = z.object({
  stopIds: z.array(z.number().int().positive()).min(1, 'stopIds must contain at least one ID')
});

module.exports = {
  addStopSchema,
  updateStopSchema,
  reorderStopsSchema
};
