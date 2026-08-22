import React from 'react';
import './Textarea.css';

export const Textarea = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  helperText,
  required = false,
  disabled = false,
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

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className="gt-textarea"
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="gt-field__error-text" role="alert">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${id}-helper`} className="gt-field__helper-text">
          {helperText}
        </p>
      )}
    </div>
  );
};
