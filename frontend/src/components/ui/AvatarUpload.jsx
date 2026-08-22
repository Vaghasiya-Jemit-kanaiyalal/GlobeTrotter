import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import './AvatarUpload.css';

// Preset avatar options for instant preview
const PRESET_AVATARS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', name: 'Explorer' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', name: 'Nomad' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80', name: 'Voyager' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80', name: 'Wanderer' },
];

export const AvatarUpload = ({ value, onChange, label = 'Profile Photo' }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="gt-avatar-upload">
      <span className="gt-field__label">{label}</span>
      <div className="gt-avatar-upload__main">
        {/* Profile Circle */}
        <div
          className={`gt-avatar-upload__preview ${isDragging ? 'gt-avatar-upload__preview--dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {value ? (
            <img src={value} alt="Profile Preview" className="gt-avatar-upload__img" />
          ) : (
            <div className="gt-avatar-upload__placeholder">
              <User className="gt-avatar-upload__placeholder-icon" />
            </div>
          )}
          
          <button
            type="button"
            className="gt-avatar-upload__camera-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo"
            aria-label="Upload photo"
          >
            <Camera className="gt-icon" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="gt-avatar-upload__input"
        />

        {/* Action Controls & Presets */}
        <div className="gt-avatar-upload__controls flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="gt-avatar-upload__btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="gt-icon" />
              <span>Choose Photo</span>
            </button>

            {value && (
              <button
                type="button"
                className="gt-avatar-upload__remove-btn"
                onClick={() => onChange(null)}
                title="Remove photo"
              >
                <X className="gt-icon" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Quick Avatar Presets */}
          <div className="gt-avatar-presets">
            <span className="gt-avatar-presets__label">Or choose avatar:</span>
            <div className="gt-avatar-presets__list">
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`gt-avatar-preset-item ${value === preset.url ? 'gt-avatar-preset-item--active' : ''}`}
                  onClick={() => onChange(preset.url)}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
