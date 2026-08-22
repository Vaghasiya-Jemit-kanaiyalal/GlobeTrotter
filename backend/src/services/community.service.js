const communityRepository = require('../repositories/community.repository');
const tripRepository = require('../repositories/trip.repository');
const stopRepository = require('../repositories/stop.repository');
const { generateSlug } = require('../utils/slug');

async function createPost(userId, postData) {
  const trip = await tripRepository.findById(postData.tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    error.errorCode = 'TRIP_NOT_FOUND';
    throw error;
  }

  if (trip.user_id !== userId) {
    const error = new Error('Access denied. You can only publish community posts for your own trips.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const publicShareToken = `share-${generateSlug(postData.title)}-${Math.random().toString(36).substr(2, 6)}`;

  // Automatically update trip is_public state
  if (postData.visibility === 'public') {
    await tripRepository.updateTrip(postData.tripId, { isPublic: true });
  }

  return communityRepository.createPost({
    ...postData,
    userId,
    coverImage: postData.coverImage || trip.cover_image,
    publicShareToken
  });
}

async function getPosts(queryParams) {
  return communityRepository.findAllPosts(queryParams);
}

async function getPostById(postId, userId) {
  const post = await communityRepository.findById(postId);
  if (!post) {
    const error = new Error('Community post not found');
    error.statusCode = 404;
    error.errorCode = 'POST_NOT_FOUND';
    throw error;
  }

  if (post.visibility === 'private' && post.author.id !== userId) {
    const error = new Error('Access denied to private post');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  const likedByUser = await communityRepository.isLikedByUser(postId, userId);
  const comments = await communityRepository.getComments(postId);
  const stops = await stopRepository.findByTripId(post.trip.id);

  return {
    ...post,
    likedByUser,
    comments,
    stops: stops.map(s => ({
      city: s.city_name,
      country: s.city_country,
      startDate: s.start_date,
      endDate: s.end_date
    }))
  };
}

async function updatePost(postId, userId, updateData) {
  const post = await communityRepository.findById(postId);
  if (!post) {
    const error = new Error('Community post not found');
    error.statusCode = 404;
    error.errorCode = 'POST_NOT_FOUND';
    throw error;
  }

  if (post.author.id !== userId) {
    const error = new Error('Access denied. Only the post owner can update this post.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return communityRepository.updatePost(postId, updateData);
}

async function deletePost(postId, userId, userRole) {
  const post = await communityRepository.findById(postId);
  if (!post) {
    const error = new Error('Community post not found');
    error.statusCode = 404;
    error.errorCode = 'POST_NOT_FOUND';
    throw error;
  }

  if (post.author.id !== userId && userRole !== 'admin') {
    const error = new Error('Access denied. Only the post owner or admin can delete this post.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return communityRepository.deletePost(postId);
}

async function toggleLike(postId, userId) {
  const isLiked = await communityRepository.isLikedByUser(postId, userId);
  if (isLiked) {
    const likesCount = await communityRepository.removeLike(postId, userId);
    return { liked: false, likesCount };
  } else {
    const likesCount = await communityRepository.addLike(postId, userId);
    return { liked: true, likesCount };
  }
}

async function getLikes(postId) {
  const count = await communityRepository.getLikesCount(postId);
  return { likesCount: count };
}

async function getComments(postId) {
  return communityRepository.getComments(postId);
}

async function addComment(postId, userId, content) {
  const post = await communityRepository.findById(postId);
  if (!post) {
    const error = new Error('Community post not found');
    error.statusCode = 404;
    error.errorCode = 'POST_NOT_FOUND';
    throw error;
  }

  return communityRepository.addComment(postId, userId, content);
}

async function updateComment(commentId, userId, content) {
  const comment = await communityRepository.findCommentById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    error.errorCode = 'COMMENT_NOT_FOUND';
    throw error;
  }

  if (comment.author.id !== userId) {
    const error = new Error('Access denied. You can only edit your own comment.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return communityRepository.updateComment(commentId, content);
}

async function deleteComment(commentId, userId, userRole) {
  const comment = await communityRepository.findCommentById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    error.errorCode = 'COMMENT_NOT_FOUND';
    throw error;
  }

  if (comment.author.id !== userId && userRole !== 'admin') {
    const error = new Error('Access denied. You can only delete your own comment.');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    throw error;
  }

  return communityRepository.deleteComment(commentId);
}

async function recordView(postId, userId) {
  return communityRepository.recordView(postId, userId);
}

async function getTrending() {
  return communityRepository.getTrending();
}

async function getSharedPostByToken(token) {
  const post = await communityRepository.findByShareToken(token);
  if (!post) {
    const error = new Error('Shared trip not found');
    error.statusCode = 404;
    error.errorCode = 'SHARED_TRIP_NOT_FOUND';
    throw error;
  }

  const stops = await stopRepository.findByTripId(post.trip.id);
  for (const stop of stops) {
    const acts = await stopRepository.findScheduledActivitiesByStopId(stop.id);
    stop.activities = acts.map(a => ({
      name: a.activity_name,
      category: a.category,
      duration: a.duration_minutes,
      scheduledDate: a.scheduled_date
    }));
  }

  return {
    postTitle: post.title,
    postDescription: post.description,
    author: {
      name: post.author.name,
      profileImage: post.author.profileImage
    },
    trip: {
      name: post.trip.name,
      destination: post.trip.destination,
      startDate: post.trip.startDate,
      endDate: post.trip.endDate
    },
    stops: stops.map(s => ({
      city: s.city_name,
      country: s.city_country,
      startDate: s.start_date,
      endDate: s.end_date,
      activities: s.activities
    }))
  };
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getLikes,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  recordView,
  getTrending,
  getSharedPostByToken
};
