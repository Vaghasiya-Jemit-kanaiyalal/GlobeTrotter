import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Compass, IndianRupee, Calendar, Plus, CheckCircle2, Eye } from 'lucide-react';
import './CityDetailsModal.css';

export const CityDetailsModal = ({ city, isOpen, onClose, onAddToTrip, onViewActivities }) => {
  if (!isOpen || !city) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${city.name}, ${city.country}`}>
      <div className="gt-city-modal-content flex-col gap-4">
        {/* Cover Image */}
        <div className="gt-city-modal-img-box">
          <img src={city.image} alt={city.name} className="gt-city-modal-img" />
          <span className="gt-city-modal-badge">{city.region || 'Asia'}</span>
        </div>

        {/* Title & Specs */}
        <div>
          <h3 className="text-xl font-bold brand-serif">{city.name}, {city.country}</h3>
          <p className="text-sm text-muted" style={{ marginTop: 2 }}>{city.description}</p>
        </div>

        {/* Specs Grid */}
        <div className="gt-city-modal-specs grid grid-cols-3 gap-2 text-center py-2">
          <div className="flex-col">
            <span className="text-xs text-muted">Best Season</span>
            <strong>{city.bestTime || 'Nov – Feb'}</strong>
          </div>
          <div className="flex-col">
            <span className="text-xs text-muted">Daily Budget</span>
            <strong className="text-amber-700">{city.avgCostPerDay || '₹3,500'}</strong>
          </div>
          <div className="flex-col">
            <span className="text-xs text-muted">Activities</span>
            <strong>{city.activitiesCount || 24} Popular</strong>
          </div>
        </div>

        {/* Top Attractions List */}
        {city.topAttractions && (
          <div className="gt-city-modal-attractions">
            <h4 className="text-xs font-bold uppercase text-muted" style={{ marginBottom: 6 }}>Popular Attractions</h4>
            <div className="flex flex-wrap gap-2">
              {city.topAttractions.map((att) => (
                <span key={att} className="gt-city-attraction-tag flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{att}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="gt-city-modal-footer flex justify-between items-center" style={{ marginTop: 12 }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            {onViewActivities && (
              <Button
                variant="secondary"
                size="sm"
                icon={Eye}
                onClick={() => {
                  onClose();
                  onViewActivities(city.name);
                }}
              >
                View Activities
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                onClose();
                onAddToTrip(city);
              }}
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
