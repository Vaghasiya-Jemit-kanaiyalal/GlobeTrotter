import React from 'react';
import { StatCard } from './StatCard';
import { UserGrowthChart } from './UserGrowthChart';
import { TripActivityChart } from './TripActivityChart';
import { DestinationChart } from './DestinationChart';
import { ActivityCategoryChart } from './ActivityCategoryChart';
import { Users, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import './AnalyticsDashboard.css';

export const AnalyticsDashboard = ({
  overview,
  userGrowthData = [],
  tripActivityData = [],
  popularCitiesData = [],
  categoryData = [],
  timeRange = '30d',
  onTimeRangeChange,
}) => {
  return (
    <div className="gt-analytics-dashboard flex flex-col gap-4">
      {/* 1. Overview Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Users"
          value={overview?.totalUsers || 2450}
          badge={overview?.growthRate || '+12.4%'}
          icon={Users}
          color="amber"
        />

        <StatCard
          title="Total Trips"
          value={overview?.totalTrips || 1820}
          icon={MapPin}
          color="navy"
        />

        <StatCard
          title="Public Shared Trips"
          value={overview?.publicTrips || 740}
          icon={Globe}
          color="teal"
        />

        <StatCard
          title="Active Users"
          value={overview?.activeUsers || 1320}
          icon={CheckCircle2}
          color="rose"
        />
      </div>

      {/* 2. Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserGrowthChart
          data={userGrowthData}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />

        <TripActivityChart data={tripActivityData} />
      </div>

      {/* 3. Secondary Ranking & Category Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DestinationChart cities={popularCitiesData} />

        <ActivityCategoryChart categories={categoryData} />
      </div>
    </div>
  );
};
