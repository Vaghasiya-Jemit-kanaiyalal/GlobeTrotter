import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { validateLoginForm } from '../../utils/validation';
import './LoginForm.css';

export const LoginForm = ({ onSwitchToRegister, onLoginSuccess, onOpenForgotPassword }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Live REST API authentication call via authService
    try {
      await onLoginSuccess({
        email: formData.identifier,
        password: formData.password,
      });
    } catch (err) {
      setErrors({ identifier: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card maxWidth="md" className="gt-login-card">
      {/* Branding Header */}
      <div className="gt-auth-header text-center">
        <Logo size="large" showTagline={true} centered={true} />
      </div>

      {/* User Profile Visual Header */}
      <div className="gt-user-visual">
        <div className="gt-user-visual__avatar">
          <User className="gt-user-visual__icon" />
        </div>
        <h2 className="gt-user-visual__welcome">Welcome back</h2>
        <p className="gt-user-visual__subtitle">Log in to manage your personalized travel itineraries</p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="gt-auth-form" noValidate>
        <Input
          id="login-identifier"
          label="Username or Email Address"
          type="text"
          value={formData.identifier}
          onChange={(e) => handleChange('identifier', e.target.value)}
          placeholder="e.g. alex@example.com"
          icon={User}
          error={errors.identifier}
          autoComplete="username"
          required
        />

        <Input
          id="login-password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Enter your password"
          icon={Lock}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        {/* Options: Remember me & Forgot password */}
        <div className="gt-auth-options flex justify-between items-center">
          <Checkbox
            id="remember-me"
            checked={formData.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            label="Remember me"
          />
          <button
            type="button"
            className="gt-forgot-password-btn"
            onClick={onOpenForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth={true}
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
          className="gt-submit-btn"
        >
          Sign In to GlobeTrotter
        </Button>
      </form>

      {/* Footer Switch Link */}
      <div className="gt-auth-footer text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            className="gt-switch-link"
            onClick={onSwitchToRegister}
          >
            Create an Account
          </button>
        </p>
      </div>
    </Card>
  );
};
