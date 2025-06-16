'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bus,
  LogOut,
  AlignLeft,
  X
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'My Journeys', href: '/my-journeys', icon: Bus },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Navigation with Sheet */}
      <div className="block md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-4 focus:outline-none">
              <AlignLeft className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white">
            <SheetHeader>
              <SheetTitle className="text-lg font-bold">Bus Journeys</SheetTitle>
              <SheetClose className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </SheetClose>
            </SheetHeader>
            <nav className="mt-6">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">Bus Journeys</h1>
        </div>
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;