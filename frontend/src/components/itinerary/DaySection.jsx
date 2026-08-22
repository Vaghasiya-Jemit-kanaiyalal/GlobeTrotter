import React from 'react';
import { Calendar, MapPin, Plus } from 'lucide-react';
import { Timeline } from './Timeline';
import { DayBudget } from './DayBudget';
import './DaySection.css';

export const DaySection = ({
  day,
  currency = '₹',
  onViewDetails,
  onEditActivity,
  onRemoveActivity,
  onAddActivityToDay,
}) => {
  // Calculate total cost for this day
  const dayTotal = day.activities.reduce((acc, act) => {
    const costNum = typeof act.cost === 'number' ? act.cost : (parseFloat(act.cost) || 0);
    return acc + costNum;
  }, 0);

  return (
    <div className="gt-day-section">
      {/* Day Header Banner */}
      <div className="gt-day-header flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="gt-day-badge">
            <span>DAY {day.dayNumber}</span>
          </div>

          <div className="gt-day-meta flex items-center gap-2 flex-wrap">
            <span className="gt-day-city font-bold text-navy-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {day.city}
            </span>
            <span className="gt-day-date text-xs text-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {day.date}
            </span>
          </div>
        </div>

        {/* Quick Add Activity Button */}
        {onAddActivityToDay && (
          <button
            type="button"
            className="gt-add-act-day-btn text-xs font-semibold flex items-center gap-1"
            onClick={() => onAddActivityToDay(day.dayNumber)}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Activity
          </button>
        )}
      </div>

      {/* Vertical Activity Timeline */}
      <Timeline
        activities={day.activities}
        currency={currency}
        onViewDetails={onViewDetails}
        onEditActivity={onEditActivity}
        onRemoveActivity={onRemoveActivity}
      />

      {/* Day Budget Summary Table */}
      {day.activities.length > 0 && (
        <DayBudget
          dayNumber={day.dayNumber}
          activities={day.activities}
          dayTotal={dayTotal}
          currency={currency}
        />
      )}
    </div>
  );
};
