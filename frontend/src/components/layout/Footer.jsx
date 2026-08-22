import React from 'react';
import { Compass, Heart, Globe, Shield, MapPin } from 'lucide-react';
import { Logo } from '../ui/Logo';
import './Footer.css';

export const Footer = ({ onNavigate, onOpenCreateTrip }) => {
  return (
    <footer className="gt-footer">
      <div className="gt-footer__container">
        {/* Main Columns */}
        <div className="gt-footer__grid">
          {/* Brand Info */}
          <div className="gt-footer__brand-col">
            <Logo size="medium" showTagline={true} centered={false} />
            <p className="gt-footer__bio">
              GlobeTrotter is a personalized multi-city travel planning platform designed to help explorers curate seamless routes, manage day-by-day itineraries, and monitor trip budgets.
            </p>
            <div className="gt-footer__socials flex gap-3">
              <span className="gt-footer__badge">
                <Globe className="gt-icon" /> Global Coverage
              </span>
              <span className="gt-footer__badge">
                <Shield className="gt-icon" /> Verified Guides
              </span>
            </div>
          </div>

          {/* Travel Tools */}
          <div className="gt-footer__col">
            <h4 className="gt-footer__heading">Travel Planning</h4>
            <ul className="gt-footer__list">
              <li>
                <button type="button" className="gt-footer__link" onClick={onOpenCreateTrip}>
                  Plan New Trip
                </button>
              </li>
              <li>
                <button type="button" className="gt-footer__link" onClick={() => onNavigate('landing', 'destinations')}>
                  Explore Destinations
                </button>
              </li>
              <li>
                <button type="button" className="gt-footer__link" onClick={() => onNavigate('landing', 'trips')}>
                  Itinerary Archive
                </button>
              </li>
              <li><span className="gt-footer__text-muted">Budget Calculator (Coming Soon)</span></li>
              <li><span className="gt-footer__text-muted">Interactive Route Map</span></li>
            </ul>
          </div>

          {/* Top Regions */}
          <div className="gt-footer__col">
            <h4 className="gt-footer__heading">Top Regions</h4>
            <ul className="gt-footer__list">
              <li><a href="#regional-selections" className="gt-footer__link">Western Europe</a></li>
              <li><a href="#regional-selections" className="gt-footer__link">East & Southeast Asia</a></li>
              <li><a href="#regional-selections" className="gt-footer__link">Alpine Switzerland</a></li>
              <li><a href="#regional-selections" className="gt-footer__link">Nordic Coastlines</a></li>
              <li><a href="#regional-selections" className="gt-footer__link">Mediterranean Islands</a></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div className="gt-footer__col">
            <h4 className="gt-footer__heading">Platform</h4>
            <ul className="gt-footer__list">
              <li><button type="button" className="gt-footer__link" onClick={() => onNavigate('login')}>Sign In (Screen 1)</button></li>
              <li><button type="button" className="gt-footer__link" onClick={() => onNavigate('register')}>Register Account (Screen 2)</button></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="gt-footer__link">Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()} className="gt-footer__link">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Sub-Footer Copyright */}
        <div className="gt-footer__bottom flex justify-between items-center">
          <p className="text-xs">
            © {new Date().getFullYear()} GlobeTrotter Personalized Travel Planning Platform. All rights reserved.
          </p>
          <div className="gt-footer__crafted flex items-center gap-1 text-xs">
            <span>Crafted for purposeful travelers</span>
            <Compass className="gt-icon inline-icon" style={{ color: 'var(--color-amber-600)' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
