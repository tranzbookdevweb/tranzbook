"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { IoCarSport } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";

import { HiOutlineTicket } from "react-icons/hi2";
import Image from "next/image";
import { FcAlarmClock } from "react-icons/fc";

interface Seat {
  id: number;
  number: string;
  isOccupied: boolean;
}

interface Ticket {
  id: string;
  busNumber: string | number;
  departureTime: string;
  arrivalTime: string;
  selectedSeats: Seat[];
  totalCost: number;
}

const initialTickets: Ticket[] = [
  {
    id: "TICKET123",
    busNumber: 45,
    departureTime: "2024-09-25T10:00",
    arrivalTime: "2024-09-25T14:00",
    selectedSeats: [
      { id: 1, number: "A1", isOccupied: false },
      { id: 2, number: "A2", isOccupied: true },
    ],
    totalCost: 30,
  },
];

function Page() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(
    null
  );
  const tripDurationHours = 4;
  const [departureTime, setDepartureTime] = useState<string>("");
  const calculateArrivalTime = (departure: string) => {
    const departureDate = new Date(departure);
    departureDate.setHours(
      departureDate.getHours() + tripDurationHours
    );
    return departureDate.toISOString().slice(0, 16);
  };

  const handleDepartureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDepartureTime = event.target.value;
    setDepartureTime(newDepartureTime);
    if (selectedTicket) {
      const updatedArrivalTime =
        calculateArrivalTime(newDepartureTime);
      setSelectedTicket({
        ...selectedTicket,
        departureTime: newDepartureTime,
        arrivalTime: updatedArrivalTime,
      });
    }
  };

  const handleSeatSelection = (seat: Seat) => {
    if (selectedTicket && !seat.isOccupied) {
      const updatedSeats = selectedTicket.selectedSeats.map((s) =>
        s.id === seat.id ? { ...s, isOccupied: true } : s
      );
      setSelectedTicket({
        ...selectedTicket,
        selectedSeats: updatedSeats,
      });
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDepartureTime(ticket.departureTime);
  };

  const handleSaveTicket = () => {
    if (selectedTicket) {
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.id === selectedTicket.id ? { ...selectedTicket } : t
        )
      );
      setSelectedTicket(null);
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.filter((t) => t.id !== ticketId)
    );
  };
  return (
    <>
      {/* Main logic behind trips will be calculated based on
       if the depature date has been overdue and check if the trip was canceled or not */}
      <div className='flex flex-col justify-center items-center min-w-full min-h-svh'>
        <Image
          src={"/noData.png"}
          alt='no data'
          width={300}
          height={300}
          quality={100}
        />
        <div className='flex flex-col items-center gap-1 -mt-6'>
          <h4 className='text-sm font-semibold'>No data available</h4>
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
      </div>
    </>
  );
}

export default Page;
