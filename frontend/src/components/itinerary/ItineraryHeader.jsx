import React from 'react';
import { ArrowLeft, User, Share2, Compass, CheckCircle2 } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import './ItineraryHeader.css';

export const ItineraryHeader = ({
  tripTitle,
  currentUser,
  onBackToDashboard,
  onShareItinerary,
}) => {
  return (
    <header className="gt-itin-header">
      <div className="gt-itin-header__inner">
        {/* Left: Brand & Back Navigation */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="gt-back-btn flex items-center gap-1"
            onClick={onBackToDashboard}
            title="Return to Dashboard"
          >
            <ArrowLeft className="gt-icon" />
            <span>Dashboard</span>
          </button>

          <div className="gt-itin-header__divider" />

          <Logo size="small" showTagline={false} centered={false} />

          <span className="gt-itin-header__trip-badge">
            {tripTitle || 'Custom Itinerary'}
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

          <div className="gt-navbar__avatar">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.firstName || currentUser.name} />
            ) : (
              <User className="gt-icon" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
