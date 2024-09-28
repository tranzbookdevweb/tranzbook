"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";

type Ticket = {
  id: number;
  name: string;
  date: string;
  seatNumber: number;
};

function Page() {
  const tickets: {
    active: Ticket[];
    canceled: Ticket[];
    used: Ticket[];
  } = {
    canceled: [],
    active: [
      { id: 1, name: "Ticket A", date: "2024-09-26", seatNumber: 12 },
      { id: 2, name: "Ticket B", date: "2024-10-02", seatNumber: 23 },
    ],
    used: [
      { id: 3, name: "Ticket C", date: "2024-08-15", seatNumber: 7 },
    ],
  };

  const renderTicketsTable = () => {
    return (
      <table className='min-w-full bg-white border'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Ticket Type</th>
            <th className='px-4 py-2'>Ticket Name</th>
            <th className='px-4 py-2'>Date</th>
            <th className='px-4 py-2'>Seat Number</th>
          </tr>
        </thead>
        <tbody>
          {tickets.canceled.length > 0 ? (
            tickets.canceled.map((ticket) => (
              <tr key={ticket.id}>
                <td className='border px-4 py-2'>Canceled</td>
                <td className='border px-4 py-2'>{ticket.name}</td>
                <td className='border px-4 py-2'>{ticket.date}</td>
                <td className='border px-4 py-2'>
                  {ticket.seatNumber}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className='border px-4 py-2 text-center text-slate-400'>
                No canceled tickets
              </td>
            </tr>
          )}

          {tickets.active.length > 0 ? (
            tickets.active.map((ticket) => (
              <tr key={ticket.id}>
                <td className='border px-4 py-2'>Active</td>
                <td className='border px-4 py-2'>{ticket.name}</td>
                <td className='border px-4 py-2'>{ticket.date}</td>
                <td className='border px-4 py-2'>
                  {ticket.seatNumber}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className='border px-4 py-2 text-center text-slate-400'>
                No active tickets
              </td>
            </tr>
          )}

          {tickets.used.length > 0 ? (
            tickets.used.map((ticket) => (
              <tr key={ticket.id}>
                <td className='border px-4 py-2'>Used</td>
                <td className='border px-4 py-2'>{ticket.name}</td>
                <td className='border px-4 py-2'>{ticket.date}</td>
                <td className='border px-4 py-2'>
                  {ticket.seatNumber}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className='border px-4 py-2 text-center text-slate-400'>
                No used tickets
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className='p-6'>
      {tickets.active.length > 0 ||
      tickets.canceled.length > 0 ||
      tickets.used.length > 0 ? (
        <div className='overflow-auto'>{renderTicketsTable()}</div>
      ) : (
        <div className='flex flex-col items-center gap-1 -mt-6'>
          <Image
            src={"/noData.png"}
            alt='no data'
            width={300}
            height={300}
            quality={100}
          />
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
      )}
    </div>
  );
}

export default Page;
