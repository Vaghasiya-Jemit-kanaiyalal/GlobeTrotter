import React from 'react';
import { CalendarX, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './EmptyCalendar.css';

export const EmptyCalendar = ({
  isFiltered = false,
  onPlanTrip,
  onResetFilters,
}) => {
  return (
    <div className="gt-empty-calendar-card text-center">
      <div className="gt-empty-cal-icon-circle mx-auto mb-3">
        <CalendarX className="w-8 h-8 text-amber-600" />
      </div>

      <h3 className="gt-empty-cal-title brand-serif">
        {isFiltered ? 'No Matching Calendar Events' : 'No Trips Scheduled Yet'}
      </h3>

      <p className="gt-empty-cal-sub text-sm text-navy-600 max-w-md mx-auto mb-4">
        {isFiltered
          ? 'Try adjusting your search query, destination filter, or event type filter to view scheduled travel plans.'
          : 'Start planning your journey and your trips, flights, hotels, and activities will appear here.'}
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
            onClick={onPlanTrip}
          >
            Plan a Trip
          </Button>
        )}
      </div>
    </div>
  );
};
