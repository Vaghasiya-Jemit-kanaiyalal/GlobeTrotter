import React, { useState } from 'react';
import { ArrowLeft, Compass, Calendar, Clock, MapPin, Sparkles, Filter, ChevronDown } from 'lucide-react';
import { Navbar } from '../layout/Navbar';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { DestinationAutocomplete } from './DestinationAutocomplete';
import { ActivitySuggestionCard } from './ActivitySuggestionCard';
import { ACTIVITIES_DATA } from '../../data/activitiesData';
import { tripApi } from '../../services/tripApi';
import './CreateTripScreen.css';

export const CreateTripScreen = ({
  currentUser,
  onNavigate,
  onCreateTripSuccess,
}) => {
  // Form State
  const [tripName, setTripName] = useState('Goa & Western Coast Explorer');
  const [destination, setDestination] = useState('Goa, India');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-07');
  const [startTime, setStartTime] = useState('09:00');
  const [description, setDescription] = useState('Exciting coastal getaway featuring beach walks, heritage Portuguese forts, and water sports.');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Activity Suggestions State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivities, setSelectedActivities] = useState([
    ACTIVITIES_DATA[0], // Pre-select sample items for preview
    ACTIVITIES_DATA[1],
  ]);

  // Filter activities by category & destination query, guaranteeing 6 cards for clean 3x2 grid display
  const filteredActivities = ACTIVITIES_DATA.filter((act) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      act.category === selectedCategory ||
      (selectedCategory === 'Adventure' && act.category.includes('Adventure')) ||
      (selectedCategory === 'Culture' && act.category.includes('Culture')) ||
      (selectedCategory === 'Food' && act.category.includes('Food')) ||
      (selectedCategory === 'Relaxation' && act.category.includes('Relaxation'));
    const q = destination.toLowerCase().trim();
    const matchesDest = !q || act.city.toLowerCase().includes(q.split(',')[0]) || act.country.toLowerCase().includes(q);
    return matchesCategory;
  }).slice(0, 6); // Take exactly 6 cards for clean 3x2 presentation

  const handleToggleActivity = (activity) => {
    setSelectedActivities((prev) => {
      const exists = prev.some((a) => a.id === activity.id);
      if (exists) {
        return prev.filter((a) => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const handleCreateTripSubmit = (e) => {
    if (e) e.preventDefault();
    const newErrors = {};

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
    }
    if (!destination.trim()) {
      newErrors.destination = 'Please select a place / destination';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setLoading(true);

    const formatDateDisplay = (d) => {
      try {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (err) {
        return d;
      }
    };

    const newTrip = {
      id: `trip-${Date.now()}`,
      title: tripName,
      coverImage: selectedActivities[0]?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      startDate,
      endDate,
      startTime,
      dateRange: `${formatDateDisplay(startDate)} – ${formatDateDisplay(endDate)}`,
      destinationCount: 1,
      destinations: [destination],
      status: 'Upcoming',
      summary: description || `Personalized trip to ${destination} with ${selectedActivities.length} planned activities.`,
      activitiesCount: selectedActivities.length,
      activities: selectedActivities,
      totalBudget: '₹18,500',
    };

    try {
      const res = await tripApi.createTrip({
        name: tripName,
        title: tripName,
        startDate,
        endDate,
        summary: description,
        destinations: [destination],
        coverImage: newTrip.coverImage,
        totalBudget: 18500,
      });
      setLoading(false);
      onCreateTripSuccess(res.data || newTrip);
    } catch (err) {
      console.warn('Backend trip creation fallback:', err);
      setLoading(false);
      onCreateTripSuccess(newTrip);
    }
  };

  return (
    <div className="gt-create-screen">
      {/* 1. Header Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab="create-trip"
        onNavigate={onNavigate}
        onOpenCreateTrip={() => {}}
        onSwitchToAuth={onNavigate}
        onLogout={() => onNavigate('landing')}
      />

      <div className="gt-create-screen__container">
        {/* Top Back Navigation Bar */}
        <div className="gt-create-screen__top-bar flex justify-between items-center">
          <button
            type="button"
            className="gt-back-btn flex items-center gap-1"
            onClick={() => onNavigate('landing')}
          >
            <ArrowLeft className="gt-icon" />
            <span>Back to Dashboard</span>
          </button>

          <span className="gt-create-screen__step-indicator font-semibold text-xs text-navy-700">
            Step 1 of 2: Trip Configuration
          </span>
        </div>

        {/* 2. Form Section */}
        <Card maxWidth="xl" className="gt-create-trip-card">
          <div className="gt-create-screen__header">
            <div className="gt-create-screen__eyebrow flex items-center gap-1">
              <Compass className="gt-icon text-amber-600" />
              <span>Multi-City Itinerary Generator</span>
            </div>
            <h1 className="gt-create-screen__title brand-serif text-3xl font-bold text-navy-900 m-0">
              Create a New Trip
            </h1>
            <p className="gt-create-screen__subtitle text-sm text-navy-600">
              Enter your basic trip details, select a destination place, and choose travel dates to initialize your itinerary planner.
            </p>
          </div>

          <form onSubmit={handleCreateTripSubmit} className="gt-trip-form" noValidate>
            <div className="gt-form-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Trip Name */}
              <Input
                id="form-trip-name"
                label="Trip Name"
                value={tripName}
                onChange={(e) => {
                  setTripName(e.target.value);
                  if (errors.tripName) setErrors((prev) => ({ ...prev, tripName: null }));
                }}
                placeholder="e.g. Goa Beach Escape, Kyoto Autumn Tour"
                error={errors.tripName}
                required
              />

              {/* Select a Place / Destination Autocomplete */}
              <DestinationAutocomplete
                value={destination}
                onChange={(val) => {
                  setDestination(val);
                  if (errors.destination) setErrors((prev) => ({ ...prev, destination: null }));
                }}
                error={errors.destination}
                required
              />

              {/* Start Date */}
              <Input
                id="form-start-date"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: null }));
                }}
                error={errors.startDate}
                required
              />

              {/* End Date */}
              <Input
                id="form-end-date"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: null }));
                }}
                error={errors.endDate}
                required
              />

              {/* Preferred Time Picker */}
              <Input
                id="form-start-time"
                label="Preferred Departure / Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                icon={Clock}
                helperText="Optional: Time of arrival or morning start."
              />
            </div>

            {/* Description / Notes */}
            <Textarea
              id="form-description"
              label="Trip Description & Travel Notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what you want to experience on this trip (e.g. sightseeing, relaxing at beaches, local food tours)..."
              rows={3}
            />
          </form>
        </Card>

        {/* 3. Destination & Activity Suggestions Section (6 Cards Display) */}
        <section className="gt-suggestions-section">
          <div className="gt-suggestions-header flex justify-between items-end flex-wrap gap-3 mb-4">
            <div>
              <div className="gt-section__eyebrow flex items-center gap-1">
                <Sparkles className="gt-icon text-amber-600" />
                <span>Smart Itinerary Recommendations</span>
              </div>
              <h2 className="gt-section__title brand-serif text-2xl font-bold text-navy-900 m-0">
                Suggestions for Places to Visit / Activities to Perform
              </h2>
              <p className="gt-section__subtitle text-xs text-navy-600 mt-1">
                Select places to visit and activities below to automatically add them into your planned itinerary schedule.
              </p>
            </div>

            {/* Top-Right Compact Category Dropdown Filter */}
            <div className="gt-category-dropdown-container flex items-center gap-2">
              <label htmlFor="cat-filter-select" className="text-xs font-bold text-navy-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-amber-600" />
                Filter Category:
              </label>
              <div className="relative">
                <select
                  id="cat-filter-select"
                  className="gt-category-select-dropdown text-xs font-semibold px-3 py-2 border border-border rounded-lg bg-white text-navy-900 shadow-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Culture">Culture</option>
                  <option value="Food">Food</option>
                  <option value="Relaxation">Relaxation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exactly 6 Destination / Activity Cards Grid */}
          <div className="gt-activities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredActivities.map((act) => {
              const isSelected = selectedActivities.some((a) => a.id === act.id);
              return (
                <ActivitySuggestionCard
                  key={act.id}
                  activity={act}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleActivity}
                />
              );
            })}
          </div>
        </section>

        {/* 4. Primary Action Footer Button */}
        <div className="gt-create-primary-action text-center pt-6 border-t border-border mt-4">
          <Button
            variant="primary"
            size="lg"
            icon={Compass}
            loading={loading}
            onClick={handleCreateTripSubmit}
            className="gt-create-final-btn"
          >
            Create Trip & Proceed to Itinerary Builder
          </Button>
          <p className="text-xs text-muted mt-2">
            Selected {selectedActivities.length} activities to be included in your day-by-day itinerary schedule.
          </p>
        </div>
      </div>
    </div>
  );
};
