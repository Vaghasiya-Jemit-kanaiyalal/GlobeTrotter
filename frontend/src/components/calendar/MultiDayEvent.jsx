import React from 'react';
import { Compass } from 'lucide-react';
import './MultiDayEvent.css';

export const MultiDayEvent = ({
  event,
  isStart = false,
  isEnd = false,
  onSelectEvent,
}) => {
  return (
    <div
      className={`gt-multiday-bar ${isStart ? 'gt-multiday-bar--start' : ''} ${isEnd ? 'gt-multiday-bar--end' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectEvent(event);
      }}
      title={`${event.title} (${event.startDate} – ${event.endDate})`}
    >
      <div className="gt-multiday-inner flex items-center gap-1">
        {isStart && <Compass className="w-3 h-3 flex-shrink-0 text-white" />}
        <span className="gt-multiday-title truncate">
          {isStart ? event.title.toUpperCase() : ''}
        </span>
      </div>
    </div>
  );
};
