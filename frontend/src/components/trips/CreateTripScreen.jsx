import React, { useState } from 'react';
import { ArrowLeft, Compass, Calendar, Clock, MapPin, Sparkles, Filter } from 'lucide-react';
import { Navbar } from '../layout/Navbar';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { DestinationAutocomplete } from './DestinationAutocomplete';
import { ActivitySuggestionCard } from './ActivitySuggestionCard';
import { SelectedActivitiesDrawer } from './SelectedActivitiesDrawer';
import { ACTIVITIES_DATA, ACTIVITY_CATEGORIES } from '../../data/activitiesData';
import './CreateTripScreen.css';

export const CreateTripScreen = ({
  currentUser,
  onNavigate,
  onCreateTripSuccess,
}) => {
  // Form State
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Activity Suggestions State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivities, setSelectedActivities] = useState([
    ACTIVITIES_DATA[0], // Pre-select 1st sample item (Fort Aguada) for realistic demo preview
  ]);

  // Filter activities by category & destination query
  const filteredActivities = ACTIVITIES_DATA.filter((act) => {
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const q = destination.toLowerCase().trim();
    const matchesDest = !q || act.city.toLowerCase().includes(q) || act.country.toLowerCase().includes(q);
    return matchesCategory && matchesDest;
  });

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
      newErrors.destination = 'Please select or enter a destination';
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
      coverImage: selectedActivities[0]?.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
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
      totalBudget: '$2,400',
    };

    setTimeout(() => {
      setLoading(false);
      onCreateTripSuccess(newTrip);
    }, 900);
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

          <span className="gt-create-screen__step-indicator">
            Step 1 of 2: Trip Configuration
          </span>
        </div>

        {/* 2. Form Section */}
        <Card maxWidth="xl" className="gt-create-trip-card">
          <div className="gt-create-screen__header">
            <div className="gt-create-screen__eyebrow flex items-center gap-1">
              <Compass className="gt-icon" />
              <span>Multi-City Itinerary Generator</span>
            </div>
            <h1 className="gt-create-screen__title brand-serif">
              Plan a New Trip
            </h1>
            <p className="gt-create-screen__subtitle">
              Enter your basic trip details, dates, and destination to initialize your itinerary planner.
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

              {/* Destination Autocomplete */}
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
                label="Preferred Start / Departure Time"
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
              label="Trip Description & Notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what you want to experience on this trip (e.g. sightseeing, relaxing at beaches, local food tours)..."
              rows={3}
            />
          </form>
        </Card>

        {/* 3. Destination & Activity Suggestions Section */}
        <section className="gt-suggestions-section">
          <div className="gt-suggestions-header flex justify-between items-end flex-wrap gap-3">
            <div>
              <div className="gt-section__eyebrow flex items-center gap-1">
                <Sparkles className="gt-icon" />
                <span>Smart Itinerary Recommendations</span>
              </div>
              <h2 className="gt-section__title brand-serif">
                Suggestions for Places to Visit / Activities to Perform
              </h2>
              <p className="gt-section__subtitle">
                Select places to visit and activities to automatically add them into your itinerary schedule.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="gt-category-pills flex gap-2 flex-wrap">
              {ACTIVITY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`gt-category-pill ${selectedCategory === cat ? 'gt-category-pill--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Cards Grid */}
          <div className="gt-activities-grid">
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
        <div className="gt-create-primary-action text-center">
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
          <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
            Next step: Organize day-by-day routes and activity timelines.
          </p>
        </div>
      </div>

      {/* Selected Items Floating Drawer */}
      <SelectedActivitiesDrawer
        selectedActivities={selectedActivities}
        onRemoveActivity={handleToggleActivity}
        onCreateTripClick={handleCreateTripSubmit}
      />
    </div>
  );
};
