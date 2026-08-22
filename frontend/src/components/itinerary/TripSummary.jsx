import React from 'react';
import { Calendar, MapPin, DollarSign, Wallet, Compass, ChevronDown } from 'lucide-react';
import './TripSummary.css';

export const TripSummary = ({
  // Mode 1: Screen 5 Build Itinerary Workspace
  tripName,
  overallDates,
  stopCount = 0,
  totalBudget = '₹0',

  // Mode 2: Screen 9 Itinerary & Budget Overview
  trip,
  allTrips = [],
  onSelectTrip,
  currency = '₹',
  estimatedTotal = 35000,
}) => {
  // If `trip` object is passed, render Screen 9 Overview View
  if (trip) {
    return (
      <div className="gt-trip-summary-card animate-fade-in">
        <div className="gt-trip-summary-content">
          <div className="gt-trip-summary-header flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="gt-trip-summary-label">Trip Itinerary & Budget Overview</div>
              <h1 className="gt-trip-summary-title brand-serif">
                Itinerary for {trip.name}
              </h1>
              {trip.subtitle && <p className="gt-trip-summary-subtitle">{trip.subtitle}</p>}
            </div>

            {allTrips.length > 1 && (
              <div className="gt-trip-switcher-wrapper">
                <label htmlFor="gt-trip-select" className="sr-only">Switch Selected Trip</label>
                <div className="relative">
                  <select
                    id="gt-trip-select"
                    className="gt-trip-select-input"
                    value={trip.id}
                    onChange={(e) => onSelectTrip(e.target.value)}
                  >
                    {allTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.currency}{t.budgetLimit?.toLocaleString() || 'N/A'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="gt-trip-select-chevron" />
                </div>
              </div>
            )}
          </div>

          <div className="gt-trip-summary-chips">
            <div className="gt-summary-chip flex items-center gap-1">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{trip.dateRangeFormatted}</span>
            </div>

            <div className="gt-summary-chip flex items-center gap-1">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>{trip.destinationsCount} Destinations ({trip.destinations?.join(', ')})</span>
            </div>

            <div className="gt-summary-chip gt-summary-chip--highlight flex items-center gap-1">
              <Wallet className="w-4 h-4 text-amber-700" />
              <span className="font-bold">
                {currency}{estimatedTotal.toLocaleString()} Estimated Total
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Screen 5 Build Itinerary Workspace View
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
