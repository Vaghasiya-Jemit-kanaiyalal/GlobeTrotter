import React, { useMemo } from 'react';
import { WeekdayHeader } from './WeekdayHeader';
import { CalendarDay } from './CalendarDay';
import './CalendarGrid.css';

export const CalendarGrid = ({
  currentDate,
  events = [],
  onSelectDate,
  onSelectEvent,
}) => {
  const todayDateString = new Date().toISOString().split('T')[0];

  // Calculate days matrix for current month (42 cells: 6 weeks x 7 days)
  const calendarCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 6 = Sat
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const cells = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      const dStr = prevDate.toISOString().split('T')[0];
      cells.push({
        date: prevDate,
        dayNumber: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: dStr === todayDateString,
        dateString: dStr,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const currDate = new Date(year, month, d);
      // Format as YYYY-MM-DD in local time
      const yearStr = currDate.getFullYear();
      const monthStr = String(currDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(currDate.getDate()).padStart(2, '0');
      const dStr = `${yearStr}-${monthStr}-${dayStr}`;

      cells.push({
        date: currDate,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dStr === todayDateString,
        dateString: dStr,
      });
    }

    // Next month padding days to complete grid (42 cells total for 6 rows)
    const remainingCells = 42 - cells.length;
    for (let d = 1; d <= remainingCells; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dStr = nextDate.toISOString().split('T')[0];
      cells.push({
        date: nextDate,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dStr === todayDateString,
        dateString: dStr,
      });
    }

    return cells;
  }, [currentDate, todayDateString]);

  // Map events to date cells (handling both single day and multi-day spans)
  const cellEventsMap = useMemo(() => {
    const map = {};

    calendarCells.forEach((cell) => {
      map[cell.dateString] = [];
    });

    events.forEach((evt) => {
      if (evt.type === 'trip' && evt.startDate && evt.endDate) {
        // Multi-day trip event spanning date range
        calendarCells.forEach((cell) => {
          if (cell.dateString >= evt.startDate && cell.dateString <= evt.endDate) {
            map[cell.dateString].push({
              ...evt,
              isMultiDaySpan: true,
              isStart: cell.dateString === evt.startDate,
              isEnd: cell.dateString === evt.endDate,
            });
          }
        });
      } else {
        // Single day event (activity / travel / stay)
        const evtDate = evt.date || evt.startDate;
        if (map[evtDate]) {
          map[evtDate].push(evt);
        }
      }
    });

    return map;
  }, [calendarCells, events]);

  return (
    <div className="gt-calendar-grid-wrapper">
      <WeekdayHeader />
      <div className="gt-calendar-grid">
        {calendarCells.map((cellObj) => (
          <CalendarDay
            key={cellObj.dateString}
            dayObj={cellObj}
            events={cellEventsMap[cellObj.dateString] || []}
            onSelectDate={onSelectDate}
            onSelectEvent={onSelectEvent}
          />
        ))}
      </div>
    </div>
  );
};
