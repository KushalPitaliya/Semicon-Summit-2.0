/**
 * Test Setup File for Vitest + React Testing Library
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock window.matchMedia (used by many React components)
global.matchMedia = global.matchMedia || function () {
    return {
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
    };
};

// Mock IntersectionObserver (used for scroll animations)
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Suppress console errors in tests (optional)
global.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
};
