/**
 * REST API Service Layer for GlobeTrotter Search & Discovery (Screen 8)
 */

import { ACTIVITIES_DATA, SAMPLE_DESTINATIONS } from '../data/activitiesData';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Comprehensive Mock Cities Database
const CITIES_DATA = [
  {
    id: 'city-1',
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
    id: 'city-2',
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    description: 'Cultural capital of Japan famous for thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden machiya houses.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    popularity: 94,
    activitiesCount: 32,
    bestTime: 'Oct – Nov & Mar – Apr',
    avgCostPerDay: '¥15,000',
    topAttractions: ['Fushimi Inari Shrine', 'Kinkaku-ji Golden Pavilion', 'Arashiyama Bamboo Grove', 'Gion District'],
  },
  {
    id: 'city-3',
    name: 'Paris',
    country: 'France',
    region: 'Western Europe',
    description: 'Global center for art, fashion, gastronomy and culture. Iconic for cityscapes along the Seine River, museums, and street cafes.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    popularity: 98,
    activitiesCount: 45,
    bestTime: 'May – Sep',
    avgCostPerDay: '€180',
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre'],
  },
  {
    id: 'city-4',
    name: 'Bir Billing',
    country: 'India',
    region: 'North India',
    description: 'World-renowned paragliding capital in Himachal Pradesh surrounded by tea gardens and Tibetan monasteries.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    popularity: 88,
    activitiesCount: 14,
    bestTime: 'Oct – Jun',
    avgCostPerDay: '₹2,200',
    topAttractions: ['Billing Take-off Site', 'Chokling Monastery', 'Deer Park Institute', 'Bir Tea Factory'],
  },
  {
    id: 'city-5',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Southern Europe',
    description: 'Dramatic cliffside coastline featuring colorful fishing villages, pastel houses, lemon groves, and Mediterranean views.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    popularity: 91,
    activitiesCount: 18,
    bestTime: 'May – Oct',
    avgCostPerDay: '€220',
    topAttractions: ['Positano Village', 'Path of the Gods Hike', 'Ravello Gardens', 'Capri Boat Excursion'],
  },
  {
    id: 'city-6',
    name: 'Interlaken',
    country: 'Switzerland',
    region: 'Central Europe',
    description: 'Alpine adventure resort town tucked between Lake Thun and Lake Brienz under the Jungfrau mountain range.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    popularity: 93,
    activitiesCount: 20,
    bestTime: 'Jun – Sep & Dec – Mar',
    avgCostPerDay: 'CHF 210',
    topAttractions: ['Jungfraujoch Top of Europe', 'Harder Kulm Funicular', 'Trümmelbach Falls', 'Lake Brienz Cruise'],
  },
];

export const searchApi = {
  // GET /api/v1/activities
  async searchActivities({
    query = '',
    category = 'All',
    priceTier = 'All',
    minRating = 0,
    sortBy = 'Relevance',
    page = 1,
    limit = 6,
  } = {}) {
    await delay(300);

    let list = ACTIVITIES_DATA.map((act) => ({
      ...act,
      rating: act.rating || 4.8,
      reviewsCount: 124,
      bestTime: 'Year-round',
    }));

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (priceTier === 'Free') {
      list = list.filter((a) => a.costValue === 0 || a.cost.toLowerCase().includes('free'));
    } else if (priceTier === 'Under1k') {
      list = list.filter((a) => a.costValue <= 1000);
    } else if (priceTier === '1kTo3k') {
      list = list.filter((a) => a.costValue >= 1000 && a.costValue <= 3000);
    }

    if (minRating > 0) {
      list = list.filter((a) => a.rating >= minRating);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'Rating') return b.rating - a.rating;
      if (sortBy === 'Lowest Price') return a.costValue - b.costValue;
      if (sortBy === 'Highest Price') return b.costValue - a.costValue;
      return 0;
    });

    const totalCount = list.length;
    const startIndex = 0;
    const paginated = list.slice(startIndex, page * limit);

    return {
      success: true,
      totalCount,
      displayedCount: paginated.length,
      hasMore: paginated.length < totalCount,
      data: paginated,
    };
  },

  // GET /api/v1/cities
  async searchCities({
    query = '',
    region = 'All',
    sortBy = 'Relevance',
    page = 1,
    limit = 6,
  } = {}) {
    await delay(300);

    let list = [...CITIES_DATA];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (region !== 'All') {
      list = list.filter((c) => c.region.toLowerCase().includes(region.toLowerCase()));
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'Popularity') return b.popularity - a.popularity;
      if (sortBy === 'Name A–Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Name Z–A') return b.name.localeCompare(a.name);
      return 0;
    });

    const totalCount = list.length;
    const paginated = list.slice(0, page * limit);

    return {
      success: true,
      totalCount,
      displayedCount: paginated.length,
      hasMore: paginated.length < totalCount,
      data: paginated,
    };
  },
};
