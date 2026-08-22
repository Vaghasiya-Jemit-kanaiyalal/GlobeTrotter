import React, { useState } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '../ui/Button';
import './CommentSection.css';

export const CommentSection = ({
  comments = [],
  onAddComment,
  currentUser,
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
  };

  return (
    <div className="gt-comment-section-box p-3 bg-subtle rounded-lg mt-3 border border-border">
      <h5 className="font-bold text-xs text-navy-800 uppercase tracking-wider mb-2">
        Community Discussion ({comments.length})
      </h5>

      {/* Comments List */}
      <div className="gt-comments-list flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-xs text-muted py-2">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="gt-comment-item bg-white p-2 rounded-md border border-border text-xs">
              <div className="flex justify-between font-semibold text-navy-900 mb-0.5">
                <span>{c.author}</span>
                <span className="text-muted font-normal">{c.time}</span>
              </div>
              <p className="text-navy-700 m-0 leading-relaxed">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="text"
          className="gt-comment-input flex-1 px-3 py-1.5 text-xs border border-border rounded-md bg-white text-navy-900 focus:outline-none focus:border-amber-600"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button type="submit" variant="primary" size="sm" icon={Send}>
          Post
        </Button>
      </form>
    </div>
  );
};
