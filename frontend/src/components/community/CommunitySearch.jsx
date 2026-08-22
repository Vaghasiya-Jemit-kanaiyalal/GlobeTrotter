import React from 'react';
import { Search, Filter, Layers, ArrowUpDown, X } from 'lucide-react';
import './CommunitySearch.css';

export const CommunitySearch = ({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  filterType,
  onFilterTypeChange,
  filterDestination,
  onFilterDestinationChange,
  sortBy,
  onSortByChange,
  availableDestinations = [],
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery || filterType !== 'All' || filterDestination !== 'All' || sortBy !== 'recent';

  return (
    <div className="gt-comm-controls-card">
      <div className="gt-comm-controls-grid">
        {/* Search Bar */}
        <div className="gt-comm-control-item gt-comm-control-search">
          <label htmlFor="gt-comm-search" className="gt-comm-control-label">Search Community</label>
          <div className="relative">
            <Search className="gt-comm-icon-left" />
            <input
              id="gt-comm-search"
              type="text"
              className="gt-comm-input gt-comm-input--search"
              placeholder="Search travel experiences, destinations, activities..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gt-comm-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Group By */}
        <div className="gt-comm-control-item">
          <label htmlFor="gt-comm-groupby" className="gt-comm-control-label">
            <Layers className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Group By
          </label>
          <select
            id="gt-comm-groupby"
            className="gt-comm-select"
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value)}
          >
            <option value="destination">Destination</option>
            <option value="city">City</option>
            <option value="activity">Activity</option>
            <option value="type">Travel Type</option>
          </select>
        </div>

        {/* Filter Post Type */}
        <div className="gt-comm-control-item">
          <label htmlFor="gt-comm-filter-type" className="gt-comm-control-label">
            <Filter className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Content Type
          </label>
          <select
            id="gt-comm-filter-type"
            className="gt-comm-select"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="trip">Trip Experience</option>
            <option value="activity">Activity Experience</option>
            <option value="itinerary">Shared Itinerary</option>
            <option value="tip">Travel Tip</option>
          </select>
        </div>

        {/* Destination Filter */}
        <div className="gt-comm-control-item">
          <label htmlFor="gt-comm-filter-dest" className="gt-comm-control-label">
            Destination
          </label>
          <select
            id="gt-comm-filter-dest"
            className="gt-comm-select"
            value={filterDestination}
            onChange={(e) => onFilterDestinationChange(e.target.value)}
          >
            <option value="All">All Destinations</option>
            {availableDestinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="gt-comm-control-item">
          <label htmlFor="gt-comm-sortby" className="gt-comm-control-label">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Sort By
          </label>
          <select
            id="gt-comm-sortby"
            className="gt-comm-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular (Likes)</option>
            <option value="views">Most Viewed</option>
            <option value="comments">Most Commented</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="gt-comm-controls-footer flex items-center justify-between mt-3 pt-2">
          <span className="text-xs text-muted">
            Filtering by: {[
              searchQuery && `"${searchQuery}"`,
              filterType !== 'All' && filterType,
              filterDestination !== 'All' && filterDestination,
            ].filter(Boolean).join(' • ')}
          </span>
          <button
            type="button"
            className="gt-comm-reset-btn text-xs font-semibold"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
