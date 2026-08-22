import React, { useState } from 'react';
import { ArrowLeft, User, Share2, Compass, Bell, ChevronDown, Calendar, Plus, LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './ItineraryHeader.css';

export const ItineraryHeader = ({
  tripTitle,
  selectedTripName,
  currentUser,
  onBackToDashboard,
  onBack,
  onShareItinerary,
  onOpenCreateTrip,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  const displayTitle = tripTitle || selectedTripName || 'Custom Itinerary';
  const handleBack = onBack || onBackToDashboard;

  return (
    <header className="gt-itin-header gt-itinerary-header">
      <div className="gt-itin-header__inner gt-itinerary-header__inner">
        {/* Left: Brand & Back Navigation */}
        <div className="flex items-center gap-4 gt-itinerary-header__left">
          {handleBack && (
            <button
              type="button"
              className="gt-back-btn flex items-center gap-1 text-sm"
              onClick={handleBack}
              title="Return to Dashboard"
            >
              <ArrowLeft className="gt-icon w-4 h-4" />
              <span>Dashboard</span>
            </button>
          )}

          <div className="gt-itin-header__divider" />

          <div className="gt-itinerary-header__brand" onClick={handleBack}>
            <Logo size="small" showTagline={false} centered={false} />
          </div>

          <span className="gt-itin-header__trip-badge hidden-mobile">
            {displayTitle}
          </span>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="gt-itin-header__actions flex items-center gap-3">
          {onShareItinerary && (
            <Button
              variant="outline"
              size="sm"
              icon={Share2}
              onClick={onShareItinerary}
              className="gt-itin-header__share-btn"
            >
              Share Route
            </Button>
          )}

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

          <div className="relative">
            <button
              type="button"
              className="gt-user-avatar-btn flex items-center gap-2"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="gt-navbar__avatar gt-avatar-circle">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.firstName || currentUser.name} />
                ) : (
                  <User className="gt-icon w-4 h-4" />
                )}
              </div>
              <span className="gt-avatar-name text-sm hidden-mobile font-semibold">
                {currentUser ? (currentUser.firstName || currentUser.name) : 'Explorer'}
              </span>
              <ChevronDown className="w-3 h-3 text-muted" />
            </button>

            {userDropdownOpen && (
              <div className="gt-header-dropdown animate-fade-in" style={{ right: 0, position: 'absolute', top: '100%', zIndex: 60 }}>
                <div className="gt-dropdown-info p-3">
                  <strong>{currentUser?.name || 'Explorer'}</strong>
                  <span className="text-xs text-muted block">{currentUser?.email || 'Guest User'}</span>
                </div>
                <div className="gt-dropdown-divider" />
                <button
                  type="button"
                  className="gt-dropdown-item flex items-center gap-2 p-2 text-xs text-left w-full"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    if (handleBack) handleBack();
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
                      className="gt-dropdown-item gt-dropdown-item--danger flex items-center gap-2 p-2 text-xs text-left w-full text-red-600"
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
