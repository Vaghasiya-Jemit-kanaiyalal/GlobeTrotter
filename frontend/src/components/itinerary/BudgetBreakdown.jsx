import React from 'react';
import { Bus, Home, Ticket, Utensils, MoreHorizontal } from 'lucide-react';
import './BudgetBreakdown.css';

export const BudgetBreakdown = ({ budget, currency = '₹', daysCount = 1 }) => {
  if (!budget) return null;

  const rows = [
    { label: 'Transport', icon: Bus, amount: budget.transport || 0 },
    { label: 'Stay (Accommodation)', icon: Home, amount: budget.stay || 0 },
    { label: 'Activities', icon: Ticket, amount: budget.activities || 0 },
    { label: 'Meals', icon: Utensils, amount: budget.meals || 0 },
    { label: 'Other', icon: MoreHorizontal, amount: budget.other || 0 },
  ];

  const total = budget.total || rows.reduce((s, r) => s + r.amount, 0);
  const avgPerDay = Math.round(total / (daysCount || 1));

  return (
    <div className="gt-budget-breakdown-card">
      <h3 className="gt-breakdown-heading brand-serif">Category Cost Breakdown</h3>

      <div className="gt-breakdown-table">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="gt-breakdown-row flex items-center justify-between py-1.5 text-sm">
              <span className="flex items-center gap-2 text-navy-700">
                <Icon className="w-3.5 h-3.5 text-amber-600" />
                {row.label}
              </span>
              <span className="font-semibold text-navy-900">
                {currency}{row.amount.toLocaleString()}
              </span>
            </div>
          );
        })}

        <div className="gt-breakdown-divider" />

        <div className="gt-breakdown-row gt-breakdown-row--total flex items-center justify-between font-bold text-base">
          <span className="text-navy-900">Total Trip Cost</span>
          <span className="text-amber-700 font-extrabold">{currency}{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Additional Metrics required by spec */}
      <div className="gt-budget-metrics-grid grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
        <div className="gt-metric-box">
          <span className="gt-metric-label">Average Cost / Day</span>
          <span className="gt-metric-val">{currency}{avgPerDay.toLocaleString()}</span>
        </div>
        <div className="gt-metric-box">
          <span className="gt-metric-label">Activities Total</span>
          <span className="gt-metric-val">{currency}{(budget.activities || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
