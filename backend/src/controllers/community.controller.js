const communityService = require('../services/community.service');
const { sendSuccess } = require('../utils/response');

async function createPost(req, res, next) {
  try {
    const post = await communityService.createPost(req.user.id, req.body);
    return sendSuccess(res, 'Community post created successfully', { post }, 201);
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await communityService.getPosts(req.query);
    return sendSuccess(res, 'Community feed fetched successfully', { posts }, 200);
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.user ? req.user.id : null;
    const post = await communityService.getPostById(postId, userId);
    return sendSuccess(res, 'Community post details retrieved', { post }, 200);
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const post = await communityService.updatePost(postId, req.user.id, req.body);
    return sendSuccess(res, 'Community post updated successfully', { post }, 200);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    await communityService.deletePost(postId, req.user.id, req.user.role);
    return sendSuccess(res, 'Community post deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
}

async function toggleLike(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const result = await communityService.toggleLike(postId, req.user.id);
    return sendSuccess(res, result.liked ? 'Post liked' : 'Post unliked', result, 200);
  } catch (error) {
    next(error);
  }
}

async function getLikes(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const result = await communityService.getLikes(postId);
    return sendSuccess(res, 'Likes count retrieved', result, 200);
  } catch (error) {
    next(error);
  }
}

async function getComments(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const comments = await communityService.getComments(postId);
    return sendSuccess(res, 'Comments retrieved', { comments }, 200);
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const comment = await communityService.addComment(postId, req.user.id, req.body.content);
    return sendSuccess(res, 'Comment posted successfully', { comment }, 201);
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const comment = await communityService.updateComment(commentId, req.user.id, req.body.content);
    return sendSuccess(res, 'Comment updated successfully', { comment }, 200);
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    await communityService.deleteComment(commentId, req.user.id, req.user.role);
    return sendSuccess(res, 'Comment deleted successfully', null, 200);
  } catch (error) {
    next(error);
  }
}

async function recordView(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.user ? req.user.id : null;
    await communityService.recordView(postId, userId);
    return sendSuccess(res, 'View recorded', null, 200);
  } catch (error) {
    next(error);
  }
}

async function getTrending(req, res, next) {
  try {
    const trending = await communityService.getTrending();
    return sendSuccess(res, 'Trending community content fetched', trending, 200);
  } catch (error) {
    next(error);
  }
}

async function getSharedPostByToken(req, res, next) {
  try {
    const token = req.params.token;
    const sharedData = await communityService.getSharedPostByToken(token);
    return sendSuccess(res, 'Public shared trip fetched successfully', sharedData, 200);
  } catch (error) {
    next(error);
  }
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
