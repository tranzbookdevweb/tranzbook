"use client";
import Image from "next/image";
import React, { useEffect,useState } from "react";
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

const PaymentButton = dynamic(
  () => import("../(buttons)/paymentButton"),
  {
    ssr: false,
  }
);

interface BusDetailsProps {
  busImage: string | undefined;
  busNumber: string | number;
  busCompany: string | number;
  busType: string | number;
  busCapacity: number;
  busRoute: { origin: string; destination: string };
  tripDuration: string | number;
  tripDepartureTime: string | number;
  tripArrivalTime: string | number;
  busExtras: string | string[];
  busDriverID: string;
  busFare: number;
  currency: string;
  selectedSeats: string[];
  distance: number;
  currentDate: Date;
  id: string | string[];
  handleBooking: () => void;
  isBooked: boolean;
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
  currentDate,
  id,
  distance,
  handleBooking,
  isBooked,
}) => {
    const [users, setUsers] = useState();
    const totalCost: number = busFare * selectedSeats.length;

  return (
    <aside className='bg-white dark:text-black md:space-y-3 -w-72 max-sm:w-full sm:max-md:w-full min-h-full max-sm:min-h-fit p-5 flex flex-col items-center max-sm:justify-between sm:max-md:justify-between   rounded-lg overflow-y-scroll custom-scrollbar'>
      <div className='flex items-center w-full mb-5 flex-wrap max-[230px]:justify-center'>
        <Image
          src={`${busImage}`}
          alt='Bus'
          height={100}
          width={100}
          className=' object-cover shadow-sm border border-slate-100 rounded-[5px]'
        />
        <div className='ml-4 max-[230px]:text-center'>
          <h2 className='text-lg font-semibold text-gray-800'>
            {busCompany}
          </h2>
          <p className='text-sm text-gray-500'>{busType}</p>
        </div>
      </div>

      <div className='w-full flex flex-col md:space-y-5 min-[1366px]:space-y-[0.8em] space-y-[0.65em] md:pb-4'>
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

        <div className='flex items-center bg-white rounded-xl border border-slate-100 p-2'>
          {/* <FiMapPin className='text-blue-600 mr-2' /> */}
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
          {/* <p className='text-xs text-gray-500'>Date</p> */}
          <p className='text-sm font-semibold text-gray-700'>{` ${currentDate.toDateString()}`}</p>
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

        <div>
          <p className='text-xs text-gray-500'>Extras</p>
          <div className='flex flex-row flex-wrap gap-1 items-center'>
            {/* please replace with actual data(busExtras or amenities) from the supabase db */}
            {["Air Conditioning", "Power Outlets"].map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    className='text-sm font-semibold text-gray-700 text-wrap gap-1'>
                    {item === "Air Conditioning" && (
                      <div className='flex flex-row rounded-xl text-xs my-1 justify-center items-center gap-2 p-1 px-2 border border-slate-200 w-fit'>
                        {item}
                        <TbTemperatureSnow />
                      </div>
                    )}
                    {item === "Power Outlets" && (
                      <div className='flex flex-row rounded-xl text-xs justify-center items-center gap-2 p-1 px-2 border border-slate-200 w-fit'>
                        {item}
                        <ImSwitch />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
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
      </div>
      <PaymentButton
        busFare={busFare}
        selectedSeats={selectedSeats}
        handleBooking={handleBooking}
        // onClick={() => handlePayments({ onSuccess, onClose })}
        className={`w-full mt-5 lg:mt-5 py-2  text-white text-sm font-semibold rounded-[5px] ${
          selectedSeats.length !== 0 && !isBooked
            ? "bg-[#fc9a1a] hover:bg-[#F79009] hover:scale-105"
            : "bg-[#ffcd5993]"
        } transition-transform transform  `}
        disabled={selectedSeats.length !== 0 && isBooked}
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
