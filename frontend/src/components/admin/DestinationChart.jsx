import React from 'react';
import './DestinationChart.css';

export const DestinationChart = ({ cities = [] }) => {
  if (!cities || cities.length === 0) return null;

  const maxVisits = Math.max(...cities.map((c) => c.visits), 100);

  return (
    <div className="gt-chart-card">
      <h4 className="gt-chart-title font-bold text-base text-navy-900 m-0 mb-3">
        Destination Popularity Ranking
      </h4>

      <div className="gt-dest-chart-list flex flex-col gap-2.5">
        {cities.map((c, i) => {
          const pct = Math.round((c.visits / maxVisits) * 100);
          return (
            <div key={c.name} className="gt-dest-rank-item flex flex-col">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-navy-900 flex items-center gap-1">
                  <span className="text-amber-700 font-extrabold w-4">{i + 1}.</span>
                  {c.name}, {c.country}
                </span>
                <span className="font-semibold text-navy-800">
                  {c.visits.toLocaleString()} visits ({c.uniqueTrips} trips)
                </span>
              </div>
              <div className="gt-dest-track w-full bg-subtle h-2.5 rounded-full overflow-hidden">
                <div
                  className="gt-dest-fill bg-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
