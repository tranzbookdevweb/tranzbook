import Image from "next/image";
import React from "react";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,FiCalendar
} from "react-icons/fi";
import PaymentButton from "../(buttons)/paymentButton";
import { useSearchContext } from "../context/useSearchContext";

interface BusDetailsProps {
  busImage: string;
  busNumber: string | number;
  busCompany: string | number;
  busType: string | number;
  busCapacity: number;
  busRoute: { origin: string; destination: string };
  tripDuration: string | number;
  tripDepartureTime: string | number;
  tripArrivalTime: string | number;
  busExtras: string;
  busDriverID: string;
  busFare: number;
  currency: string;
  selectedSeats: string[];
  currentDate:Date;
  id:string|string[];
  handleBooking:()=>void;
  isBooked:boolean;
}

const BusDetails: React.FC<BusDetailsProps> = ({
  busImage,
  busNumber,
  busCompany,
  busType,
  busCapacity,
  busRoute,
  tripDuration,
  tripDepartureTime,
  tripArrivalTime,
  busExtras,
  busDriverID,
  busFare,
  currency,
  selectedSeats,
  currentDate,id,handleBooking,isBooked
}) => {
  const totalCost: number = busFare * selectedSeats.length;
  const { searchResults } = useSearchContext();

  // kindly correct this esp the body
  const createTicketAndBooking = async () => {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: `TICKET-${Date.now()}`,
        busId: id,
        userId: "USER123",
        tripId: "TRIP123",
        seatNumber: selectedSeats,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.error);
      return;
    }

    const data = await response.json();
    console.log("Created Ticket and Booking:", data);
    handleBooking();
  };

  // please make use of useSearchContext to get the details
  // of what the user searched for
  //since I cant properly  access the db and I cant tell if
  //whether I've made some mistakes or not

  return (
    <aside className='bg-white dark:text-black shadow-lg w-72 max-sm:w-full sm:max-md:w-full h-screen p-5 flex flex-col items-start border-r max-sm:border-t sm:max-md:border-t border-gray-200 rounded-lg'>
      <div className='flex items-center w-full mb-6'>
        <Image
          src={busImage}
          alt='Bus'
          height={100}
          width={100}
          className=' object-cover shadow-sm border border-slate-100 rounded-[5px]'
        />
        <div className='ml-4'>
          <h2 className='text-lg font-semibold text-gray-800'>
            {busCompany}
          </h2>
          <p className='text-sm text-gray-500'>{busType}</p>
        </div>
      </div>

      <div className='w-full space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-500'>Bus Number</span>
          <span className='text-sm font-semibold text-gray-700'>
            {busNumber}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-500'>Capacity</span>
          <span className='text-sm font-semibold text-gray-700'>
            {busCapacity} seats
          </span>
        </div>

        <div className='flex items-center'>
          <FiMapPin className='text-blue-600 mr-2' />
          <span className='text-sm font-semibold text-gray-700'>
            {busRoute.origin} → {busRoute.destination}
          </span>
        </div>

        <div className='flex items-center'>
          <FiClock className='text-blue-600 mr-2' />
          <span className='text-sm font-semibold text-gray-700'>
            {tripDuration} (Duration)
          </span>
        </div>
        <div className='flex items-center'>
          <FiCalendar className='text-blue-600 mr-2' />
          {/* <p className='text-xs text-gray-500'>Date</p> */}
          <p className='text-sm font-semibold text-gray-700'>{` ${currentDate.toDateString()}`}</p>
        </div>
        <div>
          <p className='text-xs text-gray-500'>Distance</p>
          <p className='text-sm font-semibold text-gray-700'>{`19 km`}</p>
        </div>

        <div>
          <p className='text-xs text-gray-500'>Departure</p>
          <p className='text-sm font-semibold text-gray-700'>
            {tripDepartureTime}
          </p>
        </div>

        <div>
          <p className='text-xs text-gray-500'>Arrival</p>
          <p className='text-sm font-semibold text-gray-700'>
            {tripArrivalTime}
          </p>
        </div>

        <div>
          <p className='text-xs text-gray-500'>Extras</p>
          <p className='text-sm font-semibold text-gray-700'>
            {busExtras}
          </p>
        </div>

        <div className='flex items-center'>
          <FiUser className='text-blue-600 mr-2' />
          <span className='text-sm font-semibold text-gray-700'>
            Driver ID: {busDriverID}
          </span>
        </div>
        <div>
          <div className='flex flex-col  justify-between border-t border-b py-4 border-gray-300'>
            <h2 className=' text-xs text-slate-400'>Charges:</h2>
            <div>
              <p className='text-sm '>
                Number of seats selected: {selectedSeats.length}
              </p>
              <p className='text-sm '>
                Charge per seat: {currency}{" "}
                {busFare.toLocaleString("en-US")}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <FiDollarSign className='text-blue-600 ' />{" "}
            <p>Total charge:</p>
            <span className='text-lg font-bold text-gray-900'>
              {currency} {totalCost.toLocaleString("en-US")}
            </span>
            {/* <p>ID: {id}</p>  */}
          </div>
        </div>
        {/* test if searchResultsContext works and replace 
        the dummy data with the data needed from it {searchResults.map((result) => (
          <div key={result.id}>
            <p>
              {result.startLocationName} to {result.endLocationName}
            </p>
            <p>Price: GH₵{result.price}</p>
          </div>
        ))} */}
        <PaymentButton
          busFare={busFare}
          selectedSeats={selectedSeats}
          handleBooking={handleBooking}
          className={`w-full mt-5 py-2  text-white text-sm font-semibold rounded-[5px] ${
            selectedSeats.length !== 0 && !isBooked
              ? "bg-blue-500 hover:bg-blue-700 hover:scale-105"
              : "bg-blue-200"
          } transition-transform transform  `}
          disabled={selectedSeats.length !== 0 && isBooked}
        />
      </div>
    </aside>
  );
};

export default BusDetails;
