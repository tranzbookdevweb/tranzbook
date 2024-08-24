import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from './Modetoggle'; // Assuming ModeToggle is a component for switching themes
import { ProductToggle } from './Producttoggle';
import { ResourcesToggle } from './ResourcesToggle';
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function MenuSheet() {
  // Fetch the current user session using Kinde server session
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Menu className="w-6 h-6 text-blue-500 dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999] bg-[#DEF5FB] dark:bg-gray-900 min-w-[280px]">
        <SheetHeader className="flex items-center justify-center">
          <SheetTitle>
            <Image src='/pictures/logoNav.png' width={120} height={120} alt='Logo' className="mx-auto"/>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-6 p-6 text-center">
          {/* Main Navigation Links with Hover Effects */}
          <Link href="/" className="text-blue-500 dark:text-white font-medium text-lg hover:text-blue-700 dark:hover:text-gray-300 transition duration-300">Home</Link>
          <Link href="/About" className="text-blue-500 dark:text-white font-medium text-lg hover:text-blue-700 dark:hover:text-gray-300 transition duration-300">About Us</Link>
          <div className="text-blue-500 dark:text-white font-medium text-lg hover:text-blue-700 dark:hover:text-gray-300 transition duration-300">
            <ProductToggle />
          </div>
          <div className="text-blue-500 dark:text-white font-medium text-lg hover:text-blue-700 dark:hover:text-gray-300 transition duration-300">
            <ResourcesToggle />
          </div>

          {/* Conditional Rendering Based on User Authentication */}
          {user ? (
            <>
              <Link href='/my-journeys' className="text-blue-500 dark:text-white font-medium text-lg hover:text-blue-700 dark:hover:text-gray-300 transition duration-300">My Journeys</Link>
              <LogoutLink className="text-blue-500 dark:text-white font-medium text-lg cursor-pointer hover:text-blue-700 dark:hover:text-gray-300 transition duration-300">Logout</LogoutLink>
            </>
          ) : (
            <>
              <RegisterLink className="text-white bg-blue-500 hover:bg-blue-400 font-medium text-lg py-2 px-6 rounded transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-500">Sign up</RegisterLink>
              <LoginLink className="text-white bg-gray-500 hover:bg-gray-400 font-medium text-lg py-2 px-6 rounded transition duration-300 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600">Login</LoginLink>
            </>
          )}

          {/* Optional Mode Toggle */}
          <div className="mt-4">
            <ModeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
