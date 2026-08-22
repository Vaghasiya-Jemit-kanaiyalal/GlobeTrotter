import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Input.css';

export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  autoComplete,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const currentType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`gt-field ${error ? 'gt-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="gt-field__label">
          {label}
          {required && <span className="gt-field__required" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="gt-input-wrapper">
        {Icon && (
          <div className="gt-input__icon-left">
            <Icon className="gt-icon" />
          </div>
        )}

        <input
          id={id}
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`gt-input ${Icon ? 'gt-input--has-left-icon' : ''} ${
            isPasswordType || error || success ? 'gt-input--has-right-icon' : ''
          }`}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            className="gt-input__toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="gt-icon" /> : <Eye className="gt-icon" />}
          </button>
        )}

        {!isPasswordType && error && (
          <div className="gt-input__icon-right gt-input__icon-right--error">
            <AlertCircle className="gt-icon" />
          </div>
        )}

        {!isPasswordType && !error && success && (
          <div className="gt-input__icon-right gt-input__icon-right--success">
            <CheckCircle2 className="gt-icon" />
          </div>
        )}
      </div>

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
