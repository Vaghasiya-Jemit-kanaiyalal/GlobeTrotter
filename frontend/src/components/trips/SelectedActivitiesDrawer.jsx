import React from 'react';
import { CheckCircle2, X, Compass, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import './SelectedActivitiesDrawer.css';

export const SelectedActivitiesDrawer = ({
  selectedActivities = [],
  onRemoveActivity,
  onCreateTripClick,
}) => {
  if (selectedActivities.length === 0) return null;

  return (
    <div className="gt-selected-drawer animate-fade-in">
      <div className="gt-selected-drawer__inner flex justify-between items-center">
        {/* Left: Summary Count */}
        <div className="gt-selected-drawer__summary flex items-center gap-3">
          <div className="gt-selected-drawer__badge flex items-center gap-1">
            <CheckCircle2 className="gt-icon" />
            <span>{selectedActivities.length} {selectedActivities.length === 1 ? 'Item' : 'Items'} Selected</span>
          </div>

          {/* Selected Pills */}
          <div className="gt-selected-drawer__pills flex gap-2">
            {selectedActivities.map((act) => (
              <span key={act.id} className="gt-selected-pill flex items-center gap-1">
                <span>{act.name}</span>
                <button
                  type="button"
                  className="gt-selected-pill__remove"
                  onClick={() => onRemoveActivity(act)}
                  title={`Remove ${act.name}`}
                >
                  <X className="gt-icon" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Quick Action */}
        <div className="gt-selected-drawer__action flex items-center gap-3">
          <span className="text-xs text-muted">Ready to finalize itinerary</span>
          <Button
            variant="primary"
            size="sm"
            icon={Compass}
            onClick={onCreateTripClick}
          >
            Create Trip ({selectedActivities.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
