import React from 'react';
import './TripSkeleton.css';

export const TripSkeleton = ({ count = 3 }) => {
  return (
    <div className="gt-skeleton-grid grid grid-cols-1 sm:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="gt-skeleton-card">
          <div className="gt-skeleton-img pulse" />
          <div className="gt-skeleton-body flex-col gap-3">
            <div className="gt-skeleton-line short pulse" />
            <div className="gt-skeleton-line medium pulse" />
            <div className="gt-skeleton-line long pulse" />
            <div className="gt-skeleton-line short pulse" style={{ marginTop: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
};
