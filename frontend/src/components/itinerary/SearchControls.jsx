import React from 'react';
import { Search, Filter, ArrowUpDown, Layers, X } from 'lucide-react';
import './SearchControls.css';

export const SearchControls = ({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupByChange,
  filterCategory,
  onFilterCategoryChange,
  filterCity,
  onFilterCityChange,
  sortBy,
  onSortByChange,
  availableCities = [],
  availableCategories = [],
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery || filterCategory !== 'All' || filterCity !== 'All' || sortBy !== 'time';

  return (
    <div className="gt-search-controls-card">
      <div className="gt-search-controls-grid">
        {/* Search Bar */}
        <div className="gt-control-item gt-control-search">
          <label htmlFor="gt-search-input" className="gt-control-label">Search Activities</label>
          <div className="relative">
            <Search className="gt-control-icon-left" />
            <input
              id="gt-search-input"
              type="text"
              className="gt-control-input gt-control-input--search"
              placeholder="Search by activity, city or category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gt-clear-search-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Group By */}
        <div className="gt-control-item">
          <label htmlFor="gt-groupby-select" className="gt-control-label">
            <Layers className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Group By
          </label>
          <select
            id="gt-groupby-select"
            className="gt-control-select"
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="city">City</option>
            <option value="category">Activity Category</option>
          </select>
        </div>

        {/* Filter Category */}
        <div className="gt-control-item">
          <label htmlFor="gt-filter-cat-select" className="gt-control-label">
            <Filter className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Category Filter
          </label>
          <select
            id="gt-filter-cat-select"
            className="gt-control-select"
            value={filterCategory}
            onChange={(e) => onFilterCategoryChange(e.target.value)}
          >
            <option value="All">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filter City */}
        <div className="gt-control-item">
          <label htmlFor="gt-filter-city-select" className="gt-control-label">
            City Filter
          </label>
          <select
            id="gt-filter-city-select"
            className="gt-control-select"
            value={filterCity}
            onChange={(e) => onFilterCityChange(e.target.value)}
          >
            <option value="All">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="gt-control-item">
          <label htmlFor="gt-sortby-select" className="gt-control-label">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            Sort By
          </label>
          <select
            id="gt-sortby-select"
            className="gt-control-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="time">Time Sequence</option>
            <option value="cost-asc">Cost: Low to High</option>
            <option value="cost-desc">Cost: High to Low</option>
            <option value="name">Activity Name (A-Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="gt-search-controls-footer flex items-center justify-between mt-3 pt-2">
          <span className="text-xs text-muted">
            Filtering by: {[
              searchQuery && `"${searchQuery}"`,
              filterCategory !== 'All' && filterCategory,
              filterCity !== 'All' && filterCity,
              sortBy !== 'time' && `Sort: ${sortBy}`
            ].filter(Boolean).join(' • ')}
          </span>
          <button
            type="button"
            className="gt-reset-filters-btn text-xs font-semibold"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
