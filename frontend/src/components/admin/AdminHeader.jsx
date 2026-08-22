import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { ShieldCheck, User, ChevronDown, LogOut, ArrowLeft, MapPin, Calendar, Users, Search, Home } from 'lucide-react';
import './AdminHeader.css';

export const AdminHeader = ({
  currentUser,
  onBack,
  onNavigate,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="gt-admin-header">
      <div className="gt-admin-header__inner">
        {/* Left: Logo & Back Button */}
        <div className="gt-admin-header__left flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              className="gt-admin-back-btn flex items-center gap-1 text-sm"
              onClick={onBack}
              title="Return to Main Application"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden-mobile">Exit Admin</span>
            </button>
          )}

          <div className="gt-admin-header__brand cursor-pointer" onClick={onBack}>
            <Logo size="small" showTagline={false} centered={false} />
          </div>
        </div>

        {/* Center: Navigation Links */}
        {onNavigate && (
          <nav className="gt-admin-header__nav hidden-mobile flex items-center gap-3 text-sm font-semibold text-navy-700">
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('landing')}>Home</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('search')}>Explore</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('my-trips')}>My Trips</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('community')}>Community</button>
            <button type="button" className="hover:text-amber-600" onClick={() => onNavigate('calendar')}>Calendar</button>
            <button type="button" className="text-amber-700 font-bold">Admin Dashboard</button>
          </nav>
        )}

        {/* Right: Admin Profile Avatar */}
        <div className="gt-admin-header__right flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="gt-admin-avatar-btn flex items-center gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="gt-admin-avatar-circle">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col text-left hidden-mobile">
                <span className="gt-admin-avatar-name text-xs font-bold leading-tight">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-muted text-xs font-medium">Platform Admin</span>
              </div>
              <ChevronDown className="w-3 h-3 text-muted" />
            </button>

            {dropdownOpen && (
              <div className="gt-admin-dropdown animate-fade-in">
                <div className="p-2 border-b border-border text-xs">
                  <strong>{currentUser?.name || 'Admin'}</strong>
                  <div className="text-muted">{currentUser?.email || 'admin@globetrotter.com'}</div>
                </div>

                {onNavigate && (
                  <div className="flex flex-col gap-1 p-1">
                    <button
                      type="button"
                      className="gt-admin-dd-item text-xs"
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('profile');
                      }}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      className="gt-admin-dd-item text-xs"
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('my-trips');
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>My Trips</span>
                    </button>
                  </div>
                )}

                {onLogout && (
                  <button
                    type="button"
                    className="gt-admin-dd-item text-red-600 border-t border-border pt-2 text-xs font-semibold"
                    onClick={() => {
                      setDropdownOpen(false);
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
