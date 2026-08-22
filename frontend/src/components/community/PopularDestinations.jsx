import React from 'react';
import { MapPin, Flame } from 'lucide-react';
import './PopularDestinations.css';

export const PopularDestinations = ({
  destinations = [],
  onSelectDestination,
}) => {
  return (
    <div className="gt-popular-dests-card">
      <h3 className="gt-pop-dests-title brand-serif flex items-center gap-1.5">
        <Flame className="w-4 h-4 text-amber-600" />
        Popular Destinations
      </h3>

      <div className="gt-pop-dests-list flex flex-col gap-2 mt-2">
        {destinations.map((dest) => (
          <div
            key={dest.name}
            className="gt-pop-dest-item flex items-center justify-between p-2 rounded-md hover:bg-amber-50 cursor-pointer border border-transparent hover:border-amber-100 transition-all"
            onClick={() => onSelectDestination(dest.name)}
          >
            <div className="flex items-center gap-2">
              <div className="gt-pop-dest-thumb">
                <img src={dest.image} alt={dest.name} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-navy-900">{dest.name}</span>
                <span className="text-xs text-muted">{dest.country}</span>
              </div>
            </div>

            <span className="gt-pop-dest-badge text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {dest.postsCount} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
