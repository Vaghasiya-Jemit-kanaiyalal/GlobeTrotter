import React, { useState, useMemo } from 'react';
import { MOCK_ITINERARY_DATA } from '../../data/itineraryData';
import { ItineraryHeader } from './ItineraryHeader';
import { TripSummary } from './TripSummary';
import { SearchControls } from './SearchControls';
import { DaySection } from './DaySection';
import { BudgetSummary } from './BudgetSummary';
import { EmptyItinerary } from './EmptyItinerary';
import { LoadingState, ErrorState } from './LoadingState';
import { ActivityEditModal } from './ActivityEditModal';
import { Button } from '../ui/Button';
import { RefreshCw, AlertCircle, Plus, Eye } from 'lucide-react';
import './ItineraryViewPage.css';

export const ItineraryViewPage = ({
  currentUser,
  onBack,
  onOpenCreateTrip,
  onLogout,
  onShowToast,
}) => {
  // Active Trip State
  const [selectedTripId, setSelectedTripId] = useState('trip-goa');
  const [itineraryData, setItineraryData] = useState(MOCK_ITINERARY_DATA);

  // Search & Filter Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('day'); // 'day' | 'city' | 'category'
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'cost-asc' | 'cost-desc' | 'name'

  // Loading & Error States for Demo Testing
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // 'view' | 'edit' | 'add'
    activity: null,
    targetDayNumber: 1,
  });

  const currentTripData = itineraryData[selectedTripId] || MOCK_ITINERARY_DATA['trip-goa'];
  const { trip, days, budget } = currentTripData;

  // Extract available cities & categories for filters
  const availableCities = useMemo(() => {
    const set = new Set();
    days.forEach((d) => {
      if (d.city) set.add(d.city);
    });
    return Array.from(set);
  }, [days]);

  const availableCategories = useMemo(() => {
    const set = new Set();
    days.forEach((d) => {
      d.activities.forEach((a) => {
        if (a.category) set.add(a.category);
      });
    });
    return Array.from(set);
  }, [days]);

  // Recalculate dynamic budget totals based on current activities
  const dynamicBudget = useMemo(() => {
    let totalActivitiesCost = 0;
    days.forEach((day) => {
      day.activities.forEach((act) => {
        const costNum = typeof act.cost === 'number' ? act.cost : parseFloat(act.cost) || 0;
        totalActivitiesCost += costNum;
      });
    });

    const transport = budget.transport || 0;
    const stay = budget.stay || 0;
    const meals = budget.meals || 0;
    const other = budget.other || 0;
    const totalSpent = transport + stay + totalActivitiesCost + meals + other;

    return {
      ...budget,
      activities: totalActivitiesCost,
      total: totalSpent,
      averagePerDay: Math.round(totalSpent / (days.length || 1)),
    };
  }, [days, budget]);

  // Filter & Sort Activities per Day
  const filteredDays = useMemo(() => {
    return days.map((day) => {
      let filteredActs = day.activities.filter((act) => {
        const matchesQuery =
          !searchQuery ||
          act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          act.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          day.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = filterCategory === 'All' || act.category === filterCategory;
        const matchesCity = filterCity === 'All' || day.city === filterCity;

        return matchesQuery && matchesCategory && matchesCity;
      });

      // Sort
      filteredActs = [...filteredActs].sort((a, b) => {
        if (sortBy === 'cost-asc') return (a.cost || 0) - (b.cost || 0);
        if (sortBy === 'cost-desc') return (b.cost || 0) - (a.cost || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // Default sequence time
      });

      return {
        ...day,
        activities: filteredActs,
      };
    });
  }, [days, searchQuery, filterCategory, filterCity, sortBy]);

  const hasAnyActivities = filteredDays.some((d) => d.activities.length > 0);
  const isFiltered = Boolean(searchQuery || filterCategory !== 'All' || filterCity !== 'All');

  // Handle activity save (edit or add)
  const handleSaveActivity = (updatedAct) => {
    setItineraryData((prev) => {
      const tripCopy = JSON.parse(JSON.stringify(prev[selectedTripId]));
      const targetDay = tripCopy.days.find((d) => d.dayNumber === updatedAct.dayNumber);

      if (targetDay) {
        const existingIdx = targetDay.activities.findIndex((a) => a.id === updatedAct.id);
        if (existingIdx >= 0) {
          targetDay.activities[existingIdx] = updatedAct;
        } else {
          targetDay.activities.push(updatedAct);
        }
      }

      return {
        ...prev,
        [selectedTripId]: tripCopy,
      };
    });

    if (onShowToast) {
      onShowToast(
        modalState.mode === 'add'
          ? `Activity "${updatedAct.name}" added to Day ${updatedAct.dayNumber}!`
          : `Updated activity "${updatedAct.name}"`,
        'success'
      );
    }
  };

  // Handle activity removal
  const handleRemoveActivity = (activityId) => {
    setItineraryData((prev) => {
      const tripCopy = JSON.parse(JSON.stringify(prev[selectedTripId]));
      tripCopy.days.forEach((day) => {
        day.activities = day.activities.filter((a) => a.id !== activityId);
      });
      return {
        ...prev,
        [selectedTripId]: tripCopy,
      };
    });

    if (onShowToast) {
      onShowToast('Activity removed from itinerary', 'info');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCategory('All');
    setFilterCity('All');
    setSortBy('time');
  };

  const handleSimulateReload = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="gt-itinerary-view-root">
      {/* 1. Classical Header */}
      <ItineraryHeader
        currentUser={currentUser}
        selectedTripName={trip.name}
        onBack={onBack}
        onOpenCreateTrip={onOpenCreateTrip}
        onLogout={onLogout}
      />

      <main className="gt-itinerary-container">
        {/* State Simulator Controls (For testing Loading / Error states as required by Section 13) */}
        <div className="gt-demo-state-bar flex items-center justify-between gap-2 p-2 mb-4 bg-subtle rounded-lg border text-xs">
          <span className="font-semibold text-navy-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            Screen 9 Demo Controls:
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

        {/* 2. Trip Title Summary Header */}
        <TripSummary
          trip={trip}
          allTrips={Object.values(itineraryData).map((d) => d.trip)}
          onSelectTrip={(id) => setSelectedTripId(id)}
          currency={trip.currency}
          estimatedTotal={dynamicBudget.total}
        />

        {/* 3. Search and Control Bar */}
        <SearchControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
          filterCity={filterCity}
          onFilterCityChange={setFilterCity}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          availableCities={availableCities}
          availableCategories={availableCategories}
          onResetFilters={handleResetFilters}
        />

        {/* Main Content Layout */}
        {hasError ? (
          <ErrorState onRetry={handleSimulateReload} />
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <div className="gt-itinerary-layout-grid">
            {/* Left Column: Vertical Itinerary Timeline */}
            <section className="gt-itinerary-timeline-column">
              {!hasAnyActivities ? (
                <EmptyItinerary
                  isFiltered={isFiltered}
                  onBuildItinerary={onOpenCreateTrip || onBack}
                  onResetFilters={handleResetFilters}
                />
              ) : (
                filteredDays.map((day) => {
                  if (day.activities.length === 0 && isFiltered) return null;

                  return (
                    <DaySection
                      key={day.dayNumber}
                      day={day}
                      currency={trip.currency}
                      onViewDetails={(act) =>
                        setModalState({
                          isOpen: true,
                          mode: 'view',
                          activity: act,
                          targetDayNumber: day.dayNumber,
                        })
                      }
                      onEditActivity={(act) =>
                        setModalState({
                          isOpen: true,
                          mode: 'edit',
                          activity: act,
                          targetDayNumber: day.dayNumber,
                        })
                      }
                      onRemoveActivity={handleRemoveActivity}
                      onAddActivityToDay={(dayNum) =>
                        setModalState({
                          isOpen: true,
                          mode: 'add',
                          activity: null,
                          targetDayNumber: dayNum,
                        })
                      }
                    />
                  );
                })
              )}
            </section>

            {/* Right Column: Overall Budget Summary Panel */}
            <section className="gt-itinerary-budget-column">
              <BudgetSummary
                budget={dynamicBudget}
                budgetLimit={trip.budgetLimit}
                currency={trip.currency}
                daysCount={days.length}
              />
            </section>
          </div>
        )}
      </main>

      {/* Activity View / Edit / Add Modal Dialog */}
      <ActivityEditModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        activity={modalState.activity}
        dayNumber={modalState.targetDayNumber}
        currency={trip.currency}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSave={handleSaveActivity}
      />
    </div>
  );
};
