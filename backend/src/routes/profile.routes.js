const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const upload = require('../middleware/upload.middleware');
const { updateProfileSchema } = require('../validators/profile.validator');

router.get('/profile', authenticate, profileController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), profileController.updateProfile);
router.post('/profile/avatar', authenticate, upload.single('avatar'), profileController.uploadAvatar);
router.get('/profile/favorites', authenticate, profileController.getSavedDestinations);
router.post('/profile/favorites/:cityId', authenticate, profileController.addSavedDestination);
router.delete('/profile/favorites/:cityId', authenticate, profileController.removeSavedDestination);

module.exports = router;
