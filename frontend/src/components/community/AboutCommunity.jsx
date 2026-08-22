import React from 'react';
import { Compass, Lightbulb, Share2, MapPin } from 'lucide-react';
import './AboutCommunity.css';

export const AboutCommunity = () => {
  return (
    <div className="gt-about-community-card">
      <h3 className="gt-about-comm-title brand-serif">About the Community</h3>
      <p className="gt-about-comm-sub text-xs text-navy-600 mb-3">
        GlobeTrotter Community is a space for travelers to share authentic journeys, trip ideas, and destination guides.
      </p>

      <ul className="gt-about-comm-list flex flex-col gap-2 text-xs text-navy-800 m-0 p-0 list-none">
        <li className="flex items-start gap-2">
          <Compass className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>Discover experiences & itineraries from other travelers</span>
        </li>
        <li className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>Find trip inspiration for your upcoming vacations</span>
        </li>
        <li className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>Explore top activities, food spots and local culture</span>
        </li>
        <li className="flex items-start gap-2">
          <Share2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>Share your own completed itineraries and travel tips</span>
        </li>
      </ul>
    </div>
  );
};
