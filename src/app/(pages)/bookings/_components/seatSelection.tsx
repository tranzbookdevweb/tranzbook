/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface SeatSelectionProps {
  tripId: string;
  busCapacity: number;
  busDescription: string;
  bookedSeats?: number[];
  selectedSeats: string[];
  handleSeatSelection: (seatId: string) => void;
  handleClearSeats: () => void;
  handleSelectAllSeats: () => void;
  ticketQuantity?: number; // New prop for ticket quantity
  ticketLimitReached?: boolean; // New prop for ticket limit status
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  tripId,
  busCapacity,
  busDescription,
  bookedSeats,
  selectedSeats,
  handleSeatSelection,
  handleClearSeats,
  handleSelectAllSeats,
  ticketQuantity = 1, // Default to 1 if not provided
  ticketLimitReached = false,
}) => {
  const totalPassengerSeats = busCapacity;
  const numberOfDigits = totalPassengerSeats.toString().length;
  const formatSeatNumber = (seatNumber: number) => {
    return (seatNumber + 1).toString().padStart(numberOfDigits, "0");
  };

  // Determine bus layout based on busDescription
  const getBusLayout = () => {
    if (busDescription === "Tour") {
      return { 
        leftSeats: 2, 
        rightSeats: 2,
        hasBackRow: true,
        backRowSeats: 5 // 5 seats in the back row for Tour bus
      };
    } else if (busDescription === "Executive") {
      return { 
        leftSeats: 2, 
        rightSeats: 1,
        hasBackRow: true,
        backRowSeats: 3 // 3 seats in the back row for Executive bus
      };
    }
     else if (busDescription === "Standard") {
      return { 
        leftSeats: 2, 
        rightSeats: 1,
        hasBackRow: true,
        backRowSeats: 5 // 3 seats in the back row for Executive bus
      };
    } else {
      return { 
        leftSeats: 1, 
        rightSeats: 1,
        hasBackRow: true,
        backRowSeats: 2 // 2 seats in the back row for Standard bus
      };
    }
  };

  const busLayout = getBusLayout();
  const seatsPerRow = busLayout.leftSeats + busLayout.rightSeats;

  const renderSeats = () => {
    let allSeats: JSX.Element[] = [];
    let seatCount = 0;

    // Add driver seat and front door
    allSeats.push(
      <div className="flex justify-between w-full mb-4" key="front-section">
        <div
          className="m-2 max-sm:m-1 dark:text-black w-16 lg:w-24 lg:h-28 min-[390px]:w-[70px] max-sm:h-20 min-[390px]:h-[85px] min-[430px]:w-[80px] min-[430px]:h-24"
          key="driver-seat">
          <p className="text-center text-xs text-slate-500">Driver</p>
          <button className="w-full flex flex-col items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 px-5 bg-gray-300 bg-[url('/driver.png')] bg-cover bg-no-repeat h-16 min-[390px]:h-[70px] min-[430px]:h-[80px] md:h-20 lg:h-24 bg-center"></button>
        </div>
        <div
          className="m-2 max-sm:m-1 w-16 lg:w-24 lg:h-28 min-[390px]:w-[70px] max-sm:h-20 min-[390px]:h-[85px] min-[430px]:w-[80px] min-[430px]:h-24"
          key="entrance">
          <p className="text-center text-xs text-slate-500">Entrance</p>
          <div className="w-full flex flex-col items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 px-5 bg-gray-100 h-16 min-[390px]:h-[70px] min-[430px]:h-[80px] md:h-20 lg:h-24">
            <div className="w-full h-full border-2 border-dashed border-gray-400"></div>
          </div>
        </div>
      </div>
    );

    // Calculate how many regular rows we need before the back row
    const regularRowsCount = Math.ceil((totalPassengerSeats - busLayout.backRowSeats) / seatsPerRow);
    
    // Render regular rows
    for (let row = 0; row < regularRowsCount; row++) {
      const leftSide: JSX.Element[] = [];
      const rightSide: JSX.Element[] = [];
      const aisle = 
        <div key={`aisle-${row}`} className="flex items-center justify-center mx-2">
          <div className="h-16 w-6 flex items-center">
            <div className="border-b border-dashed border-gray-300 w-full"></div>
          </div>
        </div>;

      // Render left side seats
      for (let i = 0; i < busLayout.leftSeats; i++) {
        if (seatCount >= totalPassengerSeats - busLayout.backRowSeats) break;
        
        const seatId = formatSeatNumber(seatCount);
        const isSelected = selectedSeats.includes(seatId);
        
        leftSide.push(
          renderSeat(seatId, seatCount, isSelected)
        );
        
        seatCount++;
      }

      // Render right side seats
      for (let i = 0; i < busLayout.rightSeats; i++) {
        if (seatCount >= totalPassengerSeats - busLayout.backRowSeats) break;
        
        const seatId = formatSeatNumber(seatCount);
        const isSelected = selectedSeats.includes(seatId);
        
        rightSide.push(
          renderSeat(seatId, seatCount, isSelected)
        );
        
        seatCount++;
      }

      allSeats.push(
        <div
          key={`row-${row}`}
          className="flex flex-row justify-between w-full mb-2">
          <div className="flex flex-row">
            {leftSide}
          </div>
          {aisle}
          <div className="flex flex-row">
            {rightSide}
          </div>
        </div>
      );
    }

    // Add back row that spans full width
    if (busLayout.hasBackRow && busLayout.backRowSeats > 0) {
      const backRow: JSX.Element[] = [];
      
      for (let i = 0; i < busLayout.backRowSeats; i++) {
        if (seatCount >= totalPassengerSeats) break;
        
        const seatId = formatSeatNumber(seatCount);
        const isSelected = selectedSeats.includes(seatId);
        
        backRow.push(
          renderSeat(seatId, seatCount, isSelected)
        );
        
        seatCount++;
      }
      
      allSeats.push(
        <div key="back-row" className="mt-4 border-t-2 border-dashed border-gray-200 pt-4">
          <p className="text-center text-xs text-slate-500 mb-2">Back Row</p>
          <div className="flex flex-row justify-center w-full">
            {backRow}
          </div>
        </div>
      );
    }

    return allSeats;
  };

  const renderSeat = (seatId: string, seatIndex: number, isSelected: boolean) => {
    // Determine if the seat is disabled because it's booked or if ticket limit is reached
    const isBooked = bookedSeats?.includes(seatIndex + 1);
    const isDisabled = isBooked || (ticketLimitReached && !isSelected);
    
    return (
      <div className="m-1 max-sm:m-1 dark:text-gray-500 font-semibold" key={seatId}>
        <button
          onClick={() => {
            handleSeatSelection(seatId);
            console.log('Seat clicked:', seatId);
          }}
          className={`flex flex-col items-center justify-center w-12 h-16 min-[340px]:w-14 min-[390px]:w-16 min-[430px]:w-18 sm:w-20 md:w-20 lg:w-20 gap-1 border border-slate-200 rounded-xl p-1 transition-all duration-300 
            ${isSelected ? "bg-[#FFCC59] text-white" : "bg-white text-gray-500"}
            ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
          `}
          disabled={isDisabled}
          title={
            isBooked 
              ? "This seat is already booked" 
              : (ticketLimitReached && !isSelected) 
                ? `Maximum of ${ticketQuantity} tickets allowed` 
                : ""
          }
        >
          <Image
            src="/seat.png"
            alt="seat"
            height={40}
            width={40}
            className="object-contain max-sm:w-6 max-sm:h-6 w-6 h-6"
          />
          <p className="text-center text-xs md:text-sm">{seatId}</p>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col items-center h-full p-2 overflow-hidden md:p-4 border border-slate-200 rounded-xl dark:text-black overflow-hidden w-full max-w-2xl mx-auto">
        {/* Bus roof */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-300 rounded-t-xl"></div>
        
        {/* Bus type */}
        <h1 className="text-center text-lg font-semibold mb-3 text-gray-600">{busDescription} Bus</h1>
        
        {/* Ticket limit indicator */}
        <div className="text-center mb-2">
          <span className="text-sm text-gray-600">
            You can select up to <span className="font-bold">{ticketQuantity}</span> seat{ticketQuantity !== 1 ? 's' : ''}
          </span>
        </div>
        
        {selectedSeats.length > 0 ? (
          <div className="flex flex-col items-center justify-center mb-4">
            <h3 className="text-center text-xl font-semibold">{`${
              selectedSeats.length > 1
                ? `${
                    selectedSeats.length === totalPassengerSeats
                      ? "All"
                      : selectedSeats.length
                  } seats`
                : `${selectedSeats.length} seat`
            } selected`}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {ticketLimitReached 
                ? `Maximum limit of ${ticketQuantity} reached` 
                : `You can select ${ticketQuantity - selectedSeats.length} more seat${ticketQuantity - selectedSeats.length !== 1 ? 's' : ''}`}
            </p>
            <div className="flex flex-row gap-6 justify-center mt-2">
              <Button
                className="p-2 rounded-md text-slate-500 text-center text-sm"
                variant="ghost"
                onClick={() => handleClearSeats()}>
                Clear selection
              </Button>
              <Button
                className="p-2 rounded-md text-[#b38f3cbd] text-center text-sm"
                variant="ghost"
                onClick={() => handleSelectAllSeats()}
                disabled={ticketQuantity < 1}>
                {ticketQuantity > 1 ? `Select ${Math.min(ticketQuantity, totalPassengerSeats)} seats` : 'Select all'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4">
            <h2 className="text-xl pb-2 font-semibold">
              Select Your Seats
            </h2>
            <p className="text-sm text-gray-500">
              Please select up to {ticketQuantity} seat{ticketQuantity !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div
          className="w-full max-h-[500px] overflow-y-auto custom-scrollbar p-2">
          <div className="bus-interior">
            {renderSeats()}
          </div>
        </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #b7ebf8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #f1f1f1;
        }
        .bus-interior {
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default SeatSelection;