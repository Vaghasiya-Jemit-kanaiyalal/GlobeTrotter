import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Compass, IndianRupee, Calendar, Plus, CheckCircle2, Eye } from 'lucide-react';
import './CityDetailsModal.css';

export const CityDetailsModal = ({ city, isOpen, onClose, onAddToTrip, onViewActivities }) => {
  if (!isOpen || !city) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${city.name}, ${city.country}`} size="md">
      <div className="gt-city-modal-content flex flex-col gap-4">
        {/* 1. Cover Image Banner */}
        <div className="gt-city-modal-img-box">
          <img src={city.image} alt={city.name} className="gt-city-modal-img" />
          <span className="gt-city-modal-badge">{city.region || 'Asia'}</span>
        </div>

        {/* 2. Header & Overview Description */}
        <div className="flex flex-col gap-1 text-left">
          <h3 className="text-xl font-bold brand-serif text-navy-900 m-0 leading-tight">
            {city.name}, {city.country}
          </h3>
          <p className="text-xs sm:text-sm text-navy-800 m-0 leading-relaxed mt-1">
            {city.description}
          </p>
        </div>

        {/* 3. Center-Aligned Responsive 3-Column Stats Grid */}
        <div className="gt-city-modal-specs grid grid-cols-3 gap-2 text-center p-3 bg-subtle border border-border rounded-xl">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted font-medium">Best Season</span>
            <strong className="text-navy-900 font-bold text-xs sm:text-sm mt-0.5">{city.bestTime || 'Nov – Feb'}</strong>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-border/60 px-1">
            <span className="text-xs text-muted font-medium">Daily Budget</span>
            <strong className="text-amber-700 font-extrabold text-sm sm:text-base mt-0.5">{city.avgCostPerDay || '₹3,500'}</strong>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted font-medium">Activities</span>
            <strong className="text-navy-900 font-bold text-xs sm:text-sm mt-0.5">{city.activitiesCount || 24} Popular</strong>
          </div>
        </div>

        {/* 4. Left-Aligned Popular Attractions Section */}
        {city.topAttractions && (
          <div className="gt-city-modal-attractions text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted m-0 mb-2">Popular Attractions</h4>
            <div className="flex flex-wrap gap-2">
              {city.topAttractions.map((att) => (
                <span key={att} className="gt-city-attraction-tag flex items-center gap-1.5 text-xs px-2.5 py-1 bg-subtle border border-border rounded-md text-navy-800 font-medium">
                  <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span>{att}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 5. Footer Buttons - Aligned Horizontal Line at Bottom */}
        <div className="gt-city-modal-footer flex justify-between items-center pt-3 border-t border-border mt-2">
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
