import React from 'react';
import './TripProgress.css';

export const TripProgress = ({ currentDay = 1, totalDays = 7, percentage = 30 }) => {
  return (
    <div className="gt-trip-progress-box flex-col gap-1">
      <div className="flex justify-between items-center text-xs">
        <span className="gt-trip-progress-label">Trip Progress</span>
        <span className="gt-trip-progress-days font-semibold">
          Day {currentDay} of {totalDays}
        </span>
      </div>
      <div className="gt-progress-bar-bg">
        <div
          className="gt-progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
