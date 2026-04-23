// components/navbar/Navbar.tsx
'use client'; // This directive is necessary for client-side interactivity in App Router

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import ProductLogoSvg from '../../public/assets/navbar/product-box.svg'; 
import TrendingUpLogoSvg from '../../public/assets/navbar/trending-up.svg';
import BookOpenLogoSvg from '../../public/assets/navbar/book-open-check.svg';
import FileBarLogoSvg from '../../public/assets/navbar/file-bar-chart.svg';

// You might need to install react-icons:
// npm install react-icons
// or
// yarn add react-icons
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa'; // Example icons

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside

  // Dummy user data - In a real app, this would come from authentication context/state
  const user = {
    isAuthenticated: true,
    username: 'Rizki Sadewa - Admin', // Replace with dynamic username
    isAdmin: true, // Replace with dynamic admin status
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Only re-run if dropdownRef changes (which it won't)


  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logging out...');
    setIsDropdownOpen(false); // Close dropdown after action
    // Redirect to login page or update auth state
  };

  const handleAdminArea = () => {
    // Navigate to admin area using Next.js router
    router.push('/admin-area');
    setIsDropdownOpen(false); // Close dropdown after action
  };

  return (
    <nav className="fixed top-0 left-0 w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16"> {/* Changed justify-center to justify-between */}
          {/* Left side (e.g., Logo/Brand) - Adjust as needed */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Djong Pinisi
            </Link>
          </div>

          {/* Center (Navigation Links) */}
          <div className="flex-grow flex justify-center"> {/* flex-grow to take available space */}
            <div className="flex space-x-4">
              <Link href="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${pathname === '/' ? 'bg-pink-500' : 'hover:bg-pink-500'}`}>
                <TrendingUpLogoSvg className="h-6 w-4 mr-2" /> Dashboard
              </Link>
              <Link href="/sales-pipeline" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${pathname === '/sales-pipeline' ? 'bg-pink-500' : 'hover:bg-pink-500'}`}>
                <BookOpenLogoSvg className="h-6 w-6 mr-2" /> Sales Pipeline
              </Link>
              <Link href="/product" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${pathname === '/product' ? 'bg-pink-500' : 'hover:bg-pink-500'}`}>
                <ProductLogoSvg className="h-4 w-4 mr-2" />Product
              </Link>
              <Link href="/booking-list" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${pathname === '/booking-list' ? 'bg-pink-500' : 'hover:bg-pink-500'}`}>
                <BookOpenLogoSvg className="h-6 w-6 mr-2" /> Booking List
              </Link>
              <Link href="/report" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${pathname === '/report' ? 'bg-pink-500' : 'hover:bg-pink-500'}`}>
                <FileBarLogoSvg className="h-6 w-6 mr-2" /> Report
              </Link>
            </div>
          </div>

          {/* Right side (User Info and Dropdown) */}
          <div className="relative" ref={dropdownRef}>
            {user.isAuthenticated ? (
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span className="text-sm font-medium hidden md:block">{user.username}</span> {/* Hide username on small screens */}
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-gray-600">
                  <FaUserCircle className="text-xl text-gray-300" />
                </div>
              </div>
            ) : (
              <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700">
                Login
              </Link>
            )}

            {isDropdownOpen && user.isAuthenticated && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                {user.isAdmin && ( // Only show "Admin Area" if user is admin
                  <button
                    onClick={handleAdminArea}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-pink-500"
                  >
                    <FaCog className="mr-2" /> Admin Area
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-pink-500"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}