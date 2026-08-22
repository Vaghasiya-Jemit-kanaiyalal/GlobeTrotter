const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const upload = require('../middleware/upload.middleware');
const { updateProfileSchema, saveDestinationSchema } = require('../validators/user.validator');

// Profile Endpoints
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.delete('/profile', authenticate, userController.deleteProfile);
router.post('/profile/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);

// Saved Destinations Endpoints
router.get('/saved-destinations', authenticate, userController.getSavedDestinations);
router.post('/saved-destinations', authenticate, validate(saveDestinationSchema), userController.addSavedDestination);
router.delete('/saved-destinations/:cityId', authenticate, userController.removeSavedDestination);

module.exports = router;
