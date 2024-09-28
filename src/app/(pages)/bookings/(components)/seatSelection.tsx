// please rearrange and relocate the folders and components to where you see fit
// eg: busDetails to @/components/ui
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface SeatSelectionProps {
  busCapacity: number;
  selectedSeats: string[];
  handleSeatSelection: (seatId: string) => void;
  handleClearSeats:()=> void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  busCapacity,
  selectedSeats,
  handleSeatSelection,
  handleClearSeats
}) => {
  const rowLabels = ["F", "M", "B"];
  const frontSeatsCount = 4; //dynamic->based on the number of front seats provided
  // but it is normally 4
  const backSeatsCount = 5;
  // I will include seat status via db

  const actualMiddleSeatsCount =
    busCapacity - frontSeatsCount - backSeatsCount;
  const middleRowCount = Math.ceil(actualMiddleSeatsCount / 4);
  const [selectedMiddleRow, setSelectedMiddleRow] = useState(0);

  const renderSeats = () => {
    return rowLabels.map((rowLabel, i) => {
      let rowSeats: JSX.Element[] = [];
      let totalSeatsInRow = 0;

      if (rowLabel === "F") {
        totalSeatsInRow = frontSeatsCount;
        for (let j = 0; j < totalSeatsInRow; j++) {
           const halfSeats = Math.floor(backSeatsCount / 2);
           const side = j < halfSeats ? "L" : "R";
          const seatId = `${rowLabel}${side}-${j + 1}`;
          rowSeats.push(
            <div className='m-2 dark:text-black' key={seatId}>
              <button
                onClick={() => handleSeatSelection(seatId)}
                className={`flex flex-col items-center border border-slate-200 rounded-xl p-2 transition-all duration-300 ${
                  selectedSeats.includes(seatId)
                    ? "bg-[#b7ebf8]"
                    : "bg-white"
                }`}>
                <Image
                  src='/car_seat.png'
                  alt='seat'
                  height={100}
                  width={100}
                  className='object-contain'
                />
                <p className='text-center'>{seatId}</p>
              </button>
            </div>
          );
        }
      } else if (rowLabel === "M") {
        const startSeatIndex = selectedMiddleRow * 4;
        totalSeatsInRow = Math.min(
          4,
          actualMiddleSeatsCount - startSeatIndex
        );

        for (let j = 0; j < totalSeatsInRow; j++) {
          const halfSeats = Math.floor(backSeatsCount / 2);
          const side = j <halfSeats ? "L" : "R";
          const seatId = `${rowLabel}${side}-${startSeatIndex + j + 1}`;
          rowSeats.push(
            <div className='m-2 dark:text-black' key={seatId}>
              <button
                onClick={() => handleSeatSelection(seatId)}
                className={`flex flex-col items-center border border-slate-200 rounded-xl p-2 transition-all duration-300 ${
                  selectedSeats.includes(seatId)
                    ? "bg-[#b7ebf8]"
                    : "bg-white"
                }`}>
                <Image
                  src='/car_seat.png'
                  alt='seat'
                  height={100}
                  width={100}
                  className='object-contain'
                />
                <p className='text-center'>{seatId}</p>
              </button>
            </div>
          );
        }
      } else if (rowLabel === "B") {
        totalSeatsInRow = backSeatsCount;
        for (let j = 0; j < totalSeatsInRow; j++) {
          const halfSeats = Math.floor(backSeatsCount / 2);
          const side =
            j < halfSeats 
              ? "L"
              : j + 1 === halfSeats + 1 
              ? "M"
              : "R"; 

         const seatId = `${rowLabel}${side}-${j + 1}`;
          rowSeats.push(
            <div className='m-2 dark:text-black' key={seatId}>
              <button
                onClick={() => handleSeatSelection(seatId)}
                className={`flex flex-col items-center border border-slate-200 rounded-xl p-2 transition-all duration-300 ${
                  selectedSeats.includes(seatId)
                    ? "bg-[#b7ebf8]"
                    : "bg-white"
                }`}>
                <Image
                  src='/car_seat.png'
                  alt='seat'
                  height={100}
                  width={100}
                  className='object-contain'
                />
                <p className='text-center'>{seatId}</p>
              </button>
            </div>
          );
        }
      }

      const seatsLeft =
        rowLabel !== "M"
          ? totalSeatsInRow -
            selectedSeats.filter((seat) => seat.startsWith(rowLabel))
              .length
          : actualMiddleSeatsCount -
            selectedSeats.filter((seat) => seat.startsWith(rowLabel))
              .length;

      return (
        <div
          className='flex flex-col items-center mb-4'
          key={`row-${i}`}>
          <div className='flex flex-wrap justify-center'>
            {rowSeats}
          </div>
          {rowLabel === "M" && (
            <div className='ml-4'>
              <select
                value={selectedMiddleRow}
                onChange={(e) =>
                  setSelectedMiddleRow(Number(e.target.value))
                }
                className='p-2 border border-slate-200 rounded-xl dark:text-black bg-white'>
                {Array.from(
                  { length: middleRowCount },
                  (_, index) => (
                    <option key={index} value={index}>
                      Middle Row {index + 1}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
          <p className='ml-2 text-sm text-slate-600'>
            seats left on this row: {seatsLeft}
          </p>
        </div>
      );
    });
  };

  return (
    <div className='flex flex-col items-center p-4 border border-slate-200 rounded-xl dark:text-black '>
      <h2 className='text-xl mb-4 font-semibold'>
        Select Your Seats
      </h2>
      {renderSeats()}
      {/* clear button for selected seats */}
      <Button
        className='p-2 rounded-[5px] text-black '
        variant='ghost'
        onClick={() => handleClearSeats()}>
        Clear selection
      </Button>
    </div>
  );
};

export default SeatSelection;
