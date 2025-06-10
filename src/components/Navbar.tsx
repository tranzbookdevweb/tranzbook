'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { logout } from '@/lib/auth';
import { CampaignOutlined, Work } from '@mui/icons-material';
import { ArrowRight, Calendar,  ChevronDown, HelpCircleIcon, MapPin, Menu, Phone, Users, } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDisplayName = (): string => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    if (user?.phoneNumber) return user.phoneNumber;
    return 'User';
  };

  const closeMobileMenu = () => {
    setIsSheetOpen(false);
  };

  const navigationItems = [
    {
      href: '/about-us',
      label: 'About Us',
      icon: Users,
      description: 'Learn more about our story'
    },
    {
      href: '/contact-us',
      label: 'Contact Us',
      icon: Phone,
      description: 'Get in touch with our team'
    }
  ];

  const resourceItems = [
    {
      href: '/blog',
      label: 'Blog',
      icon: CampaignOutlined,
      description: 'Latest insights & updates',
      bgColor: 'from-orange-100 to-orange-200',
      iconBgColor: 'bg-orange-100 group-hover:bg-orange-200',
      textColor: 'text-orange-600 group-hover:text-orange-700'
    },
    {
      href: '/career',
      label: 'Careers',
      icon: Work,
      description: 'Join our growing team',
      bgColor: 'from-blue-100 to-blue-200',
      iconBgColor: 'bg-blue-100 group-hover:bg-blue-200',
      textColor: 'text-blue-600 group-hover:text-blue-700'
    },
    {
      href: '/faq',
      label: 'FAQ',
      icon: HelpCircleIcon,
      description: 'Get quick answers',
      bgColor: 'from-green-100 to-green-200',
      iconBgColor: 'bg-green-100 group-hover:bg-green-200',
      textColor: 'text-green-600 group-hover:text-green-700'
    }
  ];

  return (
    <>
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

              {/* Navigation links with modern styling - Desktop only */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link 
                  href="/about-us"
                  className="relative text-blue-600 font-medium text-sm tracking-wide transition-all duration-300 hover:text-blue-700 group"
                >
                  <span className="relative z-10">About Us</span>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative text-blue-600 font-medium text-sm tracking-wide transition-all duration-300 hover:text-blue-700 group flex items-center space-x-1 focus:outline-none">
                      <span className="relative z-10">Resources</span>
                      <ChevronDown 
                        className="w-4 h-4 transition-transform duration-300"
                      />
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center" 
                    className="z-[999] bg-white/95 backdrop-blur-md border border-blue-100 shadow-xl rounded-xl p-2 min-w-[200px] mt-2"
                  >
                    {resourceItems.map((item) => (
                      <DropdownMenuItem key={item.href} className="p-0 focus:bg-transparent">
                        <Link 
                          href={item.href} 
                          className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:${item.bgColor} hover:shadow-md flex items-center font-medium text-gray-700 hover:${item.textColor}`}
                        >
                          <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-lg ${item.iconBgColor} group-hover:scale-110 transition-all duration-300`}>
                            <item.icon className="text-sm" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{item.label}</p>
                            <p className="text-xs text-gray-500 group-hover:text-green-600">{item.description}</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Link 
                  href="/contact-us"
                  className="relative text-blue-600 font-medium text-sm tracking-wide transition-all duration-300 hover:text-blue-700 group"
                >
                  <span className="relative z-10">Contact Us</span>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </nav>
            </div>

            {/* User section and mobile menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile user profile (visible only on mobile when logged in) */}
              {user && (
                <div className="lg:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 group">
                        <div className="relative">
                          <img
                            className="w-8 h-8 rounded-full border-2 border-blue-200 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:scale-105"
                            src={
                              user.photoURL ||
                              `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName())}`
                            }
                            alt="User Profile"
                            width={32}
                            height={32}
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="min-w-[240px] z-[9999] bg-white/95 backdrop-blur-md border border-blue-100 shadow-xl rounded-xl p-2"
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
              )}

              {/* Desktop user section */}
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-blue-700/80 font-light">Welcome back,</p>
                      <p className="text-sm font-semibold text-blue-800 -mt-1">
                        {getDisplayName()}
                      </p>
                    </div>
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
                        className="min-w-[240px] z-[9999] bg-white/95 backdrop-blur-md border border-blue-100 shadow-xl rounded-xl p-2"
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

              {/* Mobile menu sheet */}
              <div className="lg:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>

                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-3 text-blue-600 hover:bg-white/30  hover:text-blue-700 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="right" 
                    className="w-full sm:max-w-2xl z-[999999] overflow-y-scroll p-0 border-0 bg-white backdrop-blur-xl"
                  >
                    <div className="relative bg-[#0066ff] p-6 pb-8">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                        <Image src='/altlogowhite.png' className='h-8 w-full' width={50} height={20} alt=''/>
                      
                          </div>
                        </div>
                        {user && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center space-x-3">
                              <img
                                className="w-12 h-12 rounded-full border-2 border-white/30"
                                src={
                                  user.photoURL ||
                                  `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName())}`
                                }
                                alt="User Profile"
                                width={48}
                                height={48}
                              />
                              <div>
                                <p className="text-white font-semibold">{getDisplayName()}</p>
                                <p className="text-blue-100 text-sm truncate">
                                  {user.email || user.phoneNumber || 'Welcome back!'}
                                </p>
                              </div>
                              <div className="ml-auto">
                                <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg"></div>
                    </div>

                    <div className="px-6 py-6 space-y-8">
                      <div>
                        <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                          Navigation
                        </h3>
                        <div className="space-y-2">
                          {navigationItems.map((item) => (
                            <Link 
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 transition-all duration-300 hover:bg-white/80 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <item.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {item.label}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                          ))}
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="resources" className="border-0">
                              <AccordionTrigger className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 hover:bg-white/80 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:no-underline">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Calendar className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-left text-gray-900 group-hover:text-orange-600 transition-colors">
                                      Resources
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Explore our resources
                                    </p>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="mt-2 space-y-2">
                                {resourceItems.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className={`group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 transition-all duration-300 hover:bg-gradient-to-r hover:${item.bgColor} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div className={`w-8 h-8 ${item.iconBgColor} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300`}>
                                        <item.icon className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className={`font-semibold text-gray-900 group-hover:${item.textColor} transition-colors`}>
                                          {item.label}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                                  </Link>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>

                      {user ? (
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                            My Account
                          </h3>
                          <div className="space-y-3">
                            <Link
                              href="/my-journeys"
                              onClick={closeMobileMenu}
                              className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-green-800">My Journeys</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                            <Button
                              onClick={handleLogout}
                              className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-red-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                              variant="ghost"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span className="font-medium">Logout</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                            Get Started
                          </h3>
                          <div className="space-y-4">
                            <Button 
                              asChild 
                              variant="outline" 
                              className="w-full h-14 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                              onClick={closeMobileMenu}
                            >
                              <Link href="/login">Login to Your Account</Link>
                            </Button>
                            <Button 
                              asChild 
                              variant="default" 
                              className="w-full h-14 bg-gradient-to-r from-[#48A0ff] to-[#3B82F6] hover:from-[#48a0ff90] hover:to-[#3B82F690] text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border-0"
                              onClick={closeMobileMenu}
                            >
                              <Link href="/signup">Create New Account</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                   
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}