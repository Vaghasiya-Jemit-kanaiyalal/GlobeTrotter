import React from 'react';
import { MapPin, Compass, CheckCircle2, Globe } from 'lucide-react';
import './ProfileStats.css';

export const ProfileStats = ({
  tripsCount = 5,
  destinationsCount = 12,
  activitiesCount = 32,
  countriesCount = 4,
}) => {
  return (
    <div className="gt-profile-stats-bar grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="gt-stat-box">
        <strong className="gt-stat-number">{tripsCount}</strong>
        <span className="gt-stat-label flex items-center gap-1">
          <Compass className="gt-icon" />
          <span>Trips</span>
        </span>
      </div>

      <div className="gt-stat-box">
        <strong className="gt-stat-number">{destinationsCount}</strong>
        <span className="gt-stat-label flex items-center gap-1">
          <MapPin className="gt-icon" />
          <span>Destinations</span>
        </span>
      </div>

      <div className="gt-stat-box">
        <strong className="gt-stat-number">{activitiesCount}</strong>
        <span className="gt-stat-label flex items-center gap-1">
          <CheckCircle2 className="gt-icon" />
          <span>Activities</span>
        </span>
      </div>

      <div className="gt-stat-box">
        <strong className="gt-stat-number">{countriesCount}</strong>
        <span className="gt-stat-label flex items-center gap-1">
          <Globe className="gt-icon" />
          <span>Countries</span>
        </span>
      </div>
    </div>
  );
};
