#!/usr/bin/env node

/**
 * Platform Compatibility Check
 * Verifies that the testing infrastructure works across different operating systems
 */

const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      ...options
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    proc.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkPlatformInfo() {
  log(`${colors.cyan}${colors.bold}🖥️  Platform Information${colors.reset}`);
  log(`Operating System: ${os.type()} ${os.release()}`);
  log(`Architecture: ${os.arch()}`);
  log(`Platform: ${os.platform()}`);
  log(`Node.js Version: ${process.version}`);
  log(`Working Directory: ${process.cwd()}`);
  log('');
}

async function checkPathHandling() {
  log(`${colors.blue}📁 Testing Path Handling${colors.reset}`);
  
  const testPaths = [
    path.join('tests', 'health-check.js'),
    path.join('tests', 'integration', 'run-tests.js'),
    path.join('apps', 'api', 'app', 'main.py'),
    path.join('apps', 'web', 'package.json')
  ];
  
  let pathTests = 0;
  let pathPassed = 0;
  
  for (const testPath of testPaths) {
    pathTests++;
    if (fs.existsSync(testPath)) {
      log(`  ${colors.green}✓${colors.reset} ${testPath} exists`);
      pathPassed++;
    } else {
      log(`  ${colors.red}✗${colors.reset} ${testPath} not found`);
    }
  }
  
  log(`Path Tests: ${colors.green}${pathPassed}/${pathTests} passed${colors.reset}\n`);
  return pathPassed === pathTests;
}

async function checkNodeCommands() {
  log(`${colors.blue}🟢 Testing Node.js Commands${colors.reset}`);
  
  const nodeCommands = [
    { cmd: 'node', args: ['--version'], name: 'Node.js' },
    { cmd: 'npm', args: ['--version'], name: 'npm' }
  ];
  
  let nodeTests = 0;
  let nodePassed = 0;
  
  for (const { cmd, args, name } of nodeCommands) {
    nodeTests++;
    try {
      const result = await runCommand(cmd, args);
      if (result.code === 0) {
        const version = result.stdout.trim();
        log(`  ${colors.green}✓${colors.reset} ${name}: ${version}`);
        nodePassed++;
      } else {
        log(`  ${colors.red}✗${colors.reset} ${name}: Failed (exit code ${result.code})`);
      }
    } catch (error) {
      log(`  ${colors.red}✗${colors.reset} ${name}: ${error.message}`);
    }
  }
  
  log(`Node.js Tests: ${colors.green}${nodePassed}/${nodeTests} passed${colors.reset}\n`);
  return nodePassed === nodeTests;
}

async function checkPythonCommands() {
  log(`${colors.blue}🐍 Testing Python Commands${colors.reset}`);
  
  const pythonCommands = [
    { cmd: 'python', args: ['--version'], name: 'Python' },
    { cmd: 'python3', args: ['--version'], name: 'Python3' },
    { cmd: 'pip', args: ['--version'], name: 'pip' },
    { cmd: 'poetry', args: ['--version'], name: 'Poetry' }
  ];
  
  let pythonTests = 0;
  let pythonPassed = 0;
  
  for (const { cmd, args, name } of pythonCommands) {
    pythonTests++;
    try {
      const result = await runCommand(cmd, args);
      if (result.code === 0) {
        const version = result.stdout.trim() || result.stderr.trim();
        log(`  ${colors.green}✓${colors.reset} ${name}: ${version}`);
        pythonPassed++;
      } else {
        log(`  ${colors.yellow}⚠${colors.reset} ${name}: Not available or failed`);
      }
    } catch (error) {
      log(`  ${colors.yellow}⚠${colors.reset} ${name}: ${error.message}`);
    }
  }
  
  log(`Python Tests: ${colors.green}${pythonPassed}/${pythonTests} available${colors.reset}\n`);
  return pythonPassed > 0; // At least one Python installation should be available
}

async function checkDockerCommands() {
  log(`${colors.blue}🐳 Testing Docker Commands${colors.reset}`);
  
  const dockerCommands = [
    { cmd: 'docker', args: ['--version'], name: 'Docker' },
    { cmd: 'docker', args: ['compose', 'version'], name: 'Docker Compose' }
  ];
  
  let dockerTests = 0;
  let dockerPassed = 0;
  
  for (const { cmd, args, name } of dockerCommands) {
    dockerTests++;
    try {
      const result = await runCommand(cmd, args);
      if (result.code === 0) {
        const version = result.stdout.trim();
        log(`  ${colors.green}✓${colors.reset} ${name}: ${version}`);
        dockerPassed++;
      } else {
        log(`  ${colors.red}✗${colors.reset} ${name}: Failed (exit code ${result.code})`);
      }
    } catch (error) {
      log(`  ${colors.red}✗${colors.reset} ${name}: ${error.message}`);
    }
  }
  
  log(`Docker Tests: ${colors.green}${dockerPassed}/${dockerTests} passed${colors.reset}\n`);
  return dockerPassed === dockerTests;
}

async function checkEnvironmentVariables() {
  log(`${colors.blue}🌍 Testing Environment Variables${colors.reset}`);
  
  const envVars = [
    'PATH',
    'HOME',
    'NODE_ENV'
  ];
  
  let envTests = 0;
  let envPassed = 0;
  
  for (const envVar of envVars) {
    envTests++;
    const value = process.env[envVar];
    if (value) {
      log(`  ${colors.green}✓${colors.reset} ${envVar}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
      envPassed++;
    } else {
      log(`  ${colors.yellow}⚠${colors.reset} ${envVar}: Not set`);
    }
  }
  
  log(`Environment Tests: ${colors.green}${envPassed}/${envTests} passed${colors.reset}\n`);
  return true; // Environment variables are optional
}

async function checkFilePermissions() {
  log(`${colors.blue}🔐 Testing File Permissions${colors.reset}`);
  
  const testFiles = [
    'run-tests.js',
    'tests/health-check.js',
    'tests/integration/run-tests.js'
  ];
  
  let permTests = 0;
  let permPassed = 0;
  
  for (const testFile of testFiles) {
    permTests++;
    try {
      fs.accessSync(testFile, fs.constants.R_OK);
      log(`  ${colors.green}✓${colors.reset} ${testFile}: Readable`);
      permPassed++;
    } catch (error) {
      log(`  ${colors.red}✗${colors.reset} ${testFile}: ${error.message}`);
    }
  }
  
  log(`Permission Tests: ${colors.green}${permPassed}/${permTests} passed${colors.reset}\n`);
  return permPassed === permTests;
}

async function checkShellCompatibility() {
  log(`${colors.blue}🐚 Testing Shell Compatibility${colors.reset}`);
  
  const shellCommands = [
    { cmd: 'echo', args: ['Hello World'], name: 'Echo Command' }
  ];
  
  // Platform-specific commands
  if (os.platform() === 'win32') {
    shellCommands.push({ cmd: 'dir', args: ['.'], name: 'Directory Listing (Windows)' });
  } else {
    shellCommands.push({ cmd: 'ls', args: ['.'], name: 'Directory Listing (Unix)' });
  }
  
  let shellTests = 0;
  let shellPassed = 0;
  
  for (const { cmd, args, name } of shellCommands) {
    shellTests++;
    try {
      const result = await runCommand(cmd, args);
      if (result.code === 0) {
        log(`  ${colors.green}✓${colors.reset} ${name}: Working`);
        shellPassed++;
      } else {
        log(`  ${colors.red}✗${colors.reset} ${name}: Failed`);
      }
    } catch (error) {
      log(`  ${colors.red}✗${colors.reset} ${name}: ${error.message}`);
    }
  }
  
  log(`Shell Tests: ${colors.green}${shellPassed}/${shellTests} passed${colors.reset}\n`);
  return shellPassed === shellTests;
}

async function runPlatformCompatibilityCheck() {
  const startTime = Date.now();
  
  log(`${colors.bold}${colors.cyan}🔍 Platform Compatibility Check${colors.reset}`);
  log(`${colors.cyan}Ensuring cross-platform testing compatibility${colors.reset}\n`);
  
  await checkPlatformInfo();
  
  const tests = [
    { name: 'Path Handling', fn: checkPathHandling },
    { name: 'Node.js Commands', fn: checkNodeCommands },
    { name: 'Python Commands', fn: checkPythonCommands },
    { name: 'Docker Commands', fn: checkDockerCommands },
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'File Permissions', fn: checkFilePermissions },
    { name: 'Shell Compatibility', fn: checkShellCompatibility }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, status: passed ? 'PASSED' : 'FAILED' });
    } catch (error) {
      log(`${colors.red}Error in ${test.name}: ${error.message}${colors.reset}\n`);
      results.push({ name: test.name, status: 'ERROR', error: error.message });
    }
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  log(`${colors.bold}${colors.cyan}📊 Platform Compatibility Results${colors.reset}`);
  log(`${'='.repeat(50)}`);
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    const status = result.status === 'PASSED' 
      ? `${colors.green}✓ PASSED${colors.reset}` 
      : result.status === 'FAILED'
      ? `${colors.yellow}⚠ FAILED${colors.reset}`
      : `${colors.red}✗ ERROR${colors.reset}`;
    
    log(`${result.name}: ${status}`);
    
    if (result.error) {
      log(`  Error: ${result.error}`);
    }
    
    if (result.status === 'PASSED') {
      passed++;
    } else {
      failed++;
    }
  });
  
  log('');
  log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  log(`${colors.yellow}⚠ Failed/Error: ${failed}${colors.reset}`);
  log(`⏱️  Duration: ${duration}s`);
  log('');
  
  if (passed >= 5) { // Require most tests to pass
    log(`${colors.green}${colors.bold}✅ Platform compatibility check passed!${colors.reset}`);
    log(`${colors.green}This system should be able to run the test suite successfully.${colors.reset}`);
  } else {
    log(`${colors.yellow}${colors.bold}⚠️  Platform compatibility issues detected!${colors.reset}`);
    log(`${colors.yellow}Some features may not work as expected. Consider installing missing dependencies.${colors.reset}`);
  }
  
  return passed >= 5;
}

// Run the platform compatibility check
if (require.main === module) {
  runPlatformCompatibilityCheck().catch((error) => {
    log(`${colors.red}Platform compatibility check failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  runPlatformCompatibilityCheck,
  checkPlatformInfo,
  checkPathHandling,
  checkNodeCommands,
  checkPythonCommands,
  checkDockerCommands
}; 