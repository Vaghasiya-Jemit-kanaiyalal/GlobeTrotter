import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import './AdminEmptyState.css';

export const AdminEmptyState = ({ onResetFilters, message = 'No data available for this search.' }) => {
  return (
    <div className="gt-admin-empty-card text-center">
      <div className="gt-admin-empty-icon mx-auto mb-3">
        <SearchX className="w-8 h-8 text-amber-600" />
      </div>

      <h3 className="gt-admin-empty-title brand-serif">No Data Found</h3>

      <p className="gt-admin-empty-sub text-sm text-navy-600 max-w-md mx-auto mb-4">
        {message}
      </p>

      {onResetFilters && (
        <div className="flex justify-center">
          <Button variant="outline" size="md" icon={RefreshCw} onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
