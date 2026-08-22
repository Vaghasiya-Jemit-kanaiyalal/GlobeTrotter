import React from 'react';
import { Search, Layers, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import './TripSearchControls.css';

export const TripSearchControls = ({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortChange,
  onResetFilters,
}) => {
  const isFiltered = searchQuery || groupBy !== 'Status' || filterStatus !== 'All' || sortBy !== 'Newest';

  return (
    <div className="gt-trip-search-box flex-col gap-3">
      {/* Search Input */}
      <div className="gt-search-input-box">
        <Search className="gt-search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your trips by title, destination, city or country..."
          className="gt-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            className="gt-search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X className="gt-icon" />
          </button>
        )}
      </div>

      {/* Group By, Filter, and Sort Controls */}
      <div className="gt-filter-controls flex items-center gap-3 flex-wrap">
        {/* Group By */}
        <div className="gt-control-item">
          <label htmlFor="group-by" className="gt-control-label">
            <Layers className="gt-icon" />
            <span>Group By</span>
          </label>
          <select
            id="group-by"
            value={groupBy}
            onChange={(e) => onGroupChange(e.target.value)}
            className="gt-control-select"
          >
            <option value="Status">Status (Ongoing / Upcoming / Completed)</option>
            <option value="Destination">Destination</option>
            <option value="Date">Date</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="gt-control-item">
          <label htmlFor="filter-status" className="gt-control-label">
            <SlidersHorizontal className="gt-icon" />
            <span>Filter Status</span>
          </label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="gt-control-select"
          >
            <option value="All">All Statuses</option>
            <option value="Ongoing">Ongoing Trips</option>
            <option value="Upcoming">Upcoming Trips</option>
            <option value="Completed">Completed Trips</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="gt-control-item">
          <label htmlFor="sort-by-trips" className="gt-control-label">
            <ArrowUpDown className="gt-icon" />
            <span>Sort By</span>
          </label>
          <select
            id="sort-by-trips"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="gt-control-select"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Start Date">Start Date</option>
            <option value="End Date">End Date</option>
            <option value="Trip Name">Trip Name (A–Z)</option>
          </select>
        </div>

        {/* Reset Filters */}
        {isFiltered && (
          <button
            type="button"
            className="gt-reset-filters-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <X className="gt-icon" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
