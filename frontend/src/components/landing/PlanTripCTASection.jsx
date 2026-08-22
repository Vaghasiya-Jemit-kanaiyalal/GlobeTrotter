import React from 'react';
import { Compass, Sparkles, Map, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import './PlanTripCTASection.css';

export const PlanTripCTASection = ({ onPlanTrip }) => {
  return (
    <section className="gt-cta-section">
      <div className="gt-cta-container">
        <div className="gt-cta-card">
          <div className="gt-cta-content">
            <div className="gt-cta-badge">
              <Sparkles className="gt-icon" />
              <span>Itinerary Generator & Multi-City Planner</span>
            </div>

            <h2 className="gt-cta-title brand-serif">
              Ready to Design Your Next Custom Itinerary?
            </h2>

            <p className="gt-cta-text">
              Connect multiple destinations, organize your daily schedules, estimate living costs, 
              and invite travel companions to your personalized travel journey.
            </p>

            <div className="gt-cta-features flex gap-4 flex-wrap">
              <div className="gt-cta-feature-item flex items-center gap-1">
                <Map className="gt-icon" />
                <span>Multi-City Routes</span>
              </div>
              <div className="gt-cta-feature-item flex items-center gap-1">
                <Calendar className="gt-icon" />
                <span>Timeline Scheduling</span>
              </div>
              <div className="gt-cta-feature-item flex items-center gap-1">
                <DollarSign className="gt-icon" />
                <span>Budget Tracking</span>
              </div>
            </div>
          </div>

          <div className="gt-cta-action">
            <Button
              variant="primary"
              size="lg"
              icon={Compass}
              onClick={onPlanTrip}
              className="gt-cta-btn"
            >
              Start Planning a Trip
            </Button>
            <span className="gt-cta-subtext text-xs">Takes less than 2 minutes to get started</span>
          </div>
        </div>
      </div>
    </section>
  );
};
