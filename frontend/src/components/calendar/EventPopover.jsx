import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, DollarSign, Compass, Tag, Plane, Home } from 'lucide-react';
import './EventPopover.css';

export const EventPopover = ({
  event,
  isOpen,
  onClose,
  onViewTrip,
}) => {
  if (!event) return null;

  const isTrip = event.type === 'trip';
  const isTravel = event.type === 'travel';
  const isStay = event.type === 'stay';
  const isActivity = event.type === 'activity';

  const getTypeBadge = () => {
    if (isTrip) return <span className="gt-popover-badge gt-popover-badge--trip">Multi-Day Trip</span>;
    if (isTravel) return <span className="gt-popover-badge gt-popover-badge--travel">Flight / Travel</span>;
    if (isStay) return <span className="gt-popover-badge gt-popover-badge--stay">Hotel / Stay</span>;
    return <span className="gt-popover-badge gt-popover-badge--activity">{event.category || 'Activity'}</span>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      size="medium"
    >
      <div className="gt-event-popover-content flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {getTypeBadge()}
          {event.cost !== undefined && (
            <span className="font-extrabold text-base text-amber-700">
              {event.currency || '₹'}{typeof event.cost === 'number' ? event.cost.toLocaleString() : event.cost}
            </span>
          )}
        </div>

        <h3 className="font-bold text-xl text-navy-900 brand-serif m-0">{event.title}</h3>

        <div className="gt-popover-meta-list flex flex-col gap-2 p-3 bg-subtle rounded-lg text-sm text-navy-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Date:</strong> {event.startDate && event.endDate && event.startDate !== event.endDate ? `${event.startDate} – ${event.endDate}` : (event.date || event.startDate)}
            </span>
          </div>

          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><strong>Time:</strong> {event.time}</span>
            </div>
          )}

          {(event.destination || event.city) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><strong>Location:</strong> {event.city || event.destination}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-navy-700 m-0 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            icon={Compass}
            onClick={() => {
              onClose();
              onViewTrip(event.tripId || 'trip-goa');
            }}
          >
            View Trip (Screen 9)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
