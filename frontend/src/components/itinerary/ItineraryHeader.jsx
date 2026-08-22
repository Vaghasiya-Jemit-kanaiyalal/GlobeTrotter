import React, { useState } from 'react';
import { ArrowLeft, Compass, Bell, User, ChevronDown, Calendar, Plus, LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './ItineraryHeader.css';

export const ItineraryHeader = ({
  currentUser,
  selectedTripName = 'Goa Adventure',
  onBack,
  onOpenCreateTrip,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  return (
    <header className="gt-itinerary-header">
      <div className="gt-itinerary-header__inner">
        {/* Left: Back Button & Logo */}
        <div className="gt-itinerary-header__left flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              className="gt-back-btn flex items-center gap-1 text-sm"
              onClick={onBack}
              title="Return to My Trips"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden-mobile">Back</span>
            </button>
          )}

          <div className="gt-itinerary-header__brand" onClick={onBack}>
            <Logo size="small" showTagline={false} centered={false} />
          </div>
        </div>

        {/* Center: Selected Trip Pill */}
        <div className="gt-itinerary-header__center">
          <div className="gt-selected-trip-pill">
            <Compass className="w-4 h-4 text-amber-600" />
            <span className="gt-trip-pill-label">{selectedTripName}</span>
            <span className="gt-trip-pill-badge">Itinerary View</span>
          </div>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="gt-itinerary-header__right flex items-center gap-2">
          {onOpenCreateTrip && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={onOpenCreateTrip}
              className="hidden-mobile"
            >
              Build Itinerary
            </Button>
          )}

          <button
            type="button"
            className="gt-header-icon-btn"
            onClick={() => setHasNotification(!hasNotification)}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasNotification && <span className="gt-notif-dot" />}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              className="gt-user-avatar-btn flex items-center gap-2"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="gt-avatar-circle">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="gt-avatar-name text-sm hidden-mobile">
                {currentUser ? (currentUser.firstName || currentUser.name) : 'Explorer'}
              </span>
              <ChevronDown className="w-3 h-3 text-muted" />
            </button>

            {userDropdownOpen && (
              <div className="gt-header-dropdown animate-fade-in">
                <div className="gt-dropdown-info">
                  <strong>{currentUser?.name || 'Explorer'}</strong>
                  <span className="text-xs text-muted">{currentUser?.email || 'Guest User'}</span>
                </div>
                <div className="gt-dropdown-divider" />
                <button
                  type="button"
                  className="gt-dropdown-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    if (onBack) onBack();
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Trips Dashboard</span>
                </button>
                {onLogout && (
                  <>
                    <div className="gt-dropdown-divider" />
                    <button
                      type="button"
                      className="gt-dropdown-item gt-dropdown-item--danger"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
