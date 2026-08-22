import React, { useState, useEffect, useMemo } from 'react';
import { communityApi } from '../../services/communityApi';
import { CommunityHeader } from './CommunityHeader';
import { CommunityIntro } from './CommunityIntro';
import { CommunitySearch } from './CommunitySearch';
import { CommunityFeed } from './CommunityFeed';
import { CommunitySidebar } from './CommunitySidebar';
import { ShareExperienceModal } from './ShareExperienceModal';
import { EmptyCommunity } from './EmptyCommunity';
import { CommunitySkeleton, CommunityError } from './CommunitySkeleton';
import './CommunityTabScreen.css';

export const CommunityTabScreen = ({
  currentUser,
  onNavigate,
  onLogout,
  onShowToast,
}) => {
  // Posts & Sidebar Data State
  const [posts, setPosts] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);

  // Search & Filter Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('destination');
  const [filterType, setFilterType] = useState('All');
  const [filterDestination, setFilterDestination] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Load initial data from communityApi service
  useEffect(() => {
    loadData();
  }, [searchQuery, filterType, filterDestination, sortBy]);

  const loadData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [postsRes, destsRes] = await Promise.all([
        communityApi.getPosts({ search: searchQuery, type: filterType, destination: filterDestination, sortBy }),
        communityApi.getTrendingDestinations(),
      ]);

      setPosts(Array.isArray(postsRes) ? postsRes : []);
      setPopularDestinations(Array.isArray(destsRes) ? destsRes : []);
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Available destinations for filter dropdown
  const availableDestinations = useMemo(() => {
    const set = new Set();
    (Array.isArray(posts) ? posts : []).forEach((p) => {
      if (p.destination) set.add(p.destination.split(',')[0]);
    });
    return Array.from(set);
  }, [posts]);

  // Handlers
  const handleLikePost = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(postId)) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );

    const updatedPost = await communityApi.toggleLikePost(postId);
    if (updatedPost && onShowToast) {
      onShowToast(updatedPost.isLiked ? 'Added to your saved community favorites' : 'Removed from favorites', 'info');
    }
  };

  const handleAddComment = async (postId, text) => {
    await communityApi.addComment(postId, text, currentUser);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComments = [...(p.comments || []), { id: `c-${Date.now()}`, author: currentUser?.name || 'Alex Morgan', text, time: 'Just now' }];
          return {
            ...p,
            comments: newComments,
            commentsCount: newComments.length,
          };
        }
        return p;
      })
    );
    if (onShowToast) {
      onShowToast('Comment posted successfully!', 'success');
    }
  };

  const handleSharePost = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    if (onShowToast) {
      onShowToast(`Link for "${post.title}" copied to clipboard!`, 'success');
    }
  };

  const handlePublishExperience = async (newPostData) => {
    const created = await communityApi.createPost(newPostData, currentUser);
    setPosts((prev) => [created, ...prev]);
    if (onShowToast) {
      onShowToast('Your travel experience has been published to the community!', 'success');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setFilterDestination('All');
    setSortBy('recent');
  };

  const isFiltered = Boolean(searchQuery || filterType !== 'All' || filterDestination !== 'All');

  return (
    <div className="gt-community-tab-root">
      {/* 1. Standard Community Header */}
      <CommunityHeader
        currentUser={currentUser}
        onNavigate={onNavigate}
        onOpenShareModal={() => setShareModalOpen(true)}
        onLogout={onLogout}
      />

      <main className="gt-community-container">
        {/* 2. Community Intro Banner */}
        <CommunityIntro onOpenShareModal={() => setShareModalOpen(true)} />

        {/* 3. Search and Discovery Controls */}
        <CommunitySearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          filterDestination={filterDestination}
          onFilterDestinationChange={setFilterDestination}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          availableDestinations={availableDestinations}
          onResetFilters={handleResetFilters}
        />

        {/* Main Content Layout */}
        {hasError ? (
          <CommunityError onRetry={loadData} />
        ) : isLoading ? (
          <CommunitySkeleton />
        ) : (
          <div className="gt-community-layout-grid">
            {/* Left Column: Main Community Feed */}
            <section className="gt-community-feed-column">
              {posts.length === 0 ? (
                <EmptyCommunity
                  isFiltered={isFiltered}
                  onOpenShareModal={() => setShareModalOpen(true)}
                  onResetFilters={handleResetFilters}
                />
              ) : (
                <CommunityFeed
                  posts={posts}
                  onLike={handleLikePost}
                  onAddComment={handleAddComment}
                  onShare={handleSharePost}
                />
              )}
            </section>

            {/* Right Column: Informational Sidebar Panel */}
            <section className="gt-community-sidebar-column">
              <CommunitySidebar
                destinations={popularDestinations}
                onSelectDestination={(destName) => setFilterDestination(destName)}
              />
            </section>
          </div>
        )}
      </main>

      {/* Share Experience Modal */}
      <ShareExperienceModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onPublish={handlePublishExperience}
      />
    </div>
  );
};
