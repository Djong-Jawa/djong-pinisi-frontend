// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login'];

// Define paths that should be accessible without auth (like static assets, API routes for login, etc.)
const publicPaths = ['/api/auth/login', '/api', '/_next', '/favicon.ico', '/public'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Allow access to public paths and routes
  if (isPublicPath || isPublicRoute) {
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Add redirect parameter to return to the original page after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If token exists and trying to access login page, redirect to dashboard
  if (token && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
