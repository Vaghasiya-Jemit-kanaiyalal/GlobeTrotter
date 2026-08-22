import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Check, ChevronDown, Sparkles } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../../data/activitiesData';
import './DestinationSelector.css';

export const DestinationSelector = ({ value, onChange, error, required = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDestinations = POPULAR_DESTINATIONS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    item.region.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (destName) => {
    setSearchQuery(destName);
    onChange(destName);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className={`gt-field ${error ? 'gt-field--error' : ''}`} ref={containerRef}>
      <label htmlFor="dest-autocomplete" className="gt-field__label flex justify-between items-center">
        <span>
          Destination / Place {required && <span className="gt-field__required">*</span>}
        </span>
        <span className="text-xs text-muted">Search or select from list</span>
      </label>

      <div className="gt-dest-selector-wrapper">
        <div className="gt-input-wrapper">
          <div className="gt-input__icon-left">
            <MapPin className="gt-icon" />
          </div>

          <input
            id="dest-autocomplete"
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Type or select destination (e.g. Goa, India or Kyoto, Japan)..."
            autoComplete="off"
            className="gt-input gt-input--has-left-icon gt-input--has-right-icon"
          />

          <button
            type="button"
            className="gt-input__toggle-password"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle destinations dropdown"
          >
            <ChevronDown className="gt-icon" />
          </button>
        </div>

        {/* Autocomplete Dropdown List */}
        {isOpen && (
          <div className="gt-dest-dropdown animate-fade-in">
            <div className="gt-dest-dropdown__header flex justify-between items-center text-xs">
              <span className="flex items-center gap-1">
                <Sparkles className="gt-icon" style={{ width: 12, height: 12, color: 'var(--color-amber-600)' }} />
                Popular Travel Destinations
              </span>
              <span>{filteredDestinations.length} available</span>
            </div>

            <div className="gt-dest-dropdown__list">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  className={`gt-dest-dropdown__item ${value === dest.name ? 'gt-dest-dropdown__item--active' : ''}`}
                  onClick={() => handleSelect(dest.name)}
                >
                  <span className="gt-dest-flag">{dest.flag}</span>
                  <div className="gt-dest-info">
                    <strong>{dest.name}</strong>
                    <span className="text-xs text-muted">{dest.region} · {dest.country}</span>
                  </div>
                  {value === dest.name && <Check className="gt-icon gt-dest-check" />}
                </button>
              ))}

              {filteredDestinations.length === 0 && searchQuery && (
                <button
                  type="button"
                  className="gt-dest-dropdown__item gt-dest-dropdown__item--custom"
                  onClick={() => handleSelect(searchQuery)}
                >
                  <MapPin className="gt-icon" />
                  <span>Use custom destination: "<strong>{searchQuery}</strong>"</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="gt-field__error-text">{error}</p>}
    </div>
  );
};
