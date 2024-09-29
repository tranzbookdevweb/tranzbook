"use client";
// this isn't part of what you asked me to do
// but it would be more convenient if the user can access these
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { IoCarSport, IoCarSportOutline } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";

import { HiOutlineTicket, HiTicket } from "react-icons/hi2";
import Image from "next/image";
import { FcAlarmClock } from "react-icons/fc";
import Link from "next/link";
import {
  useParams,
  useSelectedLayoutSegments,
} from "next/navigation";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const segments = useSelectedLayoutSegments();

  // will change to layout.tsx
  return (
    <div className=' text-black bg-white flex flex-row min-h-screen'>
      <aside className='w-[15%] p-5 border-r border-b border-slate-100 bg-white min-h-screen'>
        {/* (dashboard) */}
        <h1 className='font-bold text-xl'>Manage Bookings</h1>
        <ul className='my-5 flex flex-col gap-2'>

          {dashboardItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`p-2 rounded-[5px] text-lg gap-2 flex flex-row items-center ${
                  segments[1].toLowerCase() ===
                  item.name.toLowerCase()
                    ? "bg-blue-800 text-white font-semibold"
                    : "text-black font-normal"
                }`}>
                {segments[1].toLowerCase() ===
                item.name.toLowerCase()
                  ? item.activeIcon
                  : item.inActiveIcon}
                {item.name}
              </Link>
            );
          })}

          <button className=' flex px-2 gap-2'>
            <TbMessageReport size={25} />
            {/* use a modal */}
            File a report
          </button>
        </ul>
      </aside>
      <aside className='w-full border-r border-slate-100 min-h-full'>
        <nav className='bg-white p-4 flex flex-row justify-between items-center'>
          <p>Overview of {segments[1]}</p>
          <ul className='flex gap-5'>
            <div className='flex '>
              <li className='border py-1.5 px-2 rounded-[5px] flex gap-2 items-center'>
                <IoCalendarClearOutline size={20} color='#08129EFF' />
                {new Date().toDateString()}
              </li>
            </div>
            <li className='py-1.5 px-2 border rounded-[5px]'>
              <IoIosNotificationsOutline
                size={25}
                color='#08129EFF'
              />
            </li>
          </ul>
        </nav>
        <section className='p-5 bg-slate-50 min-h-screen min-w-full'>
          <div className='bg-white rounded-xl min-w-full min-h-svh '>
            {children}
          </div>
        </section>
      </aside>
    </div>
  );
}

const dashboardItems = [
  {
    id: 1,
    name: "Trips",
    activeIcon: <IoCarSport size={25} />,
    inActiveIcon: <IoCarSportOutline size={25} />,
    href: "/bookings/manage/trips",
  },
  {
    id: 2,
    name: "Tickets",
    activeIcon: <HiTicket size={25} />,
    inActiveIcon: <HiOutlineTicket size={25} />,
    href: "/bookings/manage/tickets",
  },
];
