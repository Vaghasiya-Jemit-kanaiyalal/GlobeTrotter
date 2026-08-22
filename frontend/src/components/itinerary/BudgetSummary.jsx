import React from 'react';
import { BudgetStatus } from './BudgetStatus';
import { BudgetChart } from './BudgetChart';
import { BudgetBreakdown } from './BudgetBreakdown';
import './BudgetSummary.css';

export const BudgetSummary = ({
  budget,
  budgetLimit = 40000,
  currency = '₹',
  daysCount = 1,
}) => {
  if (!budget) return null;

  const totalSpent = budget.total || 0;

  return (
    <aside className="gt-budget-panel-sticky">
      <div className="gt-budget-panel-header">
        <h2 className="gt-budget-panel-title brand-serif">Trip Budget Summary</h2>
        <p className="gt-budget-panel-sub text-xs text-muted">
          Real-time expense estimation & breakdown
        </p>
      </div>

      {/* Status Card */}
      <BudgetStatus
        budgetLimit={budgetLimit}
        totalSpent={totalSpent}
        currency={currency}
      />

      {/* Category Cost Breakdown */}
      <BudgetBreakdown
        budget={budget}
        currency={currency}
        daysCount={daysCount}
      />

      {/* Donut Chart & Category Bars */}
      <BudgetChart
        budget={budget}
        currency={currency}
      />
    </aside>
  );
};
