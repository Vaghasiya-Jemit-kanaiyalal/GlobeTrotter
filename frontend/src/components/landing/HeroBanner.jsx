import React from 'react';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import homeImg from '../../assets/home.jpg';
import './HeroBanner.css';

export const HeroBanner = ({ onPlanTrip, onExploreDestinations }) => {
  return (
    <section className="gt-hero">
      {/* Cinematic Background Image & Left Dark Gradient Overlay */}
      <div 
        className="gt-hero__background"
        style={{ backgroundImage: `url(${homeImg})` }}
      >
        <div className="gt-hero__overlay" />
      </div>

      <div className="gt-hero__container">
        <div className="gt-hero__content">
          {/* Eyebrow Badge */}
          <div className="gt-hero__badge">
            <Sparkles className="gt-icon" />
            <span>Personalized Multi-City Travel Planning</span>
          </div>

          {/* Headline */}
          <h1 className="gt-hero__title brand-serif">
            Plan Less. <br />
            <span className="gt-hero__title-accent">Travel More.</span>
          </h1>

          {/* Short Supporting Text */}
          <p className="gt-hero__description">
            Design custom itineraries, discover top regional highlights, coordinate seamless city transitions, 
            and manage trip budgets in one intuitive platform.
          </p>

          {/* Action Buttons */}
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

          {/* Travel Stats Bar */}
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
