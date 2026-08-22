import React from 'react';
import { AdminOverview } from './AdminOverview';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import './AdminSidebar.css';

export const AdminSidebar = () => {
  return (
    <aside className="gt-admin-sidebar-sticky flex flex-col gap-3">
      <AdminOverview />

      {/* Health Status Widget */}
      <div className="gt-admin-health-card p-3 bg-white border border-border rounded-lg shadow-sm text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-navy-900 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Platform Status
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Healthy
          </span>
        </div>
        <div className="text-muted leading-relaxed">
          All API endpoints, search indexers, and authentication services operating normally.
        </div>
      </div>
    </aside>
  );
};
