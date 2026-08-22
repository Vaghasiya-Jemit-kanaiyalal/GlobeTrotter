import React from 'react';
import { ActivityTimelineItem } from './ActivityTimelineItem';
import './Timeline.css';

export const Timeline = ({
  activities = [],
  currency = '₹',
  onViewDetails,
  onEditActivity,
  onRemoveActivity,
}) => {
  return (
    <div className="gt-timeline-container">
      {activities.map((activity, idx) => (
        <ActivityTimelineItem
          key={activity.id}
          activity={activity}
          currency={currency}
          isLast={idx === activities.length - 1}
          onViewDetails={onViewDetails}
          onEditActivity={onEditActivity}
          onRemoveActivity={onRemoveActivity}
        />
      ))}
    </div>
  );
};
