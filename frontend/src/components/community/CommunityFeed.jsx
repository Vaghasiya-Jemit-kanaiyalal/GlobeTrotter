import React from 'react';
import { CommunityPostCard } from './CommunityPostCard';
import './CommunityFeed.css';

export const CommunityFeed = ({
  posts = [],
  onLike,
  onAddComment,
  onShare,
}) => {
  return (
    <div className="gt-community-feed-list">
      {posts.map((post) => (
        <CommunityPostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onAddComment={onAddComment}
          onShare={onShare}
        />
      ))}
    </div>
  );
};
