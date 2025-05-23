import React, { useState } from "react";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { RiCircleLine, RiMapPin2Fill } from "react-icons/ri";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbTemperatureSnow } from "react-icons/tb";
import { ImSwitch } from "react-icons/im";
import dynamic from "next/dynamic";
import Image from "next/image";
import PassengerDetails from "./PassengerDetails";

const PaymentButton = dynamic(
  () => import("../_buttons/paymentButton"),
  {
    ssr: false,
  }
);

interface PassengerDetail {
  name: string;
  age: string;
  phoneNumber: string;
  kinName: string;
  kinContact: string;
}

// Update the BusDetailsProps interface to include the new passenger details props
interface BusDetailsProps {
  busCompanyLogo: string | undefined;
  busImage: string | undefined;
  busNumber: string | number;
  busCompany: string | number;
  busDescription: string | number;
  busCapacity: number;
  remainingSeats: number;
  busRoute: { origin: string; destination: string };
  tripDuration: string | number;
  tripDepartureTime: string | number;
  tripArrivalTime: string | number;
  busExtras: { name: string; icon: React.ReactNode }[];
  busDriverID: string;
  busFare: number;
  currency: string;
  selectedSeats: string[];
  distance: number;
  currentDate: Date;
  id: string | string[];
  handleBooking: () => void;
  isBooked: boolean;
  passengerDetails: PassengerDetail[];
  setPassengerDetails: React.Dispatch<React.SetStateAction<PassengerDetail[]>>;
  passengerDetailsFilled: boolean;
  setPassengerDetailsFilled: (filled: boolean) => void;
}

const BusDetails: React.FC<BusDetailsProps> = ({
  busCompanyLogo,
  busImage,
  busNumber,
  busCompany,
  busDescription,
  busCapacity,
  remainingSeats,
  busRoute,
  tripDuration,
  tripDepartureTime,
  tripArrivalTime,
  busExtras,
  busDriverID,
  busFare,
  currency,
  selectedSeats,
  currentDate,
  id,
  distance,
  handleBooking,
  isBooked,
    passengerDetails,
  setPassengerDetails,
  passengerDetailsFilled,
  setPassengerDetailsFilled,
}) => {
  const totalCost: number = busFare * selectedSeats.length;
  return (
    <aside className='bg-white dark:text-black md:space-y-3 -w-72 max-sm:w-full sm:max-md:w-full min-h-full max-sm:min-h-fit p-5 flex flex-col items-center max-sm:justify-between sm:max-md:justify-between rounded-lg overflow-y-scroll custom-scrollbar'>
      <div className='flex items-center w-full mb-5 flex-wrap max-lg:justify-center'>
        <Image
          src={`https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${busCompanyLogo}`}
          alt='Bus'
          height={80}
          width={80}
          className=' object-cover shadow-sm border border-slate-100 rounded-full'
        />
        <div className='ml-4 max-[230px]:text-center'>
          <h2 className='text-lg font-semibold text-gray-800'>
            {busCompany}
          </h2>
          <p className='text-sm text-gray-500'>{busDescription}</p>
        </div>
      </div>

      <div className='w-full flex flex-col md:space-y-5 min-[1366px]:space-y-[0.8em] space-y-[0.65em] md:pb-4'>
        <p className='text-sm font-semibold text-red-500 p-2'>
          *Disclaimer: Selected seats may not be guaranteed.
        </p>

        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-500'>Total Capacity</span>
          <span className='text-sm font-semibold text-gray-700'>
            {busCapacity} seats
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-500'>Remaining Seats</span>
          <span className='text-sm font-semibold text-gray-700'>
            {remainingSeats} seats
          </span>
        </div>

        <div className='flex items-center bg-white rounded-xl border border-slate-100 p-2'>
          <div className='flex flex-col gap-1'>
            <RiCircleLine />
            <PiLineVerticalLight />
            <RiMapPin2Fill />
          </div>
          <div className='text-sm mx-2 font-semibold text-blue-600 flex flex-col justify-between min-h-full space-y-5'>
            <p>{busRoute.origin}</p>
            <p>{busRoute.destination}</p>
          </div>
        </div>

        <div className='flex items-center'>
          <FiClock className='text-blue-600 mr-2' />
          <span className='text-sm font-semibold text-gray-700'>
            {tripDuration} (min)
          </span>
        </div>

        <div className='flex items-center'>
          <FiCalendar className='text-blue-600 mr-2' />
          <p className='text-sm font-semibold text-gray-700'>{`${currentDate.toDateString()}`}</p>
        </div>

        <div>
          <p className='text-xs text-gray-500'>Distance</p>
          <p className='text-sm font-semibold text-gray-700'>
            {distance}km
          </p>
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

        <div className=''>
          <p className='text-xs py-3 text-gray-500'>Extras</p>
          <div className='grid grid-cols-2 gap-4'>
            {busExtras.map((item, index) => (
              <div
                key={index}
                className='flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-full shadow-sm space-x-2'>
                <div className='text-[12px]'>{item.icon}</div>
                <span className='text-[11px] font-semibold text-gray-700 dark:text-white'>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className='flex flex-col justify-between border-t border-b py-4 border-gray-300'>
            <h2 className='text-xs text-slate-400'>Charges:</h2>
            <div>
              <p className='text-sm'>
                Number of seats selected: {selectedSeats.length}
              </p>
              <p className='text-sm'>
                Charge per seat: {currency}{" "}
                {busFare.toLocaleString("en-US")}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <FiDollarSign className='text-blue-600 ' />
            <p>Total charge:</p>
            <span className='text-lg font-bold text-gray-900'>
              {currency} {totalCost.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </div>

      {/* Passenger Details Form - Only show when seats are selected and not yet booked */}
      {selectedSeats.length > 0 && !isBooked && (
        <div className="w-full mb-4 mt-4">
                 <PassengerDetails
            ticketQuantity={selectedSeats.length}
            selectedSeats={selectedSeats}
            setPassengerDetailsFilled={setPassengerDetailsFilled}
            passengerDetails={passengerDetails}
            setPassengerDetails={setPassengerDetails}
          />
        </div>
      )}

      <PaymentButton
        busFare={busFare}
        selectedSeats={selectedSeats}
        handleBooking={handleBooking}
        className={`w-full mt-5 lg:mt-5 py-2 text-white text-sm font-semibold rounded-[5px] ${
          selectedSeats.length !== 0 && !isBooked && passengerDetailsFilled
            ? "bg-[#fc9a1a] hover:bg-[#F79009] hover:scale-105"
            : "bg-[#ffcd5993]"
        } transition-transform transform`}
        disabled={selectedSeats.length === 0 || isBooked}
        passengerDetailsFilled={passengerDetailsFilled}
      />

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

export default BusDetails;