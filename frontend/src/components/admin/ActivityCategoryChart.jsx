import React from 'react';
import './ActivityCategoryChart.css';

export const ActivityCategoryChart = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="gt-chart-card">
      <h4 className="gt-chart-title font-bold text-base text-navy-900 m-0 mb-3">
        Activity Category Analytics
      </h4>

      {/* Multi-segment stacked bar */}
      <div className="gt-stacked-bar-track w-full h-4 rounded-full overflow-hidden flex mb-4 border border-border">
        {categories.map((c) => (
          <div
            key={c.category}
            className="gt-stacked-bar-seg h-full"
            style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
            title={`${c.category}: ${c.percentage}% (${c.count} items)`}
          />
        ))}
      </div>

      {/* Legend & Breakdown */}
      <div className="gt-cat-analytics-legend flex flex-col gap-2">
        {categories.map((c) => (
          <div key={c.category} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-navy-800">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: c.color }} />
              {c.category}
            </span>
            <span className="font-bold text-navy-900">
              {c.percentage}% ({c.count} selections)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
