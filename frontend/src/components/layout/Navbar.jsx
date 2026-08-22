import React, { useState, useEffect } from 'react';
import { Compass, Bell, User, Plus, Menu, X, LogIn, UserPlus, MapPin, Calendar, LogOut, ChevronDown, Search, Users, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './Navbar.css';

export const Navbar = ({
  currentUser,
  activeTab = 'home',
  onNavigate,
  onOpenCreateTrip,
  onSwitchToAuth,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', action: () => onNavigate('landing') },
    { id: 'search', label: 'Explore', action: () => onNavigate('search') },
    { id: 'trips', label: 'My Trips', action: () => onNavigate('my-trips') },
    { id: 'community', label: 'Community', action: () => onNavigate('community') },
    { id: 'calendar', label: 'Calendar', action: () => onNavigate('calendar') },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', action: () => onNavigate('admin') });
  }

  return (
    <header className={`gt-navbar ${isScrolled ? 'gt-navbar--scrolled' : ''}`}>
      <div className="gt-navbar__inner">
        {/* Left: Brand Logo */}
        <div className="gt-navbar__brand cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo size="small" showTagline={false} centered={false} />
        </div>

        {/* Center: Desktop Navigation Links (ALL Fields Included) */}
        <nav className="gt-navbar__links">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`gt-nav-link ${activeTab === item.id ? 'gt-nav-link--active' : ''}`}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions & User Controls */}
        <div className="gt-navbar__actions">
          {/* Plan a Trip Quick Action */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onOpenCreateTrip}
            className="gt-navbar__plan-btn hidden-mobile"
          >
            Plan a Trip
          </Button>



          {/* User Profile Avatar / Dropdown */}
          <div className="gt-navbar__user-container relative">
            <button
              type="button"
              className="gt-navbar__user-btn flex items-center gap-1.5"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-expanded={userDropdownOpen}
              aria-label="User menu"
            >
              <div className="gt-navbar__avatar">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.firstName || currentUser.name} />
                ) : (
                  <User className="gt-icon" />
                )}
              </div>
              <span className="gt-navbar__username">
                {currentUser ? (currentUser.firstName || currentUser.name) : 'Explorer'}
              </span>
              <ChevronDown className="gt-navbar__chevron" />
            </button>

            {userDropdownOpen && (
              <div className="gt-user-dropdown animate-fade-in">
                <div className="gt-user-dropdown__header">
                  <strong>{currentUser ? `${currentUser.firstName || currentUser.name} ${currentUser?.lastName || ''}` : 'Guest Explorer'}</strong>
                  <span className="text-xs text-muted block">{currentUser ? currentUser.email : 'Not signed in'}</span>
                  {currentUser?.role === 'admin' && (
                    <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded mt-1">
                      ADMINISTRATOR
                    </span>
                  )}
                </div>
                <div className="gt-user-dropdown__divider" />

                <button
                  type="button"
                  className="gt-user-dropdown__item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('profile');
                  }}
                >
                  <User className="gt-icon" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className="gt-user-dropdown__item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('my-trips');
                  }}
                >
                  <MapPin className="gt-icon" />
                  <span>My Planned Trips</span>
                </button>

                <button
                  type="button"
                  className="gt-user-dropdown__item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('calendar');
                  }}
                >
                  <Calendar className="gt-icon" />
                  <span>Calendar View</span>
                </button>

                <button
                  type="button"
                  className="gt-user-dropdown__item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('community');
                  }}
                >
                  <Users className="gt-icon" />
                  <span>Community Tab</span>
                </button>

                {currentUser?.role === 'admin' && (
                  <button
                    type="button"
                    className="gt-user-dropdown__item text-amber-700 font-semibold"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('admin');
                    }}
                  >
                    <ShieldCheck className="gt-icon text-amber-600" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <div className="gt-user-dropdown__divider" />

                {currentUser ? (
                  <button
                    type="button"
                    className="gt-user-dropdown__item gt-user-dropdown__item--danger"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut className="gt-icon" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="gt-user-dropdown__item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSwitchToAuth('login');
                      }}
                    >
                      <LogIn className="gt-icon" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      className="gt-user-dropdown__item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSwitchToAuth('register');
                      }}
                    >
                      <UserPlus className="gt-icon" />
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="gt-navbar__hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="gt-icon" /> : <Menu className="gt-icon" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="gt-navbar__mobile-drawer animate-fade-in">
          <nav className="gt-navbar__mobile-links flex flex-col gap-2 p-3 bg-white border-b border-border">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`gt-mobile-nav-link ${activeTab === item.id ? 'gt-mobile-nav-link--active' : ''}`}
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
            <div className="gt-user-dropdown__divider" />
            <Button
              variant="primary"
              size="md"
              fullWidth={true}
              icon={Plus}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateTrip();
              }}
            >
              Plan a Trip
            </Button>
            {!currentUser && (
              <div className="flex gap-2" style={{ marginTop: 'var(--space-2)' }}>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth={true}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchToAuth('login');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth={true}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchToAuth('register');
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
