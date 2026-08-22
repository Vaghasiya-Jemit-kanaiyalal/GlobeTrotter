import React from 'react';
import { Calendar, MapPin, IndianRupee, CheckCircle2, Clock, X, Compass } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import './TripDetailModal.css';

export const TripDetailModal = ({ trip, isOpen, onClose }) => {
  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={trip.title}>
      <div className="gt-trip-modal-content">
        <div className="gt-trip-modal__image-wrapper">
          <img src={trip.coverImage} alt={trip.title} className="gt-trip-modal__img" />
          <span className="gt-trip-modal__status-badge">
            {trip.status}
          </span>
        </div>

        <div className="gt-trip-modal__meta-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="gt-trip-modal__meta-item">
            <Calendar className="gt-icon" />
            <div>
              <span className="text-xs text-muted">Travel Dates</span>
              <strong>{trip.dateRange}</strong>
            </div>
          </div>

          <div className="gt-trip-modal__meta-item">
            <IndianRupee className="gt-icon" />
            <div>
              <span className="text-xs text-muted">Estimated Budget</span>
              <strong>{trip.totalBudget || '₹2,50,000'}</strong>
            </div>
          </div>
        </div>

        <div className="gt-trip-modal__section">
          <h4 className="gt-trip-modal__heading">Itinerary Route & Destinations</h4>
          <div className="gt-trip-modal__cities flex gap-2 flex-wrap">
            {trip.destinations.map((c, i) => (
              <span key={i} className="gt-trip-modal__city-pill flex items-center gap-1">
                <MapPin className="gt-icon" /> {c}
              </span>
            ))}
          </div>
        </div>

        <div className="gt-trip-modal__section">
          <h4 className="gt-trip-modal__heading">Trip Overview</h4>
          <p className="text-sm">{trip.summary}</p>
        </div>

        <div className="gt-trip-modal__footer flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Compass} onClick={onClose}>
            Open Itinerary Builder
          </Button>
        </div>
      </div>
    </Modal>
  );
};
