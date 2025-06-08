'use client';
import Link from 'next/link';
import React from 'react';
import { ResourcesToggle } from './ResourcesToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    if (user?.phoneNumber) return user.phoneNumber;
    return 'User';
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-[999] w-full bg-gradient-to-r from-[#DEF5FB] via-[#DEF5FB] to-[#E8F7FC] backdrop-blur-sm border-b border-blue-100/50 shadow-sm">
      <div className="px-6 py-4 w-full">
        <div className="flex w-full justify-between items-center max-w-7xl mx-auto">
          {/* Logo and navigation links */}
          <div className="flex items-center space-x-8">
            {/* Logo with hover effect */}
            <Link href="/" className="group">
              <div className="relative overflow-hidden rounded-xl p-2 transition-all duration-300 group-hover:bg-white/30 group-hover:shadow-lg group-hover:scale-105">
                <img 
                  src="/pictures/logoNav.png" 
                  width={80} 
                  height={80} 
                  alt="Logo"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>

            {/* Navigation links with modern styling */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/about-us"
                className="relative text-blue-600 font-medium text-sm tracking-wide transition-all duration-300 hover:text-blue-700 group"
              >
                <span className="relative z-10">About Us</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
              
              <div className="relative group">
                <ResourcesToggle />
              </div>
              
              <Link 
                href="/contact-us"
                className="relative text-blue-600 font-medium text-sm tracking-wide transition-all duration-300 hover:text-blue-700 group"
              >
                <span className="relative z-10">Contact Us</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </nav>
          </div>

          {/* User section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Welcome message with elegant typography */}
                <div className="hidden lg:block">
                  <p className="text-sm text-blue-700/80 font-light">Welcome back,</p>
                  <p className="text-sm font-semibold text-blue-800 -mt-1">
                    {getDisplayName()}
                  </p>
                </div>

                {/* User dropdown with enhanced styling */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 group">
                      <div className="relative">
                        <img
                          className="w-10 h-10 rounded-full border-2 border-blue-200 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:scale-105"
                          src={
                            user.photoURL ||
                            `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName())}`
                          }
                          alt="User Profile"
                          width={40}
                          height={40}
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="min-w-[240px] z-[9999] bg-white/95  backdrop-blur-md border border-blue-100 shadow-xl rounded-xl p-2"
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <img
                          className="w-8 h-8 rounded-full border border-blue-200"
                          src={
                            user.photoURL ||
                            `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName())}`
                          }
                          alt="User Profile"
                          width={32}
                          height={32}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">
                            {user.email || user.phoneNumber || 'No contact info'}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-blue-100 my-2" />
                    <DropdownMenuItem asChild className="p-0">
                      <Link
                        href="/my-journeys"
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Journeys
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-700 justify-start"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-medium px-6 py-2 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  asChild 
                  variant="default" 
                  className="bg-gradient-to-r from-[#48A0ff] to-[#3B82F6] hover:from-[#48a0ff80] hover:to-[#3B82F680] text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-0"
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}