import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateEmail } from '../../utils/validation';

export const ForgotPasswordModal = ({ isOpen, onClose, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      if (onShowToast) {
        onShowToast('Password reset link sent to your email!', 'success');
      }
    }, 1200);
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSent(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password">
      {!sent ? (
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <p className="text-sm">
            Enter the email address associated with your GlobeTrotter account. We’ll send you a link to reset your password.
          </p>

          <Input
            id="reset-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. alex@example.com"
            icon={Mail}
            error={error}
            required
          />

          <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-2)' }}>
            <Button variant="text" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex-col items-center text-center gap-4 py-2">
          <CheckCircle2 style={{ width: 48, height: 48, color: 'var(--color-success)' }} />
          <h4 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-navy-900)' }}>
            Check your inbox
          </h4>
          <p className="text-sm">
            We've sent a password reset link to <strong>{email}</strong>. Please check your email to create a new password.
          </p>
          <Button variant="secondary" onClick={handleClose} fullWidth style={{ marginTop: 'var(--space-2)' }}>
            Back to Login
          </Button>
        </div>
      )}
    </Modal>
  );
};
