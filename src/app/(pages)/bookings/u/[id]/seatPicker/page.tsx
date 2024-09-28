"use client";
import React, { useState } from "react";
import BusDetails from "../../../(components)/busDetails";
import SeatSelection from "../../../(components)/seatSelection";
import Ticket from "../../../(components)/ticket";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { SearchProvider } from "../../../context/useSearchContext";


const Page = ({ params }: { params: { id: string } }) => {
  const { id } = useParams();
  // I will replace it with SearchResults from useSearchContext
  // this is just a dummy data. 
  const [busNumber, setBusNumber] = useState<string>("AS-9443-20");
  const [busCompany, setBusCompany] = useState<string>("Volvo");
  const [busType, setBusType] = useState<string>("Luxury");
  const [busCapacity, setBusCapacity] = useState<number>(65);
  const [busRoute, setBusRoute] = useState<{
    origin: string;
    destination: string;
  }>({
    origin: "Accra",
    destination: "Kumasi",
  });
  const [busExtras, setBusExtras] = useState<string>(
    "Wi-Fi, power outlets, air conditioning, restrooms"
  );
  const [tripDuration, setTripDuration] = useState<number>(6);
  const [tripDepartureTime, setTripDepartureTime] = useState<
    string | number
  >("11:00am");
  const [tripArrivalTime, setTripArrivalTime] = useState<
    string | number
  >("4:00pm");
  const [busDriverID, setBusDriverID] = useState<string>(
    "Mr Asamoah-79779"
  );
  const [busFare, setBusFare] = useState<number>(200);
  const [busImage, setBusImage] = useState<string>("/BusA.jpg");
  const [currency, setCurrency] = useState<string>("GHS");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false); // use isTicketActive from db

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

  return (
    <SearchProvider>
      <main className='flex-1  border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden '>
        {/* <h1 className='text-black text-2xl mb-'>Bus Seat Selection</h1> */}
        <div className='flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse'>
          {/* eliminate the use of props with useSearchContext so that the data will reflect what the user actually search from
          check seatSelection.tsx, you can apply it here on the individual components, I prefer the 
          individual components.
          */}
          <BusDetails
            busImage={busImage}
            busNumber={busNumber}
            busCompany={busCompany}
            busType={busType}
            busCapacity={busCapacity}
            busRoute={busRoute}
            tripDuration={tripDuration}
            tripDepartureTime={tripDepartureTime}
            tripArrivalTime={tripArrivalTime}
            busExtras={busExtras}
            busDriverID={busDriverID}
            busFare={busFare}
            selectedSeats={selectedSeats}
            currency={currency}
            handleBooking={handleBooking}
            isBooked={isBooked}
            id={id}
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
                ticketId={id}
                busNumber={busNumber}
                busCompany={busCompany}
                busFare={busFare}
                busType={busType}
                currency={currency}
                tripDuration={tripDuration}
                tripDepartureTime={tripDepartureTime}
                tripArrivalTime={tripArrivalTime}
                busRoute={busRoute}
                totalCost={totalCost}
                currentDate={currentDate}
                selectedSeats={selectedSeats}
              />
            )}
          </section>
        </div>
      </main>
    </SearchProvider>
  );
};

export default Page;
