import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { ExpenseDisplay } from './ExpenseDisplay';
import { Clock, Tag, MapPin, DollarSign, Check, X } from 'lucide-react';
import './ActivityEditModal.css';

export const ActivityEditModal = ({
  isOpen,
  mode = 'edit', // 'view' | 'edit' | 'add'
  activity,
  dayNumber,
  currency = '₹',
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sightseeing',
    time: '09:00 AM',
    duration: '2 hours',
    cost: 0,
    description: '',
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || '',
        category: activity.category || 'Sightseeing',
        time: activity.time || '09:00 AM',
        duration: activity.duration || '1-2 hours',
        cost: typeof activity.cost === 'number' ? activity.cost : (parseFloat(activity.cost) || 0),
        description: activity.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Sightseeing',
        time: '10:00 AM',
        duration: '2 hours',
        cost: 0,
        description: '',
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: activity?.id || `act-custom-${Date.now()}`,
      dayNumber: dayNumber || activity?.dayNumber || 1,
      ...formData,
      cost: Number(formData.cost) || 0,
    });
    onClose();
  };

  const isViewMode = mode === 'view';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isViewMode
          ? 'Activity Details'
          : mode === 'add'
          ? `Add Activity to Day ${dayNumber}`
          : 'Edit Activity'
      }
      size="medium"
    >
      {isViewMode ? (
        <div className="gt-activity-view-modal">
          {activity?.image && (
            <div className="gt-act-modal-cover mb-3">
              <img src={activity.image} alt={activity.name} />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="gt-activity-cat-badge">{activity?.category}</span>
            <ExpenseDisplay cost={activity?.cost || 0} currency={currency} size="lg" />
          </div>

          <h3 className="font-bold text-xl text-navy-900 mb-2 brand-serif">{activity?.name}</h3>

          <div className="gt-view-meta-list flex flex-col gap-1.5 text-sm text-navy-700 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Time: <strong>{activity?.time}</strong> ({activity?.duration})</span>
            </div>
          </div>

          {activity?.description && (
            <div className="gt-view-desc p-3 bg-subtle rounded-md text-sm text-navy-800 mb-4">
              {activity.description}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="gt-activity-edit-form">
          <Input
            label="Activity Name"
            placeholder="e.g. Gateway of India Tour"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required={true}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Sightseeing', label: 'Sightseeing' },
                { value: 'Culture & History', label: 'Culture & History' },
                { value: 'Food & Dining', label: 'Food & Dining' },
                { value: 'Adventure & Nature', label: 'Adventure & Nature' },
                { value: 'Relaxation & Beaches', label: 'Relaxation & Beaches' },
              ]}
            />

            <Input
              label={`Estimated Cost (${currency})`}
              type="number"
              min="0"
              placeholder="0 for Free"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Scheduled Time"
              placeholder="e.g. 09:00 AM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required={true}
            />

            <Input
              label="Duration"
              placeholder="e.g. 2 hours"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          <Textarea
            label="Activity Description"
            placeholder="Short overview of what to expect..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Check}>
              {mode === 'add' ? 'Add Activity' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
