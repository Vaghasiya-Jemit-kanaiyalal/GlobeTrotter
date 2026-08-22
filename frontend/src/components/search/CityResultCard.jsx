import React from 'react';
import { MapPin, Compass, Star, Plus, Eye, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import './CityResultCard.css';

export const CityResultCard = ({ city, onExploreCity, onAddToTrip }) => {
  return (
    <article className="gt-city-result-card flex-col sm:flex-row gap-4">
      {/* Destination Cover Image */}
      <div className="gt-city-card__img-box" onClick={() => onExploreCity(city)}>
        <img
          src={city.image}
          alt={city.name}
          className="gt-city-card__img"
          loading="lazy"
        />
        <span className="gt-city-card__region-badge">{city.region || 'Asia'}</span>
      </div>

      {/* Body & Specs */}
      <div className="gt-city-card__body flex-col justify-between flex-1 gap-2">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="gt-city-card__title" onClick={() => onExploreCity(city)}>
              {city.name}, <span className="gt-city-card__country">{city.country}</span>
            </h3>
            <span className="gt-city-card__pop-badge flex items-center gap-1">
              <Star className="gt-icon fill-amber-500 text-amber-500" style={{ width: 13, height: 13 }} />
              <strong>{city.popularity || 90}/100 Popularity</strong>
            </span>
          </div>

          <p className="gt-city-card__desc text-xs">{city.description}</p>
        </div>

        {/* Specs & Action Buttons */}
        <div className="gt-city-card__footer flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-muted">
              <Compass className="gt-icon" style={{ width: 13, height: 13 }} />
              <span>Popular Activities: {city.activitiesCount || 24}</span>
            </span>
            {city.avgCostPerDay && (
              <span className="flex items-center gap-1 text-amber-700">
                <span>Avg: {city.avgCostPerDay}/day</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              onClick={() => onExploreCity(city)}
            >
              Explore City
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => onAddToTrip(city)}
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
