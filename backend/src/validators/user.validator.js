const { z } = require('zod');

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  additionalInfo: z.string().optional().nullable(),
  language: z.string().max(20).optional()
});

const saveDestinationSchema = z.object({
  cityId: z.number({ required_error: 'cityId is required' }).int().positive()
});

module.exports = {
  updateProfileSchema,
  saveDestinationSchema
};
