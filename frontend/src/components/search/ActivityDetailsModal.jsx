import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Clock, DollarSign, Star, Plus, CheckCircle2 } from 'lucide-react';
import './ActivityDetailsModal.css';

export const ActivityDetailsModal = ({ activity, isOpen, onClose, onAddToTrip }) => {
  if (!isOpen || !activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity.name}>
      <div className="gt-act-modal-content flex-col gap-4">
        {/* Cover Image */}
        <div className="gt-act-modal-img-box">
          <img src={activity.image} alt={activity.name} className="gt-act-modal-img" />
          <span className="gt-act-modal-badge">{activity.category}</span>
        </div>

        {/* Header Specs */}
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <div className="gt-act-modal-location flex items-center gap-1 text-xs">
              <MapPin className="gt-icon" />
              <span>{activity.city}, {activity.country}</span>
            </div>
            <h3 className="text-xl font-bold brand-serif" style={{ marginTop: 2 }}>{activity.name}</h3>
          </div>

          <span className="gt-act-modal-rating flex items-center gap-1">
            <Star className="gt-icon fill-amber-500 text-amber-500" style={{ width: 14, height: 14 }} />
            <strong>{activity.rating || 4.8} / 5.0</strong> ({activity.reviewsCount || 124} reviews)
          </span>
        </div>

        {/* Specs Bar */}
        <div className="gt-act-modal-specs-bar grid grid-cols-3 gap-2 text-center py-2">
          <div className="flex-col">
            <span className="text-xs text-muted">Estimated Cost</span>
            <strong className="text-amber-700">{activity.cost}</strong>
          </div>
          <div className="flex-col">
            <span className="text-xs text-muted">Duration</span>
            <strong>{activity.duration}</strong>
          </div>
          <div className="flex-col">
            <span className="text-xs text-muted">Best Time</span>
            <strong>{activity.bestTime || 'Year-round'}</strong>
          </div>
        </div>

        {/* Full Description */}
        <div className="gt-act-modal-desc-box">
          <h4 className="text-xs font-bold uppercase text-muted" style={{ marginBottom: 4 }}>About Activity</h4>
          <p className="text-sm leading-relaxed">{activity.description}</p>
        </div>

        {/* Highlights List */}
        <div className="gt-act-modal-highlights">
          <h4 className="text-xs font-bold uppercase text-muted" style={{ marginBottom: 6 }}>Key Highlights</h4>
          <ul className="flex-col gap-1 text-xs">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-amber-600" /> Professional guided experience</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-amber-600" /> Safety equipment included</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-amber-600" /> Flexible cancellation policy</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="gt-act-modal-footer flex justify-between items-center" style={{ marginTop: 12 }}>
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
