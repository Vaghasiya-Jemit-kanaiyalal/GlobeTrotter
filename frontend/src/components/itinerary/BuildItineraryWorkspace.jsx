import React, { useState, useMemo } from 'react';
import { ItineraryHeader } from './ItineraryHeader';
import { TripSummary } from './TripSummary';
import { ItinerarySection } from './ItinerarySection';
import { AddActivityModal } from './AddActivityModal';
import { AddSectionModal } from './AddSectionModal';
import { ItineraryFooter } from './ItineraryFooter';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Plus, Compass, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';
import './BuildItineraryWorkspace.css';

export const BuildItineraryWorkspace = ({
  trip,
  currentUser,
  onNavigate,
  onShowToast,
}) => {
  // Master Dynamic Itinerary State (N Stops / Cities)
  const [sections, setSections] = useState([
    {
      id: 'sec-1',
      city: 'Mumbai',
      country: 'India',
      startDate: '2026-09-10',
      endDate: '2026-09-12',
      days: 3,
      budget: 12000,
      activities: [
        { id: 'a-1', name: 'Gateway of India', time: '09:00 AM', category: 'Sightseeing', cost: '₹100', duration: '2 hrs' },
        { id: 'a-2', name: 'Colaba Social Lunch', time: '01:00 PM', category: 'Food & Gastronomy', cost: '₹500', duration: '1.5 hrs' },
        { id: 'a-3', name: 'Marine Drive Sunset Stroll', time: '04:30 PM', category: 'Sightseeing', cost: 'Free', duration: '2 hrs' },
      ],
    },
    {
      id: 'sec-2',
      city: 'Pune',
      country: 'India',
      startDate: '2026-09-13',
      endDate: '2026-09-14',
      days: 2,
      budget: 8000,
      activities: [
        { id: 'a-4', name: 'Shaniwar Wada Palace', time: '10:00 AM', category: 'Culture', cost: '₹50', duration: '2 hrs' },
      ],
    },
    {
      id: 'sec-3',
      city: 'Goa',
      country: 'India',
      startDate: '2026-09-15',
      endDate: '2026-09-19',
      days: 5,
      budget: 15000,
      activities: [
        { id: 'a-5', name: 'Fort Aguada & Lighthouse', time: '09:00 AM', category: 'Sightseeing', cost: '₹100', duration: '2 hrs' },
        { id: 'a-6', name: 'Dudhsagar Waterfalls Jeep Trek', time: '01:00 PM', category: 'Adventure', cost: '₹1,800', duration: '5 hrs' },
      ],
    },
  ]);

  // Modal Controls
  const [addActTargetSection, setAddActTargetSection] = useState(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [deleteConfirmSection, setDeleteConfirmSection] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Derived Summary Values
  const totalBudgetSum = useMemo(() => {
    const sum = sections.reduce((acc, sec) => acc + (Number(sec.budget) || 0), 0);
    return `₹${sum.toLocaleString()}`;
  }, [sections]);

  const overallDateRangeDisplay = useMemo(() => {
    if (sections.length === 0) return 'No dates set';
    const first = sections[0].startDate || '10 Sep';
    const last = sections[sections.length - 1].endDate || '19 Sep';
    return `${first} – ${last}`;
  }, [sections]);

  // Reorder Handlers
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const next = [...sections];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setSections(next);
    onShowToast(`Reordered stop: ${next[index - 1].city} moved up`, 'info');
  };

  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setSections(next);
    onShowToast(`Reordered stop: ${next[index + 1].city} moved down`, 'info');
  };

  // Section Updates
  const handleUpdateDates = (sectionId, startDate, endDate) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, startDate, endDate } : s))
    );
    onShowToast('Dates updated successfully', 'success');
  };

  const handleUpdateBudget = (sectionId, newBudget) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, budget: newBudget } : s))
    );
    onShowToast('Section budget updated', 'success');
  };

  const handleAddActivity = (activityWithTime) => {
    if (!addActTargetSection) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === addActTargetSection.id
          ? { ...s, activities: [...s.activities, activityWithTime] }
          : s
      )
    );
    onShowToast(`Added "${activityWithTime.name}" to ${addActTargetSection.city}`, 'success');
  };

  const handleRemoveActivity = (sectionId, activityId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) }
          : s
      )
    );
    onShowToast('Activity removed from itinerary', 'info');
  };

  const handleAddSection = (newSection) => {
    setSections((prev) => [...prev, newSection]);
    onShowToast(`Added new stop: ${newSection.city}`, 'success');
  };

  const handleConfirmDeleteSection = () => {
    if (!deleteConfirmSection) return;
    const city = deleteConfirmSection.city;
    setSections((prev) => prev.filter((s) => s.id !== deleteConfirmSection.id));
    setDeleteConfirmSection(null);
    onShowToast(`Removed ${city} stop from itinerary`, 'info');
  };

  const handleSaveItinerary = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onShowToast('Itinerary saved successfully!', 'success');
    }, 800);
  };

  return (
    <div className="gt-build-workspace">
      {/* 1. Sticky Navigation Header */}
      <ItineraryHeader
        tripTitle={trip?.title || 'Goa & Western Coast Expedition'}
        currentUser={currentUser}
        onBackToDashboard={() => onNavigate('landing')}
        onShareItinerary={() => onShowToast('Shareable itinerary link copied to clipboard!', 'success')}
      />

      <div className="gt-build-workspace__container">
        {/* 2. Top Summary Header */}
        <TripSummary
          tripName={trip?.title || 'Goa Adventure'}
          overallDates={overallDateRangeDisplay}
          stopCount={sections.length}
          totalBudget={totalBudgetSum}
          currency="₹"
        />

        {/* Mode Banner (If Preview Mode Active) */}
        {isPreviewMode && (
          <div className="gt-preview-mode-banner flex justify-between items-center animate-fade-in">
            <div className="flex items-center gap-2">
              <Eye className="gt-icon" />
              <strong>Preview Mode Active: Clean Read-Only Itinerary View</strong>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(false)}>
              Return to Edit Mode
            </Button>
          </div>
        )}

        {/* 3. Dynamic City Sections List */}
        {sections.length > 0 ? (
          <div className="gt-sections-list flex-col gap-6">
            {sections.map((sec, idx) => (
              <ItinerarySection
                key={sec.id}
                section={sec}
                sectionIndex={idx}
                totalSections={sections.length}
                currency="₹"
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onUpdateDates={handleUpdateDates}
                onUpdateBudget={handleUpdateBudget}
                onAddActivityClick={(s) => setAddActTargetSection(s)}
                onRemoveActivity={handleRemoveActivity}
                onDeleteSectionClick={(s) => setDeleteConfirmSection(s)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="gt-sections-empty animate-fade-in">
            <div className="gt-sections-empty__icon-box">
              <MapPin className="gt-sections-empty__icon" />
            </div>
            <h3>No destinations added yet</h3>
            <p className="text-sm text-muted">
              Start building your journey by adding your first destination stop.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setAddSectionOpen(true)}
            >
              + Add Destination
            </Button>
          </div>
        )}

        {/* 4. Bottom Actions & Add Section Button */}
        {!isPreviewMode && (
          <ItineraryFooter
            onAddSectionClick={() => setAddSectionOpen(true)}
            onSaveItinerary={handleSaveItinerary}
            onPreviewItinerary={() => setIsPreviewMode(true)}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={Boolean(addActTargetSection)}
        onClose={() => setAddActTargetSection(null)}
        targetCity={addActTargetSection?.city}
        onAddActivity={handleAddActivity}
      />

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        onAddSection={handleAddSection}
        nextSectionIndex={sections.length + 1}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmSection)}
        onClose={() => setDeleteConfirmSection(null)}
        title="Confirm Stop Deletion"
      >
        <div className="flex-col gap-4">
          <div className="flex items-center gap-3" style={{ color: 'var(--color-error)' }}>
            <AlertTriangle style={{ width: 32, height: 32 }} />
            <p className="text-sm font-semibold">
              Are you sure you want to remove {deleteConfirmSection?.city} from your itinerary?
            </p>
          </div>
          <p className="text-xs text-muted">
            All scheduled activities for this stop will also be removed.
          </p>
          <div className="flex justify-between items-center" style={{ marginTop: 12 }}>
            <Button variant="outline" onClick={() => setDeleteConfirmSection(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              onClick={handleConfirmDeleteSection}
            >
              Delete Section
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
