import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Clock, IndianRupee, Star, Plus, CheckCircle2 } from 'lucide-react';
import './ActivityDetailsModal.css';

export const ActivityDetailsModal = ({ activity, isOpen, onClose, onAddToTrip }) => {
  if (!isOpen || !activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity.name} size="lg">
      <div className="gt-act-modal-content flex flex-col gap-4">
        {/* Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left Column: Image & Highlights */}
          <div className="flex flex-col gap-3">
            <div className="gt-act-modal-img-box">
              <img src={activity.image} alt={activity.name} className="gt-act-modal-img" />
              <span className="gt-act-modal-badge">{activity.category}</span>
            </div>

            {/* Key Highlights List */}
            <div className="gt-act-modal-highlights p-3 bg-subtle rounded-lg border border-border">
              <h4 className="text-xs font-bold uppercase text-muted" style={{ marginBottom: 6 }}>Key Highlights</h4>
              <ul className="flex flex-col gap-1.5 text-xs text-navy-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> Professional guided experience</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> Safety equipment included</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> Flexible cancellation policy</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Title, Rating, Specs & Description */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="gt-act-modal-location flex items-center gap-1 text-xs mb-1">
                <MapPin className="gt-icon" />
                <span>{activity.city}, {activity.country}</span>
              </div>
              <h3 className="text-xl font-bold brand-serif text-navy-900 m-0">{activity.name}</h3>
              
              <div className="mt-2 flex items-center gap-2">
                <span className="gt-act-modal-rating flex items-center gap-1">
                  <Star className="gt-icon fill-amber-500 text-amber-500" style={{ width: 14, height: 14 }} />
                  <strong>{activity.rating || 4.8} / 5.0</strong> ({activity.reviewsCount || 124} reviews)
                </span>
              </div>
            </div>

            {/* Specs Bar */}
            <div className="gt-act-modal-specs-bar grid grid-cols-3 gap-2 text-center py-2.5 px-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted">Estimated Cost</span>
                <strong className="text-amber-700 font-bold text-sm">{activity.cost}</strong>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted">Duration</span>
                <strong className="text-navy-900 text-xs font-semibold">{activity.duration}</strong>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted">Best Time</span>
                <strong className="text-navy-900 text-xs font-semibold">{activity.bestTime || 'Year-round'}</strong>
              </div>
            </div>

            {/* About Activity Description */}
            <div className="gt-act-modal-desc-box p-3">
              <h4 className="text-xs font-bold uppercase text-muted mb-1">About Activity</h4>
              <p className="text-xs leading-relaxed text-navy-800 m-0">{activity.description}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="gt-act-modal-footer flex justify-between items-center pt-3 border-t border-border mt-1">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              onClose();
              onAddToTrip(activity);
            }}
          >
            Add to Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};
