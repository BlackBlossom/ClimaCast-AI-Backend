# ClimaCast AI Backend

> AI-powered weather forecasting backend using IBM-NASA Prithvi WxC model

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![Prithvi WxC](https://img.shields.io/badge/Prithvi%20WxC-2.3B-orange.svg)](https://huggingface.co/ibm-nasa-geospatial/Prithvi-WxC-1.0-2300M-rollout)

## 🌟 Features

- ✅ **AI-Enhanced Weather Forecasting** (1-10 days)
- ✅ **Extreme Weather Detection** (Heat, Cold, Precipitation, Winds)
- ✅ **Atmospheric Pattern Analysis** (Hot/Dry, Cold/Wet, etc.)
- ✅ **Smart Caching** (1-hour TTL for performance)
- ✅ **Confidence Scoring** (98% to 70% based on forecast range)
- ✅ **Professional API** (RESTful with comprehensive error handling)

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Hugging Face API key ([Get one here](https://huggingface.co/settings/tokens))

### Installation

1. **Clone or navigate to the repository**
   ```bash
   cd ClimaCast-AI-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env and add your Hugging Face API key
   # HUGGINGFACE_API_KEY=hf_your_actual_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Server should be running on** http://localhost:5000

## 📡 API Endpoints

### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "ClimaCast AI - Powered by IBM-NASA Prithvi WxC",
  "status": "healthy",
  "model": "Prithvi WxC 2.3B parameters",
  "version": "1.0.0",
  "timestamp": "2025-11-05T09:21:33.000Z",
  "endpoints": {
    "forecast": "POST /api/predictions/prithvi/forecast",
    "extreme": "GET /api/predictions/prithvi/extreme-weather",
    "info": "GET /api/predictions/prithvi/info"
  }
}
```

### 2. Generate Weather Forecast
```http
POST /api/predictions/prithvi/forecast
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "days": 7
}
```

**Response:**
```json
{
  "success": true,
  "model": "IBM-NASA Prithvi WxC Enhanced",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone": "Asia/Kolkata"
  },
  "forecast": [
    {
      "day": 1,
      "date": "2025-11-06",
      "temperature": {
        "mean": 28.5,
        "max": 32.1,
        "min": 24.8
      },
      "precipitation": {
        "probability": 15,
        "amount": 0.2
      },
      "wind": {
        "maxSpeed": 12.5
      },
      "weatherCode": 1,
      "confidence": 96,
      "atmosphericPattern": "moderate",
      "aiAdjustment": 0.3
    }
    // ... more days
  ],
  "confidence": "high",
  "generatedAt": "2025-11-05T09:21:33.000Z",
  "cached": false
}
```

### 3. Detect Extreme Weather
```http
GET /api/predictions/prithvi/extreme-weather?latitude=28.6139&longitude=77.2090
```

**Response:**
```json
{
  "success": true,
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "extremeEvents": [
    {
      "day": 5,
      "date": "2025-11-10",
      "type": "extreme_heat",
      "severity": "high",
      "description": "Extreme heat warning: 42.3°C",
      "recommendation": "Stay indoors, stay hydrated, avoid strenuous activity"
    }
  ],
  "alertLevel": "high",
  "scannedDays": 10,
  "generatedAt": "2025-11-05T09:21:33.000Z"
}
```

### 4. Get Model Information
```http
GET /api/predictions/prithvi/info
```

**Response:**
```json
{
  "model": "IBM-NASA Prithvi WxC",
  "version": "1.0",
  "parameters": "2.3 billion",
  "training_data": "NASA MERRA-2 (40 years, 160 variables)",
  "capabilities": [
    "Weather forecasting (up to 10 days)",
    "Climate downscaling",
    "Extreme weather detection",
    "Atmospheric pattern analysis",
    "Regional and global predictions"
  ],
  "accuracy": "State-of-the-art",
  "license": "Open-source (MIT)",
  "source": "https://huggingface.co/ibm-nasa-geospatial/Prithvi-WxC-1.0-2300M-rollout"
}
```

## 🧪 Testing with cURL

**Generate Forecast:**
```bash
curl -X POST http://localhost:5000/api/predictions/prithvi/forecast \
  -H "Content-Type: application/json" \
  -d '{"latitude": 28.6139, "longitude": 77.2090, "days": 7}'
```

**Detect Extreme Weather:**
```bash
curl "http://localhost:5000/api/predictions/prithvi/extreme-weather?latitude=28.6139&longitude=77.2090"
```

**Get Model Info:**
```bash
curl http://localhost:5000/api/predictions/prithvi/info
```

## 📁 Project Structure

```
ClimaCast-AI-Backend/
├── controllers/
│   └── predictionController.js   # Request handlers & validation
├── routes/
│   └── predictionRoutes.js       # API route definitions
├── services/
│   └── prithviService.js        # Core AI logic (400+ lines)
├── utils/                        # Helper functions
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── server.js                     # Express server entry point
└── README.md                     # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `HUGGINGFACE_API_KEY` | Your HF API token | - | **YES** |
| `PRITHVI_MODEL` | Model identifier | ibm-nasa-geospatial/Prithvi-WxC-1.0-2300M-rollout | No |
| `CACHE_TTL` | Cache duration (seconds) | 3600 | No |

## 🌡️ Weather Pattern Classifications

| Pattern | Conditions | Examples |
|---------|------------|----------|
| `hot_dry` | Temp > 0.7, Humidity < 0.4 | Desert, Heat wave |
| `hot_humid` | Temp > 0.7, Humidity > 0.6 | Tropical, Monsoon |
| `cold_wet` | Temp < 0.3, Humidity > 0.6 | Winter rain/snow |
| `cold_dry` | Temp < 0.3, Humidity < 0.4 | Crisp winter |
| `stormy` | Pressure < 0.4 | Storm systems |
| `moderate` | Balanced conditions | Normal weather |

## 🚨 Extreme Weather Thresholds

| Event Type | Threshold | Severity |
|------------|-----------|----------|
| Extreme Heat | > 40°C | High |
| Extreme Cold | < 0°C | High |
| Heavy Precipitation | > 80% probability | Medium |
| Strong Winds | > 50 km/h | High |

## 📊 Confidence Scoring

The AI adjusts confidence based on forecast range:

- **Day 1:** 96% (Very high)
- **Day 3:** 92% (Still very reliable)
- **Day 5:** 88% (Good confidence)
- **Day 7:** 84% (Moderate confidence)
- **Day 10:** 78% (Lower confidence)
- **Day 14+:** 70% minimum (General trends only)

## 🛠️ Scripts

```bash
# Start production server
npm start

# Start development server (with auto-reload)
npm run dev

# Run tests (placeholder)
npm test
```

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot find module 'express'"**
```bash
npm install
```

**2. "Port 5000 already in use"**
Change `PORT` in `.env` to 5001 or kill the process using port 5000.

**3. "Invalid Hugging Face token"**
- Check your token at https://huggingface.co/settings/tokens
- Ensure it starts with `hf_`
- Make sure you've added it to `.env`

**4. "Failed to fetch atmospheric data"**
- Check internet connection
- Open-Meteo API might be temporarily down
- Try again after a few seconds

## 🌍 Example Locations to Test

**Indian Cities:**
- Delhi: `28.6139, 77.2090`
- Mumbai: `19.0760, 72.8777`
- Bangalore: `12.9716, 77.5946`
- Chennai: `13.0827, 80.2707`

**International:**
- New York: `40.7128, -74.0060`
- London: `51.5074, -0.1278`
- Tokyo: `35.6762, 139.6503`
- Sydney: `-33.8688, 151.2093`

## 🚀 Deployment

### Railway (Recommended)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Add environment variables in Railway dashboard

### Render

1. Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: climacast-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
   ```

2. Push to GitHub and connect to Render

## 📚 Technology Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js v5
- **AI Model:** IBM-NASA Prithvi WxC (2.3B parameters)
- **Weather Data:** Open-Meteo API
- **Caching:** node-cache
- **HTTP Client:** axios
- **Model Inference:** @huggingface/inference

## 🎯 Key Achievements

✅ Professional RESTful API architecture  
✅ AI-enhanced weather predictions  
✅ Extreme weather detection system  
✅ Smart caching for performance  
✅ Comprehensive error handling  
✅ Input validation & security  
✅ Well-documented & maintainable code  
✅ Production-ready deployment config  

## 📄 License

MIT License - Feel free to use this project for your hackathon!

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📧 Support

For issues or questions:
- Check the Implementation.txt guide
- Review API endpoint examples
- Test with the provided sample locations

---

**Built with ❤️ using IBM-NASA Prithvi WxC**
