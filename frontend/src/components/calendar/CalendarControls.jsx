import React from 'react';
import { Search, Filter, Layers, ArrowUpDown, X } from 'lucide-react';
import './CalendarControls.css';

export const CalendarControls = ({
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
  const hasActiveFilters =
    searchQuery || filterType !== 'All' || filterDestination !== 'All' || sortBy !== 'date';

  return (
    <div className="gt-cal-controls-card">
      <div className="gt-cal-controls-grid">
        {/* Search Bar */}
        <div className="gt-cal-control-item gt-cal-control-search">
          <label htmlFor="gt-cal-search" className="gt-cal-control-label">Search Calendar</label>
          <div className="relative">
            <Search className="gt-cal-icon-left" />
            <input
              id="gt-cal-search"
              type="text"
              className="gt-cal-input gt-cal-input--search"
              placeholder="Search by trip, destination, activity or city..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gt-cal-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Group By */}
        <div className="gt-cal-control-item">
          <label htmlFor="gt-cal-groupby" className="gt-cal-control-label">
            <Layers className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Group By
          </label>
          <select
            id="gt-cal-groupby"
            className="gt-cal-select"
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="trip">Trip</option>
            <option value="city">City</option>
            <option value="activity">Activity</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div className="gt-cal-control-item">
          <label htmlFor="gt-cal-filter-type" className="gt-cal-control-label">
            <Filter className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Event Type Filter
          </label>
          <select
            id="gt-cal-filter-type"
            className="gt-cal-select"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            <option value="All">All Event Types</option>
            <option value="trip">Trips Only</option>
            <option value="activity">Activities Only</option>
            <option value="travel">Travel & Flights</option>
            <option value="stay">Hotel & Stays</option>
          </select>
        </div>

        {/* Destination Filter */}
        <div className="gt-cal-control-item">
          <label htmlFor="gt-cal-filter-dest" className="gt-cal-control-label">
            Destination Filter
          </label>
          <select
            id="gt-cal-filter-dest"
            className="gt-cal-select"
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
        <div className="gt-cal-control-item">
          <label htmlFor="gt-cal-sortby" className="gt-cal-control-label">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Sort By
          </label>
          <select
            id="gt-cal-sortby"
            className="gt-cal-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="date">Date (Chronological)</option>
            <option value="tripName">Trip Name (A-Z)</option>
            <option value="destination">Destination (A-Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="gt-cal-controls-footer flex items-center justify-between mt-3 pt-2">
          <span className="text-xs text-muted">
            Active Filters: {[
              searchQuery && `"${searchQuery}"`,
              filterType !== 'All' && filterType,
              filterDestination !== 'All' && filterDestination,
            ].filter(Boolean).join(' • ')}
          </span>
          <button
            type="button"
            className="gt-cal-reset-btn text-xs font-semibold"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
