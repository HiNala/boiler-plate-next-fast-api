"""
Basic API Tests for FastAPI Backend
Tests core functionality of the API endpoints
"""

import pytest
import requests
import json
import os
from datetime import datetime
from typing import Dict, Any

# Configuration
BASE_URL = os.environ.get('API_URL', 'http://localhost:8000')
TIMEOUT = 10  # seconds


class TestAPIHealth:
    """Test API health endpoints"""
    
    def test_health_endpoint(self):
        """Test basic health endpoint"""
        response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert data['status'] == 'ok'
        assert 'timestamp' in data
        
        # Verify timestamp is recent (within last minute)
        timestamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
        now = datetime.now(timestamp.tzinfo)
        assert (now - timestamp).total_seconds() < 60
    
    def test_detailed_health_endpoint(self):
        """Test detailed health endpoint"""
        response = requests.get(f"{BASE_URL}/health/detailed", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert data['status'] == 'healthy'
        
        # Check required fields
        required_fields = [
            'timestamp', 'version', 'python_version', 
            'platform', 'architecture', 'system', 'services', 'endpoints'
        ]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        # Check system metrics
        system = data['system']
        assert isinstance(system['cpu_percent'], (int, float))
        assert isinstance(system['memory_percent'], (int, float))
        assert isinstance(system['disk_percent'], (int, float))
        
        # Check services
        services = data['services']
        assert services['api'] == 'running'
        assert 'database' in services
        assert 'cors' in services
        assert 'security' in services
        
        # Check endpoints
        endpoints = data['endpoints']
        assert endpoints['health'] == '/health'
        assert endpoints['docs'] == '/docs'


class TestAPIStatus:
    """Test API status endpoint"""
    
    def test_status_endpoint(self):
        """Test API status endpoint"""
        response = requests.get(f"{BASE_URL}/api/status", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert data['api_status'] == 'operational'
        assert 'timestamp' in data
        assert 'cors_origins' in data
        assert 'allowed_hosts' in data
        assert 'environment' in data
        
        # Verify data types
        assert isinstance(data['cors_origins'], list)
        assert isinstance(data['allowed_hosts'], list)
        assert isinstance(data['environment'], str)


class TestAPIDocumentation:
    """Test API documentation endpoints"""
    
    def test_docs_endpoint(self):
        """Test Swagger UI documentation"""
        response = requests.get(f"{BASE_URL}/docs", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert 'text/html' in response.headers['content-type']
        assert 'Swagger UI' in response.text
        assert 'openapi.json' in response.text
    
    def test_redoc_endpoint(self):
        """Test ReDoc documentation"""
        response = requests.get(f"{BASE_URL}/redoc", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert 'text/html' in response.headers['content-type']
        assert 'ReDoc' in response.text
    
    def test_openapi_json(self):
        """Test OpenAPI JSON schema"""
        response = requests.get(f"{BASE_URL}/openapi.json", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert data['openapi'].startswith('3.')
        assert 'info' in data
        assert 'paths' in data
        
        # Check that our endpoints are documented
        paths = data['paths']
        assert '/health' in paths
        assert '/health/detailed' in paths
        assert '/api/status' in paths


class TestAPIRoot:
    """Test API root endpoint"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = requests.get(f"{BASE_URL}/", timeout=TIMEOUT)
        
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert 'message' in data
        assert 'api_name' in data
        assert 'version' in data
        assert 'docs_url' in data
        assert 'health_url' in data


class TestAPIErrorHandling:
    """Test API error handling"""
    
    def test_404_endpoint(self):
        """Test 404 error handling"""
        response = requests.get(f"{BASE_URL}/nonexistent-endpoint", timeout=TIMEOUT)
        
        assert response.status_code == 404
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert 'detail' in data
    
    def test_method_not_allowed(self):
        """Test 405 method not allowed"""
        response = requests.post(f"{BASE_URL}/health", timeout=TIMEOUT)
        
        assert response.status_code == 405
        assert response.headers['content-type'] == 'application/json'
        
        data = response.json()
        assert 'detail' in data


class TestAPIResponseHeaders:
    """Test API response headers"""
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = requests.get(
            f"{BASE_URL}/health",
            headers={'Origin': 'http://localhost:3000'},
            timeout=TIMEOUT
        )
        
        assert response.status_code == 200
        # CORS headers should be present for cross-origin requests
        # Note: actual CORS headers depend on the frontend origin
    
    def test_content_type_headers(self):
        """Test content-type headers are correct"""
        endpoints = [
            ('/health', 'application/json'),
            ('/health/detailed', 'application/json'),
            ('/api/status', 'application/json'),
            ('/docs', 'text/html'),
            ('/', 'application/json')
        ]
        
        for endpoint, expected_type in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=TIMEOUT)
            assert response.status_code == 200
            assert expected_type in response.headers['content-type']


class TestAPIPerformance:
    """Test API performance characteristics"""
    
    def test_response_time_health(self):
        """Test health endpoint response time"""
        import time
        
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        end_time = time.time()
        
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        assert response.status_code == 200
        assert response_time < 5000  # Should respond within 5 seconds
    
    def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        import concurrent.futures
        import time
        
        def make_request():
            return requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        
        start_time = time.time()
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [future.result() for future in futures]
        end_time = time.time()
        
        # All requests should succeed
        for response in results:
            assert response.status_code == 200
        
        # Should handle 10 concurrent requests reasonably quickly
        total_time = end_time - start_time
        assert total_time < 30  # Should complete within 30 seconds


# Test configuration and fixtures
@pytest.fixture(scope="session", autouse=True)
def check_api_availability():
    """Check that the API is available before running tests"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            pytest.skip(f"API not available at {BASE_URL}")
    except requests.exceptions.RequestException:
        pytest.skip(f"API not available at {BASE_URL}")


if __name__ == "__main__":
    # Run tests directly
    pytest.main([__file__, "-v"]) 