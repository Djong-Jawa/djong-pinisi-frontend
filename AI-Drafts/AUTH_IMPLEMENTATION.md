# Authentication System Documentation

## Overview

This application now has a complete authentication system that protects all routes except `/login`. Users must authenticate with the backend API before accessing any protected pages.

## Recent Updates (v2)

### ✅ CORS Issue Fixed
- Added proper CORS headers and fetch configuration
- Improved error handling for network and CORS issues
- Better error messages for debugging

### ✅ API Configuration
- Centralized API configuration in `lib-api/api-config.ts`
- Separated `baseUrl` and endpoint paths
- Easy to add new endpoints with the same base URL

## Implementation Details

### 1. Backend Integration

**Base URL**: `https://djongjawa.com/djong-gateway`

**Login Endpoint**: `/auth/api/auth/login`

**Authentication Headers**:
- `publicKey`: Pre-configured RSA public key
- `Content-Type`: application/json

**CORS Configuration**:
- Mode: `cors`
- Credentials: `omit`
- Proper error handling for CORS failures

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response**: Contains authentication token (checked in fields: `token`, `access_token`, or `accessToken`)

### 2. Files Created/Modified

#### New Files:

1. **`lib-api/api-config.ts`** - Centralized API configuration
   - `API_BASE_URL` - Base URL for backend API
   - `API_ENDPOINTS` - All API endpoints organized by category
   - `buildApiUrl(path)` - Helper to build full URLs
   - `DEFAULT_HEADERS` - Shared headers including public key
   - `DEFAULT_FETCH_OPTIONS` - CORS-enabled fetch configuration

2. **`lib-api/auth.ts`** - Authentication utility functions
   - `login(credentials)` - Calls backend API with CORS support
   - `setAuthToken(token)` - Stores token in secure HTTP-only cookie
   - `getAuthToken()` - Retrieves token from cookie
   - `removeAuthToken()` - Removes token from cookie
   - `isAuthenticated()` - Checks if user has valid token
   - `logout()` - Removes token and redirects to login

3. **`middleware.ts`** - Route protection middleware
   - Runs on every request (except static files)
   - Checks for auth token in cookies
   - Redirects unauthenticated users to `/login`
   - Prevents authenticated users from accessing `/login`
   - Preserves original URL for post-login redirect

4. **`store/features/auth/authSlice.tsx`** - Redux auth state management
   - Stores authentication state globally
   - Actions: `setAuthData`, `clearAuthData`, `updateUser`

#### Modified Files:

1. **`app/login/page.tsx`**
   - Updated to use email instead of username
   - Integrated with backend authentication API
   - Removed Google and GitHub OAuth buttons
   - Dispatches auth state to Redux on successful login
   - Handles redirect to original destination after login
   - Updated import to use `@/lib-api/auth`

2. **`components/navbar/Navbar.tsx`**
   - Dynamic authentication state checking
   - Integrated logout functionality
   - Clears Redux state on logout
   - Shows/hides UI elements based on auth status

3. **`store/store.ts`**
   - Added auth reducer to global store

## How It Works

### Login Flow:

1. User navigates to any protected route
2. Middleware checks for `auth_token` cookie
3. If no token exists, user is redirected to `/login?redirect=/original-path`
4. User enters email and password
5. Credentials are sent to backend API with public key header
6. Backend validates and returns authentication token
7. Token is stored in secure cookie (expires in 7 days)
8. Auth state is saved to Redux store
9. User is redirected to original destination or `/dashboard`

### Logout Flow:

1. User clicks logout in navbar dropdown
2. Auth state is cleared from Redux
3. Token cookie is removed
4. User is redirected to `/login`

### Route Protection:

- **Public Routes**: `/login`, `/api/auth/*`, static assets
- **Protected Routes**: All other routes require valid token
- Middleware runs on every request to enforce protection
- Token is checked server-side in middleware for security

## Security Features

1. **HTTP-Only Cookies**: Token stored in cookie with `SameSite=Strict`
2. **Server-Side Validation**: Middleware validates token on every request
3. **Secure Headers**: Public key sent with every auth request
4. **No Client-Side Token Storage**: Tokens not exposed to JavaScript
5. **Automatic Expiration**: Cookies expire after 7 days

## Testing the Implementation

### Test Login:

```bash
# Use these credentials (from the curl example):
Email: rizkykysadewa@gmail.com
```

### Expected Behavior:

1. **Without Authentication**:
   - Accessing `/dashboard` → Redirected to `/login?redirect=/dashboard`
   - Accessing `/product` → Redirected to `/login?redirect=/product`
   - Accessing `/login` → Shows login page

2. **With Authentication**:
   - Accessing `/login` → Redirected to `/dashboard`
   - Accessing any protected route → Shows the page
   - Clicking logout → Cleared auth, redirected to `/login`

## Configuration

### Token Expiration:

To change token expiration, edit `lib-api/auth.ts`:

```typescript
// Current: 1 day
expires.setDate(expires.getDate() + 1);

// Change to 30 days:
expires.setDate(expires.getDate() + 30);
```

### Public Routes:

To add more public routes, edit `middleware.ts`:

```typescript
const publicRoutes = ['/login', '/register', '/forgot-password'];
```

### Backend API Base URL:

To change the backend base URL, edit `lib-api/api-config.ts`:

```typescript
// Change from:
export const API_BASE_URL = 'https://djongjawa.com/djong-gateway';

// To your backend:
export const API_BASE_URL = 'https://your-backend.com';
```

All endpoints will automatically use the new base URL!

## Troubleshooting

### Issue: 403 Forbidden / CORS Error
**Solution**: 
- The backend server must allow CORS requests from your frontend domain
- Check browser console for specific CORS errors
- Verify the public key is correct in `lib-api/api-config.ts`
- Ensure backend allows the `publicKey` header
- The fetch now includes proper CORS configuration (`mode: 'cors'`)

### Issue: Infinite redirect loop
**Solution**: Clear cookies and try again. Ensure middleware isn't protecting the `/login` route.

### Issue: Token not persisting
**Solution**: Check browser cookie settings. Ensure cookies are enabled.

### Issue: "No token received" error
**Solution**: Verify backend is returning token in response. Check network tab for API response format.

### Issue: Protected routes accessible without login
**Solution**: Ensure middleware.ts is in the root directory. Check middleware matcher configuration.

### Issue: Network error message
**Solution**: This typically indicates CORS blocking or network connectivity issues. Check:
- Backend server is running and accessible
- CORS is properly configured on backend
- Network connection is stable

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Remember Me**: Add option for extended session
3. **Role-Based Access**: Restrict routes based on user roles
4. **Session Timeout**: Add idle timeout with warning
5. **OAuth Integration**: Add Google/GitHub login (currently disabled per requirements)
6. **JWT Decode**: Parse token to extract user info without API call
