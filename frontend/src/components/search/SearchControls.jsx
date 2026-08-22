import React, { useState, useEffect } from 'react';
import { Search, Layers, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import './SearchControls.css';

export const SearchControls = ({
  searchType = 'activities',
  query = '',
  onQueryChange,
  groupBy,
  onGroupChange,
  sortBy,
  onSortChange,
  filterCount = 0,
  onOpenFilterModal,
  onResetFilters,
}) => {
  const [localQuery, setLocalQuery] = useState(query);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      onQueryChange(localQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery]);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const placeholder =
    searchType === 'activities'
      ? 'Search activities (e.g. Paragliding, Scuba Diving, Food Tour)...'
      : 'Search cities or destinations (e.g. Goa, Kyoto, Paris, Interlaken)...';

  return (
    <div className="gt-search-controls-box flex-col gap-3">
      {/* Debounced Search Bar */}
      <div className="gt-search-input-box">
        <Search className="gt-search-icon" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={placeholder}
          className="gt-search-input"
        />
        {localQuery && (
          <button
            type="button"
            className="gt-search-clear-btn"
            onClick={() => {
              setLocalQuery('');
              onQueryChange('');
            }}
            aria-label="Clear search text"
          >
            <X className="gt-icon" />
          </button>
        )}
      </div>

      {/* Group By, Filter Popover Trigger, and Sort By Controls */}
      <div className="gt-filter-controls flex items-center gap-3 flex-wrap">
        {/* Group By Dropdown */}
        <div className="gt-control-item">
          <label htmlFor="search-group-by" className="gt-control-label">
            <Layers className="gt-icon" />
            <span>Group By</span>
          </label>
          <select
            id="search-group-by"
            value={groupBy}
            onChange={(e) => onGroupChange(e.target.value)}
            className="gt-control-select"
          >
            {searchType === 'activities' ? (
              <>
                <option value="Category">Category</option>
                <option value="City">City</option>
                <option value="Rating">Rating</option>
                <option value="Price Range">Price Range</option>
              </>
            ) : (
              <>
                <option value="Region">Region</option>
                <option value="Country">Country</option>
                <option value="Popularity">Popularity</option>
              </>
            )}
          </select>
        </div>

        {/* Filter Popover Trigger Button */}
        <button
          type="button"
          className="gt-filter-trigger-btn flex items-center gap-2"
          onClick={onOpenFilterModal}
        >
          <SlidersHorizontal className="gt-icon" />
          <span>Filters</span>
          {filterCount > 0 && <span className="gt-filter-badge">{filterCount}</span>}
        </button>

        {/* Sort By Dropdown */}
        <div className="gt-control-item">
          <label htmlFor="search-sort-by" className="gt-control-label">
            <ArrowUpDown className="gt-icon" />
            <span>Sort By</span>
          </label>
          <select
            id="search-sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="gt-control-select"
          >
            {searchType === 'activities' ? (
              <>
                <option value="Relevance">Relevance</option>
                <option value="Rating">Highest Rating</option>
                <option value="Lowest Price">Lowest Price</option>
                <option value="Highest Price">Highest Price</option>
              </>
            ) : (
              <>
                <option value="Relevance">Relevance</option>
                <option value="Popularity">Most Popular</option>
                <option value="Name A–Z">Name (A–Z)</option>
                <option value="Name Z–A">Name (Z–A)</option>
              </>
            )}
          </select>
        </div>

        {/* Reset Filters */}
        {(query || filterCount > 0) && (
          <button
            type="button"
            className="gt-reset-filters-btn"
            onClick={onResetFilters}
            title="Reset all search filters"
          >
            <X className="gt-icon" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </div>
  );
};
