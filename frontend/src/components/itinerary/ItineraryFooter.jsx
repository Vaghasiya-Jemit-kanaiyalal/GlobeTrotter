import React from 'react';
import { Plus, Save, Eye, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import './ItineraryFooter.css';

export const ItineraryFooter = ({
  onAddSectionClick,
  onSaveItinerary,
  onPreviewItinerary,
  isSaving = false,
}) => {
  return (
    <div className="gt-itin-footer-container flex-col gap-6 align-center">
      {/* 1. Prominent Add Another Section Button */}
      <div className="gt-add-section-wrapper text-center">
        <Button
          variant="outline"
          size="lg"
          icon={Plus}
          onClick={onAddSectionClick}
          className="gt-add-another-sec-btn"
        >
          + Add Another Section / Travel Stop
        </Button>
        <p className="text-xs text-muted" style={{ marginTop: 6 }}>
          Add as many destinations to your multi-city route as needed.
        </p>
      </div>

      {/* 2. Bottom Sticky Action Bar */}
      <div className="gt-itin-bottom-bar flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Compass className="gt-icon" style={{ color: 'var(--color-amber-600)' }} />
          <span className="text-sm font-semibold">Itinerary Workspace</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={Save}
            loading={isSaving}
            onClick={onSaveItinerary}
          >
            Save Itinerary
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Eye}
            onClick={onPreviewItinerary}
          >
            Preview Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};
