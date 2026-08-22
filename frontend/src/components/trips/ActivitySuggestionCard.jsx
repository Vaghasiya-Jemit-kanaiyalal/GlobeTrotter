import React from 'react';
import { MapPin, Clock, IndianRupee, Check, Plus, Tag } from 'lucide-react';
import './ActivitySuggestionCard.css';

export const ActivitySuggestionCard = ({ activity, isSelected, onToggleSelect }) => {
  return (
    <article className={`gt-act-card ${isSelected ? 'gt-act-card--selected' : ''}`}>
      {/* Travel Image */}
      <div className="gt-act-card__image-wrapper">
        <img src={activity.image} alt={activity.name} className="gt-act-card__img" loading="lazy" />
        
        {/* Category Pill */}
        <span className="gt-act-card__category-badge">
          {activity.category}
        </span>

        {/* Selected Check Indicator Overlay */}
        {isSelected && (
          <div className="gt-act-card__selected-overlay animate-fade-in">
            <span className="gt-act-card__selected-badge">
              <Check className="gt-icon" /> Added to Itinerary
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="gt-act-card__body">
        <div className="gt-act-card__location flex items-center gap-1">
          <MapPin className="gt-icon" />
          <span>{activity.city}, {activity.country}</span>
        </div>

        <h3 className="gt-act-card__title">{activity.name}</h3>

        <p className="gt-act-card__description">{activity.description}</p>

        {/* Specs: Duration & Cost */}
        <div className="gt-act-card__specs flex justify-between items-center text-xs">
          <span className="flex items-center gap-1">
            <Clock className="gt-icon" /> {activity.duration}
          </span>
          <span className="gt-act-card__cost font-semibold">
            {activity.cost}
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className={`gt-act-card__btn ${isSelected ? 'gt-act-card__btn--selected' : ''}`}
          onClick={() => onToggleSelect(activity)}
        >
          {isSelected ? (
            <>
              <Check className="gt-icon" />
              <span>Added to Trip</span>
            </>
          ) : (
            <>
              <Plus className="gt-icon" />
              <span>Add to Trip</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
