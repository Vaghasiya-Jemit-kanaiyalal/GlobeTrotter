import React from 'react';
import { Compass, MapPin } from 'lucide-react';
import './Logo.css';

export const Logo = ({ size = 'medium', showTagline = true, centered = true }) => {
  return (
    <div className={`gt-logo gt-logo--${size} ${centered ? 'gt-logo--centered' : ''}`}>
      <div className="gt-logo__icon-wrapper">
        <Compass className="gt-logo__icon" />
        <span className="gt-logo__badge-dot" />
      </div>
      <div className="gt-logo__text-group">
        <span className="gt-logo__title brand-serif">
          Globe<span className="gt-logo__accent">Trotter</span>
        </span>
        {showTagline && (
          <span className="gt-logo__tagline">
            Personalized Travel Planning
          </span>
        )}
      </div>
    </div>
  );
};
