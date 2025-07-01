// setupTests.ts
import '@testing-library/jest-dom';

// Mock HTMLAnchorElement.click to prevent JSDom navigation errors
HTMLAnchorElement.prototype.click = jest.fn();

// Mock window.URL.createObjectURL if needed
global.window.URL.createObjectURL = jest.fn();

// Suppress JSDom navigation errors
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      (args[0].toString().includes('Not implemented: navigation') ||
        (typeof args[0] === 'object' && args[0].message && args[0].message.includes('Not implemented: navigation')))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
