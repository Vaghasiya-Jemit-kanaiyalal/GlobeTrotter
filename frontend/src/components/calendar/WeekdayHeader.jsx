import React from 'react';
import './WeekdayHeader.css';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const WeekdayHeader = () => {
  return (
    <div className="gt-weekday-grid grid grid-cols-7 text-center">
      {WEEKDAYS.map((day, idx) => (
        <div
          key={day}
          className={`gt-weekday-col ${idx === 0 || idx === 6 ? 'gt-weekday-col--weekend' : ''}`}
        >
          <span>{day}</span>
        </div>
      ))}
    </div>
  );
};
