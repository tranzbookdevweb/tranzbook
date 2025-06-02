"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import generatePDF from "react-to-pdf";
import QRCode from "react-qr-code";
import Image from "next/image";

// Interfaces
interface PassengerDetail {
  name: string;
  phoneNumber: string;
  email?: string;
  kinName: string;
  kinContact: string;
  kinEmail?: string;
}

interface TicketProps {
  ticketId: string;
  busNumber: string;
  busCompany: string;
  tripDepartureTime: string | number;
  tripArrivalTime: string | number;
  busRoute: { origin: string; destination: string };
  tripDuration: number;
  busFare: number;
  busDescription: string | number;
  currentDate: Date;
  selectedSeats: string[];
  currency: string;
  reference: string;
  totalCost: number;
  isBooked: boolean;
  passengerDetails: PassengerDetail[];
}

const Ticket: React.FC<TicketProps> = ({
  ticketId,
  busCompany,
  busDescription,
  busRoute,
  tripDepartureTime,
  tripArrivalTime,
  currency,
  totalCost,
  currentDate,
  selectedSeats,
  reference,
  passengerDetails,
}) => {
  const handleDownloadTicket = () => {
    generatePDF(() => document.getElementById("ticket"), {
      method: "open",
      page: { format: "letter", orientation: "portrait" },
    });
  };

  const routeString = `${busRoute.origin} - ${busRoute.destination}`;
  const dateString = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        id="ticket"
        className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 text-sm font-sans transition-all duration-300 hover:shadow-xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{busCompany}</h2>
            <p className="text-xs font-medium opacity-80">E-Ticket Confirmation</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{dateString}</p>
            <p className="text-xs font-light opacity-80">Ticket #{reference}</p>
          </div>
        </div>

        {/* Route & Time Info */}
        <div className="grid grid-cols-3 gap-6 px-8 py-6 bg-gray-50 border-b border-gray-200 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-800">{busRoute.origin}</p>
            <p className="text-sm text-gray-500 mt-1">{tripDepartureTime}</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-1 w-12 bg-blue-300 rounded-full mx-2"></div>
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <div className="h-1 w-12 bg-blue-300 rounded-full mx-2"></div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{busRoute.destination}</p>
            <p className="text-sm text-gray-500 mt-1">{tripArrivalTime}</p>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="px-8 py-6 border-b border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Passenger(s) & Seat(s)</p>
          <div className="space-y-4 rounded-md p-4 bg-gray-50 shadow-sm">
            {passengerDetails.map((passenger, index) => (
              <div
                key={index}
                className="pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {passenger.name} (Seat {selectedSeats[index]})
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Phone:</strong> {passenger.phoneNumber}</p>
                  {passenger.email && <p><strong>Email:</strong> {passenger.email}</p>}
                  <p>
                    <strong>Emergency Contact:</strong> {passenger.kinName} - {passenger.kinContact}
                    {passenger.kinEmail && ` (${passenger.kinEmail})`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Info Grid */}
        <div className="px-8 py-6 grid grid-cols-2 gap-8 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Bus Type</p>
            <p className="text-base font-semibold text-gray-800">{busDescription}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Price</p>
            <p className="text-base font-semibold text-gray-800">
              {currency} {totalCost.toFixed(2)}
            </p>
          </div>
        </div>

        {/* QR Code & Notes */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Important Information</p>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-2">
              <li>Arrive 30 minutes prior to departure for smooth boarding</li>
              <li>Present this e-ticket or QR code at the boarding point</li>
              <li>Valid government-issued ID required during verification</li>
            </ul>
          </div>
          <div className="text-center">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
              <QRCode
                size={100}
                value={`TICKET:${reference}|ROUTE:${routeString}|SEATS:${selectedSeats.join(",")}|DATE:${dateString}`}
                viewBox="0 0 100 100"
                className="bg-white p-2 rounded"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Scan for Verification</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-100 flex justify-between items-center border-t border-gray-200 text-xs text-gray-600">
          <div className="flex items-center space-x-3">
            <Image
              src="/pictures/logo.png"
              alt="Tranzbook Logo"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-medium">Powered by Tranzbook Technologies</span>
          </div>
          <span className="font-medium">Booking Ref: {reference}</span>
        </div>
      </div>

      <Button
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
        onClick={handleDownloadTicket}
      >
        Download Your Ticket
      </Button>
    </div>
  );
};

export default Ticket;