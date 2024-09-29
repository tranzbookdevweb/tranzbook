"use client";
import React, { useState } from "react";
import BusDetails from "../(components)/busDetails";
import SeatSelection from "../(components)/seatSelection";
import Ticket from "../(components)/ticket";
import { v4 as uuidv4 } from "uuid";
import { useSearchContext } from "../context/useSearchContext";

const Page = () => {
  const [currency, setCurrency] = useState<string>("GHS");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false);
  const { searchResults } = useSearchContext();
  const {
    logoUrl,
    busType,
    price: busFare,
    startLocationName,
    endLocationName,
    duration: tripDuration,
    id: tripId,
    imageUrl,
    //
  } = searchResults[0];

  // placeholders
  const busCompany = "Bus Company";
  const busNumber = "PN-123-ABC";
  const busCapacity = 50;
  const tripDepartureTime = "08:00 AM";
  const tripArrivalTime = "12:00 PM";
  const busExtras = "Wi-Fi, AC";
  const busDriverID = "Driver-123";
  const busRoute: {
    origin: string;
    destination: string;
  } = { origin: startLocationName, destination: endLocationName };

  const busImage = logoUrl
    ? `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${imageUrl}`
    : "default-logo-url";

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleClearSeats = () => {
    setSelectedSeats([]);
  };
  const currentDate: Date = new Date();
  const bookingId: string = uuidv4();
  const totalCost: number = busFare * selectedSeats.length;
  const handleBooking = () => {
    // just testing
    setBooked(!isBooked);
  };

  if (!searchResults || searchResults.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <>
      <main className='flex-1  border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden '>
        {/* <h1 className='text-black text-2xl mb-'>Bus Seat Selection</h1> */}
        <div className='flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse'>
          <BusDetails
            busImage={busImage}
            busNumber={busNumber}
            busCompany={busType}
            tripDepartureTime={tripDepartureTime}
            tripArrivalTime={tripArrivalTime}
            busExtras={busExtras}
            busDriverID={busDriverID}
            busCapacity={busCapacity}
            busType={busType}
            busRoute={busRoute}
            tripDuration={tripDuration}
            busFare={busFare}
            selectedSeats={selectedSeats}
            currency={currency}
            handleBooking={handleBooking}
            isBooked={isBooked}
            id={tripId}
            currentDate={currentDate}
          />
          <section className='bg-white flex flex-col items-center  p-5 w-full rounded-lg overflow-auto '>
            {isBooked === false ? (
              <>
                <h2 className='text-lg mb-3'>
                  Passenger seats available
                </h2>
                <SeatSelection
                  busCapacity={busCapacity}
                  selectedSeats={selectedSeats}
                  handleSeatSelection={handleSeatSelection}
                  handleClearSeats={handleClearSeats}
                />
              </>
            ) : (
              <Ticket
                ticketId={tripId}
                busNumber={busNumber}
                busCompany={busCompany}
                tripDepartureTime={tripDepartureTime}
                tripArrivalTime={tripArrivalTime}
                busRoute={busRoute}
                busFare={busFare}
                busType={busType}
                currency={currency}
                tripDuration={tripDuration}
                totalCost={totalCost}
                currentDate={currentDate}
                selectedSeats={selectedSeats}
              />
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Page;
