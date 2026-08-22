import React from 'react';
import { Calendar, MapPin, DollarSign, Compass, Layers } from 'lucide-react';
import './TripSummary.css';

export const TripSummary = ({
  tripName,
  overallDates,
  stopCount = 0,
  totalBudget = '₹0',
  currency = '₹',
}) => {
  return (
    <div className="gt-trip-summary-card animate-fade-in">
      <div className="gt-trip-summary__header">
        <div className="gt-trip-summary__eyebrow flex items-center gap-1">
          <Compass className="gt-icon" />
          <span>Interactive Itinerary Workspace</span>
        </div>
        <h1 className="gt-trip-summary__title brand-serif">
          Build Your Itinerary
        </h1>
      </div>

      {/* Summary Specs Bar */}
      <div className="gt-trip-summary__bar flex items-center justify-between flex-wrap gap-4">
        <div className="gt-summary-spec">
          <span className="gt-summary-spec__label">Trip Name</span>
          <strong className="gt-summary-spec__value">{tripName || 'Untitled Journey'}</strong>
        </div>

        <div className="gt-summary-divider" />

        <div className="gt-summary-spec flex items-center gap-2">
          <Calendar className="gt-summary-spec__icon" />
          <div className="flex-col">
            <span className="gt-summary-spec__label">Date Range</span>
            <strong className="gt-summary-spec__value">{overallDates || '10 Sep – 19 Sep'}</strong>
          </div>
        </div>

        <div className="gt-summary-divider" />

        <div className="gt-summary-spec flex items-center gap-2">
          <MapPin className="gt-summary-spec__icon" />
          <div className="flex-col">
            <span className="gt-summary-spec__label">Travel Stops</span>
            <strong className="gt-summary-spec__value">{stopCount} {stopCount === 1 ? 'Destination' : 'Destinations'}</strong>
          </div>
        </div>

        <div className="gt-summary-divider" />

        <div className="gt-summary-spec flex items-center gap-2">
          <DollarSign className="gt-summary-spec__icon" />
          <div className="flex-col">
            <span className="gt-summary-spec__label">Estimated Budget</span>
            <strong className="gt-summary-spec__value gt-summary-spec__value--accent">{totalBudget}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
