import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteAccountModal = ({ isOpen, onClose, onDeleteAccount }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirmText !== 'DELETE') return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      onDeleteAccount();
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account?">
      <div className="flex-col gap-4">
        <div className="flex items-center gap-3" style={{ color: 'var(--color-error)' }}>
          <AlertTriangle style={{ width: 36, height: 36, flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-navy-900)' }}>
              Permanently Delete Your GlobeTrotter Account?
            </strong>
            <p className="text-xs text-muted" style={{ marginTop: 2 }}>
              This will permanently remove your profile, personal data, saved trips, and itinerary history. This action cannot be undone.
            </p>
          </div>
        </div>

        <Input
          id="confirm-delete-input"
          label="Type DELETE to confirm:"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
        />

        <div className="flex justify-between items-center" style={{ marginTop: 8 }}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={confirmText !== 'DELETE' || isDeleting}
            loading={isDeleting}
            style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            icon={Trash2}
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Modal>
  );
};
