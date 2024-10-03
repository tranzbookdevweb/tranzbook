'use client'
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

interface SeatSelectionProps {
  busCapacity: number;
  selectedSeats: string[];
  handleSeatSelection: (seatId: string) => void;
  handleClearSeats: () => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  busCapacity,
  selectedSeats,
  handleSeatSelection,
  handleClearSeats,
}) => {
  const totalPassengerSeats = busCapacity - 1;

  const numberOfDigits = totalPassengerSeats.toString().length;

  const formatSeatNumber = (seatNumber: number) => {
    return seatNumber.toString().padStart(numberOfDigits, "0");
  };

  const renderSeats = () => {
    let allSeats: JSX.Element[] = [];

    allSeats.push(
      <div className='m-2 dark:text-black' key='driver-seat'>
        <button className='flex flex-col items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 px-5  bg-gray-300'>
          <Image
            src='/driver-seat.png'
            alt='Driver Seat'
            height={50}
            width={50}
            className='object-contain'
          />
          <p className='text-center text-sm'>Driver</p>
        </button>
      </div>
    );

    for (
      let row = 0;
      row < Math.ceil(totalPassengerSeats / 4);
      row++
    ) {
      let rowSeats: JSX.Element[] = [];

      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col;
        if (seatNumber >= totalPassengerSeats) break;

        const seatId = formatSeatNumber(seatNumber);
        const isSelected = selectedSeats.includes(seatId);

        rowSeats.push(
          <div
            className='m-2 dark:text-gray-500  font-semibold'
            key={seatId}>
            <button
              onClick={() => handleSeatSelection(seatId)}
              className={`flex flex-row items-center justify-center w-44 text-3xl  max-sm:w-20 sm:max-md:w-20 gap-2 border border-slate-200 rounded-xl p-2 max-sm:px-5 sm:max-md:px-5 transition-all duration-300 ${
                isSelected
                  ? "bg-[#FFCC59] text-white"
                  : "bg-white text-gray-500 "
              }`}>
              <Image
                src='/seat.png'
                alt='seat'
                height={50}
                width={50}
                className='object-contain'
              />
              <p className='text-center text-sm'>{seatId}</p>
            </button>
          </div>
        );
      }

      allSeats.push(
        <div
          key={`row-${row}`}
          className='flex flex-row justify-between w-full gap-10'>
          <div className='flex'>{rowSeats.slice(0, 2)}</div>
          <div className='flex'>{rowSeats.slice(2, 4)}</div>
        </div>
      );
    }

    return allSeats;
  };

  return (
    <div className='flex flex-col items-center p-4 border border-slate-200 rounded-xl dark:text-black h-full overflow-hidden'>
      <h2 className='text-xl mb-2 font-semibold'>
        Select Your Seats
      </h2>
      {selectedSeats.length > 0 ? (
        <Button
          className='p-2 rounded-[5px] text-slate-700'
          variant='ghost'
          onClick={() => handleClearSeats()}>
          Clear selection
        </Button>
      ) : (
        ""
      )}

      <div
        className='w-full lg:min-h-full max-h-[400px] overflow-y-auto custom-scrollbar pt-5 pb-20'
        style={{
          scrollbarColor: "#b7ebf8 #ffffff",
          scrollbarWidth: "thin",
        }}>
        {renderSeats()}
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

export default SeatSelection;
