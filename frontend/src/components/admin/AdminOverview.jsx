import React from 'react';
import { ShieldCheck, Users, MapPin, Tag, BarChart2 } from 'lucide-react';
import './AdminOverview.css';

export const AdminOverview = () => {
  return (
    <div className="gt-admin-overview-card">
      <h3 className="gt-admin-ov-title brand-serif flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-amber-600" />
        Admin Overview
      </h3>

      <p className="text-xs text-navy-600 mb-3">
        Monitor and manage the GlobeTrotter platform performance, users, destinations, and trends.
      </p>

      <div className="gt-admin-ov-sections flex flex-col gap-2 text-xs">
        <div className="gt-ov-sec-item p-2 bg-subtle rounded-md border border-border">
          <strong className="text-navy-900 flex items-center gap-1 mb-0.5">
            <Users className="w-3.5 h-3.5 text-amber-600" /> Manage Users
          </strong>
          <span className="text-muted">Manage registered user accounts, roles, and inspect created trip plans.</span>
        </div>

        <div className="gt-ov-sec-item p-2 bg-subtle rounded-md border border-border">
          <strong className="text-navy-900 flex items-center gap-1 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" /> Popular Cities
          </strong>
          <span className="text-muted">View destinations that are most frequently visited by travelers.</span>
        </div>

        <div className="gt-ov-sec-item p-2 bg-subtle rounded-md border border-border">
          <strong className="text-navy-900 flex items-center gap-1 mb-0.5">
            <Tag className="w-3.5 h-3.5 text-amber-600" /> Popular Activities
          </strong>
          <span className="text-muted">Identify activities and experiences users select most often.</span>
        </div>

        <div className="gt-ov-sec-item p-2 bg-subtle rounded-md border border-border">
          <strong className="text-navy-900 flex items-center gap-1 mb-0.5">
            <BarChart2 className="w-3.5 h-3.5 text-amber-600" /> User Trends & Analytics
          </strong>
          <span className="text-muted">Monitor platform user growth, trip creation frequency, and category breakdowns.</span>
        </div>
      </div>
    </div>
  );
};
