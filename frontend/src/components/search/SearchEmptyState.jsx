import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/Button';
import './SearchEmptyState.css';

export const SearchEmptyState = ({ query, searchType = 'activities', onClearSearch }) => {
  return (
    <div className="gt-search-empty-box flex-col items-center text-center gap-3 animate-fade-in">
      <div className="gt-search-empty-icon flex items-center justify-center">
        <Search className="gt-icon" />
      </div>
      <h3>No {searchType} found</h3>
      <p className="text-sm text-muted">
        No results found for {query ? `"${query}"` : 'your current filter criteria'}. Try searching another activity, city, or keyword.
      </p>
      <Button variant="outline" size="sm" icon={X} onClick={onClearSearch}>
        Clear Search & Filters
      </Button>
    </div>
  );
};
