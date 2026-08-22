import React from 'react';
import './UserGrowthChart.css';

export const UserGrowthChart = ({ data = [], timeRange = '30d', onTimeRangeChange }) => {
  if (!data || data.length === 0) return null;

  const maxUsers = Math.max(...data.map((d) => d.users), 100);
  const minUsers = Math.min(...data.map((d) => d.users), 0);

  // Chart Dimensions
  const width = 500;
  const height = 180;
  const padding = 30;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((d.users - minUsers) / (maxUsers - minUsers || 1)) * (height - padding * 2);
    return { x, y, label: d.label, users: d.users };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="gt-chart-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="gt-chart-title font-bold text-base text-navy-900 m-0">User Growth Trend</h4>
          <span className="text-xs text-muted">Platform registered user trajectory</span>
        </div>

        {onTimeRangeChange && (
          <div className="gt-period-switcher flex gap-1 bg-subtle p-1 rounded-md text-xs">
            {['7d', '30d', '3m', '1y'].map((p) => (
              <button
                key={p}
                type="button"
                className={`gt-period-btn ${timeRange === p ? 'gt-period-btn--active' : ''}`}
                onClick={() => onTimeRangeChange(p)}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="gt-svg-chart-container relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="gt-area-svg">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#CBD5E1" />

          {/* Fill Gradient Area */}
          <path d={areaD} fill="rgba(217, 119, 6, 0.12)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748B">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
