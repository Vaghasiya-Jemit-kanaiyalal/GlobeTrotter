import React from 'react';
import { Search, Filter, Layers, ArrowUpDown, Calendar, X } from 'lucide-react';
import './AdminSearch.css';

export const AdminSearch = ({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  timeRange,
  onTimeRangeChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery || filterStatus !== 'All' || sortBy !== 'recent' || timeRange !== '30d';

  return (
    <div className="gt-admin-controls-card">
      <div className="gt-admin-controls-grid">
        {/* Search Bar */}
        <div className="gt-admin-control-item gt-admin-control-search">
          <label htmlFor="gt-admin-search" className="gt-admin-control-label">Admin Search</label>
          <div className="relative">
            <Search className="gt-admin-icon-left" />
            <input
              id="gt-admin-search"
              type="text"
              className="gt-admin-input gt-admin-input--search"
              placeholder="Search users, trips, cities, activities..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gt-admin-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Analytics Time Range Selector */}
        <div className="gt-admin-control-item">
          <label htmlFor="gt-admin-timerange" className="gt-admin-control-label">
            <Calendar className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Time Period
          </label>
          <select
            id="gt-admin-timerange"
            className="gt-admin-select"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>

        {/* Group By */}
        <div className="gt-admin-control-item">
          <label htmlFor="gt-admin-groupby" className="gt-admin-control-label">
            <Layers className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Group By
          </label>
          <select
            id="gt-admin-groupby"
            className="gt-admin-select"
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value)}
          >
            <option value="users">Users</option>
            <option value="cities">Cities</option>
            <option value="activities">Activities</option>
            <option value="trips">Trips</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="gt-admin-control-item">
          <label htmlFor="gt-admin-filter-status" className="gt-admin-control-label">
            <Filter className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Account Status
          </label>
          <select
            id="gt-admin-filter-status"
            className="gt-admin-select"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Disabled">Disabled Accounts</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="gt-admin-control-item">
          <label htmlFor="gt-admin-sortby" className="gt-admin-control-label">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Sort By
          </label>
          <select
            id="gt-admin-sortby"
            className="gt-admin-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="trips">Highest Activity (Trips)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="gt-admin-controls-footer flex items-center justify-between mt-3 pt-2">
          <span className="text-xs text-muted">
            Filtering by: {[
              searchQuery && `"${searchQuery}"`,
              timeRange !== '30d' && `Range: ${timeRange}`,
              filterStatus !== 'All' && filterStatus,
            ].filter(Boolean).join(' • ')}
          </span>
          <button
            type="button"
            className="gt-admin-reset-btn text-xs font-semibold"
            onClick={onResetFilters}
          >
            Reset Controls
          </button>
        </div>
      )}
    </div>
  );
};
