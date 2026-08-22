import React from 'react';
import { CalendarEvent } from './CalendarEvent';
import { MultiDayEvent } from './MultiDayEvent';
import './CalendarDay.css';

export const CalendarDay = ({
  dayObj, // { date, dayNumber, isCurrentMonth, isToday, dateString }
  events = [],
  onSelectDate,
  onSelectEvent,
}) => {
  const { dayNumber, isCurrentMonth, isToday } = dayObj;

  // Maximum events to display before showing "+X more"
  const MAX_VISIBLE = 2;
  const visibleEvents = events.slice(0, MAX_VISIBLE);
  const hiddenCount = events.length - MAX_VISIBLE;

  return (
    <div
      className={`gt-calendar-day-cell ${!isCurrentMonth ? 'gt-day-cell--other-month' : ''} ${isToday ? 'gt-day-cell--today' : ''}`}
      onClick={() => onSelectDate(dayObj, events)}
    >
      {/* Date Cell Top Header */}
      <div className="gt-day-cell-top flex items-center justify-between mb-1">
        <span className={`gt-day-number ${isToday ? 'gt-day-number--today' : ''}`}>
          {dayNumber}
        </span>

        {isToday && (
          <span className="gt-today-label-pill">TODAY</span>
        )}
      </div>

      {/* Events inside Cell */}
      <div className="gt-day-events-wrapper">
        {visibleEvents.map((evt) => {
          if (evt.isMultiDaySpan) {
            return (
              <MultiDayEvent
                key={`${evt.id}-${dayObj.dateString}`}
                event={evt}
                isStart={evt.isStart}
                isEnd={evt.isEnd}
                onSelectEvent={onSelectEvent}
              />
            );
          }

          return (
            <CalendarEvent
              key={evt.id}
              event={evt}
              onSelectEvent={onSelectEvent}
              compact={true}
            />
          );
        })}

        {hiddenCount > 0 && (
          <div
            className="gt-more-events-pill text-xs font-bold text-amber-700"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDate(dayObj, events);
            }}
          >
            +{hiddenCount} more
          </div>
        )}
      </div>
    </div>
  );
};
