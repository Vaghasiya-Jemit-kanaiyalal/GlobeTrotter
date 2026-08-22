import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import './PostActions.css';

export const PostActions = ({
  post,
  onLike,
  onToggleComments,
  onShare,
  commentsOpen = false,
}) => {
  return (
    <div className="gt-post-actions-row flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border mt-3">
      {/* Social Reactions */}
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <button
          type="button"
          className={`gt-action-social-btn ${post.isLiked ? 'gt-action-social-btn--liked' : ''}`}
          onClick={() => onLike(post.id)}
          title="Like this experience"
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current text-red-500' : 'text-navy-600'}`} />
          <span className="font-semibold text-xs">{post.likes || 0}</span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          className={`gt-action-social-btn ${commentsOpen ? 'gt-action-social-btn--active' : ''}`}
          onClick={() => onToggleComments(post.id)}
          title="Comments"
        >
          <MessageSquare className="w-4 h-4 text-navy-600" />
          <span className="font-semibold text-xs">{post.commentsCount || 0}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          className="gt-action-social-btn"
          onClick={() => onShare(post)}
          title="Share experience"
        >
          <Share2 className="w-4 h-4 text-navy-600" />
          <span className="font-semibold text-xs hidden-mobile">Share</span>
        </button>
      </div>
    </div>
  );
};
