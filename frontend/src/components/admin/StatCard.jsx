import React from 'react';
import { TrendingUp, Users, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import './StatCard.css';

export const StatCard = ({ title, value, badge, icon: Icon, color = 'amber' }) => {
  return (
    <div className="gt-stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="gt-stat-title text-xs font-semibold uppercase tracking-wider text-muted">
          {title}
        </span>
        {Icon && (
          <div className={`gt-stat-icon-wrapper gt-stat-icon-wrapper--${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="gt-stat-value brand-serif font-bold text-2xl text-navy-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>

        {badge && (
          <span className="gt-stat-badge text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3 inline" />
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
