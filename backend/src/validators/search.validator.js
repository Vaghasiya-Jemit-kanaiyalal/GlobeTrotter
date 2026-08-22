const { z } = require('zod');

const citySearchQuerySchema = z.object({
  search: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  minPopularity: z.coerce.number().min(0).max(100).optional(),
  sort: z.enum(['popularity', 'name_asc', 'name_desc', 'activities_count']).optional().default('popularity'),
  groupBy: z.enum(['country', 'region', 'popularity']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10)
});

const activitySearchQuerySchema = z.object({
  search: z.string().max(100).optional(),
  cityId: z.coerce.number().int().positive().optional(),
  country: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  minCost: z.coerce.number().min(0).optional(),
  maxCost: z.coerce.number().min(0).optional(),
  minDuration: z.coerce.number().min(0).optional(),
  maxDuration: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['relevance', 'rating', 'price_low', 'price_high', 'duration_short', 'duration_long', 'popular', 'name_asc', 'name_desc']).optional().default('relevance'),
  groupBy: z.enum(['category', 'city', 'rating', 'price_range']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10)
});

const globalSearchQuerySchema = z.object({
  q: z.string().max(100).optional().default(''),
  type: z.enum(['activity', 'city', 'all']).optional().default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10)
});

module.exports = {
  citySearchQuerySchema,
  activitySearchQuerySchema,
  globalSearchQuerySchema
};
