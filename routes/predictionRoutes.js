const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Generate forecast using Prithvi model
router.post('/prithvi/forecast', predictionController.generatePrithviForecast);

// Detect extreme weather events
router.get('/prithvi/extreme-weather', predictionController.detectExtremeWeather);

// Get model information
router.get('/prithvi/info', predictionController.getModelInfo);

module.exports = router;
