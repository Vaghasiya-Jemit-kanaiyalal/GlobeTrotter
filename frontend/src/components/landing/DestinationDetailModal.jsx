import React from 'react';
import { MapPin, Star, Calendar, DollarSign, Compass, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import './DestinationDetailModal.css';

export const DestinationDetailModal = ({ destination, isOpen, onClose, onStartTrip }) => {
  if (!destination) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${destination.city}, ${destination.country}`}>
      <div className="gt-dest-modal-content">
        {/* Cover Photo */}
        <div className="gt-dest-modal__image-wrapper">
          <img
            src={destination.image}
            alt={destination.city}
            className="gt-dest-modal__img"
          />
          <span className="gt-dest-modal__region-badge">
            {destination.region}
          </span>
          <span className="gt-dest-modal__rating-badge">
            <Star className="gt-icon" style={{ fill: '#F59E0B', color: '#F59E0B' }} />
            <span>{destination.rating} ({destination.reviewCount} reviews)</span>
          </span>
        </div>

        {/* Overview */}
        <p className="gt-dest-modal__summary">
          {destination.summary}
        </p>

        {/* Quick Travel Intelligence Specs */}
        <div className="gt-dest-modal__specs grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="gt-dest-modal__spec-card">
            <div className="gt-dest-modal__spec-header flex items-center gap-1">
              <Calendar className="gt-icon" />
              <span>Best Time to Travel</span>
            </div>
            <strong>{destination.bestSeason}</strong>
          </div>

          <div className="gt-dest-modal__spec-card">
            <div className="gt-dest-modal__spec-header flex items-center gap-1">
              <DollarSign className="gt-icon" />
              <span>Estimated Budget</span>
            </div>
            <strong>{destination.avgDailyBudget}</strong>
          </div>
        </div>

        {/* Key Regional Highlights */}
        <div className="gt-dest-modal__highlights">
          <h4 className="gt-dest-modal__section-title">Must-See Regional Highlights</h4>
          <div className="gt-dest-modal__highlight-list">
            {destination.highlights.map((h, i) => (
              <div key={i} className="gt-dest-modal__highlight-item flex items-center gap-2">
                <CheckCircle2 className="gt-icon" style={{ color: 'var(--color-amber-600)', flexShrink: 0 }} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="gt-dest-modal__footer flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon={Compass}
            onClick={() => {
              onClose();
              onStartTrip(destination);
            }}
          >
            Start Trip in {destination.city}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
