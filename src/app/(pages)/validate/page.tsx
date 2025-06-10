'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Clock, User, Phone, Mail, Bus, Wifi, Zap, WashingMachine, Utensils, Shield, Wind, Calendar, CreditCard, Users, AlertCircle, CheckCircle, Loader2, LucideIcon } from 'lucide-react';

// Type definitions (unchanged)
interface BusRoute {
  origin: string;
  destination: string;
}

interface BusAmenities {
  airConditioning: boolean;
  chargingOutlets: boolean;
  wifi: boolean;
  restRoom: boolean;
  seatBelts: boolean;
  onboardFood: boolean;
}

interface Driver {
  name: string;
  mobile?: string;
}

interface PassengerDetail {
  name: string;
  phoneNumber?: string;
  email?: string;
  kinName?: string;
  kinContact?: string;
  kinEmail?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  logo?: string;
}

interface TicketData {
  ticketId: string;
  reference: string;
  totalCost: number;
  selectedSeats: string[];
  isBooked: boolean;
  currentDate: string;
  tripDepartureTime: string;
  tripArrivalTime: string;
  tripDuration: number;
  busFare: number;
  currency: string;
  busRoute: BusRoute;
  busNumber: string;
  busDescription: string;
  busCompany: string;
  busAmenities: BusAmenities;
  driver?: Driver;
  passengerDetails: PassengerDetail[];
  user: User;
  company: Company;
  bookingStatus: string;
  bookingDate: string;
}

interface ApiResponse {
  success: boolean;
  data: TicketData;
  error?: string;
}

interface AmenityIconProps {
  amenity: keyof BusAmenities;
  label: string;
}

const TicketLookupPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [error, setError] = useState<string>('');

  // Fetch ticket data based on reference
  const fetchTicketData = async (ref: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/GET/getTickets?ref=${encodeURIComponent(ref)}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch ticket data');
      }
      
      if (result.success && result.data) {
        setTicketData(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching ticket data';
      setError(errorMessage);
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle URL query parameter on page load
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReference(ref);
      fetchTicketData(ref);
    }
  }, [searchParams]);

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (reference.trim()) {
      fetchTicketData(reference.trim());
    }
  };

  const formatTime = (time: string | undefined): string => {
    return time ? time : 'N/A';
  };

  const formatDuration = (minutes: number | undefined): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const AmenityIcon: React.FC<AmenityIconProps> = ({ amenity, label }) => {
    const icons: Record<keyof BusAmenities, LucideIcon> = {
      airConditioning: Wind,
      wifi: Wifi,
      chargingOutlets: Zap,
      restRoom: WashingMachine,
      onboardFood: Utensils,
      seatBelts: Shield
    };
    
    const IconComponent = icons[amenity] || Bus;
    
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
        ticketData?.busAmenities?.[amenity] 
          ? 'bg-green-100 text-green-700' 
          : 'bg-gray-100 text-gray-500'
      }`}>
        <IconComponent size={16} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Ticket</h1>
          <p className="text-gray-600">Enter your booking reference to view your ticket details</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={reference}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReference(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Enter your booking reference (e.g., TB-2024-001)"
                className="w-full px-6 py-4 pr-16 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !reference.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Details */}
        {ticketData && (
          <div className="space-y-8">
            {/* Ticket Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed</h2>
                    <p className="text-blue-100">Reference: {ticketData.reference}</p>
                  </div>
                  <CheckCircle size={48} className="text-green-300" />
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-blue-600" size={24} />
                    <h3 className="font-semibold text-gray-900">From</h3>
                    <p className="text-xl font-bold text-blue-600">{ticketData.busRoute?.origin}</p>
                  </div>
                  
                  <div className="text-center">
                    <Clock className="mx-auto mb-2 text-purple-600" size={24} />
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-xl font-bold text-purple-600">{formatDuration(ticketData.tripDuration)}</p>
                  </div>
                  
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-green-600" size={24} />
                    <h3 className="font-semibold text-gray-900">To</h3>
                    <p className="text-xl font-bold text-green-600">{ticketData.busRoute?.destination}</p>
                  </div>
                </div>
              </div>
            </div>
  {ticketData.passengerDetails && ticketData.passengerDetails.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="text-blue-600" size={24} />
                    Passenger Details
                  </h3>
                  
                  <div className="space-y-6">
                    {ticketData.passengerDetails.map((passenger: PassengerDetail, index: number) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-semibold text-gray-900 mb-2">{passenger.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {passenger.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              <span>{passenger.email}</span>
                            </div>
                          )}
                          {passenger.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              <span>{passenger.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {/* Trip Details */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="text-blue-600" size={24} />
                  Trip Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Date</span>
                    <span className="font-semibold">{formatDate(ticketData.currentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure Time</span>
                    <span className="font-semibold">{formatTime(ticketData.tripDepartureTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival Time</span>
                    <span className="font-semibold">{formatTime(ticketData.tripArrivalTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seat Numbers</span>
                    <span className="font-semibold">{ticketData.selectedSeats?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus Number</span>
                    <span className="font-semibold">{ticketData.busNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-green-600" size={24} />
                  Booking Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-bold text-xl text-green-600">
                      {ticketData.currency} {ticketData.totalCost?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus Company</span>
                    <span className="font-semibold">{ticketData.busCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus Type</span>
                    <span className="font-semibold">{ticketData.busDescription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      ticketData.isBooked 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ticketData.bookingStatus || (ticketData.isBooked ? 'Confirmed' : 'Pending')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bus className="text-purple-600" size={24} />
                Bus Amenities
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <AmenityIcon amenity="airConditioning" label="A/C" />
                <AmenityIcon amenity="wifi" label="WiFi" />
                <AmenityIcon amenity="chargingOutlets" label="Charging" />
                <AmenityIcon amenity="restRoom" label="Restroom" />
                <AmenityIcon amenity="onboardFood" label="Food" />
                <AmenityIcon amenity="seatBelts" label="Seat Belts" />
              </div>
            </div>

            {/* Passenger & Driver Info */}
            <div className="grid lg:grid-cols-2 gap-8">
            

              {ticketData.driver && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="text-green-600" size={24} />
                    Driver Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="text-green-600" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{ticketData.driver.name}</p>
                        <p className="text-gray-600">Professional Driver</p>
                      </div>
                    </div>
                    {ticketData.driver.mobile && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span>{ticketData.driver.mobile}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketLookupPage;