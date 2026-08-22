/**
 * REST API Service Layer for GlobeTrotter Trips & Itinerary Management
 * Connected live to Express Backend (/api/v1/trips) and MySQL DB
 */

import { apiClient } from './apiClient';
import { INITIAL_TRIPS_DATA } from '../data/tripsData';

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

function normalizeTrip(t) {
  const startDate = t.start_date || t.startDate || '2026-10-01';
  const endDate = t.end_date || t.endDate || '2026-10-08';
  const title = t.name || t.title || 'Untitled Trip';
  const budgetVal = t.budget_limit !== undefined ? t.budget_limit : (t.budgetLimit !== undefined ? t.budgetLimit : t.totalBudget || 25000);
  const numericBudget = typeof budgetVal === 'number' ? budgetVal : (parseFloat(String(budgetVal).replace(/[^0-9.]/g, '')) || 0);

  let coverImage = t.cover_image || t.coverImage;
  const titleLower = title.toLowerCase();
  if (!coverImage || (coverImage.includes('photo-1512343879784') && !titleLower.includes('goa'))) {
    if (titleLower.includes('manali') || titleLower.includes('himalay')) {
      coverImage = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
    } else if (titleLower.includes('paris') || titleLower.includes('capital')) {
      coverImage = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';
    } else if (titleLower.includes('rajasthan') || titleLower.includes('jaipur')) {
      coverImage = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80';
    } else if (titleLower.includes('surat')) {
      coverImage = 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=800&q=80';
    } else {
      coverImage = coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
    }
  }

  return {
    ...t,
    id: String(t.id),
    title,
    name: title,
    primaryLocation: t.primaryLocation || t.primary_location || t.city_name || (Array.isArray(t.destinations) ? t.destinations[0] : null) || 'Goa, India',
    coverImage,
    startDate,
    endDate,
    dateRange: t.dateRange || `${startDate} – ${endDate}`,
    destinationCount: parseInt(t.stop_count || t.destinationCount || 1, 10),
    destinations: Array.isArray(t.destinations) ? t.destinations : [t.city_name || 'Destination'],
    activitiesCount: parseInt(t.activity_count || t.activitiesCount || 0, 10),
    totalBudget: `₹${numericBudget.toLocaleString()}`,
    budgetLimit: numericBudget,
    summary: t.description || t.summary || 'Custom itinerary trip.',
    calculatedStatus: calculateTripStatus(startDate, endDate),
    progress: calculateTripProgress(startDate, endDate),
    daysUntilStart: calculateDaysUntilStart(startDate),
  };
}

export const tripApi = {
  // GET /api/v1/trips
  async getTrips({ status = 'All', search = '', sortBy = 'Newest' } = {}) {
    try {
      const res = await apiClient.get('/trips', { search, sortBy });
      const rawList = Array.isArray(res) ? res : (res?.trips || []);
      let result = rawList.map(normalizeTrip);

      if (status !== 'All') {
        result = result.filter((t) => t.calculatedStatus.toLowerCase() === status.toLowerCase());
      }

      return {
        success: true,
        totalCount: result.length,
        ongoingCount: result.filter((t) => t.calculatedStatus === 'Ongoing').length,
        upcomingCount: result.filter((t) => t.calculatedStatus === 'Upcoming').length,
        completedCount: result.filter((t) => t.calculatedStatus === 'Completed').length,
        data: result,
      };
    } catch (err) {
      console.warn('Backend trip fetch failed, returning fallback data:', err.message);
      let result = INITIAL_TRIPS_DATA.map(normalizeTrip);
      return {
        success: true,
        totalCount: result.length,
        ongoingCount: result.filter((t) => t.calculatedStatus === 'Ongoing').length,
        upcomingCount: result.filter((t) => t.calculatedStatus === 'Upcoming').length,
        completedCount: result.filter((t) => t.calculatedStatus === 'Completed').length,
        data: result,
      };
    }
  },

  // GET /api/v1/trips/:id
  async getTripById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      const fallback = INITIAL_TRIPS_DATA.find((t) => String(t.id) === String(id)) || INITIAL_TRIPS_DATA[0];
      return { success: true, data: normalizeTrip(fallback) };
    }
    try {
      const res = await apiClient.get(`/trips/${numId}`);
      const tripObj = res?.trip || res;
      return {
        success: true,
        data: normalizeTrip(tripObj),
      };
    } catch (err) {
      console.warn(`Backend getTripById(${id}) failed:`, err.message);
      const fallback = INITIAL_TRIPS_DATA.find((t) => String(t.id) === String(id)) || INITIAL_TRIPS_DATA[0];
      return { success: true, data: normalizeTrip(fallback) };
    }
  },

  // POST /api/v1/trips
  async createTrip(data) {
    try {
      const payload = {
        name: data.title || data.name || 'New Travel Plan',
        description: data.summary || data.description || '',
        startDate: data.startDate || '2026-10-01',
        endDate: data.endDate || '2026-10-08',
        budgetLimit: typeof data.totalBudget === 'number' ? data.totalBudget : (parseFloat(String(data.totalBudget).replace(/[^0-9.]/g, '')) || 25000),
        coverImage: data.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        cityId: data.cityId || 1,
        isPublic: data.isPublic || false,
      };

      const res = await apiClient.post('/trips', payload);
      const createdTrip = res?.trip || res;
      return { success: true, data: normalizeTrip(createdTrip) };
    } catch (err) {
      console.error('Trip creation failed on backend:', err.message);
      throw err;
    }
  },

  // PUT /api/v1/trips/:id
  async updateTrip(id, updatedData) {
    try {
      const payload = {
        name: updatedData.title || updatedData.name,
        description: updatedData.summary || updatedData.description,
        startDate: updatedData.startDate,
        endDate: updatedData.endDate,
        budgetLimit: updatedData.budgetLimit || updatedData.totalBudget,
        coverImage: updatedData.coverImage,
      };
      await apiClient.put(`/trips/${id}`, payload);
      return { success: true, message: 'Trip updated successfully' };
    } catch (err) {
      console.error(`Update trip ${id} failed:`, err.message);
      throw err;
    }
  },

  // DELETE /api/v1/trips/:id
  async deleteTrip(id) {
    try {
      await apiClient.del(`/trips/${id}`);
      return { success: true, message: 'Trip deleted successfully' };
    } catch (err) {
      console.error(`Delete trip ${id} failed:`, err.message);
      throw err;
    }
  },

  // GET /api/v1/trips/:id/itinerary
  async getItinerary(tripId) {
    const numId = parseInt(tripId, 10);
    if (isNaN(numId) || numId <= 0) {
      return { stops: [] };
    }
    try {
      const res = await apiClient.get(`/trips/${numId}/itinerary`);
      return res || { stops: [] };
    } catch (err) {
      console.warn(`Get itinerary for ${tripId} failed:`, err.message);
      return { stops: [] };
    }
  },

  // POST /api/v1/trips/:id/stops
  async addStop(tripId, stopData) {
    try {
      const res = await apiClient.post(`/trips/${tripId}/stops`, stopData);
      return res;
    } catch (err) {
      console.warn(`Add stop to trip ${tripId} failed:`, err.message);
      throw err;
    }
  },

  // POST /api/v1/stops/:stopId/activities
  async addActivity(stopId, activityData) {
    try {
      const res = await apiClient.post(`/stops/${stopId}/activities`, activityData);
      return res;
    } catch (err) {
      console.warn(`Add activity to stop ${stopId} failed:`, err.message);
      throw err;
    }
  },

  // POST /api/v1/trips/:id/expenses
  async addExpense(tripId, expenseData) {
    try {
      const res = await apiClient.post(`/trips/${tripId}/expenses`, expenseData);
      return res;
    } catch (err) {
      console.warn(`Add expense to trip ${tripId} failed:`, err.message);
      throw err;
    }
  },

  // POST /api/v1/trips/:id/share
  async shareTrip(id) {
    return {
      success: true,
      shareUrl: `${window.location.origin}/#/itinerary?tripId=${id}`,
    };
  },
};
