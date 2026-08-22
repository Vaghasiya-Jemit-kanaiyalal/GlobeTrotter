import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import './Select.css';

export const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`gt-field ${error ? 'gt-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="gt-field__label">
          {label}
          {required && <span className="gt-field__required" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="gt-select-wrapper">
        {Icon && (
          <div className="gt-select__icon-left">
            <Icon className="gt-icon" />
          </div>
        )}

        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`gt-select ${Icon ? 'gt-select--has-left-icon' : ''}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="gt-select__arrow">
          <ChevronDown className="gt-icon" />
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} className="gt-field__error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
