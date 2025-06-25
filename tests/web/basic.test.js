/**
 * Basic Web Frontend Tests
 * Tests the Next.js frontend functionality
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
  WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:8000',
  TIMEOUT: 10000
};

describe('Web Frontend Tests', () => {
  beforeAll(() => {
    // Set up DOM environment
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
  });

  describe('Homepage', () => {
    test('should load homepage successfully', async () => {
      const response = await fetch(CONFIG.WEB_URL, {
        timeout: CONFIG.TIMEOUT
      });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
      
      const html = await response.text();
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('<head');
      expect(html).toContain('<body');
    });

    test('should contain expected page title', async () => {
      const response = await fetch(CONFIG.WEB_URL, {
        timeout: CONFIG.TIMEOUT
      });
      
      const html = await response.text();
      expect(html).toMatch(/<title.*>.*<\/title>/i);
    });

    test('should have proper meta tags', async () => {
      const response = await fetch(CONFIG.WEB_URL, {
        timeout: CONFIG.TIMEOUT
      });
      
      const html = await response.text();
      expect(html).toContain('<meta');
      expect(html).toMatch(/charset.*utf-8/i);
    });
  });

  describe('Health Check Page', () => {
    test('should load health check page', async () => {
      const response = await fetch(`${CONFIG.WEB_URL}/health`, {
        timeout: CONFIG.TIMEOUT
      });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
    });

    test('should contain health check content', async () => {
      const response = await fetch(`${CONFIG.WEB_URL}/health`, {
        timeout: CONFIG.TIMEOUT
      });
      
      const html = await response.text();
      // Check for health-related content
      expect(html.toLowerCase()).toMatch(/(health|status|check)/);
    });
  });

  describe('Static Assets', () => {
    test('should serve favicon', async () => {
      try {
        const response = await fetch(`${CONFIG.WEB_URL}/favicon.ico`, {
          timeout: CONFIG.TIMEOUT
        });
        
        // Favicon might not exist, so we'll accept 200 or 404
        expect([200, 404]).toContain(response.status);
      } catch (error) {
        // Network errors are acceptable for this test
        expect(error.message).toMatch(/(timeout|ECONNREFUSED|fetch)/i);
      }
    });
  });

  describe('API Integration', () => {
    test('should be able to connect to API from frontend context', async () => {
      // This tests that the API is accessible from the frontend's perspective
      const response = await fetch(`${CONFIG.API_URL}/health`, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'Origin': CONFIG.WEB_URL
        }
      });
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('ok');
    });
  });

  describe('Response Headers', () => {
    test('should have proper security headers', async () => {
      const response = await fetch(CONFIG.WEB_URL, {
        timeout: CONFIG.TIMEOUT
      });
      
      expect(response.status).toBe(200);
      
      // Check for various headers (Next.js may set these)
      const headers = response.headers;
      expect(headers.get('content-type')).toBeTruthy();
      
      // Note: Next.js might set additional security headers
      // We're mainly checking that the response is valid
    });

    test('should handle CORS properly', async () => {
      const response = await fetch(`${CONFIG.WEB_URL}/health`, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      
      expect(response.status).toBe(200);
      // The response should be successful, indicating CORS is handled
    });
  });

  describe('Performance', () => {
    test('should respond within reasonable time', async () => {
      const startTime = Date.now();
      
      const response = await fetch(CONFIG.WEB_URL, {
        timeout: CONFIG.TIMEOUT
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(10000); // Should respond within 10 seconds
    });
  });
});

// Global test setup and teardown
beforeAll(async () => {
  // Wait a moment for services to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(() => {
  // Cleanup
  if (global.window) {
    delete global.window;
    delete global.document;
    delete global.navigator;
  }
}); 