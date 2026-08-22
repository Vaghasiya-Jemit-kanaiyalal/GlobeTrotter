import React, { useState, useEffect } from 'react';
import { Compass, Calendar, MapPin, Plus, Image, Sparkles, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import './CreateTripModal.css';

const COVER_PRESETS = [
  { id: 'c1', name: 'Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
  { id: 'c2', name: 'Kyoto', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  { id: 'c3', name: 'Amalfi', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80' },
  { id: 'c4', name: 'Banff', url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80' },
  { id: 'c5', name: 'Santorini', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80' },
];

export const CreateTripModal = ({ isOpen, onClose, onCreateTrip, initialCity = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    cities: '',
    startDate: '',
    endDate: '',
    travelStyle: 'Cultural & Historic',
    description: '',
    coverImage: COVER_PRESETS[0].url,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCity) {
      setFormData((prev) => ({
        ...prev,
        title: `${initialCity} Exploration`,
        cities: initialCity,
      }));
    }
  }, [initialCity, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Trip name is required';
    }
    if (!formData.cities.trim()) {
      newErrors.cities = 'Please enter at least one destination city';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const cityList = formData.cities
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    // Format date display
    const formatDateStr = (d) => {
      try {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (e) {
        return d;
      }
    };

    const newTrip = {
      id: `trip-${Date.now()}`,
      title: formData.title,
      coverImage: formData.coverImage,
      dateRange: `${formatDateStr(formData.startDate)} – ${formatDateStr(formData.endDate)}`,
      destinationCount: cityList.length || 1,
      destinations: cityList,
      status: 'Upcoming',
      summary: formData.description || `Custom ${formData.travelStyle} itinerary covering ${cityList.join(', ')}.`,
      activitiesCount: Math.floor(Math.random() * 6) + 4,
      totalBudget: '$2,500',
    };

    setTimeout(() => {
      setLoading(false);
      onCreateTrip(newTrip);
      onClose();
      // Reset form
      setFormData({
        title: '',
        cities: '',
        startDate: '',
        endDate: '',
        travelStyle: 'Cultural & Historic',
        description: '',
        coverImage: COVER_PRESETS[0].url,
      });
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plan a New Multi-City Trip">
      <form onSubmit={handleSubmit} className="gt-create-trip-form" noValidate>
        <p className="text-sm">
          Set up your personalized travel journey. You can add cities, schedule daily itineraries, and track budgets.
        </p>

        {/* Trip Title */}
        <Input
          id="trip-title"
          label="Trip Name"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g. Grand Iberian Expedition, Nordic Aurora Quest"
          error={errors.title}
          required
        />

        {/* Destination Cities */}
        <Input
          id="trip-cities"
          label="Destination Cities (comma-separated)"
          value={formData.cities}
          onChange={(e) => handleChange('cities', e.target.value)}
          placeholder="e.g. Madrid, Seville, Lisbon"
          icon={MapPin}
          error={errors.cities}
          helperText="Enter all the cities you want to visit on this trip in order."
          required
        />

        {/* Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="trip-start-date"
            label="Departure Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            error={errors.startDate}
            required
          />

          <Input
            id="trip-end-date"
            label="Return Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            error={errors.endDate}
            required
          />
        </div>

        {/* Travel Style */}
        <Select
          id="trip-style"
          label="Primary Travel Style"
          value={formData.travelStyle}
          onChange={(e) => handleChange('travelStyle', e.target.value)}
          options={[
            { value: 'Cultural & Historic', label: 'Cultural & Historic' },
            { value: 'Nature & Adventure', label: 'Nature & Adventure' },
            { value: 'Coastal & Islands', label: 'Coastal & Islands' },
            { value: 'Road Trip & Exploration', label: 'Road Trip & Exploration' },
            { value: 'Relaxed Leisure', label: 'Relaxed Leisure' },
          ]}
        />

        {/* Cover Photo Presets */}
        <div className="gt-cover-presets-section">
          <span className="gt-field__label">Choose Cover Photo</span>
          <div className="gt-cover-presets-grid">
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`gt-cover-preset-btn ${formData.coverImage === preset.url ? 'gt-cover-preset-btn--active' : ''}`}
                onClick={() => handleChange('coverImage', preset.url)}
              >
                <img src={preset.url} alt={preset.name} />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description / Notes */}
        <Textarea
          id="trip-notes"
          label="Trip Notes & Goals (Optional)"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="e.g. Focus on architectural landmarks, wine tastings, and scenic railway journeys..."
          rows={2}
        />

        {/* Action Controls */}
        <div className="gt-create-trip__footer flex justify-between items-center">
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={Compass}
          >
            Create Itinerary
          </Button>
        </div>
      </form>
    </Modal>
  );
};
