import React from 'react';
import { AboutCommunity } from './AboutCommunity';
import './CommunitySidebar.css';

export const CommunitySidebar = () => {
  return (
    <aside className="gt-community-sidebar-sticky">
      {/* 1. About Community Card */}
      <AboutCommunity />
    </aside>
  );
};
