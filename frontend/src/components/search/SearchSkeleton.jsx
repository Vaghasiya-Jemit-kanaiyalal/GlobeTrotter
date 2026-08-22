import React from 'react';
import './SearchSkeleton.css';

export const SearchSkeleton = ({ count = 4 }) => {
  return (
    <div className="gt-search-skeleton-list flex-col gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="gt-search-skeleton-card flex-col sm:flex-row gap-4">
          <div className="gt-search-skeleton-img pulse" />
          <div className="gt-search-skeleton-body flex-1 flex-col gap-3">
            <div className="gt-skeleton-line short pulse" />
            <div className="gt-skeleton-line medium pulse" />
            <div className="gt-skeleton-line long pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
