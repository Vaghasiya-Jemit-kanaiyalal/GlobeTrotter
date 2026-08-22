import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { ShieldCheck, User, ChevronDown, LogOut, ArrowLeft, BarChart2 } from 'lucide-react';
import './AdminHeader.css';

export const AdminHeader = ({
  currentUser,
  onBack,
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

        {/* Center: Admin Badge */}
        <div className="gt-admin-header__center">
          <div className="gt-admin-pill flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="gt-admin-pill-title brand-serif">Admin Panel</span>
            <span className="gt-admin-pill-badge">Screen 12</span>
          </div>
        </div>

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

                {onLogout && (
                  <button
                    type="button"
                    className="gt-admin-dd-item text-red-600"
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
