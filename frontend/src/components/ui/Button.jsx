import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const isDisableOrLoading = disabled || loading;

  return (
    <button
      type={type}
      className={`gt-btn gt-btn--${variant} gt-btn--${size} ${fullWidth ? 'gt-btn--full' : ''} ${className}`}
      disabled={isDisableOrLoading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="gt-btn__spinner animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="gt-btn__icon" />}
      <span className="gt-btn__text">{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="gt-btn__icon" />}
    </button>
  );
};
