const { z } = require('zod');

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  additionalInfo: z.string().optional().nullable(),
  language: z.string().max(20).optional()
});

module.exports = {
  updateProfileSchema
};
