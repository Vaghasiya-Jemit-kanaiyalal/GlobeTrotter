import React from 'react';
import { Compass, MapPin } from 'lucide-react';
import './SearchTypeToggle.css';

export const SearchTypeToggle = ({ searchType = 'activities', onTypeChange }) => {
  return (
    <div className="gt-search-type-toggle flex items-center gap-1">
      <button
        type="button"
        className={`gt-toggle-tab flex items-center gap-2 ${
          searchType === 'activities' ? 'gt-toggle-tab--active' : ''
        }`}
        onClick={() => onTypeChange('activities')}
      >
        <Compass className="gt-icon" />
        <span>Activities</span>
      </button>

      <button
        type="button"
        className={`gt-toggle-tab flex items-center gap-2 ${
          searchType === 'cities' ? 'gt-toggle-tab--active' : ''
        }`}
        onClick={() => onTypeChange('cities')}
      >
        <MapPin className="gt-icon" />
        <span>Cities / Destinations</span>
      </button>
    </div>
  );
};
