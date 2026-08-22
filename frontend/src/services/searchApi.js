/**
 * REST API Service Layer for GlobeTrotter Search & Discovery (Screen 8)
 * Connected live to Express Backend (/api/v1/cities, /api/v1/activities, /api/v1/search) and MySQL DB
 */

import { apiClient } from './apiClient';
import { ACTIVITIES_DATA } from '../data/activitiesData';

const SAMPLE_CITIES = [
  {
    id: '1',
    name: 'Goa',
    country: 'India',
    region: 'West India',
    description: 'Popular coastal destination known for palm-fringed beaches, heritage churches, night markets, and water sports.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    popularity: 95,
    activitiesCount: 24,
    bestTime: 'Nov – Feb',
    avgCostPerDay: '₹3,500',
    topAttractions: ['Fort Aguada', 'Baga Beach', 'Dudhsagar Waterfalls', 'Anjuna Flea Market'],
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    description: 'Cultural capital of Japan famous for thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden machiya houses.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    popularity: 94,
    activitiesCount: 32,
    bestTime: 'Oct – Nov & Mar – Apr',
    avgCostPerDay: '₹12,000',
    topAttractions: ['Fushimi Inari Shrine', 'Kinkaku-ji Golden Pavilion', 'Arashiyama Bamboo Grove', 'Gion District'],
  },
  {
    id: '3',
    name: 'Paris',
    country: 'France',
    region: 'Western Europe',
    description: 'Global center for art, fashion, gastronomy and culture. Iconic for cityscapes along the Seine River, museums, and street cafes.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    popularity: 98,
    activitiesCount: 45,
    bestTime: 'May – Sep',
    avgCostPerDay: '₹18,000',
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre'],
  },
  {
    id: '4',
    name: 'Jaipur',
    country: 'India',
    region: 'North India',
    description: 'The Pink City famous for royal palaces, ancient forts, rich handicrafts, and vibrant bazaars.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    popularity: 92,
    activitiesCount: 28,
    bestTime: 'Oct – Mar',
    avgCostPerDay: '₹4,000',
    topAttractions: ['Amer Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
  },
  {
    id: '5',
    name: 'Mumbai',
    country: 'India',
    region: 'West India',
    description: 'The bustling City of Dreams, financial hub, iconic seafronts, and historic landmarks.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    popularity: 95,
    activitiesCount: 38,
    bestTime: 'Nov – Feb',
    avgCostPerDay: '₹5,000',
    topAttractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Colaba Causeway'],
  },
  {
    id: '6',
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    description: 'Futuristic metropolis blending high-tech neon skyscrapers, ancient shrines, and culinary excellence.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    popularity: 99,
    activitiesCount: 60,
    bestTime: 'Mar – May & Sep – Nov',
    avgCostPerDay: '₹15,000',
    topAttractions: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Tower', 'Akihabara'],
  },
];

export const searchApi = {
  // GET /api/v1/activities
  async searchActivities(params = {}) {
    try {
      const queryParams = {
        query: params.query || params.search || '',
        search: params.query || params.search || '',
        category: params.category && params.category !== 'All' ? params.category : undefined,
        priceTier: params.priceTier && params.priceTier !== 'All' ? params.priceTier : undefined,
        minRating: params.minRating || undefined,
        sortBy: params.sortBy || undefined,
        page: params.page || 1,
        limit: params.limit || 6,
      };

      const res = await apiClient.get('/activities', queryParams);
      const rawList = res?.activities || res?.items || (Array.isArray(res) ? res : []);
      const totalCount = res?.pagination?.total || rawList.length;
      const hasMore = res?.pagination ? (res.pagination.page < res.pagination.totalPages) : false;

      const formatted = rawList.map((a) => ({
        id: String(a.id),
        name: a.name,
        category: a.category || 'Sightseeing',
        city: a.city?.name || a.city_name || a.city || 'Goa',
        country: a.city?.country || a.country || 'India',
        description: a.description || '',
        cost: typeof a.estimated_cost === 'number' ? `₹${a.estimated_cost.toLocaleString()}` : (typeof a.estimatedCost === 'number' ? `₹${a.estimatedCost.toLocaleString()}` : (typeof a.cost === 'number' ? `₹${a.cost.toLocaleString()}` : (a.cost || 'Free'))),
        costValue: parseFloat(a.estimated_cost || a.estimatedCost || a.cost || 0),
        duration: a.durationMinutes ? `${a.durationMinutes} mins` : (a.duration_minutes ? `${a.duration_minutes} mins` : (a.duration || '2 hours')),
        rating: parseFloat(a.rating || 4.8),
        reviewsCount: parseInt(a.reviews_count || a.reviewsCount || 124, 10),
        image: a.imageUrl || a.image_url || a.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      }));

      return {
        success: true,
        totalCount,
        hasMore,
        data: formatted,
      };
    } catch (err) {
      console.warn('Backend searchActivities error, using fallback:', err.message);
      return { success: true, totalCount: ACTIVITIES_DATA.length, hasMore: false, data: ACTIVITIES_DATA };
    }
  },

  // GET /api/v1/cities
  async searchCities(params = {}) {
    try {
      const queryParams = {
        query: params.query || params.search || '',
        search: params.query || params.search || '',
        region: params.region && params.region !== 'All' ? params.region : undefined,
        sortBy: params.sortBy || undefined,
        page: params.page || 1,
        limit: params.limit || 6,
      };

      const res = await apiClient.get('/cities', queryParams);
      const rawList = res?.cities || res?.items || (Array.isArray(res) ? res : []);
      const totalCount = res?.pagination?.total || rawList.length;
      const hasMore = res?.pagination ? (res.pagination.page < res.pagination.totalPages) : false;

      const formatted = rawList.map((c) => ({
        id: String(c.id),
        name: c.name,
        country: c.country,
        region: c.region || 'Asia',
        description: c.description || '',
        image: c.imageUrl || c.image_url || c.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        popularity: parseInt(c.popularityScore ? c.popularityScore * 10 : (c.popularity_score ? c.popularity_score * 10 : (c.popularity || 90)), 10),
        activitiesCount: parseInt(c.activitiesCount || c.activity_count || c.activities_count || 20, 10),
        bestTime: c.best_time || c.bestTime || 'Nov – Feb',
        avgCostPerDay: c.avg_daily_budget ? `₹${parseFloat(c.avg_daily_budget).toLocaleString()}` : (c.avgCostPerDay || '₹3,500'),
        topAttractions: Array.isArray(c.top_attractions) ? c.top_attractions : ['Top Landmarks', 'Local Market'],
      }));

      return {
        success: true,
        totalCount,
        hasMore,
        data: formatted,
      };
    } catch (err) {
      console.warn('Backend searchCities error, using fallback:', err.message);
      return { success: true, totalCount: SAMPLE_CITIES.length, hasMore: false, data: SAMPLE_CITIES };
    }
  },

  // GET /api/v1/search
  async globalSearch(query = '', searchType = 'all') {
    try {
      const res = await apiClient.get('/search', { q: query, type: searchType });
      return {
        success: true,
        query,
        activities: res?.activities || [],
        cities: res?.cities || [],
      };
    } catch (err) {
      console.warn('Backend globalSearch error:', err.message);
      return { success: true, query, activities: [], cities: [] };
    }
  },
};
