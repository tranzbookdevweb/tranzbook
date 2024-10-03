"use client";
import React from "react";
import { Skeleton } from "@mui/material"; 

const SeatSelectionSkeleton: React.FC = () => {
  const totalPassengerSeats = 55;

  const renderSkeletonSeats = () => {
    let skeletonSeats: JSX.Element[] = [];

    skeletonSeats.push(
      <div className='m-2' key='driver-seat-skeleton'>
        <div className='flex flex-col items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 px-5 bg-gray-200 w-[80px] h-[9e0px]'>
          <Skeleton
            variant='circular'
            width={50}
            height={50}
            animation='wave'
          />
          <Skeleton variant='text' width={40} animation='wave' />
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
          <div className='m-2' key={`seat-skeleton-${seatNumber}`}>
            <div className='flex flex-row items-center justify-center w-44 max-sm:w-20 sm:max-md:w-20 gap-2 border border-slate-200 rounded-xl p-2 max-sm:px-5 sm:max-md:px-5 bg-gray-200'>
              <Skeleton
                variant='rectangular'
                width={50}
                height={50}
                animation='wave'
              />
              <Skeleton variant='text' width={40} animation='wave' />
            </div>
          </div>
        );
      }

      skeletonSeats.push(
        <div
          key={`row-skeleton-${row}`}
          className='flex flex-row justify-between w-full gap-10'>
          <div className='flex'>{rowSkeletons.slice(0, 2)}</div>
          <div className='flex'>{rowSkeletons.slice(2, 4)}</div>
        </div>
      );
    }

    return skeletonSeats;
  };

  return (
    <div className='flex flex-col items-center p-4 border border-slate-200 rounded-xl h-full overflow-hidden'>
      <Skeleton
        variant='text'
        width={180}
        height={30}
        animation='wave'
      />
      <Skeleton
        variant='rectangular'
        width={100}
        height={40}
        animation='wave'
        className='my-4'
      />

      <div
        className='w-full lg:min-h-full max-h-[400px] overflow-y-auto custom-scrollbar pt-5 pb-20'
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

export  {SeatSelectionSkeleton};
