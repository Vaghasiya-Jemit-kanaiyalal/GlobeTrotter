/**
 * REST API Service Layer for GlobeTrotter Trips Management
 */

import { INITIAL_TRIPS_DATA } from '../data/tripsData';

// Simulated API latency
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Calculate dynamic status based on dates
export const calculateTripStatus = (startDateStr, endDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Upcoming';
  }

  if (today < start) {
    return 'Upcoming';
  } else if (today >= start && today <= end) {
    return 'Ongoing';
  } else {
    return 'Completed';
  }
};

// Helper: Calculate days remaining or progress
export const calculateTripProgress = (startDateStr, endDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const totalTime = end.getTime() - start.getTime();
  const elapsedTime = today.getTime() - start.getTime();

  const totalDays = Math.max(1, Math.ceil(totalTime / (1000 * 60 * 60 * 24)) + 1);
  const currentDay = Math.max(1, Math.min(totalDays, Math.ceil(elapsedTime / (1000 * 60 * 60 * 24)) + 1));
  const percentage = Math.min(100, Math.max(0, Math.round((currentDay / totalDays) * 100)));

  return { totalDays, currentDay, percentage };
};

export const calculateDaysUntilStart = (startDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDateStr);
  const diffTime = start.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// Simulated Trips Data Store
let tripsStore = [
  {
    id: 'trip-ongoing-1',
    title: 'Goa Coastal Exploration',
    primaryLocation: 'Goa, India',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-08-20',
    endDate: '2026-08-28',
    dateRange: '20 Aug – 28 Aug 2026',
    destinationCount: 3,
    destinations: ['Panaji', 'Calangute', 'Palolem'],
    activitiesCount: 8,
    totalBudget: '₹35,000',
    summary: 'Active 8-day beach and heritage tour covering Sinquerim fort and spice plantations.',
  },
  {
    id: 'trip-upcoming-1',
    title: 'Parisian Classical Capitals',
    primaryLocation: 'Paris, France',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    dateRange: '15 Oct – 22 Oct 2026',
    destinationCount: 1,
    destinations: ['Paris'],
    activitiesCount: 6,
    totalBudget: '₹85,000',
    summary: 'Autumn getaway to Paris featuring Louvre museum tickets and Versailles day trip.',
  },
  {
    id: 'trip-completed-1',
    title: 'Rajasthan Heritage Road Trip',
    primaryLocation: 'Rajasthan, India',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-03-12',
    endDate: '2026-03-20',
    dateRange: '12 Mar – 20 Mar 2026',
    destinationCount: 4,
    destinations: ['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'],
    activitiesCount: 12,
    totalBudget: '₹42,000',
    summary: 'Completed 8-day desert fort safari and palace hotel tour across Rajasthan.',
  },
  {
    id: 'trip-completed-2',
    title: 'Kyoto & Tokyo Discovery',
    primaryLocation: 'Kyoto, Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    startDate: '2025-11-05',
    endDate: '2025-11-17',
    dateRange: '05 Nov – 17 Nov 2025',
    destinationCount: 3,
    destinations: ['Tokyo', 'Hakone', 'Kyoto'],
    activitiesCount: 14,
    totalBudget: '¥380,000',
    summary: 'Autumn foliage tour spanning Tokyo neon districts, Mount Fuji onsen, and Kyoto shrines.',
  },
];

export const tripApi = {
  // GET /api/v1/trips
  async getTrips({ status = 'All', search = '', sortBy = 'Newest' } = {}) {
    await delay(250);

    let result = tripsStore.map((t) => ({
      ...t,
      calculatedStatus: calculateTripStatus(t.startDate, t.endDate),
      progress: calculateTripProgress(t.startDate, t.endDate),
      daysUntilStart: calculateDaysUntilStart(t.startDate),
    }));

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.primaryLocation.toLowerCase().includes(q) ||
          t.destinations.some((d) => d.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (status !== 'All') {
      result = result.filter((t) => t.calculatedStatus.toLowerCase() === status.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'Oldest') return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === 'Start Date') return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === 'End Date') return new Date(a.endDate) - new Date(b.endDate);
      if (sortBy === 'Trip Name') return a.title.localeCompare(b.title);
      return 0;
    });

    return {
      success: true,
      totalCount: result.length,
      ongoingCount: result.filter((t) => t.calculatedStatus === 'Ongoing').length,
      upcomingCount: result.filter((t) => t.calculatedStatus === 'Upcoming').length,
      completedCount: result.filter((t) => t.calculatedStatus === 'Completed').length,
      data: result,
    };
  },

  // GET /api/v1/trips/:id
  async getTripById(id) {
    await delay(150);
    const trip = tripsStore.find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found');
    return {
      success: true,
      data: {
        ...trip,
        calculatedStatus: calculateTripStatus(trip.startDate, trip.endDate),
        progress: calculateTripProgress(trip.startDate, trip.endDate),
      },
    };
  },

  // POST /api/v1/trips
  async createTrip(data) {
    await delay(300);
    const newTrip = {
      id: `trip-${Date.now()}`,
      title: data.title,
      primaryLocation: data.primaryLocation || data.destinations?.[0] || 'Custom Destination',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      startDate: data.startDate || '2026-10-01',
      endDate: data.endDate || '2026-10-08',
      dateRange: data.dateRange || '01 Oct – 08 Oct 2026',
      destinationCount: data.destinations?.length || 1,
      destinations: data.destinations || ['Custom Destination'],
      activitiesCount: data.activitiesCount || 4,
      totalBudget: data.totalBudget || '₹25,000',
      summary: data.summary || 'Custom itinerary plan.',
    };
    tripsStore = [newTrip, ...tripsStore];
    return { success: true, data: newTrip };
  },

  // PUT /api/v1/trips/:id
  async updateTrip(id, updatedData) {
    await delay(300);
    tripsStore = tripsStore.map((t) => (t.id === id ? { ...t, ...updatedData } : t));
    return { success: true, message: 'Trip updated successfully' };
  },

  // DELETE /api/v1/trips/:id
  async deleteTrip(id) {
    await delay(300);
    tripsStore = tripsStore.filter((t) => t.id !== id);
    return { success: true, message: 'Trip deleted successfully' };
  },

  // POST /api/v1/trips/:id/share
  async shareTrip(id) {
    await delay(150);
    return {
      success: true,
      shareUrl: `http://localhost:5173/share/trip/${id}`,
    };
  },
};
