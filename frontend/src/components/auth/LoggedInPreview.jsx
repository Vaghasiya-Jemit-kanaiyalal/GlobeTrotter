import React from 'react';
import { Compass, MapPin, Calendar, Plus, LogOut, CheckCircle2, Globe, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './LoggedInPreview.css';

export const LoggedInPreview = ({ user, onLogout }) => {
  return (
    <Card maxWidth="xl" className="gt-dashboard-preview animate-fade-in">
      {/* Dashboard Top Header */}
      <div className="gt-db-header flex justify-between items-center">
        <Logo size="small" showTagline={false} centered={false} />
        
        <div className="gt-db-user-badge flex items-center gap-3">
          <div className="gt-db-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name || user.firstName} />
            ) : (
              <User className="gt-icon" />
            )}
          </div>
          <div className="gt-db-user-info flex-col">
            <span className="gt-db-user-name">
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.name || 'Traveler'}
            </span>
            <span className="gt-db-user-email">{user.email}</span>
          </div>
          <Button variant="outline" size="sm" icon={LogOut} onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      <div className="gt-db-success-banner flex items-center gap-3">
        <CheckCircle2 className="gt-db-banner-icon" />
        <div className="flex-col">
          <strong>Authentication Successful!</strong>
          <span className="text-sm">Welcome to your GlobeTrotter Personalized Travel Portal.</span>
        </div>
      </div>

      {/* Travel Summary & Quick Actions */}
      <div className="gt-db-body flex-col gap-6">
        <div className="gt-db-hero flex justify-between items-center">
          <div>
            <h2 className="gt-db-title brand-serif">
              Where to next, {user.firstName || user.name || 'Explorer'}?
            </h2>
            <p className="gt-db-subtitle text-sm">
              Your personalized multi-city itinerary planner is ready.
            </p>
          </div>
          <Button variant="primary" icon={Plus}>
            Create New Trip
          </Button>
        </div>

        {/* Preview Travel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="gt-trip-card">
            <div className="gt-trip-badge">Upcoming Trip</div>
            <h3 className="gt-trip-title">European Classical Tour</h3>
            <p className="gt-trip-route text-sm flex items-center gap-1">
              <MapPin className="gt-icon" /> Paris &rarr; Rome &rarr; Barcelona
            </p>
            <div className="gt-trip-footer flex justify-between text-xs">
              <span><Calendar className="gt-icon inline-icon" /> Oct 12 - Oct 26</span>
              <span>14 Days</span>
            </div>
          </div>

          <div className="gt-trip-card gt-trip-card--draft">
            <div className="gt-trip-badge gt-trip-badge--draft">Draft Plan</div>
            <h3 className="gt-trip-title">Kyoto & Tokyo Discovery</h3>
            <p className="gt-trip-route text-sm flex items-center gap-1">
              <Globe className="gt-icon" /> Tokyo &rarr; Hakone &rarr; Kyoto
            </p>
            <div className="gt-trip-footer flex justify-between text-xs">
              <span><Calendar className="gt-icon inline-icon" /> Nov 05 - Nov 15</span>
              <span>10 Days</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
