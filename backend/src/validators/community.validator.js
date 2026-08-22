const { z } = require('zod');

const createPostSchema = z.object({
  tripId: z.number().int().positive('tripId is required'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  postType: z.enum(['trip', 'experience', 'activity', 'itinerary', 'travel_tip']).optional().default('trip'),
  visibility: z.enum(['public', 'private']).optional().default('public'),
  coverImage: z.string().optional().nullable()
});

const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  postType: z.enum(['trip', 'experience', 'activity', 'itinerary', 'travel_tip']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
  coverImage: z.string().optional().nullable()
});

const addCommentSchema = z.object({
  content: z.string().min(1, 'Comment content cannot be empty')
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  addCommentSchema
};
