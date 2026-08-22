import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Calendar, Plus, Check, Compass } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Add "${itemName}" to Trip`}>
      <div className="gt-add-to-trip-modal flex-col gap-4">
        <p className="text-sm">
          Select an active or upcoming travel itinerary to associate <strong>{itemName}</strong> with.
        </p>

        {userTrips.length > 0 ? (
          <div className="gt-trips-radio-list flex-col gap-2">
            {userTrips.map((trip) => (
              <label
                key={trip.id}
                className={`gt-trip-radio-card flex justify-between items-center ${
                  selectedTripId === trip.id ? 'gt-trip-radio-card--selected' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="selectedTrip"
                    value={trip.id}
                    checked={selectedTripId === trip.id}
                    onChange={() => setSelectedTripId(trip.id)}
                    className="gt-radio-input"
                  />
                  <div className="flex-col">
                    <strong className="text-sm">{trip.title || trip.name}</strong>
                    <span className="text-xs text-muted flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{trip.primaryLocation || trip.destinations?.[0] || 'Custom'}</span>
                      </span>
                      •
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{trip.dateRange || trip.startDate || 'Dates set'}</span>
                      </span>
                    </span>
                  </div>
                </div>

                {selectedTripId === trip.id && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </label>
            ))}
          </div>
        ) : (
          <div className="gt-no-trips-box text-center py-4">
            <p className="text-sm text-muted">No active trips available.</p>
            <p className="text-xs text-muted" style={{ marginTop: 2 }}>
              Create a travel itinerary first to add this destination/activity.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="gt-add-to-trip-footer flex justify-between items-center" style={{ marginTop: 8 }}>
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
