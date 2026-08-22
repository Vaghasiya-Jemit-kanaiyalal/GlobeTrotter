import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  IndianRupee,
  Plus,
  Clock,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './ItinerarySection.css';

export const ItinerarySection = ({
  section,
  sectionIndex,
  totalSections,
  currency = '₹',
  onMoveUp,
  onMoveDown,
  onUpdateDates,
  onUpdateBudget,
  onAddActivityClick,
  onRemoveActivity,
  onDeleteSectionClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [tempStartDate, setTempStartDate] = useState(section.startDate || '');
  const [tempEndDate, setTempEndDate] = useState(section.endDate || '');
  const [tempBudget, setTempBudget] = useState(section.budget || 0);

  const handleSaveDates = () => {
    onUpdateDates(section.id, tempStartDate, tempEndDate);
    setIsEditingDates(false);
  };

  const handleSaveBudget = () => {
    onUpdateBudget(section.id, Number(tempBudget));
    setIsEditingBudget(false);
  };

  return (
    <div className="gt-itin-section-card animate-fade-in">
      {/* 1. Section Top Bar Header */}
      <div className="gt-itin-section__top-bar flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Reorder Up/Down Controls */}
          <div className="gt-reorder-group flex gap-1">
            <button
              type="button"
              className="gt-reorder-btn"
              disabled={sectionIndex === 0}
              onClick={() => onMoveUp(sectionIndex)}
              title="Move stop up"
            >
              <ArrowUp className="gt-icon" />
            </button>
            <button
              type="button"
              className="gt-reorder-btn"
              disabled={sectionIndex === totalSections - 1}
              onClick={() => onMoveDown(sectionIndex)}
              title="Move stop down"
            >
              <ArrowDown className="gt-icon" />
            </button>
          </div>

          <span className="gt-section-number-pill">
            Section {sectionIndex + 1}
          </span>
          <h2 className="gt-section-city-name brand-serif">
            {typeof section.city === 'object' ? (section.city?.name || section.city?.city || 'Destination') : section.city}
          </h2>
          <span className="gt-section-country-text">
            ({typeof section.country === 'object' ? (section.country?.name || 'India') : section.country})
          </span>
        </div>

        {/* Action Controls & Three-Dot Menu */}
        <div className="gt-section-actions-container">
          <button
            type="button"
            className="gt-three-dot-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Section options"
          >
            <MoreVertical className="gt-icon" />
          </button>

          {menuOpen && (
            <div className="gt-three-dot-menu animate-fade-in">
              <button
                type="button"
                className="gt-three-dot-item"
                onClick={() => {
                  setMenuOpen(false);
                  onAddActivityClick(section);
                }}
              >
                <Plus className="gt-icon" />
                <span>Add Activity</span>
              </button>
              <button
                type="button"
                className="gt-three-dot-item"
                onClick={() => {
                  setMenuOpen(false);
                  setIsEditingDates(!isEditingDates);
                }}
              >
                <Calendar className="gt-icon" />
                <span>Edit Dates</span>
              </button>
              <button
                type="button"
                className="gt-three-dot-item"
                onClick={() => {
                  setMenuOpen(false);
                  setIsEditingBudget(!isEditingBudget);
                }}
              >
                <IndianRupee className="gt-icon" />
                <span>Edit Budget</span>
              </button>
              <div className="gt-user-dropdown__divider" />
              <button
                type="button"
                className="gt-three-dot-item gt-three-dot-item--danger"
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteSectionClick(section);
                }}
              >
                <Trash2 className="gt-icon" />
                <span>Delete Section</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Destination Specs: Dates & Section Budget */}
      <div className="gt-section-specs-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Range Box */}
        <div className="gt-spec-box">
          <div className="gt-spec-box__header flex justify-between items-center">
            <span className="gt-spec-label flex items-center gap-1">
              <Calendar className="gt-icon" />
              <span>Date Range</span>
            </span>
            <button
              type="button"
              className="gt-spec-edit-link"
              onClick={() => setIsEditingDates(!isEditingDates)}
            >
              {isEditingDates ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!isEditingDates ? (
            <strong className="gt-spec-value">
              {section.startDate || '10 Sep'} &rarr; {section.endDate || '12 Sep'} ({section.days || 3} days)
            </strong>
          ) : (
            <div className="gt-spec-edit-form flex items-center gap-2" style={{ marginTop: 4 }}>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="gt-spec-input"
              />
              <span>&rarr;</span>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="gt-spec-input"
              />
              <button type="button" className="gt-spec-save-btn" onClick={handleSaveDates}>
                Save
              </button>
            </div>
          )}
        </div>

        {/* Section Budget Box */}
        <div className="gt-spec-box">
          <div className="gt-spec-box__header flex justify-between items-center">
            <span className="gt-spec-label flex items-center gap-1">
              <IndianRupee className="gt-icon" />
              <span>Section Budget</span>
            </span>
            <button
              type="button"
              className="gt-spec-edit-link"
              onClick={() => setIsEditingBudget(!isEditingBudget)}
            >
              {isEditingBudget ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!isEditingBudget ? (
            <strong className="gt-spec-value gt-spec-value--accent">
              {currency}{Number(section.budget || 0).toLocaleString()}
            </strong>
          ) : (
            <div className="gt-spec-edit-form flex items-center gap-2" style={{ marginTop: 4 }}>
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="gt-spec-input"
                placeholder="Amount"
              />
              <button type="button" className="gt-spec-save-btn" onClick={handleSaveBudget}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Activities Area */}
      <div className="gt-section-activities-area">
        <div className="gt-activities-header flex justify-between items-center">
          <h3 className="gt-activities-title">Activities & Scheduled Stops</h3>
          <button
            type="button"
            className="gt-add-activity-link flex items-center gap-1"
            onClick={() => onAddActivityClick(section)}
          >
            <Plus className="gt-icon" />
            <span>Add Activity</span>
          </button>
        </div>

        {section.activities && section.activities.length > 0 ? (
          <div className="gt-activities-timeline flex-col gap-2">
            {section.activities.map((act) => (
              <div key={act.id} className="gt-itin-activity-item flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="gt-itin-act-time">{act.time || '09:00 AM'}</span>
                  <div className="flex-col">
                    <strong className="gt-itin-act-name">{act.name}</strong>
                    <span className="text-xs text-muted flex items-center gap-2">
                      <span className="gt-itin-act-cat">{act.category || 'Sightseeing'}</span>
                      {act.duration && <span>• {act.duration}</span>}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="gt-itin-act-cost font-semibold">
                    {act.cost || 'Free'}
                  </span>
                  <button
                    type="button"
                    className="gt-itin-act-remove"
                    onClick={() => onRemoveActivity(section.id, act.id)}
                    title="Remove activity"
                  >
                    <Trash2 className="gt-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gt-activities-empty text-center py-4">
            <p className="text-xs text-muted">No activities added for {section.city} yet.</p>
            <button
              type="button"
              className="gt-empty-add-btn"
              onClick={() => onAddActivityClick(section)}
            >
              + Add Activity to {section.city}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
