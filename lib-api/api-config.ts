// lib/api-config.ts

/**
 * API Configuration
 * Centralized API endpoints configuration for easy maintenance
 */

// Base URL for the backend API
export const API_BASE_URL = 'https://djongjawa.com/djong-gateway';

// Public key for authentication
export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuAw2LmzUFIwVevG+UvNBC3YVDE4nKtAa88KVyEOUsoJMcvXxTegddCevAJTTWln8IIArqGFltj1eLI3t1th9YBkK39Cgosu7GM44UfiFMl4FrtWsG3QIdT/SrEgMVkxb7DhRIKGnwZXcgfALgsO0Hi/TlUREx36E8tWsoxIyFff3IMby7dscHJ4z/51d9TmTdBzIXJLFQ2p7ZV9iOIE5UdrfD4OtyqXiHCqwAHinP+H/HfaiJagWC/h9rAz/6XXh8hTouMiXZzvk2OBK2iJVkcGTioWK0PQGbCZD3q38oPtWMr/nT1V+z0XOHDX2lXZA3sWxL9AR6YYBseQ87XkARQIDAQAB-----END PUBLIC KEY-----`;

/**
 * API Endpoints
 * All API paths relative to the base URL
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: '/auth/api/auth/login',
    logout: '/auth/api/auth/logout',
    refresh: '/auth/api/auth/refresh',
    me: '/auth/api/auth/me',
  },
  // Add more endpoint categories as needed
  // Example:
  // tours: {
  //   list: '/tours/api/tours',
  //   detail: (id: string) => `/tours/api/tours/${id}`,
  // },
  // bookings: {
  //   list: '/bookings/api/bookings',
  //   create: '/bookings/api/bookings',
  // },
};

/**
 * Helper function to build full API URL
 * @param path - API endpoint path
 * @returns Full API URL
 */
export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'publicKey': PUBLIC_KEY,
};

/**
 * Fetch options with CORS configuration
 */
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  mode: 'cors',
  credentials: 'omit', // Don't send cookies in cross-origin requests
  headers: DEFAULT_HEADERS,
};
