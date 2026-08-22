import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', maxWidth = 'md' }) => {
  return (
    <div className={`gt-card gt-card--max-${maxWidth} ${className} animate-fade-in`}>
      {children}
    </div>
  );
};
