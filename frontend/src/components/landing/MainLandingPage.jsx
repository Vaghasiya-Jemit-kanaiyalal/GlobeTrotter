import React, { useState, useMemo } from 'react';
import { Navbar } from '../layout/Navbar';
import { HeroBanner } from './HeroBanner';
import { DestinationSearch } from './DestinationSearch';
import { RegionalSelections } from './RegionalSelections';
import { PreviousTrips } from './PreviousTrips';
import { PlanTripCTASection } from './PlanTripCTASection';
import { Footer } from '../layout/Footer';
import { DestinationDetailModal } from './DestinationDetailModal';
import { CreateTripModal } from '../trips/CreateTripModal';
import { TripDetailModal } from './TripDetailModal';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import './MainLandingPage.css';

export const MainLandingPage = ({
  currentUser,
  trips = [],
  onAddTrip,
  onNavigate,
  onLogout,
  onShowToast,
}) => {
  // Discovery & Search Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [activeNavTab, setActiveNavTab] = useState('home');

  // Modal States
  const [detailDest, setDetailDest] = useState(null);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [createTripCity, setCreateTripCity] = useState('');
  const [detailTrip, setDetailTrip] = useState(null);

  // Filter & Sort Destinations
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS_DATA.filter((dest) => {
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dest.city.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q) ||
        dest.highlights.some((h) => h.toLowerCase().includes(q));

      // Region filter
      const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;

      // Style filter
      const matchesStyle = selectedStyle === 'All' || dest.style === selectedStyle;

      return matchesSearch && matchesRegion && matchesStyle;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return parseInt(b.reviewCount) - parseInt(a.reviewCount);
      if (sortBy === 'name') return a.city.localeCompare(b.city);
      if (sortBy === 'budget') return a.costTier.length - b.costTier.length;
      return 0;
    });
  }, [searchQuery, selectedRegion, selectedStyle, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedStyle('All');
    setSortBy('rating');
  };

  const handleOpenCreateTrip = (initialCity = '') => {
    onNavigate('create-trip');
  };

  const handleCreateTripSubmit = (newTrip) => {
    onAddTrip(newTrip);
    onShowToast(`Trip "${newTrip.title}" successfully created!`, 'success');
  };

  const handleScrollToDestinations = () => {
    const el = document.getElementById('regional-selections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTrips = () => {
    const el = document.getElementById('previous-trips');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavbarNavigate = (view, section) => {
    if (view !== 'landing') {
      onNavigate(view);
      return;
    }
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveNavTab('home');
    } else if (section === 'destinations') {
      handleScrollToDestinations();
      setActiveNavTab('destinations');
    } else if (section === 'trips') {
      handleScrollToTrips();
      setActiveNavTab('trips');
    }
  };

  return (
    <div className="gt-landing-page">
      {/* 1. Header / Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeNavTab}
        onNavigate={handleNavbarNavigate}
        onOpenCreateTrip={() => handleOpenCreateTrip('')}
        onSwitchToAuth={onNavigate}
        onLogout={onLogout}
      />

      {/* 2. Hero / Banner Section */}
      <HeroBanner
        onPlanTrip={() => handleOpenCreateTrip('')}
        onExploreDestinations={handleScrollToDestinations}
      />

      {/* 3. Search and Discovery Controls */}
      <DestinationSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Top Regional Selections */}
      <RegionalSelections
        destinations={filteredDestinations}
        totalCount={DESTINATIONS_DATA.length}
        onSelectDestination={(dest) => setDetailDest(dest)}
        onResetFilters={handleResetFilters}
      />

      {/* 5. Previous Trips Section */}
      <PreviousTrips
        trips={trips}
        onPlanTrip={() => handleOpenCreateTrip('')}
        onViewTrip={(trip) => setDetailTrip(trip)}
      />

      {/* 6. Plan a Trip CTA Section */}
      <PlanTripCTASection
        onPlanTrip={() => handleOpenCreateTrip('')}
      />

      {/* 7. Footer */}
      <Footer
        onNavigate={onNavigate}
        onOpenCreateTrip={() => handleOpenCreateTrip('')}
      />

      {/* Destination Quick Detail Modal */}
      <DestinationDetailModal
        destination={detailDest}
        isOpen={Boolean(detailDest)}
        onClose={() => setDetailDest(null)}
        onStartTrip={(dest) => handleOpenCreateTrip(dest.city)}
      />

      {/* Create Trip Screen / Modal */}
      <CreateTripModal
        isOpen={createTripOpen}
        onClose={() => {
          setCreateTripOpen(false);
          setCreateTripCity('');
        }}
        onCreateTrip={handleCreateTripSubmit}
        initialCity={createTripCity}
      />

      {/* Trip Details Modal */}
      <TripDetailModal
        trip={detailTrip}
        isOpen={Boolean(detailTrip)}
        onClose={() => setDetailTrip(null)}
      />
    </div>
  );
};
