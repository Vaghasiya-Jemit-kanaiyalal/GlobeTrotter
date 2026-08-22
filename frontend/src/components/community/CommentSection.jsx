import React, { useState } from 'react';
import { Send } from 'lucide-react';
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
      <h5 className="font-bold text-xs text-navy-800 uppercase tracking-wider mb-2.5">
        Community Discussion ({comments.length})
      </h5>

      {/* Comments List */}
      <div className="gt-comments-list flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-xs text-muted py-2 italic">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="gt-comment-item bg-white p-2.5 rounded-md border border-border text-xs">
              <div className="flex justify-between font-semibold text-navy-900 mb-1">
                <span>{c.author}</span>
                <span className="text-muted font-normal text-[11px]">{c.time}</span>
              </div>
              <p className="text-navy-700 m-0 leading-relaxed">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="gt-comment-form flex items-center gap-2.5 w-full mt-3">
        <input
          type="text"
          className="gt-comment-input flex-1 h-9 px-3.5 text-xs sm:text-sm border border-border rounded-lg bg-white text-navy-900 focus:outline-none focus:border-amber-600 shadow-xs"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button type="submit" variant="primary" size="sm" icon={Send} className="gt-comment-submit-btn flex-shrink-0 h-9 px-4">
          Post
        </Button>
      </form>
    </div>
  );
};
