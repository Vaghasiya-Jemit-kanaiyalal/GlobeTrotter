import React, { useState, useEffect } from 'react';
import { Compass, Bell, User, Plus, Menu, X, LogIn, UserPlus, MapPin, Calendar, LogOut, ChevronDown } from 'lucide-react';
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
    { id: 'home', label: 'Home', action: () => onNavigate('landing', 'home') },
    { id: 'destinations', label: 'Explore Destinations', action: () => onNavigate('landing', 'destinations') },
    { id: 'trips', label: 'My Trips', action: () => onNavigate('landing', 'trips') },
  ];

  return (
    <header className={`gt-navbar ${isScrolled ? 'gt-navbar--scrolled' : ''}`}>
      <div className="gt-navbar__inner">
        {/* Left: Brand Logo */}
        <div className="gt-navbar__brand" onClick={() => onNavigate('landing', 'home')}>
          <Logo size="small" showTagline={false} centered={false} />
        </div>

        {/* Center: Desktop Navigation Links */}
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
            className="gt-navbar__plan-btn"
          >
            Plan a Trip
          </Button>

          {/* Notifications Bell */}
          <button
            type="button"
            className="gt-navbar__icon-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => setHasNotification(!hasNotification)}
          >
            <Bell className="gt-icon" />
            {hasNotification && <span className="gt-navbar__notif-badge" />}
          </button>

          {/* User Profile Avatar / Dropdown */}
          <div className="gt-navbar__user-container">
            <button
              type="button"
              className="gt-navbar__user-btn"
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
                  <span className="text-xs text-muted">{currentUser ? currentUser.email : 'Not signed in'}</span>
                </div>
                <div className="gt-user-dropdown__divider" />
                
                <button
                  type="button"
                  className="gt-user-dropdown__item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onNavigate('landing', 'trips');
                  }}
                >
                  <Calendar className="gt-icon" />
                  <span>My Planned Trips</span>
                </button>

                <button
                  type="button"
                  className="gt-user-dropdown__item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenCreateTrip();
                  }}
                >
                  <Plus className="gt-icon" />
                  <span>Create New Itinerary</span>
                </button>

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
                      <span>Sign In (Screen 1)</span>
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
                      <span>Register (Screen 2)</span>
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
          <nav className="gt-navbar__mobile-links">
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
          </nav>
        </div>
      )}
    </header>
  );
};
