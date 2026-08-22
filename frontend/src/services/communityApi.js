/**
 * GlobeTrotter Community Service API Abstraction Layer
 * Prepares frontend for REST endpoints as specified in Screen 10 (Section 17).
 */
import { INITIAL_COMMUNITY_POSTS, POPULAR_COMMUNITY_DESTINATIONS, TRENDING_EXPERIENCES } from '../data/communityData';

// Simulated local storage / memory state
let postsStore = [...INITIAL_COMMUNITY_POSTS];

export const communityApi = {
  /**
   * GET /api/v1/community/posts
   */
  async getPosts(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate async API delay
    let results = [...postsStore];

    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.destination.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    if (params.type && params.type !== 'All') {
      results = results.filter((p) => p.type === params.type);
    }

    if (params.destination && params.destination !== 'All') {
      results = results.filter((p) => p.destination.toLowerCase().includes(params.destination.toLowerCase()));
    }

    // Sort
    if (params.sortBy === 'popular') {
      results.sort((a, b) => b.likes - a.likes);
    } else if (params.sortBy === 'views') {
      results.sort((a, b) => b.views - a.views);
    } else if (params.sortBy === 'comments') {
      results.sort((a, b) => b.commentsCount - a.commentsCount);
    } // Default Most Recent

    return results;
  },

  /**
   * POST /api/v1/community/posts
   */
  async createPost(newPostData, currentUser) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newPost = {
      id: `post-${Date.now()}`,
      type: newPostData.type || 'trip',
      title: newPostData.title,
      destination: newPostData.destination || 'Goa, India',
      city: newPostData.city || 'Goa',
      country: newPostData.country || 'India',
      description: newPostData.description,
      duration: newPostData.duration || '3 Days',
      cost: newPostData.cost || 'Estimated',
      tripId: newPostData.tripId || 'trip-goa',
      image: newPostData.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      author: {
        id: currentUser?.id || 'usr-me',
        name: currentUser?.name || 'Alex Morgan',
        avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        location: 'Community Traveler',
      },
      createdAt: 'Just now',
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      views: 1,
      comments: [],
    };

    postsStore = [newPost, ...postsStore];
    return newPost;
  },

  /**
   * POST /api/v1/community/posts/:id/like
   */
  async toggleLikePost(postId) {
    postsStore = postsStore.map((p) => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    });
    return postsStore.find((p) => p.id === postId);
  },

  /**
   * POST /api/v1/community/posts/:id/comments
   */
  async addComment(postId, commentText, currentUser) {
    const newComment = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || 'Alex Morgan',
      text: commentText,
      time: 'Just now',
    };

    postsStore = postsStore.map((p) => {
      if (p.id === postId) {
        const updatedComments = [...(p.comments || []), newComment];
        return {
          ...p,
          comments: updatedComments,
          commentsCount: updatedComments.length,
        };
      }
      return p;
    });

    return newComment;
  },

  /**
   * GET /api/v1/community/trending
   */
  async getTrendingDestinations() {
    return POPULAR_COMMUNITY_DESTINATIONS;
  },

  async getTrendingExperiences() {
    return TRENDING_EXPERIENCES;
  },
};
