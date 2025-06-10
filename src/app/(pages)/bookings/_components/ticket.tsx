"use client";
import React, { useState } from "react";
import { Eye, Download, Share2, X, MapPin, Clock, Users, Bus, Phone, Mail, User } from "lucide-react";

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

// QR Code Component
const QRCode: React.FC<{ value: string; size?: number }> = ({ value, size = 120 }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  
  return (
    <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
      <img 
        src={qrCodeUrl} 
        alt="QR Code" 
        className="w-full h-auto rounded"
        onError={(e) => {
          // Fallback to placeholder if QR service fails
          e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="#6b7280">QR Code</text>
            </svg>
          `)}`;
        }}
      />
    </div>
  );
};

// Dialog Component
const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-[999999] inset-0  flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[1pc] shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const TicketCard: React.FC<{
  passenger: PassengerDetail;
  seat: string;
  ticketData: TicketProps;
  index: number;
}> = ({ passenger, seat, ticketData, index }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleViewDetails = () => {
    setShowDialog(true);
  };

  const generatePDF = () => {
    const routeString = `${ticketData.busRoute.origin} - ${ticketData.busRoute.destination}`;
    const dateString = ticketData.currentDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
const ticketContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bus Ticket - ${passenger.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f9fafb;
            color: #111827;
          }
          .ticket {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(to right, #3b82f6, #2563eb);
            padding: 16px;
            color: white;
            text-align: center;
          }
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .header p {
            font-size: 14px;
            margin: 4px 0;
            color: #bfdbfe;
          }
          .content {
            padding: 24px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          }
          .section-title::before {
            content: "•";
            margin-right: 8px;
            color: #2563eb;
          }
          .journey-section {
            background: linear-gradient(to right, #eff6ff, #dcfce7);
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
          }
          .route {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .route-point {
            text-align: center;
            flex: 1;
          }
          .route-point p {
            margin: 0;
          }
          .route-point .location {
            font-weight: bold;
            font-size: 16px;
          }
          .route-point .time {
            font-size: 12px;
            color: #4b5563;
          }
          .route-line {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: center;
          }
          .route-line .line {
            width: 80px;
            height: 2px;
            background: linear-gradient(to right, #3b82f6, #22c55e);
            position: relative;
            margin: 0 12px;
          }
          .route-line .line::before {
            content: "🚌";
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            background: #f9fafb;
            padding: 0 4px;
          }
          .duration {
            text-align: center;
            font-size: 14px;
            color: #4b5563;
            background: white;
            padding: 4px 12px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
          }
          .duration::before {
            content: "⏰";
            margin-right: 4px;
          }
          .grid-container {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
          }
          .info-card {
            background: white;
            border: 1px solid #e5e7eb;
            padding: 16px;
            border-radius: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .info-row .label {
            color: #6b7280;
          }
          .info-row .value {
            font-weight: 500;
          }
          .qr-section {
            text-align: center;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: white;
          }
          .qr-section img {
            width: 160px;
            height: 160px;
            margin-bottom: 12px;
          }
          .qr-section p {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
          }
          .notes-section {
            background: #fefce8;
            border: 1px solid #fef08a;
            padding: 16px;
            border-radius: 8px;
            margin-top: 24px;
          }
          .notes-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 14px;
            color: #713f12;
          }
          .notes-section li {
            margin-bottom: 4px;
          }
          .notes-section li::before {
            content: "•";
            margin-right: 8px;
            color: #eab308;
          }
          @media print {
            body { margin: 0; }
            .ticket { box-shadow: none; border: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>${ticketData.busCompany}</h1>
            <p>Bus Ticket</p>
            <p>Reference: ${ticketData.reference}</p>
            <p>${dateString}</p>
          </div>

          <div class="content">
            <div class="journey-section">
              <h3 class="section-title">Journey Details</h3>
              <div class="route">
                <div class="route-point">
                  <p class="location">${ticketData.busRoute.origin}</p>
                  <p class="time">${ticketData.tripDepartureTime}</p>
                </div>
                <div class="route-line">
                  <div class="line"></div>
                </div>
                <div class="route-point">
                  <p class="location">${ticketData.busRoute.destination}</p>
                  <p class="time">${ticketData.tripArrivalTime}</p>
                </div>
              </div>
              <div class="duration">
                ${Math.floor(ticketData.tripDuration / 60)}h ${ticketData.tripDuration % 60}m
              </div>
            </div>

            <div class="grid-container">
              <div>
                <div class="info-card">
                  <h4 class="section-title">Passenger Information</h4>
                  <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${passenger.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">${passenger.phoneNumber}</span>
                  </div>
                  ${passenger.email ? `
                    <div class="info-row">
                      <span class="label">Email:</span>
                      <span class="value">${passenger.email}</span>
                    </div>
                  ` : ''}
                  <div class="info-row">
                    <span class="label">Seat:</span>
                    <span class="value">${seat}</span>
                  </div>
                </div>

                <div class="info-card" style="margin-top: 16px;">
                  <h4 class="section-title">Emergency Contact</h4>
                  <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${passenger.kinName}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">${passenger.kinContact}</span>
                  </div>
                  ${passenger.kinEmail ? `
                    <div class="info-row">
                      <span class="label">Email:</span>
                      <span class="value">${passenger.kinEmail}</span>
                    </div>
                  ` : ''}
                </div>

                <div class="info-card" style="margin-top: 16px;">
                  <h4 class="section-title">Bus Information</h4>
                  <div class="info-row">
                    <span class="label">Company:</span>
                    <span class="value">${ticketData.busCompany}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Bus Number:</span>
                    <span class="value">${ticketData.busNumber}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Bus Type:</span>
                    <span class="value">${ticketData.busDescription}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Seat:</span>
                    <span class="value">${seat}</span>
                  </div>
                </div>
              </div>

              <div>
                <div class="qr-section">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://tranzbook.co/validate?ref=${ticketData.reference}`)}" alt="QR Code">
                  <p>Scan to validate ticket</p>
                  <p style="font-family: monospace; color: #9ca3af;">${ticketData.reference}</p>
                </div>

                <div class="info-card" style="margin-top: 16px;">
                  <h4 class="section-title">Fare Details</h4>
                  <div class="info-row">
                    <span class="label">Base Fare:</span>
                    <span class="value">${ticketData.currency} ${(ticketData.totalCost / ticketData.passengerDetails.length).toFixed(2)}</span>
                  </div>
                  <div class="info-row" style="border-top: 1px solid #e5e7eb; padding-top: 8px; font-weight: 600;">
                    <span>Total:</span>
                    <span>${ticketData.currency} ${(ticketData.totalCost / ticketData.passengerDetails.length).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="notes-section">
              <h4 class="section-title">Important Information</h4>
              <ul>
                <li>Arrive 30 minutes before departure time</li>
                <li>Present valid government-issued ID along with this ticket</li>
                <li>Ticket is non-transferable and non-refundable</li>
                <li>Keep your ticket safe until journey completion</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(ticketContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleShare = async () => {
    const routeString = `${ticketData.busRoute.origin} - ${ticketData.busRoute.destination}`;
    const dateString = ticketData.currentDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
    
    const url = `https://tranzbook.co/validate?ref=${ticketData.reference}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Bus Ticket - ${passenger.name}`,
          text: `Bus ticket from ${ticketData.busRoute.origin} to ${ticketData.busRoute.destination}`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Ticket URL copied to clipboard!');
      }
    } catch (err) {
      console.log('Failed to share/copy URL');
      // Fallback: show URL in alert
      alert(`Share this URL: ${url}`);
    }
  };

  const individualFare = ticketData.totalCost / ticketData.passengerDetails.length;
  const dateString = ticketData.currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Status Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">
              {ticketData.isBooked ? 'Confirmed' : 'Pending'}
            </span>
            <span className="text-blue-100 text-xs">
              {dateString}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Passenger Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{passenger.name}</h3>
                <p className="text-blue-600 font-medium">Seat {seat}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleViewDetails}
                className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                title="View Details"
              >
                <Eye className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={generatePDF}
                className="p-2.5 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
                title="Download PDF"
              >
                <Download className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors"
                title="Share Ticket"
              >
                <Share2 className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-bold text-gray-900">{ticketData.busRoute.origin}</span>
                </div>
                <p className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                  {ticketData.tripDepartureTime}
                </p>
              </div>
              
              <div className="flex items-center px-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mx-2 relative">
                    <Bus className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded" />
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center flex-1">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-green-500 mr-1" />
                  <span className="font-bold text-gray-900">{ticketData.busRoute.destination}</span>
                </div>
                <p className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                  {ticketData.tripArrivalTime}
                </p>
              </div>
            </div>
          </div>

          {/* Trip Info */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <Bus className="w-4 h-4 mr-1" />
                {ticketData.busCompany}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.floor(ticketData.tripDuration / 60)}h {ticketData.tripDuration % 60}m
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {ticketData.currency} {individualFare.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {ticketData.reference}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed View Dialog */}
      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)}>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Details</h2>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{passenger.name} • Seat {seat}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Trip Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route Card */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Journey Details
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">{ticketData.busRoute.origin}</p>
                    <p className="text-sm text-gray-600">{ticketData.tripDepartureTime}</p>
                  </div>
                  <div className="flex items-center px-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mx-3"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">{ticketData.busRoute.destination}</p>
                    <p className="text-sm text-gray-600">{ticketData.tripArrivalTime}</p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white text-gray-700">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.floor(ticketData.tripDuration / 60)}h {ticketData.tripDuration % 60}m
                  </span>
                </div>
              </div>

              {/* Passenger & Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Passenger Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{passenger.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{passenger.phoneNumber}</span>
                    </div>
                    {passenger.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium text-xs">{passenger.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    Emergency Contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{passenger.kinName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{passenger.kinContact}</span>
                    </div>
                    {passenger.kinEmail && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium text-xs">{passenger.kinEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bus Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Bus className="w-5 h-5 mr-2 text-purple-600" />
                  Bus Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company:</span>
                    <span className="font-medium">{ticketData.busCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bus Number:</span>
                    <span className="font-medium">{ticketData.busNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bus Type:</span>
                    <span className="font-medium">{ticketData.busDescription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Seat:</span>
                    <span className="font-medium">{seat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - QR Code & Actions */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-4">Validation QR Code</h4>
                <div className="flex justify-center mb-4">
<QRCode 
  value={`https://tranzbook.co/validate?ref=${ticketData.reference}`} 
  size={160} 
/>                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Scan to validate ticket
                </p>
                <p className="text-xs font-mono text-gray-400">
                  {ticketData.reference}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Fare Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Fare:</span>
                    <span>{ticketData.currency} {individualFare.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-lg">{ticketData.currency} {individualFare.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={generatePDF}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={handleShare}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Ticket
                </button>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Arrive 30 minutes before departure time</li>
              <li>• Present valid government-issued ID along with this ticket</li>
              <li>• Ticket is non-transferable and non-refundable</li>
              <li>• Keep your ticket safe until journey completion</li>
            </ul>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const Tickets: React.FC<TicketProps> = (props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bus Tickets</h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {props.passengerDetails.length} Passenger{props.passengerDetails.length > 1 ? 's' : ''}
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {props.busRoute.origin} → {props.busRoute.destination}
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="flex items-center">
              <Bus className="w-4 h-4 mr-1" />
              {props.busCompany}
            </span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{props.selectedSeats.length}</div>
              <div className="text-sm text-gray-500">Seats Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{props.currency} {props.totalCost.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Total Fare</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.floor(props.tripDuration / 60)}h {props.tripDuration % 60}m</div>
              <div className="text-sm text-gray-500">Journey Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{props.currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
              <div className="text-sm text-gray-500">Travel Date</div>
            </div>
          </div>
        </div>

        {/* Ticket Cards */}
        <div className="space-y-6">
          {props.passengerDetails.map((passenger, index) => (
            <TicketCard
              key={`${props.reference}-${index}`}
              passenger={passenger}
              seat={props.selectedSeats[index]}
              ticketData={props}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Need help? Contact {props.busCompany} customer support</p>
          <p className="mt-1">Reference: {props.reference}</p>
        </div>
      </div>
    </div>
  );
};

export default Tickets;