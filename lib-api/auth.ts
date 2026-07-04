export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: any;
  message?: string;
  [key: string]: any;
}

/**
 * Login to the backend and get authentication token
 * Uses Next.js API route as proxy to avoid CORS issues
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // Use basePath from environment variable
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    
    // Call our Next.js API route proxy instead of directly calling backend
    // This avoids CORS issues since the API route runs on the server
    const response = await fetch(`${basePath}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Set authentication token in cookie
 */
export function setAuthToken(token: string) {
  // Set cookie with token, expires in 1 day
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);
  
  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Get authentication token from cookie
 */
export function getAuthToken(): string | null {
  if (typeof globalThis.window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

/**
 * Remove authentication token from cookie
 */
export function removeAuthToken() {
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Logout user by removing token and redirecting to login
 */
export function logout() {
  removeAuthToken();
  if (typeof globalThis.window !== 'undefined') {
    window.location.href = process.env.NEXT_PUBLIC_BASE_PATH+'/login';
  }
}
