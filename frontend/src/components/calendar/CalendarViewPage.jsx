import React, { useState, useMemo } from 'react';
import { MOCK_CALENDAR_EVENTS } from '../../data/calendarData';
import { CalendarHeader } from './CalendarHeader';
import { CalendarControls } from './CalendarControls';
import { MonthNavigator } from './MonthNavigator';
import { CalendarGrid } from './CalendarGrid';
import { EventPopover } from './EventPopover';
import { DayDetails } from './DayDetails';
import { EmptyCalendar } from './EmptyCalendar';
import { CalendarSkeleton, CalendarError } from './CalendarSkeleton';
import { Calendar as CalendarIcon, Compass, Sparkles, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import './CalendarViewPage.css';

export const CalendarViewPage = ({
  currentUser,
  onBack,
  onOpenCreateTrip,
  onNavigateToItinerary,
  onLogout,
  onShowToast,
}) => {
  // Calendar Current Month State (Default to September 2026 for rich mock data view)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Sep 2026

  // Events Master State
  const [events, setEvents] = useState(MOCK_CALENDAR_EVENTS);

  // Search & Filter Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('day');
  const [filterType, setFilterType] = useState('All');
  const [filterDestination, setFilterDestination] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  // Loading & Error States for Demo Testing
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Modal / Popover States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayObj, setSelectedDayObj] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  // Extract available destinations
  const availableDestinations = useMemo(() => {
    const set = new Set();
    events.forEach((evt) => {
      if (evt.destination) set.add(evt.destination);
    });
    return Array.from(set);
  }, [events]);

  // Filter & Sort Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        (evt.destination && evt.destination.toLowerCase().includes(q)) ||
        (evt.city && evt.city.toLowerCase().includes(q)) ||
        (evt.category && evt.category.toLowerCase().includes(q));

      const matchesType = filterType === 'All' || evt.type === filterType;
      const matchesDest = filterDestination === 'All' || evt.destination === filterDestination;

      return matchesSearch && matchesType && matchesDest;
    }).sort((a, b) => {
      if (sortBy === 'tripName') return a.title.localeCompare(b.title);
      if (sortBy === 'destination') return (a.destination || '').localeCompare(b.destination || '');
      return 0; // Date default
    });
  }, [events, searchQuery, filterType, filterDestination, sortBy]);

  // Count upcoming trips and events in current month
  const currentMonthYearStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const upcomingTripsCount = useMemo(() => {
    return events.filter((e) => e.type === 'trip' && e.status !== 'Completed').length;
  }, [events]);

  const thisMonthEventsCount = useMemo(() => {
    return filteredEvents.filter((e) => {
      const d = e.startDate || e.date;
      return d && d.startsWith(currentMonthYearStr);
    }).length;
  }, [filteredEvents, currentMonthYearStr]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date()); // Jump to actual current date
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setFilterDestination('All');
    setSortBy('date');
  };

  const handleSimulateReload = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const isFiltered = Boolean(searchQuery || filterType !== 'All' || filterDestination !== 'All');

  return (
    <div className="gt-calendar-view-root">
      {/* 1. Standard Header */}
      <CalendarHeader
        currentUser={currentUser}
        onBack={onBack}
        onOpenCreateTrip={onOpenCreateTrip}
        onLogout={onLogout}
      />

      <main className="gt-calendar-container">
        {/* State Simulator Controls (For testing Loading / Error states as required by Section 15) */}
        <div className="gt-demo-state-bar flex items-center justify-between gap-2 p-2 mb-4 bg-subtle rounded-lg border text-xs">
          <span className="font-semibold text-navy-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            Screen 11 Demo Controls:
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              className="gt-state-toggle-btn"
              onClick={handleSimulateReload}
            >
              <RefreshCw className="w-3 h-3 inline mr-1" />
              Simulate Loading
            </button>

            <button
              type="button"
              className={`gt-state-toggle-btn ${hasError ? 'gt-state-toggle-btn--active' : ''}`}
              onClick={() => setHasError(!hasError)}
            >
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {hasError ? 'Clear Error' : 'Simulate Error State'}
            </button>
          </div>
        </div>

        {/* 2. Calendar View Heading & Badges */}
        <div className="gt-calendar-view-heading flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h1 className="gt-calendar-page-title brand-serif m-0">Calendar View</h1>
            <p className="gt-calendar-page-sub text-xs text-muted m-0 mt-0.5">
              Visual representation of your journey & daily schedule flow
            </p>
          </div>

          <div className="gt-calendar-heading-badges flex items-center gap-2">
            <span className="gt-cal-badge-item">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              Upcoming Trips · <strong>{upcomingTripsCount}</strong>
            </span>

            <span className="gt-cal-badge-item gt-cal-badge-item--highlight">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
              This Month · <strong>{thisMonthEventsCount} Events</strong>
            </span>
          </div>
        </div>

        {/* 3. Search and Controls */}
        <CalendarControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          filterDestination={filterDestination}
          onFilterDestinationChange={setFilterDestination}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          availableDestinations={availableDestinations}
          onResetFilters={handleResetFilters}
        />

        {/* 4. Month Navigator */}
        <MonthNavigator
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {/* Main Content Layout */}
        {hasError ? (
          <CalendarError onRetry={handleSimulateReload} />
        ) : isLoading ? (
          <CalendarSkeleton />
        ) : filteredEvents.length === 0 && isFiltered ? (
          <EmptyCalendar
            isFiltered={true}
            onPlanTrip={onOpenCreateTrip}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            events={filteredEvents}
            onSelectDate={(dayObj, dayEvts) => {
              setSelectedDayObj(dayObj);
              setSelectedDayEvents(dayEvts);
            }}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />
        )}
      </main>

      {/* Popover / Modal for Single Event Details */}
      <EventPopover
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        onViewTrip={(tripId) => {
          setSelectedEvent(null);
          if (onNavigateToItinerary) onNavigateToItinerary(tripId);
        }}
      />

      {/* Modal / Drawer for Day Details */}
      <DayDetails
        dayObj={selectedDayObj}
        events={selectedDayEvents}
        isOpen={Boolean(selectedDayObj)}
        onClose={() => setSelectedDayObj(null)}
        onViewItinerary={() => {
          setSelectedDayObj(null);
          if (onNavigateToItinerary) onNavigateToItinerary('trip-goa');
        }}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
      />
    </div>
  );
};
