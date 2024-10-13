"use client";
import React from "react";
import { Skeleton } from "@mui/material";

const SeatSelectionSkeleton: React.FC = () => {
  const totalPassengerSeats = 55;

  const renderSkeletonSeats = () => {
    let skeletonSeats: JSX.Element[] = [];

    skeletonSeats.push(
      <div
        className='m-2 max-sm:pb-[28%] pb-10 max-sm:m-1 dark:text-black w-16 lg:w-24 lg:h-24 min-[390px]:w-[70px] max-sm:h-16 min-[390px]:h-[85px] min-[430px]:w-[80px] min-[430px]:h-24'
        key='driver-seat-skeleton'>
        <Skeleton variant='text' width={60} animation='wave' />
        <div className='h-16 min-[390px]:h-[70px] min-[430px]:h-[80px] md:h-16 lg:h-24 w-24 max-sm:w-20'>
          <Skeleton
            variant='rectangular'
            width={65}
            height={65}
            className='bg-center border border-slate-200 rounded-xl '
            animation='wave'
          />
        </div>
      </div>
    );

    for (
      let row = 0;
      row < Math.ceil(totalPassengerSeats / 4);
      row++
    ) {
      let rowSkeletons: JSX.Element[] = [];

      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col;
        if (seatNumber >= totalPassengerSeats) break;

        rowSkeletons.push(
          <div
            className='m-2 max-sm:m-1'
            key={`seat-skeleton-${seatNumber}`}>
            <div className='flex flex-row items-center justify-center w-44 lg:w-40 min-[540px]:w-24 text-3xl min-[340px]:w-[62px] min-[390px]:w-[70px] min-[430px]:w-[80px] max-sm:w-16 sm:max-md:w-20 gap-2 border border-slate-200 rounded-xl p-2 max-sm:px-5 sm:max-md:px-5 bg-gray-200'>
              <Skeleton
                variant='rectangular'
                width={50}
                height={50}
                animation='wave'
                className='object-contain max-sm:w-6 max-sm:h-10 w-8 h-10'
              />
              <Skeleton variant='text' width={40} animation='wave' />
            </div>
          </div>
        );
      }

      skeletonSeats.push(
        <div
          key={`row-skeleton-${row}`}
          className='flex flex-row justify-between w-full gap-10 max-sm:gap-4 '>
          <div className='flex'>{rowSkeletons.slice(0, 2)}</div>
          <div className='flex'>{rowSkeletons.slice(2, 4)}</div>
        </div>
      );
    }

    return skeletonSeats;
  };

  return (
    <div className='flex flex-col items-center p-4 border border-slate-200 rounded-xl h-full overflow-hidden  max-sm:w-full max-sm:px-2 md:min-h-full lg:min-w-[500px] min-[1200px]:min-w-[700px] min-[1200px]:h-[650px] lg:h-[500px]'>
      <Skeleton variant='text' width={180} animation='wave' />

      <div
        className='w-full lg:min-h-full max-h-[400px] md:min-h-[720px] overflow-y-auto custom-scrollbar pt-5 pb-20'
        style={{
          scrollbarColor: "#b7ebf8 #ffffff",
          scrollbarWidth: "thin",
        }}>
        {renderSkeletonSeats()}
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
    </div>
  );
};

export { SeatSelectionSkeleton };
