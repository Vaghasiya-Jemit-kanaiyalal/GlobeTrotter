import React, { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../../services/adminApi';
import { AdminHeader } from './AdminHeader';
import { AdminSearch } from './AdminSearch';
import { AdminTabs } from './AdminTabs';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { UserTable } from './UserTable';
import { UserDetailsModal } from './UserDetailsModal';
import { PopularCities } from './PopularCities';
import { PopularActivities } from './PopularActivities';
import { AdminSidebar } from './AdminSidebar';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminSkeleton, AdminErrorState } from './AdminSkeleton';
import { Button } from '../ui/Button';
import { ShieldAlert, RefreshCw, AlertCircle, Eye, ShieldCheck, ArrowLeft } from 'lucide-react';
import './AdminPanelScreen.css';

export const AdminPanelScreen = ({
  currentUser,
  onBack,
  onNavigateToUserTrips,
  onLogout,
  onShowToast,
}) => {
  // Demo Admin Authorization State (Allows toggling between Admin & Non-Admin for QA review)
  const [isAdminRole, setIsAdminRole] = useState(
    currentUser?.role === 'admin' || true // Default to true so user can immediately preview Screen 12
  );

  // Tab State
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'cities' | 'activities'

  // Dashboard & Data States
  const [overview, setOverview] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [tripActivityData, setTripActivityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [popularActivities, setPopularActivities] = useState([]);

  // Search & Filter Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('users');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [timeRange, setTimeRange] = useState('30d');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState(null);

  // Load Data
  useEffect(() => {
    if (isAdminRole) {
      loadAdminData();
    }
  }, [isAdminRole, timeRange, searchQuery, filterStatus, sortBy]);

  const loadAdminData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [dashRes, usersRes, citiesRes, actRes] = await Promise.all([
        adminApi.getDashboardOverview(timeRange),
        adminApi.getUsers({ search: searchQuery, status: filterStatus, sortBy }),
        adminApi.getPopularCities({ search: searchQuery }),
        adminApi.getPopularActivities({ search: searchQuery }),
      ]);

      setOverview(dashRes.overview);
      setUserGrowthData(dashRes.userGrowth);
      setTripActivityData(dashRes.tripActivity);
      setCategoryData(dashRes.categoryBreakdown);
      setUsersList(usersRes);
      setPopularCities(citiesRes);
      setPopularActivities(actRes);
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // User Actions
  const handleToggleUserStatus = async (userId, newStatus) => {
    await adminApi.updateUserStatus(userId, newStatus);
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    if (onShowToast) {
      onShowToast(`User account status updated to ${newStatus}`, 'info');
    }
  };

  const handleDeleteUser = async (userId) => {
    await adminApi.deleteUser(userId);
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    if (onShowToast) {
      onShowToast('User account removed from database', 'success');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setSortBy('recent');
    setTimeRange('30d');
  };

  // SECTION 17: Admin Authorization Check Fallback UI
  if (!isAdminRole) {
    return (
      <div className="gt-admin-access-denied-root min-h-screen bg-app flex items-center justify-center p-4">
        <div className="gt-denied-card max-w-md w-full p-6 bg-white border border-border rounded-xl text-center shadow-md">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="brand-serif font-bold text-xl text-navy-900 mb-1">Access Denied</h2>
          <p className="text-sm text-navy-600 mb-4 leading-relaxed">
            You do not have administrative permissions to access the GlobeTrotter platform administration panel.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              icon={ArrowLeft}
              onClick={onBack}
              fullWidth={true}
            >
              Back to Dashboard
            </Button>

            <button
              type="button"
              className="text-xs text-amber-700 font-semibold underline mt-2"
              onClick={() => setIsAdminRole(true)}
            >
              [ Demo QA: Grant Admin Role ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gt-admin-panel-root">
      {/* 1. Header */}
      <AdminHeader
        currentUser={currentUser}
        onBack={onBack}
        onLogout={onLogout}
      />

      <main className="gt-admin-container">
        {/* State Simulator Controls (For testing Loading, Error, and Access Denied states as required by Sections 17, 18, 19) */}
        <div className="gt-demo-state-bar flex items-center justify-between gap-2 p-2 mb-4 bg-subtle rounded-lg border text-xs flex-wrap">
          <span className="font-semibold text-navy-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            Screen 12 Demo Controls:
          </span>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className="gt-state-toggle-btn"
              onClick={loadAdminData}
            >
              <RefreshCw className="w-3 h-3 inline mr-1" />
              Reload Analytics
            </button>

            <button
              type="button"
              className={`gt-state-toggle-btn ${hasError ? 'gt-state-toggle-btn--active' : ''}`}
              onClick={() => setHasError(!hasError)}
            >
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {hasError ? 'Clear Error' : 'Simulate Error'}
            </button>

            <button
              type="button"
              className="gt-state-toggle-btn text-red-600"
              onClick={() => setIsAdminRole(false)}
            >
              <ShieldAlert className="w-3 h-3 inline mr-1" />
              Simulate Access Denied
            </button>
          </div>
        </div>

        {/* 2. Controls & Search */}
        <AdminSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onResetFilters={handleResetFilters}
        />

        {/* 3. Navigation Tabs */}
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Layout Grid */}
        {hasError ? (
          <AdminErrorState onRetry={loadAdminData} />
        ) : isLoading ? (
          <AdminSkeleton />
        ) : (
          <div className="gt-admin-layout-grid">
            {/* Left Column: Active Tab Content */}
            <section className="gt-admin-main-column">
              {activeTab === 'analytics' && (
                <AnalyticsDashboard
                  overview={overview}
                  userGrowthData={userGrowthData}
                  tripActivityData={tripActivityData}
                  popularCitiesData={popularCities}
                  categoryData={categoryData}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              )}

              {activeTab === 'users' && (
                usersList.length === 0 ? (
                  <AdminEmptyState onResetFilters={handleResetFilters} message="No registered users found matching search criteria." />
                ) : (
                  <UserTable
                    users={usersList}
                    onSelectUser={(u) => setSelectedUser(u)}
                    onToggleStatus={handleToggleUserStatus}
                    onDeleteUser={handleDeleteUser}
                  />
                )
              )}

              {activeTab === 'cities' && (
                popularCities.length === 0 ? (
                  <AdminEmptyState onResetFilters={handleResetFilters} message="No popular cities data available." />
                ) : (
                  <PopularCities
                    cities={popularCities}
                    onSelectCity={(cityName) => setSearchQuery(cityName)}
                  />
                )
              )}

              {activeTab === 'activities' && (
                popularActivities.length === 0 ? (
                  <AdminEmptyState onResetFilters={handleResetFilters} message="No activity selection data available." />
                ) : (
                  <PopularActivities activities={popularActivities} />
                )
              )}
            </section>

            {/* Right Column: Sticky Sidebar Info Panel */}
            <section className="gt-admin-sidebar-column">
              <AdminSidebar />
            </section>
          </div>
        )}
      </main>

      {/* User Profile & Activity Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onViewUserTrips={(u) => {
          setSelectedUser(null);
          if (onNavigateToUserTrips) onNavigateToUserTrips(u);
        }}
      />
    </div>
  );
};
