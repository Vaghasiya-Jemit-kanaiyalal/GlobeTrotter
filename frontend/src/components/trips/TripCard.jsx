import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  MoreVertical,
  Edit2,
  Share2,
  Copy,
  Trash2,
  Compass,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { TripProgress } from './TripProgress';
import './TripCard.css';

export const TripCard = ({
  trip,
  onViewTrip,
  onContinuePlanning,
  onEditTrip,
  onShareTrip,
  onPlanSimilarTrip,
  onDeleteTrip,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const status = trip.calculatedStatus || trip.status || 'Upcoming';
  const isOngoing = status === 'Ongoing';
  const isUpcoming = status === 'Upcoming';
  const isCompleted = status === 'Completed';

  return (
    <article className={`gt-universal-trip-card gt-trip-card--${status.toLowerCase()}`}>
      {/* Cover Image */}
      <div className="gt-trip-card__image-box" onClick={() => onViewTrip(trip)}>
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="gt-trip-card__img"
          loading="lazy"
        />

        {/* Dynamic Status Badge */}
        <span className={`gt-trip-card__status-badge gt-status-badge--${status.toLowerCase()}`}>
          {isOngoing && <Compass className="gt-icon animate-spin" style={{ animationDuration: '6s' }} />}
          {isUpcoming && <Clock className="gt-icon" />}
          {isCompleted && <CheckCircle2 className="gt-icon" />}
          <span>{status}</span>
        </span>

        {/* Days remaining badge if Upcoming */}
        {isUpcoming && trip.daysUntilStart !== undefined && (
          <span className="gt-trip-card__days-remaining">
            Starts in {trip.daysUntilStart} {trip.daysUntilStart === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="gt-trip-card__body">
        {/* Three-Dot Menu & Location */}
        <div className="flex justify-between items-start">
          <div className="gt-trip-card__location flex items-center gap-1">
            <MapPin className="gt-icon" />
            <span>{trip.primaryLocation || trip.destinations?.[0] || 'Custom Destination'}</span>
          </div>

          <div className="gt-card-menu-container">
            <button
              type="button"
              className="gt-card-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Trip actions"
            >
              <MoreVertical className="gt-icon" />
            </button>

            {menuOpen && (
              <div className="gt-three-dot-menu animate-fade-in" style={{ right: 0 }}>
                <button
                  type="button"
                  className="gt-three-dot-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onEditTrip(trip);
                  }}
                >
                  <Edit2 className="gt-icon" />
                  <span>Edit Trip</span>
                </button>

                <button
                  type="button"
                  className="gt-three-dot-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onShareTrip(trip);
                  }}
                >
                  <Share2 className="gt-icon" />
                  <span>Share Trip</span>
                </button>

                <button
                  type="button"
                  className="gt-three-dot-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onPlanSimilarTrip(trip);
                  }}
                >
                  <Copy className="gt-icon" />
                  <span>Plan Similar Trip</span>
                </button>

                <div className="gt-user-dropdown__divider" />

                <button
                  type="button"
                  className="gt-three-dot-item gt-three-dot-item--danger"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteTrip(trip);
                  }}
                >
                  <Trash2 className="gt-icon" />
                  <span>Delete Trip</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="gt-trip-card__title" onClick={() => onViewTrip(trip)}>
          {trip.title}
        </h3>

        {/* Date Range */}
        <div className="gt-trip-card__date flex items-center gap-1 text-xs">
          <Calendar className="gt-icon" />
          <span>{trip.dateRange}</span>
        </div>

        {/* Dynamic Progress Bar if Ongoing */}
        {isOngoing && trip.progress && (
          <TripProgress
            currentDay={trip.progress.currentDay}
            totalDays={trip.progress.totalDays}
            percentage={trip.progress.percentage}
          />
        )}

        {/* Specs: Destinations, Activities, Budget */}
        <div className="gt-trip-card__specs-row flex justify-between items-center text-xs">
          <span>
            {trip.destinationCount || 1} {trip.destinationCount === 1 ? 'Destination' : 'Destinations'} • {trip.activitiesCount || 0} Activities
          </span>
          <strong className="gt-trip-card__budget font-semibold">
            {trip.totalBudget}
          </strong>
        </div>

        {/* Context-Specific Action Buttons */}
        <div className="gt-trip-card__actions-bar flex gap-2">
          {isOngoing && (
            <>
              <Button variant="outline" size="sm" fullWidth onClick={() => onViewTrip(trip)}>
                View Itinerary
              </Button>
              <Button variant="primary" size="sm" fullWidth onClick={() => onContinuePlanning(trip)}>
                Continue Planning
              </Button>
            </>
          )}

          {isUpcoming && (
            <>
              <Button variant="outline" size="sm" fullWidth onClick={() => onViewTrip(trip)}>
                View Trip
              </Button>
              <Button variant="secondary" size="sm" fullWidth onClick={() => onContinuePlanning(trip)}>
                Edit Itinerary
              </Button>
            </>
          )}

          {isCompleted && (
            <>
              <Button variant="outline" size="sm" fullWidth onClick={() => onViewTrip(trip)}>
                View Itinerary
              </Button>
              <Button variant="primary" size="sm" fullWidth onClick={() => onPlanSimilarTrip(trip)}>
                Plan Similar
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
