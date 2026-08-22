import React from 'react';
import { Check } from 'lucide-react';
import './Checkbox.css';

export const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  children,
  error,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`gt-checkbox-group ${className}`}>
      <label htmlFor={id} className="gt-checkbox-label">
        <div className="gt-checkbox-container">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className="gt-checkbox-input"
          />
          <div className="gt-checkbox-box">
            <Check className="gt-checkbox-icon" />
          </div>
        </div>
        <span className="gt-checkbox-text">
          {label || children}
        </span>
      </label>
      {error && <p className="gt-field__error-text">{error}</p>}
    </div>
  );
};
