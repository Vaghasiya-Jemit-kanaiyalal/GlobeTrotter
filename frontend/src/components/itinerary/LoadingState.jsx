import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './LoadingState.css';

export const LoadingState = () => {
  return (
    <div className="gt-loading-skeleton-container animate-pulse">
      {/* Day Section Skeleton */}
      <div className="gt-skeleton-card mb-4">
        <div className="gt-skeleton-bar h-8 w-48 mb-4" />
        <div className="flex gap-4 mb-3">
          <div className="gt-skeleton-bar h-12 w-20" />
          <div className="gt-skeleton-bar h-12 flex-1" />
        </div>
        <div className="flex gap-4">
          <div className="gt-skeleton-bar h-12 w-20" />
          <div className="gt-skeleton-bar h-12 flex-1" />
        </div>
      </div>

      <div className="gt-skeleton-card">
        <div className="gt-skeleton-bar h-8 w-40 mb-4" />
        <div className="flex gap-4">
          <div className="gt-skeleton-bar h-12 w-20" />
          <div className="gt-skeleton-bar h-12 flex-1" />
        </div>
      </div>
    </div>
  );
};

export const ErrorState = ({ onRetry, message = 'Failed to load trip itinerary and budget details.' }) => {
  return (
    <div className="gt-error-state-card text-center">
      <div className="gt-error-icon-circle mx-auto mb-3">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="gt-error-title font-bold text-lg text-navy-900 mb-1">
        Request Error
      </h3>
      <p className="gt-error-desc text-sm text-navy-600 mb-4 max-w-md mx-auto">
        {message}
      </p>
      <Button
        variant="primary"
        size="md"
        icon={RefreshCw}
        onClick={onRetry}
      >
        Retry Loading Itinerary
      </Button>
    </div>
  );
};
