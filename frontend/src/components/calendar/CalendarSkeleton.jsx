import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './CalendarSkeleton.css';

export const CalendarSkeleton = () => {
  return (
    <div className="gt-cal-skeleton-container animate-pulse">
      <div className="gt-cal-skeleton-header h-12 w-full mb-3 rounded-lg" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 28 }).map((_, idx) => (
          <div key={idx} className="gt-cal-skeleton-cell h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export const CalendarError = ({ onRetry, message = 'Failed to load calendar events and itineraries.' }) => {
  return (
    <div className="gt-cal-error-card text-center">
      <div className="gt-cal-error-icon mx-auto mb-3">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="font-bold text-lg text-navy-900 mb-1">Calendar Error</h3>
      <p className="text-sm text-navy-600 mb-4 max-w-md mx-auto">{message}</p>
      <Button variant="primary" size="md" icon={RefreshCw} onClick={onRetry}>
        Retry Loading Calendar
      </Button>
    </div>
  );
};
