import React from 'react';
import { AboutCommunity } from './AboutCommunity';
import { PopularDestinations } from './PopularDestinations';
import './CommunitySidebar.css';

export const CommunitySidebar = ({
  destinations = [],
  onSelectDestination,
}) => {
  return (
    <aside className="gt-community-sidebar-sticky">
      {/* 1. About Community Card */}
      <AboutCommunity />

      {/* 2. Popular Destinations Card */}
      <PopularDestinations
        destinations={destinations}
        onSelectDestination={onSelectDestination}
      />
    </aside>
  );
};
