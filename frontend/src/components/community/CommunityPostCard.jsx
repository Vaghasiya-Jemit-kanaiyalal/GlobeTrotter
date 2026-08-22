import React, { useState } from 'react';
import { PostAuthor } from './PostAuthor';
import { PostImage } from './PostImage';
import { PostActions } from './PostActions';
import { CommentSection } from './CommentSection';
import { MapPin, Compass, Calendar, Tag, DollarSign, Eye } from 'lucide-react';
import './CommunityPostCard.css';

export const CommunityPostCard = ({
  post,
  onLike,
  onAddComment,
  onShare,
  onViewTrip,
}) => {
  const [commentsOpen, setCommentsOpen] = useState(false);

  const getPostTypeBadge = () => {
    switch (post.type) {
      case 'trip':
        return <span className="gt-post-type-badge gt-post-type-badge--trip">Trip Experience</span>;
      case 'activity':
        return <span className="gt-post-type-badge gt-post-type-badge--activity">Activity Experience</span>;
      case 'itinerary':
        return <span className="gt-post-type-badge gt-post-type-badge--itinerary">Shared Itinerary</span>;
      case 'tip':
        return <span className="gt-post-type-badge gt-post-type-badge--tip">Travel Tip</span>;
      default:
        return <span className="gt-post-type-badge">Experience</span>;
    }
  };

  return (
    <article className="gt-community-post-card">
      {/* 1. Author Info */}
      <PostAuthor author={post.author} createdAt={post.createdAt} />

      {/* 2. Title & Type Badge */}
      <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
        <h3 className="gt-post-title brand-serif m-0">{post.title}</h3>
        {getPostTypeBadge()}
      </div>

      {/* 3. Location & Quick Stats Chips */}
      <div className="gt-post-meta-chips flex items-center gap-2 flex-wrap mb-2">
        {post.destination && (
          <span className="gt-post-meta-chip">
            <MapPin className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            {post.destination}
          </span>
        )}

        {post.duration && (
          <span className="gt-post-meta-chip">
            <Calendar className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
            {post.duration}
          </span>
        )}

        {post.cost && (
          <span className="gt-post-meta-chip gt-post-meta-chip--highlight">
            {post.cost}
          </span>
        )}

        <span className="gt-post-meta-chip text-muted">
          <Eye className="w-3 h-3 inline mr-1" />
          {post.views || 0} Views
        </span>
      </div>

      {/* 4. Description */}
      {post.description && (
        <p className="gt-post-desc text-sm text-navy-700 m-0 mb-2 leading-relaxed">
          {post.description}
        </p>
      )}

      {/* 5. Optional Travel Photo */}
      {post.image && <PostImage src={post.image} alt={post.title} />}

      {/* 6. Reactions & Actions Row */}
      <PostActions
        post={post}
        onLike={onLike}
        onToggleComments={() => setCommentsOpen(!commentsOpen)}
        onShare={onShare}
        onViewTrip={onViewTrip}
        commentsOpen={commentsOpen}
      />

      {/* 7. Collapsible Discussion Drawer */}
      {commentsOpen && (
        <CommentSection
          comments={post.comments || []}
          onAddComment={(text) => onAddComment(post.id, text)}
        />
      )}
    </article>
  );
};
