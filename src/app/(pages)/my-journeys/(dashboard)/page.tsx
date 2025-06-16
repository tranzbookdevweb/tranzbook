'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  Bus, 
  Download, 
  Share2, 
  Eye, 
  X, 
  User,
  Users,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';

// Interfaces
interface PassengerDetail {
  name: string;
  phoneNumber: string;
  email?: string;
  kinName: string;
  kinContact: string;
  kinEmail?: string;
}

interface Trip {
  id: string;
  tripId: string;
  reference: string; // Added to match API
  company: string;
  route: string;
  date: string;
  totalAmount: number;
  currency: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  seatNumbers: number[];
  passengers: PassengerDetail[];
  tripDetails: {
    departureTime: string;
    arrivalTime?: string;
    basePrice: number;
    commission: number;
    commissionType: string;
    recurring: boolean;
    daysOfWeek: number[] | null; // Updated to match API
    duration?: number;
    bus: any;
    route: any;
    driver: any | null;
    occurrence: any;
  };
}

// Currency symbols
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: '₵',
  NGN: '₦',
  ZAR: 'R',
  KES: 'KSh',
};

// Status configurations
const statusConfig = {
  upcoming: {
    label: 'Upcoming',
    icon: Clock,
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600'
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600'
  }
};

// Helper function to convert daysOfWeek numbers to names
const getDayNames = (days: number[] | null): string => {
  if (!days || days.length === 0) return 'N/A';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map(day => dayNames[day]).join(', ');
};

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

// Individual Journey Card Component
const JourneyCard: React.FC<{
  passenger: PassengerDetail;
  seat: number;
  trip: Trip;
  index: number;
  onCancelTrip: (id: string) => void;
}> = ({ passenger, seat, trip, index, onCancelTrip }) => {
  const [showDialog, setShowDialog] = useState(false);
  const statusInfo = statusConfig[trip.status];
  const StatusIcon = statusInfo.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const individualFare = trip.totalAmount / trip.passengers.length;
const routeParts = trip.route.split(' to '); // Changed from ' - ' to ' to '
const origin = routeParts[0];
const destination = routeParts[1] || 'Destination';

  const handleViewDetails = () => {
    setShowDialog(true);
  };

  const generatePDF = () => {
    const ticketContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Journey Ticket - ${trip.reference}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
        .ticket { max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
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
        <div class="header">
          <div>
            <h1>${trip.company}</h1>
            <p>Journey Ticket</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 16px; font-weight: 600;">${formatFullDate(trip.date)}</p>
            <p style="font-size: 12px; opacity: 0.8;">Ticket #${trip.id}</p>
          </div>
        </div>

        <div class="route-section">
          <div class="route-grid">
            <div class="route-point">
              <h3>${origin}</h3>
              <p>${trip.tripDetails.departureTime}</p>
            </div>
            <div class="route-arrow"></div>
            <div class="route-point">
              <h3>${destination}</h3>
              <p>${trip.tripDetails.arrivalTime || 'Arrival time'}</p>
            </div>
          </div>
        </div>

        <div class="passenger-section">
          <div class="section-title">Passenger & Seat</div>
          <div class="passenger-list">
            <div class="passenger-item">
              <span class="passenger-name">${passenger.name}</span>
              <span class="seat-number">Seat ${seat}</span>
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <h4>Bus Type</h4>
            <p>${trip.tripDetails.bus?.busType || 'Standard'}</p>
          </div>
          <div class="detail-item">
            <h4>Individual Price</h4>
            <p class="total-amount">${currencySymbols[trip.currency] || ''}${individualFare.toFixed(2)} ${trip.currency}</p>
          </div>
        </div>

        <div class="info-section">
          <div class="info-content">
            <div class="info-title">Important Information</div>
            <ul class="info-list">
              <li>Arrive 30 minutes prior to departure for smooth boarding</li>
              <li>Present this ticket at the boarding point</li>
              <li>Valid government-issued ID required during verification</li>
              <li>Contact us immediately if you need to make any changes</li>
            </ul>
          </div>
          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://tranzbook.co/validate?ref=${trip.reference}`)}" alt="QR Code" class="qr-code">
            <p class="qr-text">Scan for Verification</p>
          </div>
        </div>

        <div class="footer">
          <div class="footer-left">
            <span class="footer-text">Powered by TRANZBOOK INC</span>
          </div>
          <span class="footer-text">Journey Ref: ${trip.reference}</span>
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
    const url = `https://tranzbook.co/validate?ref=${trip.reference}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Journey Ticket - ${passenger.name}`,
          text: `Journey from ${origin} to ${destination}`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Journey URL copied to clipboard!');
      }
    } catch (err) {
      console.log('Failed to share/copy URL');
      alert(`Share this URL: ${url}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className={`bg-gradient-to-r ${statusInfo.gradientFrom} ${statusInfo.gradientTo} px-4 py-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                {statusInfo.label}
              </span>
            </div>
            <span className="text-white text-xs opacity-90">
              {formatDate(trip.date)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${statusInfo.gradientFrom} ${statusInfo.gradientTo} rounded-full flex items-center justify-center`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{passenger.name}</h3>
                <p className={`${statusInfo.textColor} font-medium`}>Seat {seat}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleViewDetails}
                className={`p-2.5 rounded-full ${statusInfo.bgColor} hover:bg-opacity-80 transition-colors`}
                title="View Details"
              >
                <Eye className={`w-5 h-5 ${statusInfo.textColor}`} />
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
                title="Share Journey"
              >
                <Share2 className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-bold text-gray-900">{origin}</span>
                </div>
                <p className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                  {trip.tripDetails.departureTime}
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
                  <span className="font-bold text-gray-900">{destination}</span>
                </div>
                <p className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                  {trip.tripDetails.arrivalTime || 'Arrival time'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <Bus className="w-4 h-4 mr-1" />
                {trip.company}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {trip.tripDetails.duration ? `${Math.floor(trip.tripDetails.duration / 60)}h ${trip.tripDetails.duration % 60}m` : 'Duration TBA'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {currencySymbols[trip.currency] || ''}{individualFare.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {trip.reference}
              </p>
            </div>
          </div>

          {trip.status === 'upcoming' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => onCancelTrip(trip.id)}
                className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100 transition-colors font-medium"
              >
                Cancel Journey
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)}>
        <div className={`bg-gradient-to-r ${statusInfo.gradientFrom} ${statusInfo.gradientTo} text-white px-6 py-4 flex justify-between items-center`}>
          <div>
            <h2 className="text-xl font-bold">{trip.company}</h2>
            <p className="text-sm opacity-90">Journey Details</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{formatDate(trip.date)}</p>
            <p className="text-xs opacity-80">ID #{trip.reference}</p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{origin}</h3>
              <p className="text-sm text-gray-600">{trip.tripDetails.departureTime}</p>
            </div>
            <div className="px-4">
              <div className="w-12 h-0.5 bg-blue-500 relative">
                <div className="absolute -right-1 -top-1 w-0 h-0 border-l-4 border-l-blue-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
              </div>
            </div>
            <div className="text-center flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{destination}</h3>
              <p className="text-sm text-gray-600">{trip.tripDetails.arrivalTime || 'Arrival time'}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Passenger & Seat</div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">{passenger.name}</span>
              <span className="text-gray-600">Seat {seat}</span>
            </div>
            {passenger.phoneNumber && (
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Phone className="w-4 h-4 mr-2" />
                {passenger.phoneNumber}
              </div>
            )}
            {passenger.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {passenger.email}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 px-6 py-4 border-b border-gray-200">
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Bus Type</h4>
            <p className="text-base font-semibold text-gray-900">{trip.tripDetails.bus?.busType || 'Standard'}</p>
          </div>
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Individual Price</h4>
            <p className="text-base font-bold text-green-600">{currencySymbols[trip.currency] || ''}{individualFare.toFixed(2)} {trip.currency}</p>
          </div>
        </div>

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
                Present this ticket at the boarding point
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
            <QRCode value={`https://tranzbook.co/validate?ref=${trip.reference}`} size={120} />
            <p className="text-xs text-gray-500 mt-2">Scan for Verification</p>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-xs text-gray-500">Powered by TRANZBOOK INC</span>
          <span className="text-xs text-gray-500">Journey Ref: {trip.reference}</span> {/* Updated to use reference */}
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
              Share Journey
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

// Main Component
const MyJourneys: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsPageLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/GET/getUserTrips');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data.trips || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to load your journeys. Please try again later.');
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    setFilteredTrips(trips.filter(trip => trip.status === activeTab));
  }, [trips, activeTab]);

  const handleCancelTrip = async (id: string) => {
    if (confirm('Are you sure you want to cancel this journey? Cancellation policies may apply.')) {
      try {
        const response = await fetch('/api/cancelTrip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: id }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to cancel journey');
        }
        
        setTrips(trips.map(trip => 
          trip.id === id ? { ...trip, status: 'cancelled' } : trip
        ));
        alert('Journey cancelled successfully.');
      } catch (error) {
        console.error('Error cancelling journey:', error);
        alert('Failed to cancel journey. Please try again later.');
      }
    }
  };

  const getStatusCounts = () => {
    return {
      upcoming: trips.filter(trip => trip.status === 'upcoming').length,
      completed: trips.filter(trip => trip.status === 'completed').length,
      cancelled: trips.filter(trip => trip.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Journeys</h1>
          <p className="text-gray-600">Manage and view your upcoming and past bus journeys</p>
        </div>

        {/* Status Tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          {Object.keys(statusConfig).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status as 'upcoming' | 'completed' | 'cancelled')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === status
                  ? `${statusConfig[status as keyof typeof statusConfig].textColor} border-b-2 ${statusConfig[status as keyof typeof statusConfig].borderColor}`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{statusConfig[status as keyof typeof statusConfig].label} ({statusCounts[status as keyof typeof statusCounts]})</span>
              </div>
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center text-red-700">
            <AlertCircle className="w-5 h-5 inline-block mr-2" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {isPageLoading && (
          <div className="text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading your journeys...</p>
          </div>
        )}

        {/* No Journeys State */}
        {!isPageLoading && filteredTrips.length === 0 && !error && (
          <div className="text-center text-gray-600 bg-white rounded-lg p-8 border border-gray-200">
            <Bus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No {activeTab} journeys found.</p>
            <Link href="/book" className="text-blue-600 hover:underline mt-2 inline-block">
              Book a new journey
            </Link>
          </div>
        )}

        {/* Journeys List */}
        {!isPageLoading && filteredTrips.length > 0 && (
          <div className="space-y-8">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="space-y-6">
                {/* Trip Summary Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{trip.seatNumbers.length}</div>
                      <div className="text-sm text-gray-500">Seats Booked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currencySymbols[trip.currency] || ''}{trip.totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Total Fare</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {trip.tripDetails.duration ? `${Math.floor(trip.tripDetails.duration / 60)}h ${trip.tripDetails.duration % 60}m` : 'Duration TBA'}
                      </div>
                      <div className="text-sm text-gray-500">Journey Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-500">Travel Date</div>
                    </div>
                  </div>
                </div>

                {/* Passenger Tickets */}
                <div className="space-y-6">
                  {trip.passengers.map((passenger, index) => (
                    <JourneyCard
                      key={`${trip.id}-${index}`}
                      passenger={passenger}
                      seat={trip.seatNumbers[index]}
                      trip={trip}
                      index={index}
                      onCancelTrip={handleCancelTrip}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Need help? Contact our customer support</p>
          <p className="mt-1">Powered by TRANZBOOK INC</p>
        </div>
      </div>
    </div>
  );
};

export default MyJourneys;