import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ACTIVITY_CATEGORIES } from '../../data/activitiesData';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import './SearchFilterPopover.css';

export const SearchFilterPopover = ({
  isOpen,
  onClose,
  searchType = 'activities',
  currentFilters = {},
  onApplyFilters,
  onClearFilters,
}) => {
  const [category, setCategory] = useState(currentFilters.category || 'All');
  const [priceTier, setPriceTier] = useState(currentFilters.priceTier || 'All');
  const [minRating, setMinRating] = useState(currentFilters.minRating || 0);
  const [region, setRegion] = useState(currentFilters.region || 'All');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({ category, priceTier, minRating, region });
    onClose();
  };

  const handleClear = () => {
    setCategory('All');
    setPriceTier('All');
    setMinRating(0);
    setRegion('All');
    onClearFilters();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Search Results">
      <div className="gt-search-filter-popover flex-col gap-4">
        {searchType === 'activities' ? (
          <>
            {/* Category Filter */}
            <div className="gt-filter-group">
              <label className="gt-filter-group-label">Category</label>
              <div className="gt-filter-pills flex flex-wrap gap-2">
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`gt-filter-pill ${category === cat ? 'gt-filter-pill--active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tier Filter */}
            <div className="gt-filter-group">
              <label className="gt-filter-group-label">Price Range</label>
              <div className="gt-filter-pills flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`gt-filter-pill ${priceTier === 'All' ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setPriceTier('All')}
                >
                  All Prices
                </button>
                <button
                  type="button"
                  className={`gt-filter-pill ${priceTier === 'Free' ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setPriceTier('Free')}
                >
                  Free Only
                </button>
                <button
                  type="button"
                  className={`gt-filter-pill ${priceTier === 'Under1k' ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setPriceTier('Under1k')}
                >
                  Under ₹1,000
                </button>
                <button
                  type="button"
                  className={`gt-filter-pill ${priceTier === '1kTo3k' ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setPriceTier('1kTo3k')}
                >
                  ₹1,000 – ₹3,000
                </button>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="gt-filter-group">
              <label className="gt-filter-group-label">Minimum Rating</label>
              <div className="gt-filter-pills flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`gt-filter-pill ${minRating === 0 ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setMinRating(0)}
                >
                  Any Rating
                </button>
                <button
                  type="button"
                  className={`gt-filter-pill ${minRating === 4 ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setMinRating(4)}
                >
                  4.0+ ★
                </button>
                <button
                  type="button"
                  className={`gt-filter-pill ${minRating === 4.5 ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setMinRating(4.5)}
                >
                  4.5+ ★
                </button>
              </div>
            </div>
          </>
        ) : (
          /* City Search Filters */
          <div className="gt-filter-group">
            <label className="gt-filter-group-label">Geographic Region</label>
            <div className="gt-filter-pills flex flex-wrap gap-2">
              {['All', 'Asia', 'Europe', 'North America', 'South America'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`gt-filter-pill ${region === r ? 'gt-filter-pill--active' : ''}`}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="gt-filter-modal-footer flex justify-between items-center" style={{ marginTop: 12 }}>
          <Button variant="text" onClick={handleClear} icon={X}>
            Clear Filters
          </Button>

          <Button variant="primary" onClick={handleApply} icon={Check}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};
