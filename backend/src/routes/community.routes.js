const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { createPostSchema, updatePostSchema, addCommentSchema } = require('../validators/community.validator');

// Public Feed & Discovery
router.get('/community/posts', optionalAuthenticate, communityController.getPosts);
router.get('/community/trending', communityController.getTrending);
router.get('/community/shared/:token', communityController.getSharedPostByToken);
router.get('/community/posts/:postId', optionalAuthenticate, communityController.getPostById);

// Create / Edit / Delete Post (Authenticated)
router.post('/community/posts', authenticate, validate(createPostSchema), communityController.createPost);
router.put('/community/posts/:postId', authenticate, validate(updatePostSchema), communityController.updatePost);
router.delete('/community/posts/:postId', authenticate, communityController.deletePost);

// Likes
router.post('/community/posts/:postId/like', authenticate, communityController.toggleLike);
router.delete('/community/posts/:postId/like', authenticate, communityController.toggleLike);
router.get('/community/posts/:postId/likes', communityController.getLikes);

// Comments
router.get('/community/posts/:postId/comments', communityController.getComments);
router.post('/community/posts/:postId/comments', authenticate, validate(addCommentSchema), communityController.addComment);
router.put('/community/comments/:commentId', authenticate, validate(addCommentSchema), communityController.updateComment);
router.delete('/community/comments/:commentId', authenticate, communityController.deleteComment);

// Views
router.post('/community/posts/:postId/view', optionalAuthenticate, communityController.recordView);

module.exports = router;
