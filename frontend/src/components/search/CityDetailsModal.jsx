import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Compass, IndianRupee, Calendar, Plus, CheckCircle2, Eye } from 'lucide-react';
import './CityDetailsModal.css';

export const CityDetailsModal = ({ city, isOpen, onClose, onAddToTrip, onViewActivities }) => {
  if (!isOpen || !city) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${city.name}, ${city.country}`} size="lg">
      <div className="gt-city-modal-content flex flex-col gap-4">
        {/* Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column: Image & Attractions */}
          <div className="flex flex-col gap-3">
            <div className="gt-city-modal-img-box">
              <img src={city.image} alt={city.name} className="gt-city-modal-img" />
              <span className="gt-city-modal-badge">{city.region || 'Asia'}</span>
            </div>

            {/* Top Attractions List */}
            {city.topAttractions && (
              <div className="gt-city-modal-attractions p-3 bg-subtle rounded-lg border border-border">
                <h4 className="text-xs font-bold uppercase text-muted mb-2">Popular Attractions</h4>
                <div className="flex flex-wrap gap-1.5">
                  {city.topAttractions.map((att) => (
                    <span key={att} className="gt-city-attraction-tag flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{att}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Specs & Description */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-xl font-bold brand-serif text-navy-900 m-0">{city.name}, {city.country}</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">{city.description}</p>
            </div>

            {/* Specs Grid */}
            <div className="gt-city-modal-specs grid grid-cols-3 gap-2 text-center py-2.5 px-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted">Best Season</span>
                <strong className="text-navy-900 text-xs font-semibold">{city.bestTime || 'Nov – Feb'}</strong>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted">Daily Budget</span>
                <strong className="text-amber-700 font-bold text-sm">{city.avgCostPerDay || '₹3,500'}</strong>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted">Activities</span>
                <strong className="text-navy-900 text-xs font-semibold">{city.activitiesCount || 24} Popular</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="gt-city-modal-footer flex justify-between items-center pt-3 border-t border-border mt-1">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            {onViewActivities && (
              <Button
                variant="outline"
                icon={Eye}
                onClick={() => {
                  onClose();
                  onViewActivities(city);
                }}
              >
                View Activities
              </Button>
            )}
            <Button
              variant="primary"
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
