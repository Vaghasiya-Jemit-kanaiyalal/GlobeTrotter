import React from 'react';
import { Search, Layers, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { REGIONS, TRAVEL_STYLES } from '../../data/destinationsData';
import './DestinationSearch.css';

export const DestinationSearch = ({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedStyle,
  onStyleChange,
  sortBy,
  onSortChange,
  onResetFilters,
}) => {
  const isFiltered = searchQuery || selectedRegion !== 'All' || selectedStyle !== 'All' || sortBy !== 'rating';

  return (
    <div className="gt-search-section">
      <div className="gt-search-container">
        {/* Main Search Input */}
        <div className="gt-search-input-box">
          <Search className="gt-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by city, country, or region (e.g., Kyoto, Amalfi, Switzerland)..."
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

        {/* Discovery Filter Controls */}
        <div className="gt-filter-controls">
          {/* Group By / Region */}
          <div className="gt-control-item">
            <label htmlFor="filter-region" className="gt-control-label">
              <Layers className="gt-icon" />
              <span>Region</span>
            </label>
            <select
              id="filter-region"
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="gt-control-select"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Regions' : r}
                </option>
              ))}
            </select>
          </div>

          {/* Filter / Travel Style */}
          <div className="gt-control-item">
            <label htmlFor="filter-style" className="gt-control-label">
              <SlidersHorizontal className="gt-icon" />
              <span>Travel Style</span>
            </label>
            <select
              id="filter-style"
              value={selectedStyle}
              onChange={(e) => onStyleChange(e.target.value)}
              className="gt-control-select"
            >
              {TRAVEL_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Travel Styles' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="gt-control-item">
            <label htmlFor="sort-by" className="gt-control-label">
              <ArrowUpDown className="gt-icon" />
              <span>Sort By</span>
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="gt-control-select"
            >
              <option value="rating">Highest Rated ★</option>
              <option value="popular">Most Popular</option>
              <option value="name">Destination (A–Z)</option>
              <option value="budget">Budget Level</option>
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
    </div>
  );
};
