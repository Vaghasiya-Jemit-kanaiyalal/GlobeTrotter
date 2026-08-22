import React, { useRef } from 'react';
import { Camera, User, Trash2 } from 'lucide-react';
import './ProfileAvatar.css';

export const ProfileAvatar = ({ avatarUrl, onAvatarChange, onAvatarRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAvatarChange(url);
    }
  };

  return (
    <div className="gt-profile-avatar-container">
      <div className="gt-profile-avatar-wrapper">
        {avatarUrl ? (
          <img src={avatarUrl} alt="User Profile" className="gt-profile-avatar-img" />
        ) : (
          <div className="gt-profile-avatar-fallback flex items-center justify-center">
            <User className="gt-icon" />
          </div>
        )}

        {/* Change Photo Overlay Button */}
        <button
          type="button"
          className="gt-avatar-overlay-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Change Photo"
        >
          <Camera className="gt-icon" />
          <span>Change Photo</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {avatarUrl && (
        <button
          type="button"
          className="gt-remove-photo-btn flex items-center gap-1"
          onClick={onAvatarRemove}
          title="Remove Photo"
        >
          <Trash2 className="gt-icon" />
          <span>Remove Photo</span>
        </button>
      )}
    </div>
  );
};
