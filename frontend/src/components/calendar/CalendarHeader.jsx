import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, User, ChevronDown, Plus, Bell, LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './CalendarHeader.css';

export const CalendarHeader = ({
  currentUser,
  onBack,
  onOpenCreateTrip,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="gt-calendar-header">
      <div className="gt-calendar-header__inner">
        {/* Left: Back Action & Logo */}
        <div className="gt-calendar-header__left flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              className="gt-cal-back-btn flex items-center gap-1 text-sm"
              onClick={onBack}
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden-mobile">Back</span>
            </button>
          )}

          <div className="gt-calendar-header__brand cursor-pointer" onClick={onBack}>
            <Logo size="small" showTagline={false} centered={false} />
          </div>
        </div>

        {/* Center: Screen Title Badge */}
        <div className="gt-calendar-header__center">
          <div className="gt-cal-screen-pill flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <span className="gt-cal-pill-title brand-serif">Travel Calendar</span>
            <span className="gt-cal-pill-badge">Screen 11</span>
          </div>
        </div>

        {/* Right: User Avatar & Actions */}
        <div className="gt-calendar-header__right flex items-center gap-2">
          {onOpenCreateTrip && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={onOpenCreateTrip}
              className="hidden-mobile"
            >
              Plan a Trip
            </Button>
          )}

          <div className="relative">
            <button
              type="button"
              className="gt-cal-avatar-btn flex items-center gap-2"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="gt-cal-avatar-circle">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="gt-cal-avatar-name text-sm hidden-mobile">
                {currentUser ? (currentUser.firstName || currentUser.name) : 'Explorer'}
              </span>
              <ChevronDown className="w-3 h-3 text-muted" />
            </button>

            {userDropdownOpen && (
              <div className="gt-cal-user-dropdown animate-fade-in">
                <div className="p-2 border-b border-border">
                  <strong>{currentUser?.name || 'Explorer'}</strong>
                  <div className="text-xs text-muted">{currentUser?.email || 'Not signed in'}</div>
                </div>
                <button
                  type="button"
                  className="gt-cal-dd-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    if (onBack) onBack();
                  }}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Dashboard Home</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    className="gt-cal-dd-item text-red-600"
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
        </div>
      </div>
    </header>
  );
};
