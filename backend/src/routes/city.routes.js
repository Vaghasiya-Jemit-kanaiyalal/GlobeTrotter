const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');

// IMPORTANT ROUTE ORDER: Declare static endpoints before parameterized :cityId
router.get('/cities/popular', cityController.getPopularCities);
router.get('/cities', cityController.getCities);
router.get('/cities/:cityId', cityController.getCityById);
router.get('/cities/:cityId/activities', cityController.getCityActivities);

module.exports = router;
