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
    <div className="gt-profile-stats-card">
      <div className="gt-stats-row">
        {/* Trips */}
        <div className="gt-stat-column">
          <strong className="gt-stat-number brand-serif">
            {tripsCount}
          </strong>
          <span className="gt-stat-label">
            <Compass className="gt-icon" />
            <span>Trips</span>
          </span>
        </div>

        {/* Destinations */}
        <div className="gt-stat-column">
          <strong className="gt-stat-number brand-serif">
            {destinationsCount}
          </strong>
          <span className="gt-stat-label">
            <MapPin className="gt-icon" />
            <span>Destinations</span>
          </span>
        </div>

        {/* Activities */}
        <div className="gt-stat-column">
          <strong className="gt-stat-number brand-serif">
            {activitiesCount}
          </strong>
          <span className="gt-stat-label">
            <CheckCircle2 className="gt-icon" />
            <span>Activities</span>
          </span>
        </div>

        {/* Countries */}
        <div className="gt-stat-column">
          <strong className="gt-stat-number brand-serif">
            {countriesCount}
          </strong>
          <span className="gt-stat-label">
            <Globe className="gt-icon" />
            <span>Countries</span>
          </span>
        </div>
      </div>
    </div>
  );
};
