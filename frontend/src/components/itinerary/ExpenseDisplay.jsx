import React from 'react';
import './ExpenseDisplay.css';

export const ExpenseDisplay = ({ cost, currency = '₹', size = 'md', className = '' }) => {
  const isFree = cost === 0 || cost === '0' || cost === 'Free';

  return (
    <div className={`gt-expense-badge gt-expense-badge--${size} ${isFree ? 'gt-expense-badge--free' : ''} ${className}`}>
      {isFree ? (
        <span className="gt-expense-free">Free</span>
      ) : (
        <span className="gt-expense-amount">
          {currency}{typeof cost === 'number' ? cost.toLocaleString() : cost}
        </span>
      )}
    </div>
  );
};
