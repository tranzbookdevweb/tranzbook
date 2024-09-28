"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";

interface Ticket {
  id: number;
  name: string;
  date: string;
  seatCode: string;
  ticketId: string;
  totalCost: string;
  busNumber: string;
  busCompany: string;
  busType: string;
  busRoute: string;
  tripDuration: string;
  tripDepartureTime: string;
  tripArrivalTime: string;
  busFare: string;
  currency: string;
  currentDate: string;
  selectedSeats: string[];
}

interface TicketGroups {
  active: Ticket[];
  canceled: Ticket[];
  used: Ticket[];
}

const Page: React.FC = () => {
  const tickets: TicketGroups = {
    canceled: [],
    active: [
      {
        id: 1,
        name: "Accra to Kumasi",
        date: "2024-09-26",
        seatCode: "ML-12",
        ticketId: "GH123",
        totalCost: "120 GHC",
        busNumber: "GR-1234-23",
        busCompany: "VIP Bus",
        busType: "Luxury",
        busRoute: "Accra to Kumasi",
        tripDuration: "5 hours",
        tripDepartureTime: "8:00 AM",
        tripArrivalTime: "1:00 PM",
        busFare: "100 GHC",
        currency: "GHC",
        currentDate: "2024-09-22",
        selectedSeats: ["ML-12"],
      },
      {
        id: 2,
        name: "Accra to Takoradi",
        date: "2024-10-02",
        seatCode: "FL-5",
        ticketId: "GH456",
        totalCost: "80 GHC",
        busNumber: "AS-6789-23",
        busCompany: "STC",
        busType: "Standard",
        busRoute: "Accra to Takoradi",
        tripDuration: "4 hours",
        tripDepartureTime: "6:00 AM",
        tripArrivalTime: "10:00 AM",
        busFare: "75 GHC",
        currency: "GHC",
        currentDate: "2024-09-22",
        selectedSeats: ["FL-5"],
      },
    ],
    used: [
      {
        id: 3,
        name: "Kumasi to Tamale",
        date: "2024-08-15",
        seatCode: "BL-9",
        ticketId: "GH789",
        totalCost: "150 GHC",
        busNumber: "BA-4321-22",
        busCompany: "Metro Mass",
        busType: "Economy",
        busRoute: "Kumasi to Tamale",
        tripDuration: "6 hours",
        tripDepartureTime: "9:00 AM",
        tripArrivalTime: "3:00 PM",
        busFare: "140 GHC",
        currency: "GHC",
        currentDate: "2024-08-10",
        selectedSeats: ["BL-9"],
      },
    ],
  };

  const renderTicketsTable = () => (
    <table className='min-w-full bg-white border border-slate-200 shadow-lg rounded-lg'>
      <thead className='bg-slate-100'>
        <tr>
          {[
            "Ticket Type",
            "Ticket Name",
            "Date",
            "Seat Code",
            "Bus Number",
            "Bus Company",
            "Departure",
            "Arrival",
            "Total Cost",
          ].map((header) => (
            <th key={header} className='px-6 py-4 text-left'>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='text-slate-600'>
        {["canceled", "active", "used"].map((type) =>
          tickets[type as keyof TicketGroups].length > 0 ? (
            tickets[type as keyof TicketGroups].map((ticket) => (
              <tr key={ticket.id} className='hover:bg-slate-50'>
                <td className='border px-6 py-4 capitalize'>
                  {type}
                </td>
                <td className='border px-6 py-4'>{ticket.name}</td>
                <td className='border px-6 py-4'>{ticket.date}</td>
                <td className='border px-6 py-4'>
                  {ticket.seatCode}
                </td>
                <td className='border px-6 py-4'>
                  {ticket.busNumber}
                </td>
                <td className='border px-6 py-4'>
                  {ticket.busCompany}
                </td>
                <td className='border px-6 py-4'>
                  {ticket.tripDepartureTime}
                </td>
                <td className='border px-6 py-4'>
                  {ticket.tripArrivalTime}
                </td>
                <td className='border px-6 py-4'>
                  {ticket.totalCost}
                </td>
              </tr>
            ))
          ) : (
            <tr key={`${type}-empty`}>
              <td
                colSpan={9}
                className='border px-6 py-4 text-center text-slate-400'>
                No {type} tickets
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );

  return (
    <div className='p-8'>
      {Object.values(tickets).some((group) => group.length > 0) ? (
        <div className='overflow-auto'>{renderTicketsTable()}</div>
      ) : (
        <div className='flex flex-col items-center gap-3 -mt-6'>
          <Image
            src='/noData.png'
            alt='No data available'
            width={300}
            height={300}
            quality={100}
          />
          <h4 className='text-lg font-semibold'>No data available</h4>
          <p className='text-slate-400 text-sm'>
            You need to complete a trip
          </p>
          <Button
            variant='outline'
            className='bg-blue-600 text-white rounded-[5px]'>
            <FiPlus size={20} />
            Add one
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
