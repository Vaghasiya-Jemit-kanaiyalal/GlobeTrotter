import React from 'react';
import './TripActivityChart.css';

export const TripActivityChart = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 50);

  return (
    <div className="gt-chart-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="gt-chart-title font-bold text-base text-navy-900 m-0">Trips Created Activity</h4>
          <span className="text-xs text-muted">Daily new itinerary creation frequency</span>
        </div>
      </div>

      <div className="gt-bar-chart-grid flex items-end justify-between gap-2 h-44 pt-4 border-b border-border">
        {data.map((item, idx) => {
          const heightPct = Math.round((item.count / maxCount) * 100);
          return (
            <div key={idx} className="gt-bar-col flex flex-col items-center flex-1">
              <span className="gt-bar-val text-xs font-bold text-navy-900 mb-1">{item.count}</span>
              <div className="gt-bar-track w-full bg-subtle rounded-t-md h-32 relative flex items-end">
                <div
                  className="gt-bar-fill w-full bg-navy-900 rounded-t-md hover:bg-amber-600 transition-all cursor-pointer"
                  style={{ height: `${heightPct}%` }}
                  title={`${item.day}: ${item.count} trips created`}
                />
              </div>
              <span className="gt-bar-label text-xs text-navy-600 mt-2 font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
