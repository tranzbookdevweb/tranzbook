import React from "react";
import { Skeleton } from "@mui/material";
import { RiCircleLine, RiMapPin2Fill } from "react-icons/ri";
import { PiLineVerticalLight } from "react-icons/pi";
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";
import Image from "next/image";

const BusDetailsSkeleton: React.FC = () => {
  return (
    <aside className='bg-white dark:text-black w-72 max-sm:w-full sm:max-md:w-full h-screen p-5 flex flex-col items-start max-sm:justify-between sm:max-md:justify-between border-r max-sm:border-t sm:max-md:border-t border-gray-200 rounded-lg overflow-hidden'>
      <div className='flex items-center min-w-full mb-6'>
        <Skeleton variant='rectangular' width={100} height={100} />
        <div className='ml-4 w-1/2'>
          <h2 className='text-lg font-semibold text-gray-800 min-w-full'>
            <Skeleton width='100%' />
          </h2>
          <p className='text-sm text-gray-500 min-w-full'>
            <Skeleton width='100%' />
          </p>
        </div>
      </div>

      <div className='w-full space-y-4'>
        {[
          "Bus Number",
          "Capacity",
          "Distance",
          "Departure",
          "Arrival",
          "Extras",
        ].map((label, index) => (
          <div
            key={index}
            className='flex items-center justify-between'>
            <span className='text-xs text-gray-500'>{label}</span>
            <span className=' mx-4 text-sm font-semibold text-gray-700 w-full'>
              <Skeleton width='100%' />
            </span>
          </div>
        ))}

        <div className='flex items-center bg-white rounded-xl border border-slate-100 p-2'>
          <div className='flex flex-col gap-1'>
            <RiCircleLine />
            <PiLineVerticalLight />
            <RiMapPin2Fill />
          </div>
          <div className='text-sm mx-2 font-semibold text-blue-600 flex flex-col justify-between min-h-full space-y-5 min-w-full'>
            <span className='min-w-full'>
              <Skeleton width='80%' />
            </span>
            <span className='min-w-full'>
              <Skeleton width='80%' />
            </span>
          </div>
        </div>

        <div className='flex items-center w-full'>
          <FiClock className='text-blue-600 mr-2' />
          <span className='text-sm font-semibold text-gray-700 w-3/4'>
            <Skeleton width='80%' />
          </span>
        </div>

        <div className='flex items-center w-full'>
          <FiCalendar className='text-blue-600 mr-2' />
          <p className='text-sm font-semibold text-gray-700 w-3/4'>
            <Skeleton width='80%' />
          </p>
        </div>

        <div className='flex items-center w-full'>
          <FiUser className='text-blue-600 mr-2' />
          <span className='text-sm font-semibold text-gray-700 w-3/4'>
            <Skeleton width='80%' />
          </span>
        </div>

        <div className='flex flex-col border-t border-b py-4 border-gray-300'>
          <h2 className='text-xs text-slate-400'>Charges:</h2>
          <div>
            <p className='text-sm'>
              <Skeleton width='80%' />
            </p>
            <p className='text-sm'>
              <Skeleton width='80%' />
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-wrap w-full'>
          <FiDollarSign className='text-blue-600' />
          <p className="w-3/4">
            <Skeleton width='80%' />
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #b7ebf8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #ffffff;
        }
      `}</style>
    </aside>
  );
};

export { BusDetailsSkeleton };
