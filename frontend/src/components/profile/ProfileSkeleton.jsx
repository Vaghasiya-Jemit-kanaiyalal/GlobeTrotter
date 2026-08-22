import React from 'react';
import './ProfileSkeleton.css';

export const ProfileSkeleton = () => {
  return (
    <div className="gt-profile-skeleton-card animate-fade-in">
      <div className="gt-skeleton-avatar-circle pulse" />
      <div className="gt-skeleton-details flex-col gap-3">
        <div className="gt-skeleton-line short pulse" />
        <div className="gt-skeleton-line medium pulse" />
        <div className="gt-skeleton-line long pulse" />
      </div>
    </div>
  );
};
