import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ResourcesToggle } from "./ResourcesToggle";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuSheet } from "./MenuToggle";

export async function Navbar() {
  // Fetch the current user session using Kinde server session
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className=' flex sticky bottom-0 top-0 left-0 right-0 z-[99999] p-[1.6vh] w-full overflow-x-hidden bg-[#DEF5FB]  items-center'>
      <div className='flex w-[100%] justify-between items-center max-w-6xl mx-auto'>
        {/* Logo and navigation links */}
        <div className='logoContainer items-center flex mr-5 space-x-3'>
          <Link href='/'>
            {/* Updated the img tag to use Next.js Image component */}
            <Image
              src='/pictures/logoNav.png'
              width={100}
              height={100}
              alt='Logo'
            />
          </Link>

          {/* Middle menu links for larger screens */}
          <div className='menuMiddle max-lg:hidden flex text-blue-500 items-center text-[14px] font-medium space-x-3'>
            <Link href='/about-us'>About Us</Link>
            <ResourcesToggle />
            <Link href='/contact-us'>Contact Us</Link>
          </div>
          {user && (
            <div className='menuMiddle max-lg:hidden flex text-blue-500 items-center text-[14px] font-medium space-x-3'>
              {/* I intially made it /bookings/u/${randomUUID}/seatPicker to 
              test the seatSelection and ticket generation since I couldnt access the db
               */}
              {/* <Link href={`/my-journeys`}>Bookings</Link> */}
            </div>
          )}
        </div>

        {/* User menu with dropdown for logged in users */}
        <div className='userMenu flex items-center space-x-2'>
          <div className='flex items-center space-x-2'>
            {user ? (
              <>
                {/* Dropdown menu for logged-in users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* Replaced <img> with <Image /> and added Next.js optimization */}
                    <Image
                      className='hover:cursor-pointer w-8 h-8 rounded-full'
                      src={
                        user?.picture ??
                        "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
                      }
                      alt='User Profile'
                      width={32}
                      height={32}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='z-[999] text-black bg-white'>
                    <DropdownMenuItem className='rounded-[8px] hover:cursor-pointer items-center flex font-semibold'>
                      <Link
                        href='/my-journeys'
                        className='rounded-[8px] hover:bg-orange-200 p-2 hover:text-white w-full hover:cursor-pointer items-center flex font-semibold'>
                        My Journeys
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='rounded-[8px] hover:cursor-pointer items-center flex font-semibold'>
                      <div className='rounded-[8px] hover:bg-orange-200 p-2 hover:text-white w-full hover:cursor-pointer items-center flex font-semibold'>
                        <LogoutLink className='w-full'>
                          Logout
                        </LogoutLink>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className='lg:hidden'>
                  <MenuSheet />
                </div>
              </>
            ) : (
              <>
                {/* Registration and login links for users who are not logged in */}
                <div className='max-lg:hidden space-x-2 flex items-center'>
                  <RegisterLink className='px-2 py-0.5 rounded-[8px] w-20 text-center text-white font-semibold hover:bg-[#48a0ff60] bg-[#48A0ff]'>
                    Sign up
                  </RegisterLink>
                  <LoginLink className='px-2 py-0.5 rounded-[8px] w-20 text-center text-white font-semibold hover:bg-gray-300 bg-gray-400'>
                    Login
                  </LoginLink>
                </div>
                {/* Menu toggle for smaller screens */}
                <div className='lg:hidden'>
                  <MenuSheet />
                </div>
              </>
            )}
          </div>
          {/* <ModeToggle/>  Uncomment this line to enable mode toggle functionality */}
        </div>
      </div>
    </div>
  );
}
