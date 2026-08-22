import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import './ShareExperienceModal.css';

export const ShareExperienceModal = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'trip',
    destination: 'Goa, India',
    city: 'Goa',
    duration: '5 Days',
    cost: '₹18,000',
    description: '',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    onPublish(formData);
    onClose();
    // Reset
    setFormData({
      title: '',
      type: 'trip',
      destination: 'Goa, India',
      city: 'Goa',
      duration: '3 Days',
      cost: '₹10,000',
      description: '',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Travel Experience"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="gt-share-experience-form flex flex-col gap-3">
        <Input
          label="Experience / Trip Title"
          placeholder="e.g. Amazing 5-Day Goa Adventure & Scuba Diving"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required={true}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Content Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'trip', label: 'Trip Experience' },
              { value: 'activity', label: 'Activity Experience' },
              { value: 'itinerary', label: 'Shared Itinerary' },
              { value: 'tip', label: 'Travel Tip' },
            ]}
          />

          <Input
            label="Destination"
            placeholder="e.g. Goa, India"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            required={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Duration / Time"
            placeholder="e.g. 5 Days"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />

          <Input
            label="Estimated Budget / Cost"
            placeholder="e.g. ₹18,500"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          />
        </div>

        <Textarea
          label="Share your Journey & Advice"
          placeholder="Describe your highlights, places visited, hidden gems, and travel recommendations for the community..."
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required={true}
        />

        <Input
          label="Photo URL (Optional)"
          placeholder="https://images.unsplash.com/..."
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Check}>
            Publish Experience
          </Button>
        </div>
      </form>
    </Modal>
  );
};
