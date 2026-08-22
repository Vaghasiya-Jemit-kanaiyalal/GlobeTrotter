import React from 'react';
import { Mail, Phone, MapPin, Globe, Info, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';
import './ProfileDetails.css';

export const ProfileDetails = ({ profile, onEditClick }) => {
  return (
    <div className="gt-profile-details-box flex-col gap-4">
      <div className="gt-profile-details__header flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="gt-profile-name brand-serif">{profile.name || `${profile.firstName} ${profile.lastName}`}</h2>
          <span className="gt-profile-badge">Member since {profile.memberSince || '2024'}</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Edit3}
          onClick={onEditClick}
        >
          Edit Profile
        </Button>
      </div>

      {/* Grid Information Fields */}
      <div className="gt-profile-fields-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="gt-info-field">
          <span className="gt-info-field__label flex items-center gap-1">
            <Mail className="gt-icon" />
            <span>Email Address</span>
          </span>
          <strong className="gt-info-field__value">{profile.email}</strong>
        </div>

        {/* Phone */}
        <div className="gt-info-field">
          <span className="gt-info-field__label flex items-center gap-1">
            <Phone className="gt-icon" />
            <span>Phone Number</span>
          </span>
          <strong className="gt-info-field__value">{profile.phone || 'Not provided'}</strong>
        </div>

        {/* City */}
        <div className="gt-info-field">
          <span className="gt-info-field__label flex items-center gap-1">
            <MapPin className="gt-icon" />
            <span>City</span>
          </span>
          <strong className="gt-info-field__value">{profile.city || 'Not specified'}</strong>
        </div>

        {/* Country */}
        <div className="gt-info-field">
          <span className="gt-info-field__label flex items-center gap-1">
            <Globe className="gt-icon" />
            <span>Country</span>
          </span>
          <strong className="gt-info-field__value">{profile.country || 'Not specified'}</strong>
        </div>
      </div>

      {/* Additional Info Bio */}
      {profile.additionalInfo && (
        <div className="gt-info-field gt-info-field--full">
          <span className="gt-info-field__label flex items-center gap-1">
            <Info className="gt-icon" />
            <span>Additional Information / Travel Bio</span>
          </span>
          <p className="gt-info-field__bio text-sm">{profile.additionalInfo}</p>
        </div>
      )}
    </div>
  );
};
