import React from 'react';
import { BarChart2, Users, MapPin, Tag } from 'lucide-react';
import './AdminTabs.css';

export const AdminTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'analytics', label: 'User Trends & Analytics', icon: BarChart2 },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'cities', label: 'Popular Cities', icon: MapPin },
    { id: 'activities', label: 'Popular Activities', icon: Tag },
  ];

  return (
    <div className="gt-admin-tabs-nav flex items-center gap-2 mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`gt-admin-tab-btn ${isActive ? 'gt-admin-tab-btn--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-navy-600'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
