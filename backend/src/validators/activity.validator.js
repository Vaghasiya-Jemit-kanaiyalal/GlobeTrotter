const { z } = require('zod');

const scheduleActivitySchema = z.object({
  activityId: z.number({ required_error: 'activityId is required' }).int().positive(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'scheduledDate must be YYYY-MM-DD'),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'scheduledTime must be HH:MM or HH:MM:SS'),
  activityOrder: z.number().int().positive().optional(),
  notes: z.string().optional().nullable()
});

const updateScheduledActivitySchema = z.object({
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).optional(),
  activityOrder: z.number().int().positive().optional(),
  notes: z.string().optional().nullable()
});

module.exports = {
  scheduleActivitySchema,
  updateScheduledActivitySchema
};
