import React from 'react';
import { ExpenseDisplay } from './ExpenseDisplay';
import { Calculator } from 'lucide-react';
import './DayBudget.css';

export const DayBudget = ({
  dayNumber,
  activities = [],
  dayTotal = 0,
  currency = '₹',
}) => {
  return (
    <div className="gt-day-budget-card">
      <div className="gt-day-budget-header flex items-center justify-between mb-2">
        <span className="gt-day-budget-title flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
          <Calculator className="w-3.5 h-3.5 text-amber-600" />
          Day {dayNumber} Expense Summary
        </span>
        <span className="text-xs text-muted font-medium">{activities.length} Items</span>
      </div>

      <div className="gt-day-budget-table">
        {activities.map((act) => (
          <div key={act.id} className="gt-day-budget-row flex items-center justify-between">
            <span className="gt-day-budget-item-name text-xs text-navy-700 truncate">
              {act.name}
            </span>
            <span className="gt-day-budget-item-cost">
              <ExpenseDisplay cost={act.cost} currency={currency} size="sm" />
            </span>
          </div>
        ))}

        <div className="gt-day-budget-divider" />

        <div className="gt-day-budget-row gt-day-budget-row--total flex items-center justify-between">
          <span className="font-bold text-sm text-navy-900">Day {dayNumber} Total</span>
          <span className="font-extrabold text-base text-amber-700">
            {currency}{dayTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
