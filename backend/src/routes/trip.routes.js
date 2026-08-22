const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { createTripSchema, updateTripSchema } = require('../validators/trip.validator');

router.post('/trips', authenticate, validate(createTripSchema), tripController.createTrip);
router.get('/trips', authenticate, tripController.getTrips);
router.get('/trips/:tripId', authenticate, tripController.getTripById);
router.put('/trips/:tripId', authenticate, validate(updateTripSchema), tripController.updateTrip);
router.delete('/trips/:tripId', authenticate, tripController.deleteTrip);
router.post('/trips/:tripId/copy', authenticate, tripController.copyTrip);

module.exports = router;
