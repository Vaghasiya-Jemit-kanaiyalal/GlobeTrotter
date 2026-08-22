import React from 'react';
import { Compass, SearchX, Sparkles } from 'lucide-react';
import { RegionalDestinationCard } from './RegionalDestinationCard';
import { Button } from '../ui/Button';
import './RegionalSelections.css';

export const RegionalSelections = ({
  destinations = [],
  totalCount = 0,
  onSelectDestination,
  onResetFilters,
}) => {
  return (
    <section id="regional-selections" className="gt-section gt-regional-section">
      <div className="gt-section__container">
        {/* Section Header */}
        <div className="gt-section__header flex justify-between items-end">
          <div>
            <div className="gt-section__eyebrow flex items-center gap-1">
              <Compass className="gt-icon" />
              <span>Curated City & Regional Guides</span>
            </div>
            <h2 className="gt-section__title brand-serif">
              Top Regional Selections
            </h2>
            <p className="gt-section__subtitle">
              Hand-picked destinations engineered for seamless multi-city itineraries and cultural immersion.
            </p>
          </div>

          <span className="gt-section__count-badge">
            Showing {destinations.length} of {totalCount} Destinations
          </span>
        </div>

        {/* Destination Grid */}
        {destinations.length > 0 ? (
          <div className="gt-dest-grid">
            {destinations.map((dest) => (
              <RegionalDestinationCard
                key={dest.id}
                destination={dest}
                onSelect={onSelectDestination}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Results */
          <div className="gt-dest-empty animate-fade-in">
            <div className="gt-dest-empty__icon-box">
              <SearchX className="gt-dest-empty__icon" />
            </div>
            <h3 className="gt-dest-empty__title">No destinations match your criteria</h3>
            <p className="gt-dest-empty__text">
              Try adjusting your search query, region filter, or travel style to explore other available locations.
            </p>
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
