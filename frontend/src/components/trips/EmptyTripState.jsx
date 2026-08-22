import React from 'react';
import { Compass, Calendar, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import './EmptyTripState.css';

export const EmptyTripState = ({ status = 'upcoming', onPlanTrip }) => {
  const configs = {
    ongoing: {
      title: 'No ongoing trips',
      subtitle: 'Your active journeys currently underway will appear here.',
      icon: Compass,
      showCta: false,
    },
    upcoming: {
      title: 'No upcoming trips',
      subtitle: 'Ready for your next adventure? Start planning a new itinerary.',
      icon: Calendar,
      showCta: true,
    },
    completed: {
      title: 'No completed trips yet',
      subtitle: 'Your finished travel itineraries will be archived here.',
      icon: CheckCircle2,
      showCta: false,
    },
  };

  const current = configs[status.toLowerCase()] || configs.upcoming;
  const IconComponent = current.icon;

  return (
    <div className="gt-empty-section-card animate-fade-in">
      <div className="gt-empty-section-icon flex items-center justify-center">
        <IconComponent className="gt-icon" />
      </div>
      <h4 className="gt-empty-section-title">{current.title}</h4>
      <p className="gt-empty-section-subtitle text-xs">{current.subtitle}</p>
      {current.showCta && onPlanTrip && (
        <Button variant="primary" size="sm" icon={Plus} onClick={onPlanTrip} style={{ marginTop: 8 }}>
          Plan a Trip
        </Button>
      )}
    </div>
  );
};
