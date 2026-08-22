import React from 'react';
import { MapPin, Flame } from 'lucide-react';
import './PopularCities.css';

export const PopularCities = ({ cities = [], onSelectCity }) => {
  return (
    <div className="gt-popular-cities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {cities.map((city, idx) => (
        <div
          key={city.name}
          className="gt-admin-city-card flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-amber-600 transition-all cursor-pointer shadow-sm"
          onClick={() => onSelectCity && onSelectCity(city.name)}
        >
          <div className="gt-admin-city-rank font-extrabold text-lg text-amber-700 w-6 flex-shrink-0">
            #{idx + 1}
          </div>

          <div className="gt-admin-city-thumb">
            <img src={city.image} alt={city.name} />
          </div>

          <div className="flex flex-col flex-1">
            <h4 className="font-bold text-base text-navy-900 brand-serif m-0">{city.name}</h4>
            <span className="text-xs text-muted mb-1">{city.country}</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <span>{city.visits.toLocaleString()} visits</span>
              <span>• {city.uniqueTrips} trips</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
