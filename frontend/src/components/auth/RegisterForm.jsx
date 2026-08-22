import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { AvatarUpload } from '../ui/AvatarUpload';
import { validateRegisterForm, getPasswordStrength } from '../../utils/validation';
import './RegisterForm.css';

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'SG', label: 'Singapore' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'BR', label: 'Brazil' },
  { value: 'OTHER', label: 'Other Country' },
];

export const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    avatarUrl: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: '',
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await onRegisterSuccess({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        avatarUrl: formData.avatarUrl,
        additionalInfo: formData.additionalInfo,
      });
    } catch (err) {
      setErrors({ email: err.message || 'Registration failed. Email may already be registered.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card maxWidth="xl" className="gt-register-card">
      {/* Branding Header */}
      <div className="gt-auth-header text-center mb-2">
        <Logo size="large" showTagline={true} centered={true} />
      </div>

      {/* Styled & Justified Header Title Box */}
      <div className="gt-register-title-box p-4 bg-subtle rounded-xl border border-border text-center mb-4">
        <h2 className="gt-register-title brand-serif text-2xl font-bold text-navy-900 m-0 mb-1.5">
          Start Your Journey
        </h2>
        <p className="gt-register-subtitle text-xs text-navy-600 max-w-md mx-auto m-0 leading-relaxed text-center">
          Create your personalized GlobeTrotter account to design, manage, and share multi-city trips worldwide.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="gt-register-form flex flex-col gap-4" noValidate>
        {/* Profile Photo / Avatar Upload Area */}
        <div className="gt-form-section">
          <AvatarUpload
            value={formData.avatarUrl}
            onChange={(url) => handleChange('avatarUrl', url)}
            label="Profile Picture & Travel Avatar"
          />
        </div>

        {/* Form Fields: Two-Column Responsive Grid */}
        <div className="gt-form-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <Input
            id="register-firstname"
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="e.g. Alex"
            icon={User}
            error={errors.firstName}
            required
          />

          {/* Last Name */}
          <Input
            id="register-lastname"
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="e.g. Morgan"
            icon={User}
            error={errors.lastName}
            required
          />

          {/* Email Address */}
          <Input
            id="register-email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="alex.morgan@example.com"
            icon={Mail}
            error={errors.email}
            required
          />

          {/* Phone Number */}
          <Input
            id="register-phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            icon={Phone}
            error={errors.phone}
            required
          />

          {/* Password Field */}
          <div className="flex flex-col">
            <Input
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
            />
            {formData.password && (
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-muted">Strength:</span>
                <span className="font-bold" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword}
            required
          />

          {/* City */}
          <Input
            id="register-city"
            label="City"
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. San Francisco"
            icon={MapPin}
            error={errors.city}
            required
          />

          {/* Country Select */}
          <Select
            id="register-country"
            label="Country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            options={COUNTRY_OPTIONS}
            placeholder="Select your country"
            icon={Globe}
            error={errors.country}
            required
          />
        </div>

        {/* Additional Information / Travel Preferences */}
        <div className="gt-form-section">
          <Textarea
            id="register-additional"
            label="Additional Information & Travel Style"
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            placeholder="Tell us about your favorite travel destinations, budget style, or trip preferences (e.g., adventure, cultural exploration, relaxed vacation)..."
            rows={3}
            helperText="Optional: Helps GlobeTrotter personalize multi-city trip recommendations for you."
          />
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="gt-form-section">
          <Checkbox
            id="register-terms"
            checked={formData.terms}
            onChange={(e) => handleChange('terms', e.target.checked)}
            error={errors.terms}
          >
            I agree to the{' '}
            <a href="#terms" onClick={(e) => e.preventDefault()} className="gt-link-underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="gt-link-underline">
              Privacy Policy
            </a>.
          </Checkbox>
        </div>

        {/* Submit Button */}
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
          Complete Registration
        </Button>
      </form>

      {/* Footer Switch Link */}
      <div className="gt-auth-footer text-center pt-3 border-t border-border mt-2">
        <p className="text-sm text-navy-700">
          Already have an account?{' '}
          <button
            type="button"
            className="gt-switch-link text-amber-600 font-bold hover:underline"
            onClick={onSwitchToLogin}
          >
            Sign In
          </button>
        </p>
      </div>
    </Card>
  );
};
