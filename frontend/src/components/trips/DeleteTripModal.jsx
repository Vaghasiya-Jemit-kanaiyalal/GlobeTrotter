import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteTripModal = ({ trip, isOpen, onClose, onDelete }) => {
  if (!isOpen || !trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Trip?">
      <div className="flex-col gap-4">
        <div className="flex items-center gap-3" style={{ color: 'var(--color-error)' }}>
          <AlertTriangle style={{ width: 32, height: 32, flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-navy-900)' }}>
              Are you sure you want to delete "{trip.title}"?
            </strong>
            <p className="text-xs text-muted" style={{ marginTop: 2 }}>
              This action cannot be undone. All saved day-by-day schedules, routes, and activity notes will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: 12 }}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            icon={Trash2}
            onClick={() => {
              onDelete(trip.id);
              onClose();
            }}
          >
            Delete Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};
