import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Save } from 'lucide-react';

export const EditTripModal = ({ trip, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trip) {
      setTitle(trip.title || '');
      setLocation(trip.primaryLocation || '');
      setStartDate(trip.startDate || '');
      setEndDate(trip.endDate || '');
      setSummary(trip.summary || '');
    }
  }, [trip]);

  if (!isOpen || !trip) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave(trip.id, {
        title,
        primaryLocation: location,
        startDate,
        endDate,
        summary,
      });
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Trip: ${trip.title}`}>
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        <Input
          id="edit-title"
          label="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          id="edit-location"
          label="Primary Destination"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="edit-start"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            id="edit-end"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Textarea
          id="edit-summary"
          label="Trip Description & Notes"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
        />

        <div className="flex justify-between items-center" style={{ marginTop: 12 }}>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
