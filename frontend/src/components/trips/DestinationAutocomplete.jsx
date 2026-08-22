import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Check } from 'lucide-react';
import { SAMPLE_DESTINATIONS } from '../../data/activitiesData';
import './DestinationAutocomplete.css';

export const DestinationAutocomplete = ({
  value,
  onChange,
  onSelectDestination,
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
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

  const filtered = SAMPLE_DESTINATIONS.filter((d) => {
    const q = query.toLowerCase().trim();
    return !q || d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.region.toLowerCase().includes(q);
  });

  const handleSelect = (dest) => {
    const fullStr = `${dest.city}, ${dest.country}`;
    setQuery(fullStr);
    onChange(fullStr);
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
  };

  return (
    <div className={`gt-field ${error ? 'gt-field--error' : ''}`} ref={containerRef}>
      <label htmlFor="destination-autocomplete" className="gt-field__label">
        Destination / Primary Place
        {required && <span className="gt-field__required"> *</span>}
      </label>

      <div className="gt-input-wrapper">
        <div className="gt-input__icon-left">
          <MapPin className="gt-icon" />
        </div>

        <input
          id="destination-autocomplete"
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city or place (e.g., Goa, Kyoto, Paris, Interlaken)..."
          className="gt-input gt-input--has-left-icon gt-input--has-right-icon"
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            className="gt-input__toggle-password"
            onClick={() => {
              setQuery('');
              onChange('');
            }}
            aria-label="Clear destination"
          >
            <X className="gt-icon" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <ul className="gt-autocomplete-list animate-fade-in" role="listbox">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item.id}
                className="gt-autocomplete-item flex justify-between items-center"
                onClick={() => handleSelect(item)}
                role="option"
                aria-selected={query.includes(item.city)}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="gt-autocomplete-icon" />
                  <div className="flex-col">
                    <strong>{item.city}</strong>
                    <span className="text-xs text-muted">{item.country} • {item.region}</span>
                  </div>
                </div>

                <span className="gt-autocomplete-tag">{item.tag}</span>
              </li>
            ))
          ) : (
            <li className="gt-autocomplete-item gt-autocomplete-item--custom" onClick={() => setIsOpen(false)}>
              <span>Use custom location: <strong>"{query}"</strong></span>
            </li>
          )}
        </ul>
      )}

      {error && <p className="gt-field__error-text" role="alert">{error}</p>}
    </div>
  );
};
