import React, { useState } from 'react';
import { Search, SlidersHorizontal, Plus, Check, Clock, DollarSign, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ACTIVITIES_DATA, ACTIVITY_CATEGORIES } from '../../data/activitiesData';
import './AddActivityModal.css';

export const AddActivityModal = ({ isOpen, onClose, targetCity, onAddActivity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [timeInput, setTimeInput] = useState('09:00 AM');

  if (!isOpen) return null;

  const filtered = ACTIVITIES_DATA.filter((act) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || act.name.toLowerCase().includes(q) || act.description.toLowerCase().includes(q) || act.city.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    
    let matchesCost = true;
    if (costFilter === 'Free') matchesCost = act.costValue === 0 || act.cost.toLowerCase().includes('free');
    if (costFilter === 'Under500') matchesCost = act.costValue <= 500;

    return matchesSearch && matchesCategory && matchesCost;
  });

  const handleAdd = (act) => {
    const activityWithTime = {
      ...act,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: timeInput,
    };
    onAddActivity(activityWithTime);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Activity to ${targetCity || 'Stop'}`}>
      <div className="gt-add-act-modal flex-col gap-4">
        {/* Time Selector Header */}
        <div className="gt-add-act-time-picker flex items-center justify-between">
          <span className="text-xs font-semibold">Scheduled Time:</span>
          <select
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="gt-add-act-select"
          >
            <option value="09:00 AM">09:00 AM (Morning)</option>
            <option value="11:30 AM">11:30 AM (Late Morning)</option>
            <option value="01:00 PM">01:00 PM (Afternoon Lunch)</option>
            <option value="04:00 PM">04:00 PM (Late Afternoon)</option>
            <option value="07:30 PM">07:30 PM (Evening Dinner)</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="gt-search-input-box">
          <Search className="gt-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities or places..."
            className="gt-search-input"
          />
        </div>

        {/* Category & Cost Filters */}
        <div className="gt-add-act-filters flex gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="gt-filter-select text-xs"
          >
            {ACTIVITY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <select
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
            className="gt-filter-select text-xs"
          >
            <option value="All">Cost: All Tiers</option>
            <option value="Free">Cost: Free Only</option>
            <option value="Under500">Cost: Under ₹500 / $10</option>
          </select>
        </div>

        {/* Activity Cards List */}
        <div className="gt-add-act-list flex-col gap-3">
          {filtered.map((act) => (
            <div key={act.id} className="gt-add-act-card flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={act.image} alt={act.name} className="gt-add-act-img" />
                <div className="flex-col">
                  <strong className="text-sm">{act.name}</strong>
                  <span className="text-xs text-muted">{act.city} • {act.category} • {act.duration}</span>
                  <span className="gt-add-act-desc text-xs">{act.description}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => handleAdd(act)}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
