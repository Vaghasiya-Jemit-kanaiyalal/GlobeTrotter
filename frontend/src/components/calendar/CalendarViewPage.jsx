import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CALENDAR_EVENTS } from '../../data/calendarData';
import { apiClient } from '../../services/apiClient';
import { CalendarHeader } from './CalendarHeader';
import { CalendarControls } from './CalendarControls';
import { MonthNavigator } from './MonthNavigator';
import { CalendarGrid } from './CalendarGrid';
import { EventPopover } from './EventPopover';
import { DayDetails } from './DayDetails';
import { EmptyCalendar } from './EmptyCalendar';
import { CalendarSkeleton, CalendarError } from './CalendarSkeleton';
import { Calendar as CalendarIcon, Compass } from 'lucide-react';
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

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Modal / Popover States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayObj, setSelectedDayObj] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  // Fetch live calendar events from Express Backend (/api/v1/calendar)
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const res = await apiClient.get('/calendar', { month, year });
        if (res && Array.isArray(res.events) && res.events.length > 0) {
          const mapped = res.events.map((e) => ({
            id: e.id,
            title: e.title,
            type: e.type,
            date: e.startDate || e.date,
            startDate: e.startDate,
            endDate: e.endDate,
            startTime: e.startTime || '09:00 AM',
            endTime: e.endTime || '11:00 AM',
            destination: e.destination || e.city || 'Goa, India',
            city: e.city || 'Goa',
            category: e.category || (e.type === 'trip' ? 'Trip' : 'Sightseeing'),
            cost: typeof e.cost === 'number' ? `₹${e.cost.toLocaleString()}` : (e.cost || '₹0'),
            duration: e.duration ? `${e.duration} mins` : '2 hours',
            notes: e.notes || '',
            image: e.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
          }));
          setEvents(mapped);
        }
      } catch (err) {
        console.warn('Calendar API fetch warning:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarEvents();
  }, [currentDate]);

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

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
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
          <CalendarError onRetry={handleReload} />
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
