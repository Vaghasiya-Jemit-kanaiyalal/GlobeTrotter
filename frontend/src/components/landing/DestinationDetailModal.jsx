import React from 'react';
import { MapPin, Star, Calendar, IndianRupee, Compass, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import './DestinationDetailModal.css';

export const DestinationDetailModal = ({ destination, isOpen, onClose, onStartTrip }) => {
  if (!destination) return null;

  const highlights = destination.highlights || [];
  const rawCity = typeof destination.city === 'object' ? (destination.city?.name || destination.city?.city || 'City') : (destination.city || 'City');
  const rawCountry = typeof destination.country === 'object' ? (destination.country?.name || 'India') : (destination.country || 'India');
  const displayCityName = String(rawCity).split('&')[0].trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${rawCity}, ${rawCountry}`} size="lg">
      <div className="gt-dest-modal-content flex flex-col gap-4 text-left p-1">
        {/* Cover Photo */}
        <div className="gt-dest-modal__image-wrapper relative w-full h-[220px] rounded-xl overflow-hidden bg-subtle">
          <img
            src={destination.image}
            alt={`${destination.city}, ${destination.country}`}
            className="gt-dest-modal__img w-full h-full object-cover"
          />
          <span className="gt-dest-modal__region-badge absolute top-3 left-3 px-2.5 py-1 rounded bg-navy-900/85 text-white text-xs font-semibold shadow">
            {destination.region || 'Asia'}
          </span>
          <span className="gt-dest-modal__rating-badge absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-navy-900 text-xs font-bold shadow">
            <Star className="gt-icon w-3.5 h-3.5" style={{ fill: '#F59E0B', color: '#F59E0B' }} />
            <span>{destination.rating || 4.8} ({destination.reviewCount || '1k'} reviews)</span>
          </span>
        </div>

        {/* Summary Description */}
        <p className="gt-dest-modal__summary text-sm text-navy-800 leading-relaxed m-0">
          {destination.summary}
        </p>

        {/* Quick Travel Intelligence Specs */}
        <div className="gt-dest-modal__specs grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="gt-dest-modal__spec-card p-3 bg-subtle border border-border rounded-xl flex flex-col gap-1">
            <div className="gt-dest-modal__spec-header flex items-center gap-1.5 text-xs font-bold text-navy-600 uppercase tracking-wide">
              <Calendar className="gt-icon w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Best Time to Travel</span>
            </div>
            <strong className="text-sm text-navy-900 font-bold">{destination.bestSeason || 'Spring – Autumn'}</strong>
          </div>

          <div className="gt-dest-modal__spec-card p-3 bg-subtle border border-border rounded-xl flex flex-col gap-1">
            <div className="gt-dest-modal__spec-header flex items-center gap-1.5 text-xs font-bold text-navy-600 uppercase tracking-wide">
              <IndianRupee className="gt-icon w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Estimated Daily Budget</span>
            </div>
            <strong className="text-sm text-amber-700 font-extrabold">{destination.avgDailyBudget || '₹10,000 / day'}</strong>
          </div>
        </div>

        {/* Key Regional Highlights */}
        {highlights.length > 0 && (
          <div className="gt-dest-modal__highlights flex flex-col gap-2">
            <h4 className="gt-dest-modal__section-title text-xs font-bold uppercase tracking-wider text-navy-700 m-0">Must-See Regional Highlights</h4>
            <div className="gt-dest-modal__highlight-list grid grid-cols-1 sm:grid-cols-2 gap-2">
              {highlights.map((h, i) => (
                <div key={i} className="gt-dest-modal__highlight-item flex items-center gap-2 p-2.5 bg-subtle border border-border rounded-lg text-xs text-navy-800 font-medium">
                  <CheckCircle2 className="gt-icon w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Action Bar */}
        <div className="gt-dest-modal__footer flex justify-between items-center pt-3.5 border-t border-border mt-1">
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Compass}
            onClick={() => {
              onClose();
              if (onStartTrip) onStartTrip(destination);
            }}
          >
            Start Trip in {displayCityName}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
