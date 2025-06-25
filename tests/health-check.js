#!/usr/bin/env node

/**
 * Health Check Test Suite
 * Verifies that all services are running and responding correctly
 */

const http = require('http');
const https = require('https');

// Configuration
const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 2000 // 2 seconds
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const timeout = setTimeout(() => {
      reject(new Error(`Request timeout after ${CONFIG.TIMEOUT}ms`));
    }, CONFIG.TIMEOUT);

    const req = lib.get(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testWithRetry(testFn, testName, retries = CONFIG.RETRY_COUNT) {
  for (let i = 0; i < retries; i++) {
    try {
      await testFn();
      return;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      log(`  ${colors.yellow}Retry ${i + 1}/${retries} for ${testName}...${colors.reset}`);
      await sleep(CONFIG.RETRY_DELAY);
    }
  }
}

async function testApiHealth() {
  log(`${colors.blue}Testing API Health Endpoint...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`API health check failed with status ${response.statusCode}`);
  }
  
  const data = JSON.parse(response.body);
  if (data.status !== 'ok') {
    throw new Error(`API health status is not 'ok': ${data.status}`);
  }
  
  log(`  ${colors.green}✓ API health check passed${colors.reset}`);
  return data;
}

async function testApiDetailedHealth() {
  log(`${colors.blue}Testing API Detailed Health Endpoint...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/health/detailed`);
  
  if (response.statusCode !== 200) {
    throw new Error(`API detailed health check failed with status ${response.statusCode}`);
  }
  
  const data = JSON.parse(response.body);
  if (data.status !== 'healthy') {
    throw new Error(`API detailed health status is not 'healthy': ${data.status}`);
  }
  
  // Verify required fields
  const requiredFields = ['timestamp', 'version', 'python_version', 'system', 'services'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field in detailed health: ${field}`);
    }
  }
  
  log(`  ${colors.green}✓ API detailed health check passed${colors.reset}`);
  log(`    Python version: ${data.python_version}`);
  log(`    Platform: ${data.platform}`);
  return data;
}

async function testApiStatus() {
  log(`${colors.blue}Testing API Status Endpoint...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/api/status`);
  
  if (response.statusCode !== 200) {
    throw new Error(`API status check failed with status ${response.statusCode}`);
  }
  
  const data = JSON.parse(response.body);
  if (data.api_status !== 'operational') {
    throw new Error(`API status is not 'operational': ${data.api_status}`);
  }
  
  log(`  ${colors.green}✓ API status check passed${colors.reset}`);
  log(`    Environment: ${data.environment}`);
  return data;
}

async function testApiDocs() {
  log(`${colors.blue}Testing API Documentation Endpoint...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/docs`);
  
  if (response.statusCode !== 200) {
    throw new Error(`API docs check failed with status ${response.statusCode}`);
  }
  
  if (!response.body.includes('Swagger UI')) {
    throw new Error('API docs do not contain expected Swagger UI content');
  }
  
  log(`  ${colors.green}✓ API documentation accessible${colors.reset}`);
}

async function testWebHealth() {
  log(`${colors.blue}Testing Web Frontend...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.WEB_URL}`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Web frontend check failed with status ${response.statusCode}`);
  }
  
  // Check if it's a valid HTML response
  if (!response.body.includes('<!DOCTYPE html>') && !response.body.includes('<html')) {
    throw new Error('Web frontend did not return valid HTML');
  }
  
  log(`  ${colors.green}✓ Web frontend accessible${colors.reset}`);
}

async function testWebHealthPage() {
  log(`${colors.blue}Testing Web Health Page...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.WEB_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Web health page check failed with status ${response.statusCode}`);
  }
  
  log(`  ${colors.green}✓ Web health page accessible${colors.reset}`);
}

async function testCORS() {
  log(`${colors.blue}Testing CORS Configuration...${colors.reset}`);
  
  // Test that API accepts requests from frontend origin
  const response = await makeRequest(`${CONFIG.API_URL}/health`, {
    headers: {
      'Origin': CONFIG.WEB_URL,
      'Access-Control-Request-Method': 'GET'
    }
  });
  
  if (response.statusCode !== 200) {
    throw new Error(`CORS test failed with status ${response.statusCode}`);
  }
  
  log(`  ${colors.green}✓ CORS configuration working${colors.reset}`);
}

async function runHealthChecks() {
  const startTime = Date.now();
  
  log(`${colors.bold}${colors.blue}🏥 Starting Health Check Test Suite${colors.reset}`);
  log(`${colors.blue}API URL: ${CONFIG.API_URL}${colors.reset}`);
  log(`${colors.blue}Web URL: ${CONFIG.WEB_URL}${colors.reset}`);
  log('');

  const tests = [
    { name: 'API Health', fn: testApiHealth },
    { name: 'API Detailed Health', fn: testApiDetailedHealth },
    { name: 'API Status', fn: testApiStatus },
    { name: 'API Documentation', fn: testApiDocs },
    { name: 'Web Frontend', fn: testWebHealth },
    { name: 'Web Health Page', fn: testWebHealthPage },
    { name: 'CORS Configuration', fn: testCORS }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await testWithRetry(test.fn, test.name);
      passed++;
    } catch (error) {
      log(`${colors.red}✗ ${test.name} failed: ${error.message}${colors.reset}`);
      failed++;
    }
    log('');
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  log(`${colors.bold}📊 Test Results:${colors.reset}`);
  log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  log(`⏱️  Duration: ${duration}s`);
  log('');

  if (failed > 0) {
    log(`${colors.red}${colors.bold}❌ Health checks failed!${colors.reset}`);
    process.exit(1);
  } else {
    log(`${colors.green}${colors.bold}✅ All health checks passed!${colors.reset}`);
    process.exit(0);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`${colors.red}Unhandled Rejection at: ${promise}, reason: ${reason}${colors.reset}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`${colors.red}Uncaught Exception: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run the health checks
if (require.main === module) {
  runHealthChecks().catch((error) => {
    log(`${colors.red}Health check suite failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  runHealthChecks,
  testApiHealth,
  testWebHealth,
  CONFIG
}; 