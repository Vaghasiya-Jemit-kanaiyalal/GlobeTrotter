import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Clock, IndianRupee, Star, Plus, CheckCircle2 } from 'lucide-react';
import './ActivityDetailsModal.css';

export const ActivityDetailsModal = ({ activity, isOpen, onClose, onAddToTrip }) => {
  if (!isOpen || !activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity.name} size="md">
      <div className="gt-act-modal-content flex flex-col gap-4">
        {/* 1. Cover Image Banner */}
        <div className="gt-act-modal-img-box">
          <img src={activity.image} alt={activity.name} className="gt-act-modal-img" />
          <span className="gt-act-modal-badge">{activity.category}</span>
        </div>

        {/* 2. Location, Title & Rating Header */}
        <div className="flex justify-between items-start gap-3 flex-wrap text-left">
          <div className="flex flex-col gap-1 text-left flex-1">
            <div className="gt-act-modal-location flex items-center gap-1.5 text-xs text-navy-600 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{activity.city}, {activity.country}</span>
            </div>
            <h3 className="text-xl font-bold brand-serif text-navy-900 m-0 leading-tight">
              {activity.name}
            </h3>
          </div>

          <div className="gt-act-modal-rating flex items-center gap-1.5 px-3 py-1 bg-subtle border border-border rounded-full text-xs text-navy-800 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
            <span><strong>{activity.rating || 4.8}</strong> / 5.0</span>
            <span className="text-muted ml-0.5">({activity.reviewsCount || 124} reviews)</span>
          </div>
        </div>

        {/* 3. Center-Aligned Responsive 3-Column Stats Grid */}
        <div className="gt-act-modal-specs-bar grid grid-cols-3 gap-2 text-center p-3 bg-subtle border border-border rounded-xl">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted font-medium">Estimated Cost</span>
            <strong className="text-amber-700 font-extrabold text-sm sm:text-base mt-0.5">{activity.cost}</strong>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-border/60 px-1">
            <span className="text-xs text-muted font-medium">Duration</span>
            <strong className="text-navy-900 font-bold text-xs sm:text-sm mt-0.5">{activity.duration}</strong>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted font-medium">Best Time</span>
            <strong className="text-navy-900 font-bold text-xs sm:text-sm mt-0.5">{activity.bestTime || 'Year-round'}</strong>
          </div>
        </div>

        {/* 4. Left-Aligned About Activity Box */}
        <div className="gt-act-modal-desc-box p-3.5 bg-subtle border border-border rounded-xl text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted m-0 mb-1">About Activity</h4>
          <p className="text-xs sm:text-sm leading-relaxed text-navy-800 m-0">{activity.description}</p>
        </div>

        {/* 5. Left-Aligned Key Highlights Section */}
        <div className="gt-act-modal-highlights text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted m-0 mb-2">Key Highlights</h4>
          <ul className="flex flex-col gap-2 text-xs text-navy-800 p-0 m-0 list-none">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Professional guided experience</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Safety equipment included</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Flexible cancellation policy</span>
            </li>
          </ul>
        </div>

        {/* 6. Footer Buttons - Aligned Horizontal Line at Bottom */}
        <div className="gt-act-modal-footer flex justify-between items-center pt-3 border-t border-border mt-2">
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
