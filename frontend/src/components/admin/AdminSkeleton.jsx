import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './AdminSkeleton.css';

export const AdminSkeleton = () => {
  return (
    <div className="gt-admin-skeleton animate-pulse flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-white border border-border rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-56 bg-white border border-border rounded-lg" />
        <div className="h-56 bg-white border border-border rounded-lg" />
      </div>
    </div>
  );
};

export const AdminErrorState = ({ onRetry, message = 'Unable to load administration data.' }) => {
  return (
    <div className="gt-admin-error-card text-center">
      <div className="gt-admin-error-icon mx-auto mb-3">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="font-bold text-lg text-navy-900 mb-1">Analytics Error</h3>
      <p className="text-sm text-navy-600 mb-4 max-w-md mx-auto">{message}</p>
      <Button variant="primary" size="md" icon={RefreshCw} onClick={onRetry}>
        Retry Loading Analytics
      </Button>
    </div>
  );
};
