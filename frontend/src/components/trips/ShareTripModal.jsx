import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Copy, Check, Share2, Globe } from 'lucide-react';

export const ShareTripModal = ({ trip, isOpen, onClose, onShowToast }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !trip) return null;

  const shareUrl = `http://localhost:5173/share/trip/${trip.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (onShowToast) onShowToast('Public trip link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share Trip: ${trip.title}`}>
      <div className="flex-col gap-4 text-center py-2">
        <Globe style={{ width: 44, height: 44, color: 'var(--color-amber-600)', margin: '0 auto' }} />
        <h4 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-navy-900)' }}>
          Public Itinerary Link
        </h4>
        <p className="text-sm">
          Anyone with this link can view your multi-city route, daily activities, and travel highlights.
        </p>

        <div className="gt-input-wrapper" style={{ marginTop: 8 }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="gt-input"
            style={{ paddingRight: '4rem', fontSize: 'var(--font-size-xs)' }}
          />
          <button
            type="button"
            className="gt-input__toggle-password flex items-center gap-1"
            onClick={handleCopy}
            style={{ color: 'var(--color-amber-600)', fontWeight: 700 }}
          >
            {copied ? <Check className="gt-icon" /> : <Copy className="gt-icon" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <Button variant="secondary" onClick={onClose} fullWidth style={{ marginTop: 12 }}>
          Close
        </Button>
      </div>
    </Modal>
  );
};
