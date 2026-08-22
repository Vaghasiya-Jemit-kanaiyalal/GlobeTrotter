import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './MonthNavigator.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MonthNavigator = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const year = currentDate.getFullYear();
  const monthName = MONTH_NAMES[currentDate.getMonth()];

  return (
    <div className="gt-month-navigator flex items-center justify-between flex-wrap gap-3">
      {/* Month & Year Title */}
      <div className="gt-month-title-wrapper flex items-center gap-2">
        <h2 className="gt-month-title brand-serif m-0">
          {monthName} {year}
        </h2>
      </div>

      {/* Navigation Buttons */}
      <div className="gt-month-nav-controls flex items-center gap-2">
        <button
          type="button"
          className="gt-today-btn text-xs font-semibold flex items-center gap-1"
          onClick={onToday}
          title="Jump to Current Month"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
          Today
        </button>

        <div className="gt-nav-arrows flex items-center gap-1">
          <button
            type="button"
            className="gt-nav-arrow-btn"
            onClick={onPrevMonth}
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="gt-nav-arrow-btn"
            onClick={onNextMonth}
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
