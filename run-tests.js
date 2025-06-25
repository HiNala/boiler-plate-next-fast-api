#!/usr/bin/env node

/**
 * Comprehensive Test Runner
 * Runs all test suites for the full-stack application
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 5000
};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  underline: '\x1b[4m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on('error', (error) => {
      reject(error);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkServices() {
  log(`${colors.blue}🔍 Checking if services are running...${colors.reset}`);
  
  const http = require('http');
  
  const checkService = (url, name) => {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  };

  const apiHealthy = await checkService(`${CONFIG.API_URL}/health`, 'API');
  const webHealthy = await checkService(`${CONFIG.WEB_URL}`, 'Web');

  if (!apiHealthy) {
    log(`${colors.yellow}⚠️  API not responding at ${CONFIG.API_URL}${colors.reset}`);
    log(`${colors.yellow}   Make sure to run: npm run dev${colors.reset}`);
  } else {
    log(`${colors.green}✓ API is running at ${CONFIG.API_URL}${colors.reset}`);
  }

  if (!webHealthy) {
    log(`${colors.yellow}⚠️  Web frontend not responding at ${CONFIG.WEB_URL}${colors.reset}`);
    log(`${colors.yellow}   Make sure to run: npm run dev${colors.reset}`);
  } else {
    log(`${colors.green}✓ Web frontend is running at ${CONFIG.WEB_URL}${colors.reset}`);
  }

  return { apiHealthy, webHealthy };
}

async function runHealthChecks() {
  log(`${colors.cyan}${colors.bold}🏥 Running Health Checks${colors.reset}`);
  
  try {
    await runCommand('node', ['tests/health-check.js'], {
      env: { ...process.env, API_URL: CONFIG.API_URL, WEB_URL: CONFIG.WEB_URL }
    });
    log(`${colors.green}✅ Health checks passed${colors.reset}\n`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ Health checks failed: ${error.message}${colors.reset}\n`);
    return false;
  }
}

async function runIntegrationTests() {
  log(`${colors.magenta}${colors.bold}🔗 Running Integration Tests${colors.reset}`);
  
  try {
    await runCommand('node', ['tests/integration/run-tests.js'], {
      env: { ...process.env, API_URL: CONFIG.API_URL, WEB_URL: CONFIG.WEB_URL }
    });
    log(`${colors.green}✅ Integration tests passed${colors.reset}\n`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ Integration tests failed: ${error.message}${colors.reset}\n`);
    return false;
  }
}

async function runApiTests() {
  log(`${colors.blue}${colors.bold}🐍 Running API Tests (Python/pytest)${colors.reset}`);
  
  try {
    // Check if we can run pytest
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    
    await runCommand(pythonCommand, ['-m', 'pytest', 'tests/api/', '-v'], {
      env: { ...process.env, API_URL: CONFIG.API_URL },
      cwd: process.cwd()
    });
    log(`${colors.green}✅ API tests passed${colors.reset}\n`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ API tests failed: ${error.message}${colors.reset}`);
    log(`${colors.yellow}💡 Try installing pytest: pip install pytest requests python-dateutil${colors.reset}\n`);
    return false;
  }
}

async function runWebTests() {
  log(`${colors.green}${colors.bold}🌐 Running Web Tests (Jest)${colors.reset}`);
  
  try {
    // Check if we're in the web tests directory or need to install dependencies
    const webTestsDir = path.join(process.cwd(), 'tests', 'web');
    
    if (!fs.existsSync(path.join(webTestsDir, 'node_modules'))) {
      log(`${colors.yellow}📦 Installing web test dependencies...${colors.reset}`);
      await runCommand('npm', ['install', '--no-save'], { cwd: webTestsDir });
    }
    
    await runCommand('npm', ['test'], {
      env: { ...process.env, API_URL: CONFIG.API_URL, WEB_URL: CONFIG.WEB_URL },
      cwd: webTestsDir
    });
    log(`${colors.green}✅ Web tests passed${colors.reset}\n`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ Web tests failed: ${error.message}${colors.reset}\n`);
    return false;
  }
}

async function runLinting() {
  log(`${colors.cyan}${colors.bold}🔍 Running Linting${colors.reset}`);
  
  let lintResults = [];
  
  // Lint API (Python)
  try {
    log(`${colors.cyan}Linting API (Python)...${colors.reset}`);
    await runCommand('cd', ['apps/api && poetry run ruff check .'], { shell: true });
    lintResults.push({ name: 'API (Python)', status: 'passed' });
  } catch (error) {
    log(`${colors.yellow}⚠️  API linting issues found${colors.reset}`);
    lintResults.push({ name: 'API (Python)', status: 'failed', error: error.message });
  }
  
  // Lint Web (ESLint)
  try {
    log(`${colors.cyan}Linting Web (ESLint)...${colors.reset}`);
    await runCommand('cd', ['apps/web && npm run lint'], { shell: true });
    lintResults.push({ name: 'Web (ESLint)', status: 'passed' });
  } catch (error) {
    log(`${colors.yellow}⚠️  Web linting issues found${colors.reset}`);
    lintResults.push({ name: 'Web (ESLint)', status: 'failed', error: error.message });
  }
  
  const lintPassed = lintResults.filter(r => r.status === 'passed').length;
  const lintFailed = lintResults.filter(r => r.status === 'failed').length;
  
  log(`${colors.cyan}Linting Summary: ${colors.green}${lintPassed} passed${colors.reset}, ${colors.red}${lintFailed} failed${colors.reset}\n`);
  
  return lintFailed === 0;
}

async function runAllTests() {
  const startTime = Date.now();
  
  log(`${colors.bold}${colors.white}🚀 Full-Stack Test Suite Runner${colors.reset}`);
  log(`${colors.white}API URL: ${CONFIG.API_URL}${colors.reset}`);
  log(`${colors.white}Web URL: ${CONFIG.WEB_URL}${colors.reset}`);
  log(`${colors.white}Timeout: ${CONFIG.TIMEOUT}ms${colors.reset}`);
  log('');

  // Check if services are running
  const { apiHealthy, webHealthy } = await checkServices();
  log('');

  const results = [];

  // Run tests in order
  const testSuites = [
    { name: 'Health Checks', fn: runHealthChecks, required: true },
    { name: 'Integration Tests', fn: runIntegrationTests, required: true },
    { name: 'API Tests', fn: runApiTests, required: false },
    { name: 'Web Tests', fn: runWebTests, required: false },
    { name: 'Linting', fn: runLinting, required: false }
  ];

  for (const suite of testSuites) {
    try {
      const suiteStartTime = Date.now();
      const passed = await suite.fn();
      const suiteEndTime = Date.now();
      const duration = suiteEndTime - suiteStartTime;
      
      results.push({
        name: suite.name,
        status: passed ? 'PASSED' : 'FAILED',
        duration,
        required: suite.required
      });
    } catch (error) {
      results.push({
        name: suite.name,
        status: 'ERROR',
        error: error.message,
        required: suite.required
      });
    }
  }

  // Summary
  const endTime = Date.now();
  const totalDuration = ((endTime - startTime) / 1000).toFixed(2);

  log(`${colors.bold}${colors.white}📊 Test Suite Summary${colors.reset}`);
  log(`${colors.white}${'='.repeat(50)}${colors.reset}`);

  let totalPassed = 0;
  let totalFailed = 0;
  let requiredFailed = 0;

  results.forEach(result => {
    const status = result.status === 'PASSED' 
      ? `${colors.green}✓ PASSED${colors.reset}` 
      : result.status === 'FAILED'
      ? `${colors.red}✗ FAILED${colors.reset}`
      : `${colors.yellow}⚠ ERROR${colors.reset}`;
    
    const duration = result.duration ? ` (${(result.duration / 1000).toFixed(2)}s)` : '';
    const required = result.required ? ' [REQUIRED]' : ' [OPTIONAL]';
    
    log(`${result.name}${required}: ${status}${duration}`);
    
    if (result.error) {
      log(`  Error: ${result.error}`);
    }
    
    if (result.status === 'PASSED') {
      totalPassed++;
    } else {
      totalFailed++;
      if (result.required) {
        requiredFailed++;
      }
    }
  });

  log('');
  log(`${colors.green}✓ Passed: ${totalPassed}${colors.reset}`);
  log(`${colors.red}✗ Failed: ${totalFailed}${colors.reset}`);
  log(`${colors.red}✗ Required Failed: ${requiredFailed}${colors.reset}`);
  log(`⏱️  Total Duration: ${totalDuration}s`);
  log('');

  if (requiredFailed > 0) {
    log(`${colors.red}${colors.bold}❌ Test suite failed! ${requiredFailed} required test(s) failed.${colors.reset}`);
    log(`${colors.yellow}💡 Make sure all services are running with: npm run dev${colors.reset}`);
    process.exit(1);
  } else if (totalFailed > 0) {
    log(`${colors.yellow}${colors.bold}⚠️  Test suite completed with ${totalFailed} optional test(s) failed.${colors.reset}`);
    process.exit(0);
  } else {
    log(`${colors.green}${colors.bold}✅ All tests passed!${colors.reset}`);
    process.exit(0);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log(`${colors.bold}Full-Stack Test Suite Runner${colors.reset}`);
  log('');
  log('Usage: node run-tests.js [options]');
  log('');
  log('Options:');
  log('  --health-only    Run only health checks');
  log('  --integration    Run only integration tests');
  log('  --api-only       Run only API tests');
  log('  --web-only       Run only web tests');
  log('  --lint-only      Run only linting');
  log('  --no-services    Skip service availability check');
  log('  --help, -h       Show this help message');
  log('');
  log('Environment Variables:');
  log('  API_URL          API base URL (default: http://localhost:8000)');
  log('  WEB_URL          Web base URL (default: http://localhost:3000)');
  log('');
  process.exit(0);
}

// Handle specific test runs
if (args.includes('--health-only')) {
  runHealthChecks().then(passed => process.exit(passed ? 0 : 1));
} else if (args.includes('--integration')) {
  runIntegrationTests().then(passed => process.exit(passed ? 0 : 1));
} else if (args.includes('--api-only')) {
  runApiTests().then(passed => process.exit(passed ? 0 : 1));
} else if (args.includes('--web-only')) {
  runWebTests().then(passed => process.exit(passed ? 0 : 1));
} else if (args.includes('--lint-only')) {
  runLinting().then(passed => process.exit(passed ? 0 : 1));
} else {
  // Run all tests
  runAllTests().catch((error) => {
    log(`${colors.red}Test runner failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
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