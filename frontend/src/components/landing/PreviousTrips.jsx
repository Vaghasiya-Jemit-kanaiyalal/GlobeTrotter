import React, { useState } from 'react';
import { Calendar, Plus, Compass, Sparkles, MapPin, Eye, EyeOff } from 'lucide-react';
import { TripCard } from './TripCard';
import { Button } from '../ui/Button';
import './PreviousTrips.css';

export const PreviousTrips = ({
  trips = [],
  onPlanTrip,
  onViewTrip,
}) => {
  const [showEmptyStatePreview, setShowEmptyStatePreview] = useState(false);

  const displayedTrips = (showEmptyStatePreview ? [] : trips).slice(0, 3);

  return (
    <section id="previous-trips" className="gt-section gt-trips-section">
      <div className="gt-section__container">
        {/* Section Header */}
        <div className="gt-section__header flex justify-between items-end">
          <div>
            <div className="gt-section__eyebrow flex items-center gap-1">
              <Calendar className="gt-icon" />
              <span>Itinerary Archive & Active Journeys</span>
            </div>
            <h2 className="gt-section__title brand-serif">
              Previous Trips
            </h2>
            <p className="gt-section__subtitle">
              Review your completed multi-city travel records, revisit itinerary details, and manage upcoming routes.
            </p>
          </div>

          {/* Quick controls: Empty State Preview toggle & Plan Trip Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              className="gt-empty-state-toggle-btn"
              onClick={() => setShowEmptyStatePreview(!showEmptyStatePreview)}
              title="Toggle to test empty state view"
            >
              {showEmptyStatePreview ? <Eye className="gt-icon" /> : <EyeOff className="gt-icon" />}
              <span>{showEmptyStatePreview ? 'Show Sample Trips' : 'Simulate Empty State'}</span>
            </button>

            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={onPlanTrip}
            >
              New Trip
            </Button>
          </div>
        </div>

        {/* Trips Grid or Empty State */}
        {displayedTrips.length > 0 ? (
          <div className="gt-trips-grid">
            {displayedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onViewTrip={onViewTrip}
              />
            ))}
          </div>
        ) : (
          /* Classical Empty State */
          <div className="gt-trips-empty animate-fade-in">
            <div className="gt-trips-empty__compass-badge">
              <Compass className="gt-trips-empty__icon" />
            </div>
            <h3 className="gt-trips-empty__title">No trips yet</h3>
            <p className="gt-trips-empty__subtitle">
              Start planning your first journey. Organize destinations, build custom day-by-day itineraries, and keep all travel details in one place.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={onPlanTrip}
              className="gt-trips-empty__cta"
            >
              Plan a Trip
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
