/* eslint-disable @next/next/no-img-element */
"use client";
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
    return (seatNumber + 1).toString().padStart(numberOfDigits, "0");
  };

  const renderSeats = () => {
    let allSeats: JSX.Element[] = [];

    allSeats.push(
      <div
        className='m-2 max-sm:m-1 dark:text-black w-16 lg:w-24 lg:h-28 min-[390px]:w-[70px] max-sm:h-20 min-[390px]:h-[85px] min-[430px]:w-[80px] min-[430px]:h-24'
        key='driver-seat'>
        <p className='text-center text-xs text-slate-500'>Driver</p>
        <button className='w-full flex flex-col items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 px-5  bg-gray-300 bg-[url("/driver.png")] bg-cover bg-no-repeat h-16 min-[390px]:h-[70px] min-[430px]:h-[80px] md:h-20 lg:h-24 bg-center'>
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
            className='m-2 max-sm:m-1 dark:text-gray-500  font-semibold '
            key={seatId}>
            <button
              onClick={() => handleSeatSelection(seatId)}
              className={`flex flex-row items-center justify-center lg:w-40 min-[540px]:w-24 text-3xl min-[340px]:w-[62px] min-[390px]:w-[70px] min-[430px]:w-[80px] max-sm:w-16 sm:max-md:w-20 gap-2 border border-slate-200 rounded-xl p-2 max-sm:px-5 sm:max-md:px-5 transition-all duration-300 ${
                isSelected
                  ? "bg-[#FFCC59] text-white"
                  : "bg-white text-gray-500 "
              }`}>
              <Image
                src='/seat.png'
                alt='seat'
                height={50}
                width={50}
                className='object-contain max-sm:w-6 max-sm:h-10 w-8 h-10'
              />
              <p className='text-center text-base lg:text-lg'>{seatId}</p>
            </button>
          </div>
        );
      }

      allSeats.push(
        <div
          key={`row-${row}`}
          className='flex flex-row justify-between w-full gap-10 max-sm:gap-0 '>
          <div className='flex'>{rowSeats.slice(0, 2)}</div>
          <div className='flex'>{rowSeats.slice(2, 4)}</div>
        </div>
      );
    }

    return allSeats;
  };

  return (
    <div className='flex flex-col items-center lg:justify-center p-5 max-sm:pb-0 border border-slate-200 rounded-xl dark:text-black h-full overflow-hidden  max-sm:w-full max-sm:px-2 md:min-h-full lg:min-w-[500px] min-[1200px]:min-w-[700px] min-[1200px]:h-[650px] lg:h-[500px]'>
      <h2 className='text-xl mb-0 font-semibold'>
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
        className='w-full lg:min-h-full max-h-[400px] md:min-h-[720px] overflow-y-auto custom-scrollbar pt-5 pb-28'
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
