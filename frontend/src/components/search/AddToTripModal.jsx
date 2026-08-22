import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Calendar, Plus, Check } from 'lucide-react';
import './AddToTripModal.css';

export const AddToTripModal = ({
  itemToAdd,
  isOpen,
  onClose,
  userTrips = [],
  onConfirmAddToTrip,
  onCreateNewTrip,
}) => {
  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !itemToAdd) return null;

  const itemName = itemToAdd.name || itemToAdd.city || 'Item';

  const handleAdd = () => {
    if (!selectedTripId) return;
    setIsAdding(true);
    const targetTrip = userTrips.find((t) => t.id === selectedTripId) || userTrips[0];
    setTimeout(() => {
      setIsAdding(false);
      onConfirmAddToTrip(itemToAdd, targetTrip);
      onClose();
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add "${itemName}" to Trip`} size="md">
      <div className="gt-add-to-trip-modal flex flex-col gap-4 text-left">
        {/* Left-Aligned Subtitle Description */}
        <p className="text-sm text-navy-800 m-0 leading-relaxed text-left">
          Select an active or upcoming travel itinerary to associate <strong className="text-navy-900">{itemName}</strong> with.
        </p>

        {userTrips.length > 0 ? (
          <div className="gt-trips-radio-list flex flex-col gap-3">
            {userTrips.map((trip) => (
              <label
                key={trip.id}
                className={`gt-trip-radio-card flex justify-between items-center gap-3 w-full text-left ${
                  selectedTripId === trip.id ? 'gt-trip-radio-card--selected' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="radio"
                    name="selectedTrip"
                    value={trip.id}
                    checked={selectedTripId === trip.id}
                    onChange={() => setSelectedTripId(trip.id)}
                    className="gt-radio-input flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1 min-w-0 flex-1 text-left">
                    <strong className="text-sm text-navy-900 font-bold truncate block">
                      {trip.title || trip.name}
                    </strong>
                    <div className="text-xs text-muted flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{trip.primaryLocation || trip.destinations?.[0] || 'Custom Location'}</span>
                      </span>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{trip.dateRange || trip.startDate || 'Flexible Dates'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTripId === trip.id && (
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0 ml-2" />
                )}
              </label>
            ))}
          </div>
        ) : (
          <div className="gt-no-trips-box text-center py-6">
            <p className="text-sm font-semibold text-navy-900 m-0">No active trips available.</p>
            <p className="text-xs text-muted mt-1 m-0">
              Create a travel itinerary first to add this destination/activity.
            </p>
          </div>
        )}

        {/* Footer Actions - Perfectly Aligned Horizontal Bottom Line */}
        <div className="gt-add-to-trip-footer flex justify-between items-center pt-3 border-t border-border mt-2">
          <Button variant="outline" size="sm" icon={Plus} onClick={onCreateNewTrip}>
            Create New Trip
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!selectedTripId || userTrips.length === 0 || isAdding}
            loading={isAdding}
            onClick={handleAdd}
          >
            Add to Selected Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};
