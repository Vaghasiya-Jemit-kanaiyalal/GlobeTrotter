import React from 'react';
import { Users, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import './CommunityIntro.css';

export const CommunityIntro = ({ onOpenShareModal }) => {
  return (
    <div className="gt-community-intro-card flex items-center justify-between flex-wrap gap-4">
      <div>
        <div className="gt-community-intro-pill flex items-center gap-1.5 mb-1 text-xs uppercase font-bold text-amber-600">
          <Users className="w-3.5 h-3.5" />
          GlobeTrotter Traveler Community
        </div>
        <h1 className="gt-community-intro-title brand-serif m-0">Community</h1>
        <p className="gt-community-intro-sub text-sm text-navy-600 m-0 mt-1 max-w-xl">
          Discover travel experiences, trip ideas, activities and shared itineraries published by fellow GlobeTrotter explorers.
        </p>
      </div>

      {onOpenShareModal && (
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onOpenShareModal}
        >
          Share Your Experience
        </Button>
      )}
    </div>
  );
};
