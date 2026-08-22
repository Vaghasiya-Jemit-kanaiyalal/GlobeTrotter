import React from 'react';
import { Calendar, MapPin, CheckCircle, Clock, ArrowRight, Layers } from 'lucide-react';
import './TripCard.css';

export const TripCard = ({ trip, onViewTrip }) => {
  const isCompleted = trip.status === 'Completed';

  return (
    <article className="gt-trip-card" onClick={() => onViewTrip(trip)}>
      {/* Cover Image */}
      <div className="gt-trip-card__image-box">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="gt-trip-card__img"
          loading="lazy"
        />
        
        {/* Status Badge */}
        <span
          className={`gt-trip-card__status-badge ${
            isCompleted ? 'gt-trip-card__status-badge--completed' : 'gt-trip-card__status-badge--upcoming'
          }`}
        >
          {isCompleted ? <CheckCircle className="gt-icon" /> : <Clock className="gt-icon" />}
          <span>{trip.status}</span>
        </span>

        {/* Cities Count Pill */}
        <span className="gt-trip-card__dest-count">
          <MapPin className="gt-icon" />
          <span>{trip.destinationCount} {trip.destinationCount === 1 ? 'City' : 'Cities'}</span>
        </span>
      </div>

      {/* Card Content */}
      <div className="gt-trip-card__body">
        <div className="gt-trip-card__date flex items-center gap-1">
          <Calendar className="gt-icon" />
          <span>{trip.dateRange}</span>
        </div>

        <h3 className="gt-trip-card__title">{trip.title}</h3>

        <p className="gt-trip-card__summary">{trip.summary}</p>

        {/* Route preview */}
        {trip.destinations && trip.destinations.length > 0 && (
          <div className="gt-trip-card__route">
            <span className="gt-trip-card__route-label">Route:</span>
            <span className="gt-trip-card__route-cities">
              {trip.destinations.join(' → ')}
            </span>
          </div>
        )}

        {/* Footer info & action */}
        <div className="gt-trip-card__footer flex justify-between items-center">
          <span className="gt-trip-card__meta">
            {trip.activitiesCount ? `${trip.activitiesCount} Activities` : 'Custom Itinerary'}
          </span>

          <button
            type="button"
            className="gt-trip-card__view-btn flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewTrip(trip);
            }}
          >
            <span>View Trip</span>
            <ArrowRight className="gt-icon" />
          </button>
        </div>
      </div>
    </article>
  );
};
