import React from 'react';
import { MapPin, Star, ArrowRight, Compass, Sparkles } from 'lucide-react';
import './RegionalDestinationCard.css';

export const RegionalDestinationCard = ({ destination, onSelect, onQuickPlan }) => {
  return (
    <article className="gt-dest-card" onClick={() => onSelect(destination)}>
      {/* Image Container */}
      <div className="gt-dest-card__image-box">
        <img
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          className="gt-dest-card__img"
          loading="lazy"
        />
        
        {/* Floating Region Badge */}
        <span className="gt-dest-card__region-badge">
          {destination.region}
        </span>

        {/* Cost Indicator Badge */}
        <span className="gt-dest-card__cost-badge" title={destination.costDescription}>
          {destination.costTier}
        </span>
      </div>

      {/* Card Content */}
      <div className="gt-dest-card__body">
        <div className="gt-dest-card__header flex justify-between items-center">
          <div className="gt-dest-card__location flex items-center gap-1">
            <MapPin className="gt-icon" />
            <span className="gt-dest-card__country">{destination.country}</span>
          </div>

          <div className="gt-dest-card__rating flex items-center gap-1">
            <Star className="gt-icon gt-dest-card__star" />
            <strong>{destination.rating}</strong>
            <span className="gt-dest-card__reviews">({destination.reviewCount})</span>
          </div>
        </div>

        <h3 className="gt-dest-card__title">{destination.city}</h3>
        
        <p className="gt-dest-card__summary">{destination.summary}</p>

        {/* Highlights Preview Tags */}
        <div className="gt-dest-card__tags">
          {destination.highlights.slice(0, 2).map((h, i) => (
            <span key={i} className="gt-dest-card__tag">
              {h}
            </span>
          ))}
          {destination.highlights.length > 2 && (
            <span className="gt-dest-card__tag gt-dest-card__tag--more">
              +{destination.highlights.length - 2} more
            </span>
          )}
        </div>

        {/* Footer Action */}
        <div className="gt-dest-card__footer flex justify-between items-center">
          <span className="gt-dest-card__style-tag">
            {destination.style}
          </span>

          <button
            type="button"
            className="gt-dest-card__explore-btn flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(destination);
            }}
          >
            <span>Explore</span>
            <ArrowRight className="gt-icon" />
          </button>
        </div>
      </div>
    </article>
  );
};
