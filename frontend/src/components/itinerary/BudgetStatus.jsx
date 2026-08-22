import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';
import './BudgetStatus.css';

export const BudgetStatus = ({
  budgetLimit = 40000,
  totalSpent = 38000,
  currency = '₹',
}) => {
  const isOverBudget = totalSpent > budgetLimit;
  const diff = Math.abs(totalSpent - budgetLimit);
  const percentSpent = Math.min(Math.round((totalSpent / (budgetLimit || 1)) * 100), 100);

  return (
    <div className={`gt-budget-status-card ${isOverBudget ? 'gt-budget-status-card--over' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-sm text-navy-900">Trip Budget Status</span>
        </div>

        {isOverBudget ? (
          <span className="gt-status-pill gt-status-pill--danger flex items-center gap-1 text-xs">
            <AlertCircle className="w-3 h-3" /> Over Budget
          </span>
        ) : (
          <span className="gt-status-pill gt-status-pill--success flex items-center gap-1 text-xs">
            <CheckCircle2 className="w-3 h-3" /> Within Budget
          </span>
        )}
      </div>

      <div className="gt-status-numbers-grid grid grid-cols-3 gap-2 text-center mb-3">
        <div className="gt-status-num-item">
          <span className="gt-num-label">Limit</span>
          <span className="gt-num-val">{currency}{budgetLimit.toLocaleString()}</span>
        </div>

        <div className="gt-status-num-item">
          <span className="gt-num-label">Spent</span>
          <span className="gt-num-val">{currency}{totalSpent.toLocaleString()}</span>
        </div>

        <div className="gt-status-num-item">
          <span className="gt-num-label">{isOverBudget ? 'Over By' : 'Remaining'}</span>
          <span className={`gt-num-val ${isOverBudget ? 'text-red-600 font-extrabold' : 'text-emerald-700 font-extrabold'}`}>
            {currency}{diff.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="gt-budget-progress-container">
        <div className="gt-budget-bar-track">
          <div
            className={`gt-budget-bar-fill ${isOverBudget ? 'gt-budget-bar-fill--over' : ''}`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>
        <span className="text-xs text-muted text-right block mt-1">
          {percentSpent}% of total budget allocated
        </span>
      </div>

      {isOverBudget && (
        <div className="gt-over-budget-warning flex items-start gap-2 mt-3 p-2.5 rounded-md text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Subtle Alert:</strong> This trip exceeds your set target budget by{' '}
            <span className="font-bold">{currency}{diff.toLocaleString()}</span>. Consider trimming non-essential activity expenses.
          </div>
        </div>
      )}
    </div>
  );
};
