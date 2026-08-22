import React from 'react';
import { Mail, Phone, MapPin, Globe, Info, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';
import './ProfileDetails.css';

export const ProfileDetails = ({ profile, onEditClick }) => {
  return (
    <div className="gt-profile-details-box">
      {/* Header Row: Name, Member Badge & Edit Profile CTA */}
      <div className="gt-profile-details__header">
        <div>
          <h2 className="gt-profile-name brand-serif">
            {profile.name || `${profile.firstName} ${profile.lastName}`}
          </h2>
          <span className="gt-profile-badge">
            Member since {profile.memberSince || '2024'}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Edit3}
          onClick={onEditClick}
          className="gt-edit-profile-btn"
        >
          Edit Profile
        </Button>
      </div>

      {/* 2-Column Information Grid - Spans Full Width */}
      <div className="gt-profile-fields-grid">
        {/* Email */}
        <div className="gt-info-field">
          <span className="gt-info-field__label">
            <Mail className="gt-icon" />
            <span>Email Address</span>
          </span>
          <strong className="gt-info-field__value">{profile.email}</strong>
        </div>

        {/* Phone */}
        <div className="gt-info-field">
          <span className="gt-info-field__label">
            <Phone className="gt-icon" />
            <span>Phone Number</span>
          </span>
          <strong className="gt-info-field__value">{profile.phone || 'Not provided'}</strong>
        </div>

        {/* City */}
        <div className="gt-info-field">
          <span className="gt-info-field__label">
            <MapPin className="gt-icon" />
            <span>City</span>
          </span>
          <strong className="gt-info-field__value">{profile.city || 'Not specified'}</strong>
        </div>

        {/* Country */}
        <div className="gt-info-field">
          <span className="gt-info-field__label">
            <Globe className="gt-icon" />
            <span>Country</span>
          </span>
          <strong className="gt-info-field__value">{profile.country || 'Not specified'}</strong>
        </div>
      </div>

      {/* Shortened & Refined Travel Bio Box - Spans Full Width */}
      {profile.additionalInfo && (
        <div className="gt-info-field gt-info-field--full">
          <span className="gt-info-field__label">
            <Info className="gt-icon" />
            <span>Travel Bio & Style</span>
          </span>
          <p className="gt-info-field__bio">{profile.additionalInfo}</p>
        </div>
      )}
    </div>
  );
};
