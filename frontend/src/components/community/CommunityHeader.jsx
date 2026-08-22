import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Users, Bell, User, Plus, Compass, Calendar as CalendarIcon, MapPin, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import './CommunityHeader.css';

export const CommunityHeader = ({
  currentUser,
  onNavigate,
  onOpenShareModal,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);

  return (
    <header className="gt-community-header">
      <div className="gt-community-header__inner">
        {/* Left: Brand Logo */}
        <div className="gt-community-header__brand" onClick={() => onNavigate('landing')}>
          <Logo size="small" showTagline={false} centered={false} />
        </div>

        {/* Center: Navigation Links */}
        <nav className="gt-community-header__nav hidden-mobile">
          <button
            type="button"
            className="gt-comm-nav-link"
            onClick={() => onNavigate('landing')}
          >
            Home
          </button>
          <button
            type="button"
            className="gt-comm-nav-link"
            onClick={() => onNavigate('my-trips')}
          >
            My Trips
          </button>
          <button
            type="button"
            className="gt-comm-nav-link gt-comm-nav-link--active"
          >
            Community
          </button>
          <button
            type="button"
            className="gt-comm-nav-link"
            onClick={() => onNavigate('calendar')}
          >
            Calendar
          </button>
        </nav>

        {/* Right: User Avatar & Share Action */}
        <div className="gt-community-header__actions flex items-center gap-2">
          {onOpenShareModal && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onOpenShareModal}
              className="hidden-mobile"
            >
              Share Experience
            </Button>
          )}

          <button
            type="button"
            className="gt-comm-icon-btn"
            onClick={() => setHasNotif(!hasNotif)}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasNotif && <span className="gt-comm-notif-dot" />}
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              type="button"
              className="gt-comm-avatar-btn flex items-center gap-2"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="gt-comm-avatar-circle">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="gt-comm-avatar-name text-sm hidden-mobile">
                {currentUser ? (currentUser.firstName || currentUser.name) : 'Explorer'}
              </span>
              <ChevronDown className="w-3 h-3 text-muted" />
            </button>

            {userDropdownOpen && (
              <div className="gt-comm-user-dropdown animate-fade-in">
                <div className="p-2 border-b border-border">
                  <strong>{currentUser?.name || 'Explorer'}</strong>
                  <div className="text-xs text-muted">{currentUser?.email || 'Guest User'}</div>
                </div>
                <button
                  type="button"
                  className="gt-comm-dd-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('my-trips');
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  <span>My Trips (Screen 6)</span>
                </button>
                <button
                  type="button"
                  className="gt-comm-dd-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('itinerary');
                  }}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Itinerary & Budget (Screen 9)</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    className="gt-comm-dd-item text-red-600"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="gt-comm-hamburger-btn hidden-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="gt-comm-mobile-drawer animate-fade-in">
          <button type="button" className="gt-comm-mobile-link" onClick={() => onNavigate('landing')}>
            Home
          </button>
          <button type="button" className="gt-comm-mobile-link" onClick={() => onNavigate('my-trips')}>
            My Trips
          </button>
          <button type="button" className="gt-comm-mobile-link gt-comm-mobile-link--active">
            Community
          </button>
          <button type="button" className="gt-comm-mobile-link" onClick={() => onNavigate('calendar')}>
            Calendar
          </button>
          <div className="pt-2">
            <Button variant="primary" size="md" fullWidth={true} icon={Plus} onClick={onOpenShareModal}>
              Share Experience
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
