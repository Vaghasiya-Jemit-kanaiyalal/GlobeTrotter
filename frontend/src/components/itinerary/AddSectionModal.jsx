import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DestinationAutocomplete } from '../trips/DestinationAutocomplete';
import './AddSectionModal.css';

export const AddSectionModal = ({ isOpen, onClose, onAddSection, nextSectionIndex = 1 }) => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('10000');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please select or enter a destination city');
      return;
    }

    setError('');

    // Extract city name if format is "City, Country"
    const cityName = city.split(',')[0].trim();
    const countryName = city.includes(',') ? city.split(',')[1].trim() : 'India';

    const newSection = {
      id: `sec-${Date.now()}`,
      city: cityName,
      country: countryName,
      startDate: startDate || '13 Sep',
      endDate: endDate || '15 Sep',
      days: 3,
      budget: Number(budget) || 10000,
      activities: [],
    };

    onAddSection(newSection);
    onClose();
    // Reset
    setCity('');
    setStartDate('');
    setEndDate('');
    setBudget('10000');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Stop (Section ${nextSectionIndex})`}>
      <form onSubmit={handleSubmit} className="gt-add-section-form flex-col gap-4">
        <p className="text-sm">
          Expand your multi-city route by adding a new destination stop to your itinerary.
        </p>

        <DestinationAutocomplete
          value={city}
          onChange={(val) => {
            setCity(val);
            if (error) setError('');
          }}
          error={error}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="new-sec-start"
            label="Stop Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            id="new-sec-end"
            label="Stop End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Input
          id="new-sec-budget"
          label="Estimated Section Budget (₹ / $)"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          icon={DollarSign}
        />

        <div className="gt-add-section__footer flex justify-between items-center">
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Plus}>
            Create Stop
          </Button>
        </div>
      </form>
    </Modal>
  );
};
