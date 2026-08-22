import React from 'react';
import { Navbar } from '../layout/Navbar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, MapPin, Clock, DollarSign, Compass, ArrowLeft, CheckCircle2, Plus, Share2 } from 'lucide-react';
import './ItineraryBuilderScreen.css';

export const ItineraryBuilderScreen = ({ trip, currentUser, onNavigate }) => {
  if (!trip) return null;

  return (
    <div className="gt-itinerary-screen">
      <Navbar
        currentUser={currentUser}
        activeTab="trips"
        onNavigate={onNavigate}
        onOpenCreateTrip={() => onNavigate('create-trip')}
        onSwitchToAuth={onNavigate}
        onLogout={() => onNavigate('landing')}
      />

      <div className="gt-itinerary-container">
        {/* Top Back Navigation Bar */}
        <div className="gt-itinerary-top-bar flex justify-between items-center">
          <button
            type="button"
            className="gt-back-btn flex items-center gap-1"
            onClick={() => onNavigate('landing')}
          >
            <ArrowLeft className="gt-icon" />
            <span>Back to Main Dashboard</span>
          </button>

          <span className="gt-itinerary-badge flex items-center gap-1">
            <CheckCircle2 className="gt-icon" style={{ color: 'var(--color-success)' }} />
            <span>Itinerary Active</span>
          </span>
        </div>

        {/* Hero Header Card */}
        <Card maxWidth="xl" className="gt-itinerary-hero-card">
          <div className="gt-itinerary-hero flex justify-between items-start flex-wrap gap-4">
            <div className="flex-col gap-2">
              <span className="gt-itinerary-tag">Multi-City Itinerary Plan</span>
              <h1 className="gt-itinerary-title brand-serif">{trip.title}</h1>
              
              <div className="gt-itinerary-meta flex items-center gap-4 flex-wrap text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="gt-icon" /> {trip.destinations?.join(' → ') || 'Custom Route'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="gt-icon" /> {trip.dateRange}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="gt-icon" /> {trip.totalBudget || '$2,400'} Estimated
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={Share2}>
                Share Trip
              </Button>
              <Button variant="primary" size="sm" icon={Plus}>
                Add Activity
              </Button>
            </div>
          </div>
        </Card>

        {/* Day-by-Day Timeline */}
        <div className="gt-itinerary-body">
          <h2 className="gt-itinerary-section-title brand-serif">Day-by-Day Schedule & Activities</h2>
          
          <div className="gt-timeline flex-col gap-4">
            {/* Day 1 */}
            <div className="gt-timeline-day">
              <div className="gt-timeline-day-header flex items-center gap-2">
                <span className="gt-day-pill">Day 1</span>
                <h3>Arrival & Exploration</h3>
              </div>

              <div className="gt-timeline-events flex-col gap-3">
                {trip.activities && trip.activities.length > 0 ? (
                  trip.activities.map((act, index) => (
                    <div key={act.id || index} className="gt-event-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={act.image} alt={act.name} className="gt-event-img" />
                        <div className="flex-col">
                          <strong>{act.name}</strong>
                          <span className="text-xs text-muted">{act.city} • {act.category} • {act.duration}</span>
                        </div>
                      </div>
                      <span className="gt-event-cost text-xs font-semibold">{act.cost}</span>
                    </div>
                  ))
                ) : (
                  <div className="gt-event-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="gt-icon" style={{ color: 'var(--color-amber-600)' }} />
                      <div className="flex-col">
                        <strong>Check-in & City Orientation Walk</strong>
                        <span className="text-xs text-muted">Arrival • 2 hours</span>
                      </div>
                    </div>
                    <span className="gt-event-cost text-xs font-semibold">Included</span>
                  </div>
                )}
              </div>
            </div>

            {/* Day 2 */}
            <div className="gt-timeline-day">
              <div className="gt-timeline-day-header flex items-center gap-2">
                <span className="gt-day-pill">Day 2</span>
                <h3>Cultural Highlights & Guided Tour</h3>
              </div>
              <div className="gt-event-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Compass className="gt-icon" style={{ color: 'var(--color-amber-600)' }} />
                  <div className="flex-col">
                    <strong>Historic District Walking Exploration</strong>
                    <span className="text-xs text-muted">Guided Tour • 3.5 hours</span>
                  </div>
                </div>
                <span className="gt-event-cost text-xs font-semibold">$45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
