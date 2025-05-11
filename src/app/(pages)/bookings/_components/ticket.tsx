"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import generatePDF from "react-to-pdf";
import QRCode from "react-qr-code";
import Image from "next/image";

// Interface to match the props from your existing code
interface TicketProps {
  ticketId: string | string[];
  busNumber: string | number;
  busCompany: string;
  busDescription: string;
  busRoute: { origin: string; destination: string };
  tripDuration: string | number;
  tripDepartureTime: number | string;
  tripArrivalTime: number | string;
  busFare: number;
  currency: string;
  totalCost: number;
  currentDate: Date;
  selectedSeats: string[];
  isBooked: boolean;
  reference?: string;
}

const SimplifiedTicket: React.FC<TicketProps> = ({
  ticketId,
  busNumber,
  busCompany,
  busDescription,
  busRoute,
  tripDepartureTime,
  tripArrivalTime,
  currency,
  totalCost,
  currentDate,
  selectedSeats,
  isBooked,
  reference,
}) => {
  const handleDownloadTicket = () => {
    generatePDF(() => document.getElementById("ticket"), {
      method: "open",
      page: {
        format: "a4",
        orientation: "p",
      },
    });
  };

  // Format the route string
  const routeString = `${busRoute.origin} - ${busRoute.destination}`;

  // Format the date string
  const dateString = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "long",
  });

  // Format seat numbers for display (handle case with many seats)
  const displaySeats =
    selectedSeats.length > 4
      ? `${selectedSeats.slice(0, 2).join(", ")} +${selectedSeats.length - 2} more`
      : selectedSeats.join(", ");

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="ticket" className="bg-white rounded-lg shadow-md p-6 relative">
        {/* Header Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{routeString}</h2>
              <p className="text-sm text-gray-500">{dateString}</p>
            </div>
            {/* <button className="text-rose-500">
              <Share2 size={20} />
            </button> */}
          </div>
        </div>

        {/* Ticket Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500">Bus Operator</p>
            <p className="font-medium">{busCompany}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Seat Number(s)</p>
            <p className="font-medium">{displaySeats}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ticket ID</p>
            <p className="font-medium">
              {reference || (typeof ticketId === "object" ? ticketId[0] : ticketId)}
            </p>
          </div>
          {busNumber && (
            <div>
              <p className="text-xs text-gray-500">Bus Number</p>
              <p className="font-medium">{busNumber}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">Description</p>
            <p className="font-medium">{busDescription}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Departure</p>
            <p className="font-medium">{tripDepartureTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Arrival</p>
            <p className="font-medium">{tripArrivalTime}</p>
          </div>
        </div>

        {/* Total Cost */}
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-semibold text-rose-500">
              {currency}{" "}
              {totalCost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4 p-2 bg-white">
          <QRCode
            size={128}
            value={`TICKET:${reference || (typeof ticketId === "object" ? ticketId[0] : ticketId)}|ROUTE:${routeString}|SEATS:${selectedSeats.join(",")}|DATE:${dateString}`}
            viewBox="0 0 128 128"
            className="border-4 border-white"
          />
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 italic mb-4">
          Note: Just show your QR code while boarding the bus.
        </p>

        {/* Tranzbook Technologies Branding */}
        <div className="flex justify-center items-center gap-2 py-2 border-t border-gray-200">
          <Image
            src="/pictures/logo.png" // Replace with actual logo URL
            alt="Tranzbook Technologies Logo"
            width={35}
            height={35}
            className="object-contain"
          />
          <p className="text-xs text-gray-600 font-medium">
            Powered by Tranzbook Technologies
          </p>
        </div>
      </div>

      <Button
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleDownloadTicket}
      >
        Download Ticket
      </Button>
    </div>
  );
};

export default SimplifiedTicket;
