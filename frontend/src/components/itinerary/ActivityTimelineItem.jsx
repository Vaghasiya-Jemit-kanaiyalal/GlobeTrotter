import React from 'react';
import { Clock, Tag, Eye, Edit3, Trash2, MapPin } from 'lucide-react';
import { ExpenseDisplay } from './ExpenseDisplay';
import './ActivityTimelineItem.css';

export const ActivityTimelineItem = ({
  activity,
  currency = '₹',
  isLast = false,
  onViewDetails,
  onEditActivity,
  onRemoveActivity,
}) => {
  return (
    <div className="gt-timeline-item">
      {/* Time & Vertical Connector Line */}
      <div className="gt-timeline-left">
        <div className="gt-timeline-time flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-muted" />
          <span>{activity.time}</span>
        </div>
        <div className="gt-timeline-node-dot" />
        {!isLast && <div className="gt-timeline-connector-line" />}
      </div>

      {/* Main Activity Card */}
      <div className="gt-timeline-card">
        <div className="gt-timeline-card-inner flex items-start justify-between gap-3">
          {/* Left: Thumbnail & Details */}
          <div className="flex items-start gap-3 flex-1">
            {activity.image && (
              <div className="gt-activity-thumb">
                <img src={activity.image} alt={activity.name} />
              </div>
            )}

            <div className="gt-activity-content">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="gt-activity-cat-badge flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {activity.category}
                </span>

                {activity.duration && (
                  <span className="gt-activity-duration">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {activity.duration}
                  </span>
                )}
              </div>

              <h4 className="gt-activity-name">{activity.name}</h4>

              {activity.description && (
                <p className="gt-activity-desc">{activity.description}</p>
              )}
            </div>
          </div>

          {/* Right: Cost & Action Controls */}
          <div className="gt-activity-right flex flex-col items-end gap-2">
            <ExpenseDisplay cost={activity.cost} currency={currency} size="md" />

            <div className="gt-activity-actions flex items-center gap-1">
              <button
                type="button"
                className="gt-act-action-btn"
                onClick={() => onViewDetails(activity)}
                title="View activity details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="gt-act-action-btn"
                onClick={() => onEditActivity(activity)}
                title="Edit activity"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {onRemoveActivity && (
                <button
                  type="button"
                  className="gt-act-action-btn gt-act-action-btn--danger"
                  onClick={() => onRemoveActivity(activity.id)}
                  title="Remove activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
