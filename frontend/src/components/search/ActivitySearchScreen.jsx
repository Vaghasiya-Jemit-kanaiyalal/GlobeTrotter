import React, { useState, useEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { SearchTypeToggle } from './SearchTypeToggle';
import { SearchControls } from './SearchControls';
import { SearchFilterPopover } from './SearchFilterPopover';
import { ActivityResultCard } from './ActivityResultCard';
import { CityResultCard } from './CityResultCard';
import { ActivityDetailsModal } from './ActivityDetailsModal';
import { CityDetailsModal } from './CityDetailsModal';
import { AddToTripModal } from './AddToTripModal';
import { SearchSkeleton } from './SearchSkeleton';
import { SearchEmptyState } from './SearchEmptyState';
import { searchApi } from '../../services/searchApi';
import { tripApi } from '../../services/tripApi';
import { Button } from '../ui/Button';
import { Compass, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import './ActivitySearchScreen.css';

export const ActivitySearchScreen = ({
  currentUser,
  onNavigate,
  onOpenCreateTrip,
  onShowToast,
}) => {
  // Mode & Query State
  const [searchType, setSearchType] = useState('activities'); // 'activities' | 'cities'
  const [query, setQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Category');
  const [sortBy, setSortBy] = useState('Relevance');
  const [page, setPage] = useState(1);

  // Filters State
  const [filters, setFilters] = useState({
    category: 'All',
    priceTier: 'All',
    minRating: 0,
    region: 'All',
  });
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Results State
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Item Selection
  const [selectedActivityDetails, setSelectedActivityDetails] = useState(null);
  const [selectedCityDetails, setSelectedCityDetails] = useState(null);
  const [itemAddToTrip, setItemAddToTrip] = useState(null);
  const [userTrips, setUserTrips] = useState([]);

  // Fetch User Trips for Add To Trip Modal
  useEffect(() => {
    tripApi.getTrips().then((res) => {
      setUserTrips(res.data || []);
    });
  }, []);

  // Fetch Search Results
  const executeSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (searchType === 'activities') {
        const res = await searchApi.searchActivities({
          query,
          category: filters.category,
          priceTier: filters.priceTier,
          minRating: filters.minRating,
          sortBy,
          page,
          limit: 6,
        });
        setResults(res.data);
        setTotalCount(res.totalCount);
        setHasMore(res.hasMore);
      } else {
        const res = await searchApi.searchCities({
          query,
          region: filters.region,
          sortBy,
          page,
          limit: 6,
        });
        setResults(res.data);
        setTotalCount(res.totalCount);
        setHasMore(res.hasMore);
      }
    } catch (err) {
      setError('Unable to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    executeSearch();
  }, [searchType, query, filters, sortBy]);

  useEffect(() => {
    if (page > 1) {
      executeSearch();
    }
  }, [page]);

  const handleResetAll = () => {
    setQuery('');
    setFilters({ category: 'All', priceTier: 'All', minRating: 0, region: 'All' });
    setSortBy('Relevance');
    setGroupBy(searchType === 'activities' ? 'Category' : 'Region');
  };

  const handleConfirmAddToTrip = (item, targetTrip) => {
    const itemName = item.name || item.city || 'Item';
    onShowToast(`Added "${itemName}" to trip "${targetTrip.title || targetTrip.name}"!`, 'success');
  };

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.priceTier !== 'All' ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.region !== 'All' ? 1 : 0);

  return (
    <div className="gt-search-screen">
      {/* 1. Header Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab="explore"
        onNavigate={onNavigate}
        onOpenCreateTrip={onOpenCreateTrip}
        onSwitchToAuth={onNavigate}
        onLogout={() => onNavigate('landing')}
      />

      <div className="gt-search-container">
        {/* 2. Mode Toggle Tabs */}
        <div className="gt-search-header flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="gt-section__eyebrow flex items-center gap-1">
              <Compass className="gt-icon" />
              <span>Reusable Travel Discovery</span>
            </div>
            <h1 className="gt-search-title brand-serif">Explore Activities & Cities</h1>
          </div>

          <SearchTypeToggle
            searchType={searchType}
            onTypeChange={(type) => {
              setSearchType(type);
              handleResetAll();
            }}
          />
        </div>

        {/* 3. Search Bar + Controls */}
        <SearchControls
          searchType={searchType}
          query={query}
          onQueryChange={setQuery}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterCount={activeFilterCount}
          onOpenFilterModal={() => setFilterModalOpen(true)}
          onResetFilters={handleResetAll}
        />

        {/* 4. Results Header & Count */}
        <div className="gt-results-count-bar flex justify-between items-center text-xs">
          <span className="gt-results-count-pill font-semibold">
            {totalCount} {searchType === 'activities' ? 'activities found' : 'destinations found'}
          </span>
          {query && <span className="text-muted">Showing results for "{query}"</span>}
        </div>

        {/* Loading Skeleton State */}
        {loading && <SearchSkeleton count={4} />}

        {/* Error State */}
        {error && !loading && (
          <div className="gt-search-error-box text-center flex-col items-center gap-3">
            <AlertTriangle style={{ width: 36, height: 36, color: 'var(--color-error)' }} />
            <p className="font-semibold">{error}</p>
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={executeSearch}>
              Retry Search
            </Button>
          </div>
        )}

        {/* Empty Search State */}
        {!loading && !error && results.length === 0 && (
          <SearchEmptyState
            query={query}
            searchType={searchType}
            onClearSearch={handleResetAll}
          />
        )}

        {/* Results Cards List */}
        {!loading && !error && results.length > 0 && (
          <div className="gt-search-results-list flex-col gap-4">
            {searchType === 'activities'
              ? results.map((act) => (
                  <ActivityResultCard
                    key={act.id}
                    activity={act}
                    onViewDetails={(a) => setSelectedActivityDetails(a)}
                    onAddToTrip={(a) => setItemAddToTrip(a)}
                  />
                ))
              : results.map((city) => (
                  <CityResultCard
                    key={city.id}
                    city={city}
                    onExploreCity={(c) => setSelectedCityDetails(c)}
                    onAddToTrip={(c) => setItemAddToTrip(c)}
                  />
                ))}
          </div>
        )}

        {/* Pagination / Load More */}
        {!loading && !error && hasMore && (
          <div className="gt-search-pagination text-center" style={{ marginTop: 24 }}>
            <Button
              variant="outline"
              size="md"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More Results ({totalCount - results.length} remaining)
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <SearchFilterPopover
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        searchType={searchType}
        currentFilters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onClearFilters={handleResetAll}
      />

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        activity={selectedActivityDetails}
        isOpen={Boolean(selectedActivityDetails)}
        onClose={() => setSelectedActivityDetails(null)}
        onAddToTrip={(a) => setItemAddToTrip(a)}
      />

      {/* City Details Modal */}
      <CityDetailsModal
        city={selectedCityDetails}
        isOpen={Boolean(selectedCityDetails)}
        onClose={() => setSelectedCityDetails(null)}
        onAddToTrip={(c) => setItemAddToTrip(c)}
        onViewActivities={(cityName) => {
          setSearchType('activities');
          setQuery(cityName);
        }}
      />

      {/* Add To Trip Modal */}
      <AddToTripModal
        itemToAdd={itemAddToTrip}
        isOpen={Boolean(itemAddToTrip)}
        onClose={() => setItemAddToTrip(null)}
        userTrips={userTrips}
        onConfirmAddToTrip={handleConfirmAddToTrip}
        onCreateNewTrip={() => {
          setItemAddToTrip(null);
          onOpenCreateTrip();
        }}
      />
    </div>
  );
};
