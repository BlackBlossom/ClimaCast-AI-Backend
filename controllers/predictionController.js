const prithviService = require('../services/prithviService');
const NodeCache = require('node-cache');

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

/**
 * Generate weather forecast using Prithvi model
 */
exports.generatePrithviForecast = async (req, res) => {
  try {
    const { latitude, longitude, days = 7 } = req.body;

    // Validate inputs
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required parameters: latitude and longitude'
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        error: 'Invalid latitude: must be between -90 and 90'
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'Invalid longitude: must be between -180 and 180'
      });
    }

    const forecastDays = Math.min(Math.max(days, 1), 10);

    // Check cache
    const cacheKey = `prithvi_${latitude}_${longitude}_${forecastDays}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      console.log('✅ Returning cached Prithvi forecast');
      return res.json({
        ...cachedResult,
        cached: true
      });
    }

    // Generate forecast
    console.log(`🔄 Generating Prithvi forecast for (${latitude}, ${longitude})`);
    const result = await prithviService.generateForecast(
      parseFloat(latitude),
      parseFloat(longitude),
      forecastDays
    );

    // Cache result
    cache.set(cacheKey, result);

    res.json({
      ...result,
      cached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      error: 'Failed to generate forecast',
      message: error.message
    });
  }
};

/**
 * Detect extreme weather events
 */
exports.detectExtremeWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required parameters: latitude and longitude'
      });
    }

    const result = await prithviService.detectExtremeWeather(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.json(result);

  } catch (error) {
    console.error('Extreme weather detection error:', error);
    res.status(500).json({
      error: 'Failed to detect extreme weather',
      message: error.message
    });
  }
};

/**
 * Get model information
 */
exports.getModelInfo = (req, res) => {
  res.json({
    model: 'IBM-NASA Prithvi WxC',
    version: '1.0',
    parameters: '2.3 billion',
    training_data: 'NASA MERRA-2 (40 years, 160 variables)',
    capabilities: [
      'Weather forecasting (up to 10 days)',
      'Climate downscaling',
      'Extreme weather detection',
      'Atmospheric pattern analysis',
      'Regional and global predictions'
    ],
    accuracy: 'State-of-the-art',
    license: 'Open-source (MIT)',
    source: 'https://huggingface.co/ibm-nasa-geospatial/Prithvi-WxC-1.0-2300M-rollout'
  });
};
