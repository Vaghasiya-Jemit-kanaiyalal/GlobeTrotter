import React from 'react';
import { Calendar, MapPin, Wallet, ChevronDown, Compass } from 'lucide-react';
import './TripSummary.css';

export const TripSummary = ({
  trip,
  allTrips = [],
  onSelectTrip,
  currency = '₹',
  estimatedTotal = 35000,
}) => {
  if (!trip) return null;

  return (
    <div className="gt-trip-summary-card">
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

        {/* Compact Metadata Summary Line */}
        <div className="gt-trip-summary-chips">
          <div className="gt-summary-chip">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>{trip.dateRangeFormatted}</span>
          </div>

          <div className="gt-summary-chip">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>{trip.destinationsCount} Destinations ({trip.destinations.join(', ')})</span>
          </div>

          <div className="gt-summary-chip gt-summary-chip--highlight">
            <Wallet className="w-4 h-4 text-amber-700" />
            <span className="font-bold">
              {currency}{estimatedTotal.toLocaleString()} Estimated Total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
