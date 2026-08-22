import React from 'react';
import { Users, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './EmptyCommunity.css';

export const EmptyCommunity = ({
  isFiltered = false,
  onOpenShareModal,
  onResetFilters,
}) => {
  return (
    <div className="gt-empty-community-card text-center">
      <div className="gt-empty-comm-icon mx-auto mb-3">
        <Users className="w-8 h-8 text-amber-600" />
      </div>

      <h3 className="gt-empty-comm-title brand-serif">
        {isFiltered ? 'No Matching Travel Experiences' : 'No Travel Experiences Yet'}
      </h3>

      <p className="gt-empty-comm-sub text-sm text-navy-600 max-w-md mx-auto mb-4">
        {isFiltered
          ? 'Try adjusting your search query, destination filter, or post type filter to find shared travel posts.'
          : 'Be the first to share your journey, itineraries, and activity experiences with the GlobeTrotter community.'}
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
            onClick={onOpenShareModal}
          >
            Share Your Experience
          </Button>
        )}
      </div>
    </div>
  );
};
