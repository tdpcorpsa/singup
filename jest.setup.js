import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.NEXT_PUBLIC_TDP_API_BASE_URL = 'https://api.test.com';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_LOGIN_URL = 'http://localhost:3000/login';
process.env.NEXT_PUBLIC_PARENT_ORIGIN = '*';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.parent for iframe testing
Object.defineProperty(window, 'parent', {
  value: {
    postMessage: jest.fn()
  },
  writable: true
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});