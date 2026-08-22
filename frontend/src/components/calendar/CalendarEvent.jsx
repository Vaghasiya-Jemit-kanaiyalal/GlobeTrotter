import React from 'react';
import { Compass, MapPin, Plane, Home, Clock, Tag } from 'lucide-react';
import './CalendarEvent.css';

export const CalendarEvent = ({
  event,
  onSelectEvent,
  compact = false,
}) => {
  const isTrip = event.type === 'trip';
  const isTravel = event.type === 'travel';
  const isStay = event.type === 'stay';
  const isActivity = event.type === 'activity';

  const getIcon = () => {
    if (isTrip) return <Compass className="w-3 h-3 flex-shrink-0" />;
    if (isTravel) return <Plane className="w-3 h-3 flex-shrink-0" />;
    if (isStay) return <Home className="w-3 h-3 flex-shrink-0" />;
    return <Tag className="w-3 h-3 flex-shrink-0" />;
  };

  return (
    <div
      className={`gt-cal-event-pill gt-cal-event-pill--${event.type}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectEvent(event);
      }}
      title={`${event.title}${event.cost ? ` (${event.currency}${event.cost.toLocaleString()})` : ''}`}
    >
      <span className="gt-event-icon-wrapper">{getIcon()}</span>
      <span className="gt-event-title-text truncate">{event.title}</span>
      {event.time && !compact && <span className="gt-event-time-badge">{event.time}</span>}
    </div>
  );
};
