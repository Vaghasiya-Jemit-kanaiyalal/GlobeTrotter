import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ShieldCheck, LogIn, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import './AdminLoginForm.css';

export const AdminLoginForm = ({
  onAdminLoginSuccess,
  onBackToApp,
}) => {
  const [email, setEmail] = useState('admin@globetrotter.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (onAdminLoginSuccess) {
        await onAdminLoginSuccess(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gt-admin-login-root min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="gt-admin-login-card max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-500/20 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="medium" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Administrator Portal
          </div>

          <h2 className="brand-serif font-bold text-2xl text-navy-900 m-0">Admin Sign In</h2>
          <p className="text-xs text-navy-600 mt-1">
            Authorized GlobeTrotter management credentials required.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Administrator Email"
            type="email"
            placeholder="admin@globetrotter.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              isLoading={isLoading}
              fullWidth={true}
            >
              Authenticate Admin Session
            </Button>
          </div>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <button
            type="button"
            className="text-xs text-navy-600 hover:text-amber-600 font-semibold inline-flex items-center gap-1 transition-colors"
            onClick={onBackToApp}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to GlobeTrotter Platform
          </button>
        </div>
      </div>
    </div>
  );
};
