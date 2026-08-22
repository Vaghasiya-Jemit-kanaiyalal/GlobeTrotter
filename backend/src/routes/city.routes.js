const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');

router.get('/cities', cityController.getCities);
router.get('/cities/:id', cityController.getCityById);
router.get('/recommendations/destinations', cityController.getRecommendations);

module.exports = router;
