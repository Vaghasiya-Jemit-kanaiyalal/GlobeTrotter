import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './CommunitySkeleton.css';

export const CommunitySkeleton = () => {
  return (
    <div className="gt-comm-skeleton-list animate-pulse">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="gt-comm-skeleton-card p-4 bg-white border border-border rounded-xl mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-subtle" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="h-4 w-32 bg-subtle rounded" />
              <div className="h-3 w-24 bg-subtle rounded" />
            </div>
          </div>
          <div className="h-5 w-3/4 bg-subtle rounded mb-2" />
          <div className="h-4 w-full bg-subtle rounded mb-1" />
          <div className="h-4 w-2/3 bg-subtle rounded mb-3" />
          <div className="h-48 w-full bg-subtle rounded mb-3" />
        </div>
      ))}
    </div>
  );
};

export const CommunityError = ({ onRetry, message = 'Failed to load community experiences.' }) => {
  return (
    <div className="gt-comm-error-card text-center">
      <div className="gt-comm-error-icon mx-auto mb-3">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="font-bold text-lg text-navy-900 mb-1">Community Error</h3>
      <p className="text-sm text-navy-600 mb-4 max-w-md mx-auto">{message}</p>
      <Button variant="primary" size="md" icon={RefreshCw} onClick={onRetry}>
        Retry Loading Posts
      </Button>
    </div>
  );
};
