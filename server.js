// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// CORS configuration - allow frontend origins
const corsOptions = {
  origin: [
    'http://localhost:3000',              // Local React development
    'http://localhost:5173',              // Local Vite development
    'https://clima-cast-ai.vercel.app',   // Production frontend
    'https://*.vercel.app'                // All Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware to enable CORS
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Log all requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next(); // Pass to next middleware
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ClimaCast AI - Powered by IBM-NASA Prithvi WxC',
    status: 'healthy',
    model: 'Prithvi WxC 2.3B parameters',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      forecast: 'POST /api/predictions/prithvi/forecast',
      extreme: 'GET /api/predictions/prithvi/extreme-weather',
      info: 'GET /api/predictions/prithvi/info'
    }
  });
});

// Import routes
const predictionRoutes = require('./routes/predictionRoutes');

// Register routes
app.use('/api/predictions', predictionRoutes);

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Get port from environment or use 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║    🚀 ClimaCast AI Server - Powered by Prithvi WxC         ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`  🌍 Server running on port: ${PORT}`);
  console.log(`  🔗 Local URL: http://localhost:${PORT}`);
  console.log(`  📊 Health Check: http://localhost:${PORT}/`);
  console.log(`  🤖 Model: IBM-NASA Prithvi WxC (2.3B parameters)`);
  console.log(`  📅 Started at: ${new Date().toLocaleString()}`);
  console.log();
  console.log('  Press Ctrl+C to stop the server');
  console.log();
});
