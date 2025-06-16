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
  companyLogo: string; // Add companyLogo to the interface
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
    <div className="fixed z-[999999] inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
      <meta charset="utf-8">
      <title>Bus Ticket - ${ticketData.reference}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
        .ticket { max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
        .header-left { display: flex; align-items: center; gap: 15px; }
        .company-logo { width: 50px; height: 50px; background: white; border-radius: 8px; padding: 5px; object-fit: contain; }
        .header h1 { font-size: 28px; font-weight: bold; }
        .header p { font-size: 14px; opacity: 0.9; }
        .route-section { background: #f8fafc; padding: 30px; border-bottom: 1px solid #e5e7eb; text-align: center; }
        .route-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; }
        .route-point { text-align: center; }
        .route-point h3 { font-size: 20px; color: #1f2937; margin-bottom: 8px; }
        .route-point p { color: #6b7280; font-size: 14px; }
        .route-arrow { width: 60px; height: 2px; background: #3b82f6; position: relative; }
        .route-arrow::after { content: ''; position: absolute; right: -8px; top: -4px; width: 0; height: 0; border-left: 10px solid #3b82f6; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .passenger-section { padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .section-title { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
        .passenger-list { background: #f9fafb; padding: 20px; border-radius: 8px; }
        .passenger-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .passenger-item:last-child { border-bottom: none; }
        .passenger-name { font-weight: 600; color: #1f2937; }
        .seat-number { color: #6b7280; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .detail-item h4 { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .detail-item p { font-size: 16px; font-weight: 600; color: #1f2937; }
        .info-section { padding: 30px; background: #f8fafc; display: flex; gap: 30px; align-items: flex-start; }
        .info-content { flex: 1; }
        .info-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
        .info-list { list-style: none; }
        .info-list li { color: #6b7280; font-size: 14px; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .info-list li::before { content: '•'; color: #3b82f6; font-weight: bold; position: absolute; left: 0; }
        .qr-section { text-align: center; }
        .qr-code { width: 120px; height: 120px; margin-bottom: 10px; }
        .qr-text { font-size: 12px; color: #6b7280; }
        .footer { background: #f1f5f9; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; }
        .footer-left { display: flex; align-items: center; gap: 10px; }
        .footer-text { font-size: 12px; color: #6b7280; }
        .total-amount { color: #059669; font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <img src="${ticketData.companyLogo ? `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${ticketData.companyLogo}` : ''}" alt="Company Logo" class="company-logo">
            <div>
              <h1>${ticketData.busCompany}</h1>
              <p>E-Ticket Confirmation</p>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 16px; font-weight: 600;">${dateString}</p>
            <p style="font-size: 12px; opacity: 0.8;">Ticket #${ticketData.reference}</p>
          </div>
        </div>

        <!-- Route Information -->
        <div class="route-section">
          <div class="route-grid">
            <div class="route-point">
              <h3>${ticketData.busRoute.origin}</h3>
              <p>${ticketData.tripDepartureTime}</p>
            </div>
            <div class="route-arrow"></div>
            <div class="route-point">
              <h3>${ticketData.busRoute.destination}</h3>
              <p>${ticketData.tripArrivalTime}</p>
            </div>
          </div>
        </div>

        <!-- Passenger Details -->
        <div class="passenger-section">
          <div class="section-title">Passenger(s) & Seat(s)</div>
          <div class="passenger-list">
            <div class="passenger-item">
              <span class="passenger-name">${passenger.name}</span>
              <span class="seat-number">Seat ${seat}</span>
            </div>
          </div>
        </div>

        <!-- Trip Details -->
        <div class="details-grid">
          <div class="detail-item">
            <h4>Bus Type</h4>
            <p>${ticketData.busDescription}</p>
          </div>
          <div class="detail-item">
            <h4>Individual Price</h4>
            <p class="total-amount">${ticketData.currency} ${individualFare.toFixed(2)}</p>
          </div>
        </div>

        <!-- Important Information with QR Code -->
        <div class="info-section">
          <div class="info-content">
            <div class="info-title">Important Information</div>
            <ul class="info-list">
              <li>Arrive 30 minutes prior to departure for smooth boarding</li>
              <li>Present this e-ticket at the boarding point</li>
              <li>Valid government-issued ID required during verification</li>
              <li>Contact us immediately if you need to make any changes</li>
            </ul>
          </div>
          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://tranzbook.co/validate?ref=${ticketData.reference}`)}" alt="QR Code" class="qr-code">
            <p class="qr-text">Scan for Verification</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-left">
            <span class="footer-text">Powered by TRANZBOOK INC</span>
          </div>
          <span class="footer-text">Booking Ref: ${ticketData.reference}</span>
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

      {/* Updated Detailed View Dialog */}
      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={ticketData.companyLogo ? `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${ticketData.companyLogo}` : ''}
              alt="Company Logo"
              className="w-10 h-10 bg-white rounded-md p-1 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold">{ticketData.busCompany}</h2>
              <p className="text-sm opacity-90">E-Ticket Confirmation</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{dateString}</p>
            <p className="text-xs opacity-80">Ticket #{ticketData.reference}</p>
          </div>
        </div>

        {/* Route Section */}
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{ticketData.busRoute.origin}</h3>
              <p className="text-sm text-gray-600">{ticketData.tripDepartureTime}</p>
            </div>
            <div className="px-4">
              <div className="w-12 h-0.5 bg-blue-500 relative">
                <div className="absolute -right-1 -top-1 w-0 h-0 border-l-4 border-l-blue-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
              </div>
            </div>
            <div className="text-center flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{ticketData.busRoute.destination}</h3>
              <p className="text-sm text-gray-600">{ticketData.tripArrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Passenger(s) & Seat(s)</div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">{passenger.name}</span>
              <span className="text-gray-600">Seat {seat}</span>
            </div>
          </div>
        </div>

        {/* Trip Details Grid */}
        <div className="grid grid-cols-2 gap-6 px-6 py-4 border-b border-gray-200">
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Bus Type</h4>
            <p className="text-base font-semibold text-gray-900">{ticketData.busDescription}</p>
          </div>
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Individual Price</h4>
            <p className="text-base font-bold text-green-600">{ticketData.currency} {individualFare.toFixed(2)}</p>
          </div>
        </div>

        {/* Important Information with QR Code */}
        <div className="px-6 py-5 bg-gray-50 flex gap-6">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Important Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">•</span>
                Arrive 30 minutes prior to departure for smooth boarding
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">•</span>
                Present this e-ticket at the boarding point
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">•</span>
                Valid government-issued ID required during verification
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">•</span>
                Contact us immediately if you need to make any changes
              </li>
            </ul>
          </div>
          <div className="text-center">
            <QRCode value={`https://tranzbook.co/validate?ref=${ticketData.reference}`} size={120} />
            <p className="text-xs text-gray-500 mt-2">Scan for Verification</p>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-xs text-gray-500">Powered by TRANZBOOK INC</span>
          <span className="text-xs text-gray-500">Booking Ref: {ticketData.reference}</span>
        </div>

        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex gap-3">
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