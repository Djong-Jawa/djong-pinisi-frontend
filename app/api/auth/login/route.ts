// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, API_ENDPOINTS, PUBLIC_KEY } from '@/lib-api/api-config';

/**
 * Proxy endpoint for authentication
 * This bypasses CORS by making the request from the server-side
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Make request to backend from server-side (no CORS issues)
    const backendUrl = `${API_BASE_URL}${API_ENDPOINTS.auth.login}`;
    
    console.log('Proxy: Calling backend at:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'publicKey': PUBLIC_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    // Get response data
    const data = await response.json().catch(() => null);

    // If backend returns error status
    if (!response.ok) {
      console.error('Backend error:', response.status, data);
      return NextResponse.json(
        {
          message: data?.message || data?.error || 'Authentication failed',
          error: data
        },
        { status: response.status }
      );
    }

    // Return success response
    console.log('Login successful');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Proxy API Error:', error);
    
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
