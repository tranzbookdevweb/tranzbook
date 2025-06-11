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
// Dialog Component
const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-[999999] inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-4 h-4" />
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
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            color: #1f2937;
          }
          .ticket {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #4f46e5;
            color: white;
            padding: 16px;
            text-align: center;
          }
          .header h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 4px 0;
          }
          .header p {
            font-size: 12px;
            margin: 0;
            opacity: 0.9;
          }
          .route-section {
            padding: 16px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
          }
          .route {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .route-point {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
          }
          .route-time {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
          }
          .route-arrow {
            color: #6b7280;
            font-size: 12px;
          }
          .passenger-section {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
          }
          .section-title {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .passenger-info {
            margin-bottom: 12px;
          }
          .passenger-name {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 2px;
          }
          .passenger-details {
            font-size: 12px;
            color: #6b7280;
          }
          .bus-section {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
          }
          .bus-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .bus-label {
            font-size: 12px;
            color: #6b7280;
          }
          .bus-value {
            font-size: 12px;
            font-weight: 500;
            color: #1f2937;
          }
          .price-section {
            padding: 16px;
            text-align: right;
            background: #f9fafb;
          }
          .price {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
          }
          .qr-section {
            padding: 16px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .qr-code {
            width: 80px;
            height: 80px;
            margin: 0 auto 8px;
          }
          .qr-text {
            font-size: 10px;
            color: #6b7280;
          }
          .footer {
            padding: 12px 16px;
            background: #f9fafb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>Royal VVIP</h1>
            <p>E-Ticket Confirmation</p>
          </div>

          <div class="route-section">
            <div class="route">
              <div>
                <div class="route-point">${ticketData.busRoute.origin}</div>
                <div class="route-time">${ticketData.tripDepartureTime}</div>
              </div>
              <div class="route-arrow">→</div>
              <div>
                <div class="route-point">${ticketData.busRoute.destination}</div>
                <div class="route-time">${ticketData.tripArrivalTime}</div>
              </div>
            </div>
          </div>

          <div class="passenger-section">
            <div class="section-title">Passenger & Seat(s)</div>
            <div class="passenger-info">
              <div class="passenger-name">${passenger.name} (Seat ${seat})</div>
              <div class="passenger-details">
                Phone: ${passenger.phoneNumber}<br>
                ${passenger.email ? `Email: ${passenger.email}` : ''}
              </div>
            </div>
          </div>

          <div class="bus-section">
            <div class="section-title">Bus Info</div>
            <div class="bus-info">
              <span class="bus-label">Type:</span>
              <span class="bus-value">${ticketData.busDescription}</span>
            </div>
          </div>

          <div class="price-section">
            <div class="section-title">Price</div>
            <div class="price">${ticketData.currency} ${(ticketData.totalCost / ticketData.passengerDetails.length).toFixed(2)}</div>
          </div>

          <div class="qr-section">
            <div class="section-title">Important Information</div>
            <p class="qr-text">• Arrive 30 minutes before boarding</p>
            <p class="qr-text">• Present this e-ticket or QR code at the boarding point</p>
            <p class="qr-text">• Valid government-issued ID required during verification</p>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`https://tranzbook.co/validate?ref=${ticketData.reference}`)}" alt="QR Code" style="width: 100%; height: 100%;">
            </div>
            <p class="qr-text">Scan for Verification</p>
          </div>

          <div class="footer">
            <img src="/pictures/logo.png" alt="Tranzbook" style="height: 16px; margin-bottom: 4px;"><br>
            Powered by Tranzbook Technologies<br>
            Booking Ref: ${ticketData.reference}
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
        <div className="bg-indigo-600 text-white px-4 py-3 text-center">
          <h2 className="text-lg font-bold">Royal VVIP</h2>
          <p className="text-xs opacity-90">E-Ticket Confirmation</p>
          <p className="text-xs opacity-75">{dateString}</p>
        </div>

        <div className="px-4 py-3 text-center border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-gray-900">{ticketData.busRoute.origin}</div>
              <div className="text-xs text-gray-500">{ticketData.tripDepartureTime}</div>
            </div>
            <div className="text-gray-400 text-sm">→</div>
            <div>
              <div className="font-semibold text-gray-900">{ticketData.busRoute.destination}</div>
              <div className="text-xs text-gray-500">{ticketData.tripArrivalTime}</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Passenger & Seat(s)</div>
          <div className="mb-3">
            <div className="font-semibold text-gray-900">{passenger.name} (Seat {seat})</div>
            <div className="text-xs text-gray-600 mt-1">
              Phone: {passenger.phoneNumber}
              {passenger.email && (
                <>
                  <br />
                  Email: {passenger.email}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Bus Info</div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900">{ticketData.busDescription}</span>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</div>
          <div className="text-lg font-bold text-gray-900">
            {ticketData.currency} {individualFare.toFixed(2)}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Important Information</div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Arrive 30 minutes before boarding</p>
            <p>• Present this e-ticket or QR code at the boarding point</p>
            <p>• Valid government-issued ID required during verification</p>
          </div>
        </div>

        <div className="px-4 py-3 text-center border-b border-gray-100">
          <div className="mb-2">
            <QRCode value={`https://tranzbook.co/validate?ref=${ticketData.reference}`} size={120} />
          </div>
          <p className="text-xs text-gray-500">Scan for Verification</p>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-center">
          <div className="mb-2">
            <img src="/pictures/logo.png" alt="Tranzbook" className="h-4 mx-auto mb-1" />
          </div>
          <p className="text-xs text-gray-500">Powered by Tranzbook Technologies</p>
          <p className="text-xs text-gray-400 mt-1">Booking Ref: {ticketData.reference}</p>
        </div>

        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex justify-center space-x-2">
            <button
              onClick={generatePDF}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Ticket
            </button>
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