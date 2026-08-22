import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="gt-toast__icon gt-toast__icon--success" />,
    error: <AlertCircle className="gt-toast__icon gt-toast__icon--error" />,
    info: <Info className="gt-toast__icon gt-toast__icon--info" />,
  };

  return (
    <div className={`gt-toast gt-toast--${type} animate-fade-in`} role="status" aria-live="polite">
      {icons[type]}
      <span className="gt-toast__message">{message}</span>
      <button type="button" className="gt-toast__close" onClick={onClose} aria-label="Dismiss message">
        <X className="gt-icon" />
      </button>
    </div>
  );
};
