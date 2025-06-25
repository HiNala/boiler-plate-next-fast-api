#!/usr/bin/env node

/**
 * CI-Optimized Health Check
 * A simplified health check script designed for CI/CD environments
 * with better error handling and debugging information
 */

const http = require('http');

// Configuration
const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 2000
};

// Colors for output (work in CI)
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

function makeRequest(url, timeout = CONFIG.TIMEOUT) {
  return new Promise((resolve, reject) => {
    const requestTimeout = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    const req = http.get(url, (res) => {
      clearTimeout(requestTimeout);
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
      clearTimeout(requestTimeout);
      reject(err);
    });
    
    req.setTimeout(timeout);
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testWithRetry(testFn, testName, retries = CONFIG.RETRY_COUNT) {
  for (let i = 0; i < retries; i++) {
    try {
      await testFn();
      return true;
    } catch (error) {
      if (i === retries - 1) {
        log(`${colors.red}✗ ${testName} failed after ${retries} attempts: ${error.message}${colors.reset}`);
        return false;
      }
      log(`${colors.yellow}Retry ${i + 1}/${retries} for ${testName}...${colors.reset}`);
      await sleep(CONFIG.RETRY_DELAY);
    }
  }
}

async function testApiHealth() {
  log(`${colors.blue}Testing API Health...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`API health check failed with status ${response.statusCode}`);
  }
  
  try {
    const data = JSON.parse(response.body);
    if (data.status !== 'ok') {
      throw new Error(`API health status is not 'ok': ${data.status}`);
    }
    log(`  ${colors.green}✓ API health check passed${colors.reset}`);
  } catch (parseError) {
    log(`  ${colors.yellow}⚠ API responded but JSON parsing failed: ${parseError.message}${colors.reset}`);
    log(`  Response body: ${response.body.substring(0, 100)}`);
  }
}

async function testApiDocs() {
  log(`${colors.blue}Testing API Documentation...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/docs`);
  
  if (response.statusCode !== 200) {
    throw new Error(`API docs failed with status ${response.statusCode}`);
  }
  
  if (!response.body.includes('swagger') && !response.body.includes('Swagger')) {
    throw new Error('API docs do not contain expected Swagger content');
  }
  
  log(`  ${colors.green}✓ API documentation accessible${colors.reset}`);
}

async function testWebFrontend() {
  log(`${colors.blue}Testing Web Frontend...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.WEB_URL}`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Web frontend failed with status ${response.statusCode}`);
  }
  
  // Check for basic HTML
  if (!response.body.includes('<html') && !response.body.includes('<!DOCTYPE')) {
    throw new Error('Web frontend did not return valid HTML');
  }
  
  log(`  ${colors.green}✓ Web frontend accessible${colors.reset}`);
}

async function testWebHealthPage() {
  log(`${colors.blue}Testing Web Health Page...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.WEB_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Web health page failed with status ${response.statusCode}`);
  }
  
  log(`  ${colors.green}✓ Web health page accessible${colors.reset}`);
}

async function runCIHealthChecks() {
  const startTime = Date.now();
  
  log(`${colors.bold}${colors.blue}🏥 CI Health Check Suite${colors.reset}`);
  log(`${colors.blue}API URL: ${CONFIG.API_URL}${colors.reset}`);
  log(`${colors.blue}Web URL: ${CONFIG.WEB_URL}${colors.reset}`);
  log('');

  // Test basic connectivity first
  log(`${colors.blue}🔍 Testing basic connectivity...${colors.reset}`);
  
  const tests = [
    { name: 'API Health', fn: testApiHealth },
    { name: 'API Documentation', fn: testApiDocs },
    { name: 'Web Frontend', fn: testWebFrontend },
    { name: 'Web Health Page', fn: testWebHealthPage }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await testWithRetry(test.fn, test.name);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  log('');
  log(`${colors.bold}📊 CI Health Check Results:${colors.reset}`);
  log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  log(`⏱️  Duration: ${duration}s`);
  log('');

  if (failed > 0) {
    log(`${colors.red}${colors.bold}❌ Health checks failed!${colors.reset}`);
    
    // Debug information
    log(`${colors.yellow}Debug Information:${colors.reset}`);
    log(`Node.js version: ${process.version}`);
    log(`Platform: ${process.platform}`);
    log(`Architecture: ${process.arch}`);
    log(`Working directory: ${process.cwd()}`);
    
    process.exit(1);
  } else {
    log(`${colors.green}${colors.bold}✅ All CI health checks passed!${colors.reset}`);
    process.exit(0);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  log(`${colors.red}Unhandled Rejection: ${reason}${colors.reset}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`${colors.red}Uncaught Exception: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run the CI health checks
if (require.main === module) {
  runCIHealthChecks().catch((error) => {
    log(`${colors.red}CI health check suite failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  runCIHealthChecks,
  testApiHealth,
  testWebFrontend,
  CONFIG
}; 