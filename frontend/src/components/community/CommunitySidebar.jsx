import React from 'react';
import { AboutCommunity } from './AboutCommunity';
import { PopularDestinations } from './PopularDestinations';
import { TrendingExperiences } from './TrendingExperiences';
import './CommunitySidebar.css';

export const CommunitySidebar = ({
  destinations = [],
  experiences = [],
  onSelectDestination,
  onSelectExperience,
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

      {/* 3. Trending Experiences Card */}
      <TrendingExperiences
        experiences={experiences}
        onSelectExperience={onSelectExperience}
      />
    </aside>
  );
};
