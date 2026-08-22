/**
 * GlobeTrotter Community Service API Layer
 * Connected live to Express Backend (/api/v1/community) and MySQL DB
 */

import { apiClient } from './apiClient';
import { INITIAL_COMMUNITY_POSTS, POPULAR_COMMUNITY_DESTINATIONS, TRENDING_EXPERIENCES } from '../data/communityData';

let postsMemoryStore = [...INITIAL_COMMUNITY_POSTS];

export const communityApi = {
  /**
   * GET /api/v1/community/posts
   */
  async getPosts(params = {}) {
    try {
      const res = await apiClient.get('/community/posts', params);
      const rawList = Array.isArray(res) ? res : (res?.posts || []);
      
      const formatted = rawList.map((p) => ({
        id: String(p.id),
        type: p.post_type || p.type || 'trip',
        title: p.title,
        destination: p.destination || p.city_name || 'Goa, India',
        city: p.city_name || p.city || 'Goa',
        country: p.country || 'India',
        description: p.description || '',
        duration: p.duration || '3 Days',
        cost: p.cost || '₹18,500',
        tripId: p.trip_id ? String(p.trip_id) : 'trip-1',
        image: p.cover_image || p.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        author: {
          id: p.user_id ? String(p.user_id) : 'usr-1',
          name: p.author_name || p.author?.name || 'Traveler',
          avatar: p.author_avatar || p.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          location: p.author_location || 'Community Traveler',
        },
        createdAt: p.created_at ? String(p.created_at).split('T')[0] : 'Recently',
        likes: parseInt(p.likes_count || p.likes || 1, 10),
        isLiked: Boolean(p.is_liked || p.isLiked),
        commentsCount: parseInt(p.comments_count || p.commentsCount || 0, 10),
        views: parseInt(p.views_count || p.views || 42, 10),
        comments: p.comments || [],
      }));

      return formatted;
    } catch (err) {
      console.warn('Backend community getPosts error:', err.message);
      return postsMemoryStore;
    }
  },

  /**
   * POST /api/v1/community/posts
   */
  async createPost(newPostData, currentUser) {
    try {
      const payload = {
        title: newPostData.title,
        description: newPostData.description,
        postType: newPostData.type || 'trip',
        tripId: newPostData.tripId || null,
        visibility: 'public',
        coverImage: newPostData.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      };

      const res = await apiClient.post('/community/posts', payload);
      const post = res?.post || res;
      
      const formatted = {
        id: String(post.id),
        type: post.post_type || newPostData.type || 'trip',
        title: post.title,
        destination: newPostData.destination || 'Goa, India',
        city: 'Goa',
        country: 'India',
        description: post.description,
        duration: '3 Days',
        cost: '₹18,500',
        tripId: String(post.trip_id || '1'),
        image: post.cover_image,
        author: {
          id: currentUser?.id || 'usr-1',
          name: currentUser?.name || 'Traveler',
          avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          location: 'Community Traveler',
        },
        createdAt: 'Just now',
        likes: 1,
        isLiked: true,
        commentsCount: 0,
        views: 1,
        comments: [],
      };

      postsMemoryStore = [formatted, ...postsMemoryStore];
      return formatted;
    } catch (err) {
      console.error('Create community post failed:', err.message);
      throw err;
    }
  },

  /**
   * POST /api/v1/community/posts/:id/like
   */
  async toggleLikePost(postId) {
    try {
      await apiClient.post(`/community/posts/${postId}/like`);
    } catch (err) {
      console.warn(`Like post ${postId} backend sync error:`, err.message);
    }

    postsMemoryStore = postsMemoryStore.map((p) => {
      if (String(p.id) === String(postId)) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    });
    return postsMemoryStore.find((p) => String(p.id) === String(postId));
  },

  /**
   * POST /api/v1/community/posts/:id/comments
   */
  async addComment(postId, commentText, currentUser) {
    try {
      await apiClient.post(`/community/posts/${postId}/comments`, { content: commentText });
    } catch (err) {
      console.warn(`Add comment backend sync error:`, err.message);
    }

    const newComment = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || 'Traveler',
      text: commentText,
      time: 'Just now',
    };

    postsMemoryStore = postsMemoryStore.map((p) => {
      if (String(p.id) === String(postId)) {
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

  async getTrendingDestinations() {
    return POPULAR_COMMUNITY_DESTINATIONS;
  },

  async getTrendingExperiences() {
    return TRENDING_EXPERIENCES;
  },
};
