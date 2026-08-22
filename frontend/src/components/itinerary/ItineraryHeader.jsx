import React, { useState } from 'react';
import { ArrowLeft, User, Share2, Compass, Bell, ChevronDown, Calendar, Plus, LogOut, MapPin, Users, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './ItineraryHeader.css';

export const ItineraryHeader = ({
  tripTitle,
  selectedTripName,
  currentUser,
  onBackToDashboard,
  onBack,
  onNavigate,
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
              <span>Back</span>
            </button>
          )}

          <div className="gt-itin-header__divider" />

          <div className="gt-itinerary-header__brand cursor-pointer" onClick={handleBack}>
            <Logo size="small" showTagline={false} centered={false} />
          </div>

          <span className="gt-itin-header__trip-badge hidden-mobile">
            {displayTitle}
          </span>
        </div>

        {/* Center: Navigation Links (ALL Fields) */}
        {onNavigate && (
          <nav className="gt-itinerary-header__nav hidden-mobile flex items-center gap-3 text-sm font-semibold text-navy-700">
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('landing')}>Home</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('search')}>Explore</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('my-trips')}>My Trips</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('community')}>Community</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('calendar')}>Calendar</button>
            {currentUser?.role === 'admin' && (
              <button type="button" className="text-amber-700 font-bold" onClick={() => onNavigate('admin')}>Admin</button>
            )}
          </nav>
        )}

        {/* Right: User Profile & Actions */}
        <div className="gt-itin-header__actions flex items-center gap-3">
          {onShareItinerary && (
            <Button
              variant="outline"
              size="sm"
              icon={Share2}
              onClick={onShareItinerary}
              className="gt-itin-header__share-btn hidden-mobile"
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
              <div className="gt-header-dropdown animate-fade-in bg-white border border-border rounded-lg shadow-lg p-2" style={{ right: 0, position: 'absolute', top: '100%', zIndex: 60, minWidth: '180px' }}>
                <div className="gt-dropdown-info p-2 border-b border-border text-xs">
                  <strong>{currentUser?.name || 'Explorer'}</strong>
                  <span className="text-xs text-muted block">{currentUser?.email || 'Guest User'}</span>
                </div>
                
                {onNavigate && (
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      type="button"
                      className="gt-dropdown-item flex items-center gap-2 p-1.5 text-xs text-navy-800 hover:bg-subtle rounded text-left w-full font-medium"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('profile');
                      }}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      className="gt-dropdown-item flex items-center gap-2 p-1.5 text-xs text-navy-800 hover:bg-subtle rounded text-left w-full font-medium"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('my-trips');
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>My Trips</span>
                    </button>
                    <button
                      type="button"
                      className="gt-dropdown-item flex items-center gap-2 p-1.5 text-xs text-navy-800 hover:bg-subtle rounded text-left w-full font-medium"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('calendar');
                      }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Calendar View</span>
                    </button>
                    <button
                      type="button"
                      className="gt-dropdown-item flex items-center gap-2 p-1.5 text-xs text-navy-800 hover:bg-subtle rounded text-left w-full font-medium"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('community');
                      }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Community Tab</span>
                    </button>
                    {currentUser?.role === 'admin' && (
                      <button
                        type="button"
                        className="gt-dropdown-item flex items-center gap-2 p-1.5 text-xs text-amber-700 font-bold hover:bg-subtle rounded text-left w-full"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>
                )}

                {onLogout && (
                  <button
                    type="button"
                    className="gt-dropdown-item gt-dropdown-item--danger flex items-center gap-2 p-1.5 text-xs text-left w-full text-red-600 hover:bg-red-50 rounded mt-1 border-t border-border pt-2 font-semibold"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
