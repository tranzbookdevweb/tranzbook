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
  phoneNumber: string;
  email?: string;
  kinName: string;
  kinContact: string;
  kinEmail?: string;
}

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
    <div className='w-full max-w-7xl max-sm:w-7xl bg-white rounded-lg shadow-sm border border-gray-200 h-fit'>
      {/* Company Header */}
      <div className='p-4 border-b border-gray-100'>
        <div className='flex items-center gap-3'>
          <Image
            src={`https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${busCompanyLogo}`}
            alt='Bus Company'
            height={48}
            width={48}
            className='rounded-lg object-cover'
          />
          <div>
            <h3 className='font-semibold text-gray-900'>{busCompany}</h3>
            <p className='text-sm text-gray-500'>{busDescription}</p>
          </div>
        </div>
      </div>

      {/* Route & Time */}
      <div className='p-4 border-b border-gray-100'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='flex flex-col items-center'>
            <RiCircleLine className='text-blue-500' />
            <div className='w-px h-8 bg-gray-300 my-1'></div>
            <RiMapPin2Fill className='text-red-500' />
          </div>
          <div className='flex-1'>
            <div className='flex justify-between items-center mb-1'>
              <span className='font-medium text-gray-900'>{busRoute.origin}</span>
              <span className='text-sm text-gray-500'>{tripDepartureTime}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-medium text-gray-900'>{busRoute.destination}</span>
              <span className='text-sm text-gray-500'>{tripArrivalTime}</span>
            </div>
          </div>
        </div>
        
        <div className='flex items-center gap-4 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <FiClock size={14} />
            <span>{tripDuration} min</span>
          </div>
          <div className='flex items-center gap-1'>
            <FiCalendar size={14} />
            <span>{currentDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className='p-4 border-b border-gray-100'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-gray-500'>Distance</span>
            <p className='font-medium text-gray-900'>{distance}km</p>
          </div>
          <div>
            <span className='text-gray-500'>Available</span>
            <p className='font-medium text-gray-900'>{remainingSeats} seats</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className='p-4 border-b border-gray-100'>
        <h4 className='text-sm font-medium text-gray-700 mb-2'>Amenities</h4>
        <div className='flex flex-wrap gap-2'>
          {busExtras.map((item, index) => (
            <div
              key={index}
              className='flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600'
            >
              <span className='text-xs'>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Passenger Details */}
      {selectedSeats.length > 0 && !isBooked && (
        <div className='p-4 border-b border-gray-100 bg-blue-50'>
          <div className='flex items-center gap-2 mb-3'>
            <FiUser size={16} className='text-blue-600' />
            <h4 className='font-medium text-gray-900'>Passenger Details</h4>
          </div>
          <PassengerDetails
            selectedSeats={selectedSeats}
            setPassengerDetailsFilled={setPassengerDetailsFilled}
            passengerDetails={passengerDetails}
            setPassengerDetails={setPassengerDetails}
          />
        </div>
      )}

      {/* Pricing */}
      <div className='p-4 border-b border-gray-100'>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Seats selected:</span>
            <span className='font-medium'>{selectedSeats.length}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Price per seat:</span>
            <span className='font-medium'>{currency} {busFare.toLocaleString()}</span>
          </div>
          <div className='flex justify-between items-center pt-2 border-t border-gray-200'>
            <span className='font-semibold text-gray-900'>Total:</span>
            <span className='text-lg font-bold text-blue-600'>
              {currency} {totalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className='p-4'>
        <PaymentButton
          busFare={busFare}
          selectedSeats={selectedSeats}
          handleBooking={handleBooking}
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
            selectedSeats.length !== 0 && !isBooked && passengerDetailsFilled
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={selectedSeats.length === 0 || isBooked || !passengerDetailsFilled}
          passengerDetailsFilled={passengerDetailsFilled}
        />
        
        {selectedSeats.length === 0 && (
          <p className='text-center text-sm text-gray-500 mt-2'>
            Select seats to continue
          </p>
        )}
        
        {selectedSeats.length > 0 && !passengerDetailsFilled && !isBooked && (
          <p className='text-center text-sm text-orange-600 mt-2'>
            Complete passenger details above
          </p>
        )}

        <p className='text-xs text-gray-500 text-center mt-3'>
          *Selected seats may not be guaranteed
        </p>
      </div>
    </div>
  );
};

export default BusDetails;