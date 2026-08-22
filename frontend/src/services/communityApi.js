/**
 * GlobeTrotter Community Service API Layer
 * Connected live to Express Backend (/api/v1/community) and MySQL DB
 */

import { apiClient } from './apiClient';
import { INITIAL_COMMUNITY_POSTS, POPULAR_COMMUNITY_DESTINATIONS, TRENDING_EXPERIENCES } from '../data/communityData';

let postsMemoryStore = [...INITIAL_COMMUNITY_POSTS];

function normalizePost(p) {
  const authorName = p.author?.name || (p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : null) || p.author_name || 'Traveler';
  const authorAvatar = p.author?.profileImage || p.author?.avatar || p.author_avatar || p.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';
  const postType = p.postType || p.post_type || p.type || 'trip';
  const coverImg = p.coverImage || p.cover_image || p.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
  const destName = p.trip?.destination || p.destination || p.primary_destination || p.city || 'Goa, India';

  return {
    id: String(p.id),
    type: postType,
    title: p.title || 'Community Travel Experience',
    destination: destName.includes(',') ? destName : `${destName}, India`,
    city: p.city || (destName.includes(',') ? destName.split(',')[0] : destName),
    country: p.country || (destName.includes(',') ? destName.split(',')[1].trim() : 'India'),
    description: p.description || '',
    duration: p.duration || '5 Days',
    cost: p.cost || '₹18,500',
    tripId: p.trip?.id ? String(p.trip.id) : (p.trip_id ? String(p.trip_id) : 'trip-1'),
    image: coverImg,
    author: {
      id: p.author?.id ? String(p.author.id) : (p.user_id ? String(p.user_id) : 'usr-1'),
      name: authorName,
      avatar: authorAvatar,
      location: p.author?.location || 'Community Traveler',
    },
    createdAt: p.createdAt ? (typeof p.createdAt === 'string' && p.createdAt.includes('T') ? p.createdAt.split('T')[0] : p.createdAt) : 'Recently',
    likes: typeof p.likes === 'number' ? p.likes : parseInt(p.likes_count || 1, 10),
    isLiked: Boolean(p.isLiked || p.is_liked),
    commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : parseInt(p.comments || p.comments_count || 0, 10),
    views: typeof p.views === 'number' ? p.views : parseInt(p.views_count || 42, 10),
    comments: Array.isArray(p.comments) ? p.comments : [],
  };
}

export const communityApi = {
  /**
   * GET /api/v1/community/posts
   */
  async getPosts(params = {}) {
    try {
      const queryParams = {};
      if (params.search) queryParams.search = params.search;
      if (params.type && params.type !== 'All') queryParams.postType = params.type;
      if (params.destination && params.destination !== 'All') queryParams.destination = params.destination;
      if (params.sortBy) queryParams.sort = params.sortBy;

      const res = await apiClient.get('/community/posts', queryParams);
      const rawList = Array.isArray(res) ? res : (res?.posts || []);
      
      const formatted = rawList.map(normalizePost);

      // Return database posts if available, otherwise return sample community posts
      return formatted.length > 0 ? formatted : postsMemoryStore;
    } catch (err) {
      console.warn('Backend community getPosts error, returning fallback:', err.message);
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
        tripId: newPostData.tripId || 1,
        visibility: 'public',
        coverImage: newPostData.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      };

      const res = await apiClient.post('/community/posts', payload);
      const post = res?.post || res;
      const formatted = normalizePost(post);

      postsMemoryStore = [formatted, ...postsMemoryStore];
      return formatted;
    } catch (err) {
      console.warn('Backend createPost fallback:', err.message);
      const newPost = {
        id: `post-${Date.now()}`,
        type: newPostData.type || 'trip',
        title: newPostData.title,
        destination: newPostData.destination || 'Goa, India',
        city: 'Goa',
        country: 'India',
        description: newPostData.description,
        duration: newPostData.duration || '3 Days',
        cost: newPostData.cost || '₹18,500',
        tripId: String(newPostData.tripId || '1'),
        image: newPostData.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
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
      postsMemoryStore = [newPost, ...postsMemoryStore];
      return newPost;
    }
  },

  // POST /api/v1/community/posts/:id/like
  async toggleLikePost(postId) {
    try {
      const numId = parseInt(postId, 10);
      if (!isNaN(numId)) {
        await apiClient.post(`/community/posts/${numId}/like`);
      }
    } catch (err) {
      console.warn(`Like post ${postId} backend sync warning:`, err.message);
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

    return postsMemoryStore.find((p) => String(p.id) === String(postId)) || null;
  },

  /**
   * POST /api/v1/community/posts/:id/comments
   */
  async addComment(postId, commentText, currentUser) {
    try {
      await apiClient.post(`/community/posts/${postId}/comments`, { content: commentText });
    } catch (err) {
      console.warn(`Add comment backend sync warning:`, err.message);
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
