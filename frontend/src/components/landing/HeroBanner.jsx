import React from 'react';
import { Compass, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import './HeroBanner.css';

export const HeroBanner = ({ onPlanTrip, onExploreDestinations }) => {
  return (
    <section className="gt-hero">
      {/* Background Graphic / Overlay */}
      <div className="gt-hero__background">
        <div className="gt-hero__overlay" />
      </div>

      <div className="gt-hero__container">
        <div className="gt-hero__content">
          {/* Badge */}
          <div className="gt-hero__badge">
            <Sparkles className="gt-icon" />
            <span>Personalized Multi-City Travel Planning</span>
          </div>

          {/* Heading */}
          <h1 className="gt-hero__title brand-serif">
            Craft Your Next <br />
            <span className="gt-hero__title-accent">Multi-City Journey</span>
          </h1>

          {/* Subtitle */}
          <p className="gt-hero__description">
            Design custom itineraries, discover top regional highlights, coordinate city transitions, 
            and manage budgets in one intuitive travel platform.
          </p>

          {/* CTA Buttons */}
          <div className="gt-hero__actions">
            <Button
              variant="primary"
              size="lg"
              icon={Compass}
              onClick={onPlanTrip}
              className="gt-hero__primary-btn"
            >
              Plan a Trip
            </Button>

            <Button
              variant="outline"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={onExploreDestinations}
              className="gt-hero__secondary-btn"
            >
              Explore Destinations
            </Button>
          </div>

          {/* Key Stats Bar */}
          <div className="gt-hero__stats">
            <div className="gt-hero__stat-item">
              <strong>120+</strong>
              <span>Curated Regions</span>
            </div>
            <div className="gt-hero__stat-divider" />
            <div className="gt-hero__stat-item">
              <strong>Multi-City</strong>
              <span>Route Optimization</span>
            </div>
            <div className="gt-hero__stat-divider" />
            <div className="gt-hero__stat-item">
              <strong>100% Free</strong>
              <span>Itinerary Planning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
