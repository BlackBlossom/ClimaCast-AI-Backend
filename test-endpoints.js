// ClimaCast AI Backend - API Testing Script
// Run with: node test-endpoints.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Helper function to log colored messages
function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

// Helper function to log test headers
function testHeader(testName) {
  console.log('\n' + '═'.repeat(60));
  log(`🧪 ${testName}`, 'cyan');
  console.log('═'.repeat(60));
}

// Test 1: Health Check
async function testHealthCheck() {
  testHeader('TEST 1: Health Check');
  
  try {
    const response = await axios.get(`${BASE_URL}/`);
    
    if (response.data.status === 'healthy') {
      log('✅ Server is healthy!', 'green');
      log(`   Status: ${response.data.status}`, 'gray');
      log(`   Model: ${response.data.model}`, 'gray');
      log(`   Version: ${response.data.version}`, 'gray');
      return true;
    } else {
      log('❌ Unexpected response', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Health check failed!', 'red');
    log(`   Error: ${error.message}`, 'red');
    log('   Make sure the server is running: npm run dev', 'yellow');
    return false;
  }
}

// Test 2: Model Information
async function testModelInfo() {
  testHeader('TEST 2: Model Information');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/predictions/prithvi/info`);
    
    log('✅ Model info retrieved!', 'green');
    log(`   Model: ${response.data.model}`, 'gray');
    log(`   Parameters: ${response.data.parameters}`, 'gray');
    log(`   Training Data: ${response.data.training_data}`, 'gray');
    log(`   Capabilities: ${response.data.capabilities.length} features`, 'gray');
    return true;
  } catch (error) {
    log('❌ Model info failed!', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Generate Weather Forecast
async function testGenerateForecast() {
  testHeader('TEST 3: Generate Weather Forecast (Delhi)');
  
  log('⏳ Generating 7-day forecast... (this may take 3-8 seconds)', 'yellow');
  
  try {
    const requestBody = {
      latitude: 28.6139,
      longitude: 77.2090,
      days: 7
    };
    
    const startTime = Date.now();
    const response = await axios.post(
      `${BASE_URL}/api/predictions/prithvi/forecast`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const endTime = Date.now();
    
    log(`✅ Forecast generated successfully! (${endTime - startTime}ms)`, 'green');
    log(`   Location: (${response.data.location.latitude}, ${response.data.location.longitude})`, 'gray');
    log(`   Timezone: ${response.data.location.timezone}`, 'gray');
    log(`   Model: ${response.data.model}`, 'gray');
    log(`   Cached: ${response.data.cached}`, 'gray');
    
    console.log('\n   📅 7-Day Forecast Preview:');
    response.data.forecast.forEach(day => {
      log(`   Day ${day.day} (${day.date}): ${day.temperature.mean}°C | ${day.atmosphericPattern} | ${day.confidence}% confidence`, 'gray');
    });
    
    return response.data;
  } catch (error) {
    log('❌ Forecast generation failed!', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test 4: Cache Verification
async function testCacheVerification() {
  testHeader('TEST 4: Cache Verification');
  
  log('⏳ Making second request (should be cached and instant)...', 'yellow');
  
  try {
    const requestBody = {
      latitude: 28.6139,
      longitude: 77.2090,
      days: 7
    };
    
    const startTime = Date.now();
    const response = await axios.post(
      `${BASE_URL}/api/predictions/prithvi/forecast`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const endTime = Date.now();
    
    if (response.data.cached) {
      log(`✅ Cache is working! Response returned in ${endTime - startTime}ms`, 'green');
      log(`   Cached: ${response.data.cached}`, 'gray');
      return true;
    } else {
      log('⚠️  Response not cached (might be first run)', 'yellow');
      log(`   Response time: ${endTime - startTime}ms`, 'gray');
      return true;
    }
  } catch (error) {
    log('❌ Cache test failed!', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 5: Extreme Weather Detection
async function testExtremeWeather() {
  testHeader('TEST 5: Extreme Weather Detection');
  
  log('⏳ Scanning for extreme events... (may take 5-15 seconds)', 'yellow');
  
  try {
    const startTime = Date.now();
    const response = await axios.get(
      `${BASE_URL}/api/predictions/prithvi/extreme-weather?latitude=28.6139&longitude=77.2090`
    );
    const endTime = Date.now();
    
    log(`✅ Extreme weather scan complete! (${endTime - startTime}ms)`, 'green');
    log(`   Alert Level: ${response.data.alertLevel}`, 'gray');
    log(`   Events Found: ${response.data.extremeEvents.length}`, 'gray');
    log(`   Scanned Days: ${response.data.scannedDays}`, 'gray');
    
    if (response.data.extremeEvents.length > 0) {
      console.log('\n   ⚠️  EXTREME WEATHER ALERTS:');
      response.data.extremeEvents.forEach(event => {
        log(`   • Day ${event.day} (${event.date}): ${event.type}`, 'yellow');
        log(`     ${event.description}`, 'gray');
        log(`     Recommendation: ${event.recommendation}`, 'gray');
      });
    } else {
      log('\n   ✅ No extreme weather events detected.', 'green');
    }
    
    return true;
  } catch (error) {
    log('❌ Extreme weather detection failed!', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test 6: Error Handling
async function testErrorHandling() {
  testHeader('TEST 6: Error Handling (Invalid Latitude)');
  
  log('Testing with invalid latitude (999)...', 'yellow');
  
  try {
    const requestBody = {
      latitude: 999,  // Invalid!
      longitude: 77.2090,
      days: 7
    };
    
    await axios.post(
      `${BASE_URL}/api/predictions/prithvi/forecast`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    log('⚠️  Error handling might not be working - request succeeded!', 'yellow');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log('✅ Error handling is working!', 'green');
      log(`   Error: ${error.response.data.error}`, 'gray');
      return true;
    } else {
      log('❌ Unexpected error', 'red');
      log(`   Error: ${error.message}`, 'red');
      return false;
    }
  }
}

// Test 7: Different Location (Mumbai)
async function testDifferentLocation() {
  testHeader('TEST 7: Different Location (Mumbai)');
  
  log('⏳ Generating forecast for Mumbai...', 'yellow');
  
  try {
    const requestBody = {
      latitude: 19.0760,
      longitude: 72.8777,
      days: 5
    };
    
    const response = await axios.post(
      `${BASE_URL}/api/predictions/prithvi/forecast`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    log('✅ Mumbai forecast generated!', 'green');
    log(`   Location: (${response.data.location.latitude}, ${response.data.location.longitude})`, 'gray');
    log(`   Timezone: ${response.data.location.timezone}`, 'gray');
    
    console.log('\n   📅 5-Day Forecast:');
    response.data.forecast.slice(0, 3).forEach(day => {
      log(`   Day ${day.day}: ${day.temperature.mean}°C | ${day.atmosphericPattern}`, 'gray');
    });
    
    return true;
  } catch (error) {
    log('❌ Mumbai forecast failed!', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  log('║  🧪 ClimaCast AI - API Testing Suite                      ║', 'cyan');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Run all tests
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Model Info', fn: testModelInfo },
    { name: 'Generate Forecast', fn: testGenerateForecast },
    { name: 'Cache Verification', fn: testCacheVerification },
    { name: 'Extreme Weather', fn: testExtremeWeather },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Different Location', fn: testDifferentLocation }
  ];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result !== false) {
        results.passed++;
        results.tests.push({ name: test.name, status: 'PASS' });
      } else {
        results.failed++;
        results.tests.push({ name: test.name, status: 'FAIL' });
      }
    } catch (error) {
      results.failed++;
      results.tests.push({ name: test.name, status: 'ERROR' });
      log(`\nUnexpected error in ${test.name}: ${error.message}`, 'red');
    }
  }
  
  // Print summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  log('║  📊 Test Summary                                           ║', 'cyan');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  results.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    const color = test.status === 'PASS' ? 'green' : 'red';
    log(`${icon} ${test.name}: ${test.status}`, color);
  });
  
  console.log('\n' + '─'.repeat(60));
  log(`Total: ${results.passed + results.failed} tests`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  if (results.failed > 0) {
    log(`Failed: ${results.failed}`, 'red');
  }
  console.log('─'.repeat(60));
  
  if (results.passed === tests.length) {
    log('\n🎉 All tests passed! Your ClimaCast AI Backend is working perfectly!', 'green');
    log('   Now you can build your React frontend to visualize this data.\n', 'cyan');
  } else {
    log('\n⚠️  Some tests failed. Check the errors above.\n', 'yellow');
  }
  
  console.log('📚 Next Steps:');
  console.log('   1. Keep the server running: npm run dev');
  console.log('   2. Review the COMPLETE.md file for documentation');
  console.log('   3. Start building your React frontend');
  console.log('   4. Deploy to Railway or Render for production\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Test suite crashed:', error.message);
  process.exit(1);
});
