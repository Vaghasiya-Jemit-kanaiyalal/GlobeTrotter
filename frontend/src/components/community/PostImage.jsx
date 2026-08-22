import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import './PostImage.css';

export const PostImage = ({ src, alt = 'Travel Experience' }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <div className="gt-post-image-wrapper relative" onClick={() => setLightboxOpen(true)}>
        <img src={src} alt={alt} className="gt-post-img" />
        <button
          type="button"
          className="gt-img-expand-btn"
          title="View full image"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
        >
          <Maximize2 className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {lightboxOpen && (
        <div className="gt-lightbox-overlay animate-fade-in" onClick={() => setLightboxOpen(false)}>
          <div className="gt-lightbox-content relative" onClick={(e) => e.stopPropagation()}>
            <img src={src} alt={alt} className="gt-lightbox-img" />
            <button
              type="button"
              className="gt-lightbox-close"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
