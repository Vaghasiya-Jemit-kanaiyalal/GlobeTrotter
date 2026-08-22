const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stop.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { addStopSchema, updateStopSchema, reorderStopsSchema } = require('../validators/stop.validator');

// Stop management under trips
router.post('/trips/:tripId/stops', authenticate, validate(addStopSchema), stopController.addStop);
router.get('/trips/:tripId/stops', authenticate, stopController.getStops);
router.put('/trips/:tripId/stops/reorder', authenticate, validate(reorderStopsSchema), stopController.reorderStops);

// Individual stop actions
router.put('/stops/:stopId', authenticate, validate(updateStopSchema), stopController.updateStop);
router.delete('/stops/:stopId', authenticate, stopController.deleteStop);

module.exports = router;
