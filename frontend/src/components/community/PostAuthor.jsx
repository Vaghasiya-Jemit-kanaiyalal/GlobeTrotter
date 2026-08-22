import React from 'react';
import { User, MapPin, Clock } from 'lucide-react';
import './PostAuthor.css';

export const PostAuthor = ({ author, createdAt }) => {
  if (!author) return null;

  return (
    <div className="gt-post-author flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-2.5">
        <div className="gt-post-avatar-wrapper">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="gt-post-avatar-img" />
          ) : (
            <div className="gt-post-avatar-placeholder">
              <User className="w-4 h-4 text-navy-700" />
            </div>
          )}
        </div>

        <div className="gt-author-details flex flex-col">
          <span className="gt-author-name font-bold text-navy-900 text-sm">{author.name}</span>
          <span className="gt-author-sub text-xs text-muted flex items-center gap-1">
            {author.location && (
              <>
                <MapPin className="w-3 h-3 text-amber-600 inline" />
                {author.location} •
              </>
            )}
            <Clock className="w-3 h-3 inline ml-0.5" /> {createdAt}
          </span>
        </div>
      </div>
    </div>
  );
};
