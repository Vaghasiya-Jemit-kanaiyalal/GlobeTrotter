import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Calendar, MapPin, Clock, Compass, Calculator } from 'lucide-react';
import './DayDetails.css';

export const DayDetails = ({
  dayObj,
  events = [],
  isOpen,
  onClose,
  onViewItinerary,
  onSelectEvent,
}) => {
  if (!dayObj) return null;

  const dayTotal = events.reduce((acc, evt) => {
    const costNum = typeof evt.cost === 'number' ? evt.cost : parseFloat(evt.cost) || 0;
    return acc + costNum;
  }, 0);

  const currency = events[0]?.currency || '₹';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule for ${dayObj.dateString}`}
      size="medium"
    >
      <div className="gt-day-details-content flex flex-col gap-3">
        {/* Date Header */}
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div>
              <div className="font-bold text-navy-900">{dayObj.dateString}</div>
              <div className="text-xs text-muted">Selected Calendar Date</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted block">Day Total</span>
            <span className="font-extrabold text-base text-amber-700">
              {currency}{dayTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Events Schedule Table */}
        <h4 className="font-bold text-sm text-navy-900 m-0">Scheduled Items ({events.length})</h4>

        {events.length === 0 ? (
          <div className="p-4 text-center bg-subtle rounded-lg text-sm text-muted">
            No specific activities scheduled for this date.
          </div>
        ) : (
          <div className="gt-day-details-list flex flex-col gap-2">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="gt-day-detail-item flex items-center justify-between p-2.5 bg-white border border-border rounded-lg cursor-pointer hover:border-amber-600 transition-all"
                onClick={() => {
                  onClose();
                  onSelectEvent(evt);
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="gt-detail-time text-xs font-bold text-navy-700 w-16">
                    {evt.time || 'All Day'}
                  </span>
                  <div>
                    <div className="font-semibold text-sm text-navy-900">{evt.title}</div>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600 inline" />
                      {evt.city || evt.destination || 'Scheduled Destination'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-navy-800">
                    {evt.cost ? `${evt.currency || '₹'}${evt.cost.toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            icon={Compass}
            onClick={() => {
              onClose();
              onViewItinerary();
            }}
          >
            View Full Itinerary (Screen 9)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
