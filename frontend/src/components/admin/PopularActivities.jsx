import React from 'react';
import { Tag, MapPin, Flame } from 'lucide-react';
import './PopularActivities.css';

export const PopularActivities = ({ activities = [] }) => {
  return (
    <div className="gt-popular-activities-card bg-white border border-border rounded-xl p-4 shadow-sm">
      <div className="gt-admin-act-table-wrapper overflow-x-auto">
        <table className="gt-admin-act-table w-full text-left border-collapse">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Activity Name</th>
              <th>Category</th>
              <th>City</th>
              <th>Selections</th>
              <th className="text-right">Popularity Rating</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act, idx) => (
              <tr key={act.name} className="hover:bg-subtle transition-all">
                <td className="font-extrabold text-amber-700">#{idx + 1}</td>
                <td>
                  <span className="font-bold text-sm text-navy-900">{act.name}</span>
                </td>
                <td>
                  <span className="gt-admin-cat-badge">{act.category}</span>
                </td>
                <td>
                  <span className="text-xs text-navy-700">
                    <MapPin className="w-3 h-3 text-amber-600 inline mr-1" />
                    {act.city}
                  </span>
                </td>
                <td className="font-bold text-xs text-navy-900">
                  {act.selections.toLocaleString()} selections
                </td>
                <td className="text-right">
                  <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 inline mr-0.5" />
                    {act.popularity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
