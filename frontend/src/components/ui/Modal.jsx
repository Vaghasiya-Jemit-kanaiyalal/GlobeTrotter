import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal = ({ isOpen, onClose, title, size = 'default', children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="gt-modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`gt-modal-container gt-modal-container--${size} animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="gt-modal-header">
          <h3 id="modal-title" className="gt-modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="gt-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="gt-icon" />
          </button>
        </div>

        <div className="gt-modal-body">{children}</div>
      </div>
    </div>
  );
};
