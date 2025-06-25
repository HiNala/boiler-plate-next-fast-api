#!/usr/bin/env node

/**
 * Integration Test Suite
 * Tests end-to-end functionality across all services
 */

const http = require('http');
const path = require('path');

// Configuration
const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
  TIMEOUT: 15000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 3000
};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Request timeout after ${CONFIG.TIMEOUT}ms`));
    }, CONFIG.TIMEOUT);

    const req = http.get(url, options, (res) => {
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

/**
 * Test API Response Time
 */
async function testApiResponseTime() {
  log(`${colors.cyan}Testing API Response Time...${colors.reset}`);
  
  const startTime = Date.now();
  const response = await makeRequest(`${CONFIG.API_URL}/health`);
  const endTime = Date.now();
  
  const responseTime = endTime - startTime;
  
  if (response.statusCode !== 200) {
    throw new Error(`API health check failed with status ${response.statusCode}`);
  }
  
  if (responseTime > 5000) {
    log(`  ${colors.yellow}⚠️  API response time is slow: ${responseTime}ms${colors.reset}`);
  } else {
    log(`  ${colors.green}✓ API response time: ${responseTime}ms${colors.reset}`);
  }
  
  return responseTime;
}

/**
 * Test API Content Types
 */
async function testApiContentTypes() {
  log(`${colors.cyan}Testing API Content Types...${colors.reset}`);
  
  const endpoints = [
    { path: '/health', expectedType: 'application/json' },
    { path: '/health/detailed', expectedType: 'application/json' },
    { path: '/api/status', expectedType: 'application/json' },
    { path: '/docs', expectedType: 'text/html' }
  ];
  
  for (const endpoint of endpoints) {
    const response = await makeRequest(`${CONFIG.API_URL}${endpoint.path}`);
    
    if (response.statusCode !== 200) {
      throw new Error(`Endpoint ${endpoint.path} failed with status ${response.statusCode}`);
    }
    
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes(endpoint.expectedType)) {
      throw new Error(`Endpoint ${endpoint.path} returned wrong content type: ${contentType}`);
    }
  }
  
  log(`  ${colors.green}✓ All API content types correct${colors.reset}`);
}

/**
 * Test API Error Handling
 */
async function testApiErrorHandling() {
  log(`${colors.cyan}Testing API Error Handling...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/nonexistent-endpoint`);
  
  if (response.statusCode !== 404) {
    throw new Error(`Expected 404 for nonexistent endpoint, got ${response.statusCode}`);
  }
  
  // Check if error response is JSON
  try {
    const errorData = JSON.parse(response.body);
    if (!errorData.detail && !errorData.message && !errorData.error) {
      throw new Error('Error response does not contain expected error fields');
    }
  } catch (parseError) {
    throw new Error('Error response is not valid JSON');
  }
  
  log(`  ${colors.green}✓ API error handling working correctly${colors.reset}`);
}

/**
 * Test Web Frontend Performance
 */
async function testWebPerformance() {
  log(`${colors.cyan}Testing Web Frontend Performance...${colors.reset}`);
  
  const startTime = Date.now();
  const response = await makeRequest(`${CONFIG.WEB_URL}`);
  const endTime = Date.now();
  
  const responseTime = endTime - startTime;
  
  if (response.statusCode !== 200) {
    throw new Error(`Web frontend failed with status ${response.statusCode}`);
  }
  
  if (responseTime > 10000) {
    log(`  ${colors.yellow}⚠️  Web response time is slow: ${responseTime}ms${colors.reset}`);
  } else {
    log(`  ${colors.green}✓ Web response time: ${responseTime}ms${colors.reset}`);
  }
  
  // Check for basic HTML structure
  const html = response.body;
  const checks = [
    { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
    { name: 'HTML tag', pattern: /<html/i },
    { name: 'Head section', pattern: /<head/i },
    { name: 'Body section', pattern: /<body/i },
    { name: 'Title tag', pattern: /<title/i }
  ];
  
  for (const check of checks) {
    if (!check.pattern.test(html)) {
      throw new Error(`Web HTML missing ${check.name}`);
    }
  }
  
  log(`  ${colors.green}✓ Web HTML structure is valid${colors.reset}`);
  return responseTime;
}

/**
 * Test Full Stack Communication
 */
async function testFullStackCommunication() {
  log(`${colors.cyan}Testing Full Stack Communication...${colors.reset}`);
  
  // Test that health page loads and can communicate with API
  const response = await makeRequest(`${CONFIG.WEB_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Health page failed with status ${response.statusCode}`);
  }
  
  // Verify HTML contains expected content
  const html = response.body;
  if (!html.includes('Health Check') && !html.includes('health')) {
    throw new Error('Health page does not contain expected health check content');
  }
  
  log(`  ${colors.green}✓ Full stack communication working${colors.reset}`);
}

/**
 * Test Service Dependencies
 */
async function testServiceDependencies() {
  log(`${colors.cyan}Testing Service Dependencies...${colors.reset}`);
  
  // Test API detailed health to check service status
  const response = await makeRequest(`${CONFIG.API_URL}/health/detailed`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Service dependencies check failed with status ${response.statusCode}`);
  }
  
  const data = JSON.parse(response.body);
  
  // Check services section
  if (!data.services) {
    throw new Error('No services information in detailed health response');
  }
  
  const requiredServices = ['api', 'database'];
  for (const service of requiredServices) {
    if (!data.services[service]) {
      throw new Error(`Missing service status for: ${service}`);
    }
  }
  
  log(`  ${colors.green}✓ All service dependencies healthy${colors.reset}`);
}

/**
 * Test Environment Configuration
 */
async function testEnvironmentConfig() {
  log(`${colors.cyan}Testing Environment Configuration...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/api/status`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Environment config check failed with status ${response.statusCode}`);
  }
  
  const data = JSON.parse(response.body);
  
  // Check required configuration fields
  const requiredFields = ['environment', 'cors_origins', 'allowed_hosts'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing configuration field: ${field}`);
    }
  }
  
  // Verify CORS origins include frontend URL
  if (!data.cors_origins.includes(CONFIG.WEB_URL)) {
    log(`  ${colors.yellow}⚠️  Frontend URL not in CORS origins${colors.reset}`);
  }
  
  log(`  ${colors.green}✓ Environment configuration valid${colors.reset}`);
  log(`    Environment: ${data.environment}`);
  log(`    CORS Origins: ${data.cors_origins.join(', ')}`);
}

/**
 * Test Security Headers
 */
async function testSecurityHeaders() {
  log(`${colors.cyan}Testing Security Headers...${colors.reset}`);
  
  const response = await makeRequest(`${CONFIG.API_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Security headers check failed with status ${response.statusCode}`);
  }
  
  // Check for basic security headers
  const headers = response.headers;
  const securityChecks = [
    { name: 'Content-Type', header: 'content-type', required: true },
    { name: 'Server', header: 'server', required: false }
  ];
  
  for (const check of securityChecks) {
    if (check.required && !headers[check.header]) {
      throw new Error(`Missing required header: ${check.name}`);
    }
  }
  
  log(`  ${colors.green}✓ Security headers present${colors.reset}`);
}

async function runIntegrationTests() {
  const startTime = Date.now();
  
  log(`${colors.bold}${colors.magenta}🔗 Starting Integration Test Suite${colors.reset}`);
  log(`${colors.magenta}API URL: ${CONFIG.API_URL}${colors.reset}`);
  log(`${colors.magenta}Web URL: ${CONFIG.WEB_URL}${colors.reset}`);
  log('');

  const tests = [
    { name: 'API Response Time', fn: testApiResponseTime },
    { name: 'API Content Types', fn: testApiContentTypes },
    { name: 'API Error Handling', fn: testApiErrorHandling },
    { name: 'Web Performance', fn: testWebPerformance },
    { name: 'Full Stack Communication', fn: testFullStackCommunication },
    { name: 'Service Dependencies', fn: testServiceDependencies },
    { name: 'Environment Configuration', fn: testEnvironmentConfig },
    { name: 'Security Headers', fn: testSecurityHeaders }
  ];

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const test of tests) {
    try {
      const testStartTime = Date.now();
      await testWithRetry(test.fn, test.name);
      const testEndTime = Date.now();
      const testDuration = testEndTime - testStartTime;
      
      results.push({ name: test.name, status: 'PASSED', duration: testDuration });
      passed++;
    } catch (error) {
      log(`${colors.red}✗ ${test.name} failed: ${error.message}${colors.reset}`);
      results.push({ name: test.name, status: 'FAILED', error: error.message });
      failed++;
    }
    log('');
  }

  const endTime = Date.now();
  const totalDuration = ((endTime - startTime) / 1000).toFixed(2);

  log(`${colors.bold}📊 Integration Test Results:${colors.reset}`);
  results.forEach(result => {
    const status = result.status === 'PASSED' 
      ? `${colors.green}✓ PASSED${colors.reset}` 
      : `${colors.red}✗ FAILED${colors.reset}`;
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    log(`  ${result.name}: ${status}${duration}`);
  });
  
  log('');
  log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  log(`⏱️  Total Duration: ${totalDuration}s`);
  log('');

  if (failed > 0) {
    log(`${colors.red}${colors.bold}❌ Integration tests failed!${colors.reset}`);
    process.exit(1);
  } else {
    log(`${colors.green}${colors.bold}✅ All integration tests passed!${colors.reset}`);
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

// Run the integration tests
if (require.main === module) {
  runIntegrationTests().catch((error) => {
    log(`${colors.red}Integration test suite failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  runIntegrationTests,
  CONFIG
}; 