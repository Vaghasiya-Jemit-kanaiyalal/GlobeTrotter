import React from 'react';
import './BudgetChart.css';

export const CATEGORY_COLORS = {
  transport: { bg: '#1E293B', label: 'Transport' },
  stay: { bg: '#D97706', label: 'Accommodation' },
  activities: { bg: '#0F766E', label: 'Activities' },
  meals: { bg: '#E11D48', label: 'Meals' },
  other: { bg: '#64748B', label: 'Other' },
};

export const BudgetChart = ({ budget, currency = '₹' }) => {
  if (!budget) return null;

  const categories = [
    { key: 'transport', label: 'Transport', amount: budget.transport || 0, color: '#1E293B' },
    { key: 'stay', label: 'Accommodation', amount: budget.stay || 0, color: '#D97706' },
    { key: 'activities', label: 'Activities', amount: budget.activities || 0, color: '#0F766E' },
    { key: 'meals', label: 'Meals', amount: budget.meals || 0, color: '#E11D48' },
    { key: 'other', label: 'Other', amount: budget.other || 0, color: '#64748B' },
  ];

  const totalCost = categories.reduce((sum, c) => sum + c.amount, 0) || 1;

  // Calculate SVG Donut slice arcs
  let accumulatedAngle = 0;
  const donutSlices = categories.map((cat) => {
    const percentage = (cat.amount / totalCost) * 100;
    const angle = (cat.amount / totalCost) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return {
      ...cat,
      percentage: Math.round(percentage),
      startAngle,
      endAngle: accumulatedAngle,
    };
  });

  // Calculate SVG path for donut ring
  const getSlicePath = (startAngle, endAngle) => {
    const rad = (deg) => (deg - 90) * (Math.PI / 180);
    const rOuter = 50;
    const rInner = 32;
    const cx = 60;
    const cy = 60;

    const x1 = cx + rOuter * Math.cos(rad(startAngle));
    const y1 = cy + rOuter * Math.sin(rad(startAngle));
    const x2 = cx + rOuter * Math.cos(rad(endAngle));
    const y2 = cy + rOuter * Math.sin(rad(endAngle));

    const x3 = cx + rInner * Math.cos(rad(endAngle));
    const y3 = cy + rInner * Math.sin(rad(endAngle));
    const x4 = cx + rInner * Math.cos(rad(startAngle));
    const y4 = cy + rInner * Math.sin(rad(startAngle));

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="gt-budget-chart-card">
      <h4 className="gt-budget-chart-title">Expense Allocation Visualization</h4>

      <div className="gt-chart-visual-wrapper flex items-center justify-center gap-4 my-3">
        {/* SVG Donut Chart */}
        <div className="gt-donut-wrapper relative">
          <svg viewBox="0 0 120 120" className="gt-donut-svg">
            {donutSlices.map((slice) => {
              if (slice.amount === 0) return null;
              // Avoid zero length slice error if 100% single category
              const endDeg = slice.endAngle >= slice.startAngle + 360 ? slice.startAngle + 359.99 : slice.endAngle;
              return (
                <path
                  key={slice.key}
                  d={getSlicePath(slice.startAngle, endDeg)}
                  fill={slice.color}
                  className="gt-donut-slice"
                >
                  <title>{slice.label}: {currency}{slice.amount.toLocaleString()} ({slice.percentage}%)</title>
                </path>
              );
            })}
          </svg>
          <div className="gt-donut-center text-center">
            <span className="gt-donut-total-val text-xs font-bold text-navy-900">
              {currency}{totalCost.toLocaleString()}
            </span>
            <span className="gt-donut-sub text-muted">Total</span>
          </div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="gt-category-bars-list flex flex-col gap-2">
        {categories.map((cat) => {
          const pct = Math.round((cat.amount / totalCost) * 100) || 0;
          return (
            <div key={cat.key} className="gt-cat-bar-item">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-navy-800">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </span>
                <span className="font-semibold text-navy-900">
                  {currency}{cat.amount.toLocaleString()} ({pct}%)
                </span>
              </div>
              <div className="gt-cat-progress-track">
                <div
                  className="gt-cat-progress-fill"
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
