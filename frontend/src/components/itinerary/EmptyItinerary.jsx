import React from 'react';
import { CalendarX, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './EmptyItinerary.css';

export const EmptyItinerary = ({
  isFiltered = false,
  onBuildItinerary,
  onResetFilters,
}) => {
  return (
    <div className="gt-empty-itinerary-card text-center">
      <div className="gt-empty-icon-circle mx-auto mb-3">
        <CalendarX className="w-8 h-8 text-amber-600" />
      </div>

      <h3 className="gt-empty-title brand-serif">
        {isFiltered ? 'No Matching Activities Found' : 'No Activities Added Yet'}
      </h3>

      <p className="gt-empty-sub text-sm text-navy-600 max-w-md mx-auto mb-4">
        {isFiltered
          ? 'Try adjusting your search query, city filter, or category filter to find scheduled trip activities.'
          : 'Build your itinerary by adding destinations, dates, and activity plans.'}
      </p>

      <div className="flex justify-center gap-3">
        {isFiltered ? (
          <Button
            variant="outline"
            size="md"
            icon={RefreshCw}
            onClick={onResetFilters}
          >
            Reset Filters
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={onBuildItinerary}
          >
            Build Itinerary
          </Button>
        )}
      </div>
    </div>
  );
};
