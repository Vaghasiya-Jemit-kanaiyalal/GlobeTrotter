import React, { useState, useEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { TripCard } from './TripCard';
import { TripSearchControls } from './TripSearchControls';
import { TripSkeleton } from './TripSkeleton';
import { EmptyTripState } from './EmptyTripState';
import { EditTripModal } from './EditTripModal';
import { ShareTripModal } from './ShareTripModal';
import { DeleteTripModal } from './DeleteTripModal';
import { tripApi } from '../../services/tripApi';
import { Button } from '../ui/Button';
import { Compass, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import './UserTripListingScreen.css';

export const UserTripListingScreen = ({
  currentUser,
  onNavigate,
  onOpenCreateTrip,
  onViewTripDetails,
  onShowToast,
}) => {
  // State
  const [tripsData, setTripsData] = useState([]);
  const [stats, setStats] = useState({ total: 0, ongoing: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Status');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal States
  const [editTrip, setEditTrip] = useState(null);
  const [shareTrip, setShareTrip] = useState(null);
  const [deleteTrip, setDeleteTrip] = useState(null);

  // Fetch Trips from API Service
  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripApi.getTrips({
        status: filterStatus,
        search: searchQuery,
        sortBy: sortBy,
      });
      setTripsData(res.data);
      setStats({
        total: res.totalCount,
        ongoing: res.ongoingCount,
        upcoming: res.upcomingCount,
        completed: res.completedCount,
      });
    } catch (err) {
      setError('Unable to load your trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [searchQuery, filterStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setGroupBy('Status');
    setFilterStatus('All');
    setSortBy('Newest');
  };

  const handleSaveEditTrip = async (id, updatedFields) => {
    await tripApi.updateTrip(id, updatedFields);
    onShowToast('Trip updated successfully!', 'success');
    fetchTrips();
  };

  const handleDeleteTripSubmit = async (id) => {
    await tripApi.deleteTrip(id);
    onShowToast('Trip deleted from your account', 'info');
    fetchTrips();
  };

  const handlePlanSimilarTrip = async (tripToClone) => {
    const clonedTripData = {
      title: `${tripToClone.title} (New)`,
      primaryLocation: tripToClone.primaryLocation,
      coverImage: tripToClone.coverImage,
      startDate: '2026-11-01',
      endDate: '2026-11-08',
      dateRange: '01 Nov – 08 Nov 2026',
      destinations: tripToClone.destinations,
      summary: `Cloned itinerary based on ${tripToClone.title}.`,
    };
    await tripApi.createTrip(clonedTripData);
    onShowToast(`Created new trip based on "${tripToClone.title}"!`, 'success');
    fetchTrips();
  };

  // Group Trips
  const ongoingTrips = tripsData.filter((t) => t.calculatedStatus === 'Ongoing');
  const upcomingTrips = tripsData.filter((t) => t.calculatedStatus === 'Upcoming');
  const completedTrips = tripsData.filter((t) => t.calculatedStatus === 'Completed');

  return (
    <div className="gt-my-trips-screen">
      {/* 1. Header Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab="trips"
        onNavigate={onNavigate}
        onOpenCreateTrip={onOpenCreateTrip}
        onSwitchToAuth={onNavigate}
        onLogout={() => onNavigate('landing')}
      />

      <div className="gt-my-trips-container">
        {/* 2. Page Title */}
        <div className="gt-my-trips-header flex justify-between items-end flex-wrap gap-4">
          <div>
            <div className="gt-section__eyebrow flex items-center gap-1">
              <Compass className="gt-icon" />
              <span>Personalized Travel Library</span>
            </div>
            <h1 className="gt-my-trips-title brand-serif">My Trips</h1>
            <p className="gt-my-trips-subtitle">
              Manage and revisit all your travel plans in one place.
            </p>
          </div>
        </div>

        {/* 3. Search, Group By, Filter, Sort Controls */}
        <TripSearchControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Loading State */}
        {loading && <TripSkeleton count={4} />}

        {/* Error State */}
        {error && !loading && (
          <div className="gt-trips-error-box flex-col items-center text-center gap-3">
            <AlertTriangle style={{ width: 36, height: 36, color: 'var(--color-error)' }} />
            <p className="font-semibold">{error}</p>
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchTrips}>
              Retry Loading Trips
            </Button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && !error && tripsData.length === 0 && (searchQuery || filterStatus !== 'All') && (
          <div className="gt-trips-no-results text-center flex-col items-center gap-3">
            <h3>No trips found</h3>
            <p className="text-sm text-muted">
              Try a different trip name, destination, or clear your search filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Main Content Sections: Ongoing → Upcoming → Completed */}
        {!loading && !error && tripsData.length > 0 && (
          <div className="gt-trips-sections-wrapper flex-col gap-8">
            {/* 7. Ongoing Trips Section */}
            {(filterStatus === 'All' || filterStatus === 'Ongoing') && (
              <section className="gt-trip-section">
                <div className="gt-trip-section-header flex justify-between items-center">
                  <h2 className="gt-trip-section-title">
                    <span className="gt-dot gt-dot--ongoing" /> Ongoing Trips
                  </h2>
                  <span className="text-xs text-muted">{ongoingTrips.length} active</span>
                </div>

                {ongoingTrips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {ongoingTrips.map((t) => (
                      <TripCard
                        key={t.id}
                        trip={t}
                        onViewTrip={onViewTripDetails}
                        onContinuePlanning={() => onNavigate('itinerary-builder')}
                        onEditTrip={(t) => setEditTrip(t)}
                        onShareTrip={(t) => setShareTrip(t)}
                        onPlanSimilarTrip={handlePlanSimilarTrip}
                        onDeleteTrip={(t) => setDeleteTrip(t)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyTripState status="ongoing" />
                )}
              </section>
            )}

            {/* 8. Upcoming Trips Section */}
            {(filterStatus === 'All' || filterStatus === 'Upcoming') && (
              <section className="gt-trip-section">
                <div className="gt-trip-section-header flex justify-between items-center">
                  <h2 className="gt-trip-section-title">
                    <span className="gt-dot gt-dot--upcoming" /> Upcoming Trips
                  </h2>
                  <span className="text-xs text-muted">{upcomingTrips.length} planned</span>
                </div>

                {upcomingTrips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {upcomingTrips.map((t) => (
                      <TripCard
                        key={t.id}
                        trip={t}
                        onViewTrip={onViewTripDetails}
                        onContinuePlanning={() => onNavigate('itinerary-builder')}
                        onEditTrip={(t) => setEditTrip(t)}
                        onShareTrip={(t) => setShareTrip(t)}
                        onPlanSimilarTrip={handlePlanSimilarTrip}
                        onDeleteTrip={(t) => setDeleteTrip(t)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyTripState status="upcoming" onPlanTrip={onOpenCreateTrip} />
                )}
              </section>
            )}

            {/* 9. Completed Trips Section */}
            {(filterStatus === 'All' || filterStatus === 'Completed') && (
              <section className="gt-trip-section">
                <div className="gt-trip-section-header flex justify-between items-center">
                  <h2 className="gt-trip-section-title">
                    <span className="gt-dot gt-dot--completed" /> Completed Trips
                  </h2>
                  <span className="text-xs text-muted">{completedTrips.length} archived</span>
                </div>

                {completedTrips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {completedTrips.map((t) => (
                      <TripCard
                        key={t.id}
                        trip={t}
                        onViewTrip={onViewTripDetails}
                        onContinuePlanning={() => onNavigate('itinerary-builder')}
                        onEditTrip={(t) => setEditTrip(t)}
                        onShareTrip={(t) => setShareTrip(t)}
                        onPlanSimilarTrip={handlePlanSimilarTrip}
                        onDeleteTrip={(t) => setDeleteTrip(t)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyTripState status="completed" />
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {/* Edit Trip Modal */}
      <EditTripModal
        trip={editTrip}
        isOpen={Boolean(editTrip)}
        onClose={() => setEditTrip(null)}
        onSave={handleSaveEditTrip}
      />

      {/* Share Trip Modal */}
      <ShareTripModal
        trip={shareTrip}
        isOpen={Boolean(shareTrip)}
        onClose={() => setShareTrip(null)}
        onShowToast={onShowToast}
      />

      {/* Delete Trip Modal */}
      <DeleteTripModal
        trip={deleteTrip}
        isOpen={Boolean(deleteTrip)}
        onClose={() => setDeleteTrip(null)}
        onDelete={handleDeleteTripSubmit}
      />
    </div>
  );
};
