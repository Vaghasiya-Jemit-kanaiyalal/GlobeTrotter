import React from 'react';
import { MapPin, Clock, IndianRupee, Star, Plus, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import './ActivityResultCard.css';

export const ActivityResultCard = ({ activity, onViewDetails, onAddToTrip }) => {
  return (
    <article className="gt-activity-result-card flex-col sm:flex-row gap-4">
      {/* Cover Image */}
      <div className="gt-act-card__img-box" onClick={() => onViewDetails(activity)}>
        <img
          src={activity.image}
          alt={activity.name}
          className="gt-act-card__img"
          loading="lazy"
        />
        <span className="gt-act-card__category-badge">{activity.category}</span>
      </div>

      {/* Body & Specs */}
      <div className="gt-act-card__body flex-col justify-between flex-1 gap-2">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="gt-act-card__title" onClick={() => onViewDetails(activity)}>
              {activity.name}
            </h3>
            <span className="gt-act-card__rating flex items-center gap-1">
              <Star className="gt-icon fill-amber-500 text-amber-500" style={{ width: 13, height: 13 }} />
              <strong>{activity.rating || 4.8}</strong>
            </span>
          </div>

          <div className="gt-act-card__location flex items-center gap-1 text-xs">
            <MapPin className="gt-icon" />
            <span>{activity.city}, {activity.country}</span>
          </div>

          <p className="gt-act-card__desc text-xs">{activity.description}</p>
        </div>

        {/* Specs & Actions */}
        <div className="gt-act-card__footer flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="gt-icon text-muted" style={{ width: 13, height: 13 }} />
              <span>{activity.duration}</span>
            </span>
            <span className="flex items-center gap-1 gt-act-card__cost">
              <IndianRupee className="gt-icon text-amber-600" style={{ width: 13, height: 13 }} />
              <span>{activity.cost}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              onClick={() => onViewDetails(activity)}
            >
              View Details
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => onAddToTrip(activity)}
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
