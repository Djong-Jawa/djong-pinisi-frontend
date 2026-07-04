// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login, setAuthToken } from '@/lib-api/auth';
import { setAuthData } from '@/store/features/auth/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call the backend authentication API
      const response = await login({ email, password });
      
      // Extract token from response (check multiple possible fields)
      const token = response.token || response.access_token || response.accessToken;
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      // Store the token in cookie
      setAuthToken(token);
      
      // Update Redux store with auth data
      dispatch(setAuthData({ 
        token, 
        user: response.user || { email }
      }));
      
      console.log('Login successful!');
      
      // Redirect to the original page or dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
     <div className="flex min-h-screen bg-white"> {/* Changed background to white */}
      {/* Left Half: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-200"> {/* White background, lighter border */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Djong Pinisi</h2> {/* Darker text for white theme */}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-xs italic text-center">{error}</p> 
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Protected by Djong Pinisi Authentication
          </p>
        </div>
      </div>

      {/* Right Half: Background Video */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"> {/* Hidden on small screens, flex on large */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70" // Adjusted opacity for white background
        >
          <source src="/videos/Space_Pinisi_Ship_s_Epic_Battle.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Optional: Overlay to slightly dim the video or add a tint */}
        {/* <div className="absolute inset-0 bg-white opacity-20 z-10"></div> */}
      </div>
    </div>
   </>
  );
}