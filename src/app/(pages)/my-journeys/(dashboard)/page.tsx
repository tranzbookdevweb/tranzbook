'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CreditCard, Bus, Download } from 'lucide-react';
import generatePDF from "react-to-pdf";
import QRCode from "react-qr-code";
import Image from "next/image";

interface Trip {
  id: string;
  tripId: string;
  company: string;
  route: string;
  date: string;
  totalAmount: number;
  currency: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  seatNumbers: number[];
  tripDetails: {
    departureTime: string;
    basePrice: number;
    commission: number;
    commissionType: string;
    recurring: boolean;
    daysOfWeek: string[];
    bus: any;
    route: any;
    driver: any | null;
    occurrence: any;
  };
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: '₵',
  NGN: '₦',
  ZAR: 'R',
  KES: 'KSh',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

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
        
        // Update the trips array with the cancelled trip
        setTrips(trips.map(trip => 
          trip.id === id ? { ...trip, status: 'cancelled' } : trip
        ));
      } catch (error) {
        console.error('Error cancelling journey:', error);
        alert(error instanceof Error ? error.message : 'Failed to cancel journey. Please try again later.');
      }
    }
  };

  const handleDownloadTicket = (trip: Trip) => {
    // Create origin and destination from route string
    const routeParts = trip.route.split(" - ");
    const origin = routeParts[0];
    const destination = routeParts[1] || "Destination";
    
    // Create unique ID for the PDF element
    const pdfElementId = `ticket-${trip.id}`;
    
    // Create hidden ticket element if it doesn't exist
    if (!document.getElementById(pdfElementId)) {
      const ticketElement = document.createElement('div');
      ticketElement.id = pdfElementId;
      ticketElement.style.position = 'absolute';
      ticketElement.style.left = '-9999px';
      ticketElement.style.top = '-9999px';
      document.body.appendChild(ticketElement);
      
      // Render the ticket content
      ticketElement.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200" style="width: 800px; height: 400px;">
          <!-- Ticket Header with Color Band -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4 text-white">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="bg-white p-2 rounded-full">
                  <!-- Logo placeholder -->
                  <div style="width: 40px; height: 40px; background-color: #f0f0f0; border-radius: 50%;"></div>
                </div>
                <div>
                  <h1 class="text-2xl font-bold">${trip.company}</h1>
                  <p class="text-blue-100 text-sm">E-Ticket Confirmation</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-medium">${formatDate(trip.date)}</p>
                <p class="text-blue-100 text-sm">Ticket #${trip.id.substring(0, 8)}</p>
              </div>
            </div>
          </div>

          <!-- Main Ticket Content -->
          <div class="p-6">
            <!-- Journey Details -->
            <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div class="flex-1">
                <p class="text-sm text-gray-500">From</p>
                <h2 class="text-xl font-bold text-gray-800">${origin}</h2>
                <p class="text-gray-700">${trip.tripDetails.departureTime}</p>
              </div>
              
              <div class="flex-none px-4">
                <div class="w-24 h-0.5 bg-gray-300 relative">
                  <div class="absolute -top-1 left-0 w-2 h-2 rounded-full bg-blue-600"></div>
                  <div class="absolute -top-1 right-0 w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </div>
              
              <div class="flex-1 text-right">
                <p class="text-sm text-gray-500">To</p>
                <h2 class="text-xl font-bold text-gray-800">${destination}</h2>
                <p class="text-gray-700">Arrival time</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <!-- Left column -->
              <div class="col-span-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Bus Number</p>
                    <p class="font-semibold text-gray-800">${trip.tripDetails.bus?.busNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Bus Type</p>
                    <p class="font-semibold text-gray-800">${trip.tripDetails.bus?.busType || "Standard"}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Seat(s)</p>
                    <p class="font-semibold text-gray-800">${trip.seatNumbers.join(", ")}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Price</p>
                    <p class="font-semibold text-gray-800">
                      ${currencySymbols[trip.currency] || ''}${trip.totalAmount.toFixed(2)} ${trip.currency}
                    </p>
                  </div>
                </div>

                <div class="mt-6 pt-4 border-t border-dashed border-gray-200">
                  <h3 class="font-semibold text-gray-800 mb-2">Important Information:</h3>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Please arrive 30 minutes before departure time</li>
                    <li>• Present this ticket or QR code when boarding</li>
                    <li>• Valid ID may be required during boarding</li>
                  </ul>
                </div>
              </div>

              <!-- Right column with QR code -->
              <div class="flex flex-col items-center justify-center border-l border-gray-200 pl-6">
                <div class="p-3 bg-white border border-gray-200 rounded-md mb-2">
                  <!-- QR code placeholder -->
                  <div style="width: 120px; height: 120px; background-color: #f0f0f0;"></div>
                </div>
                <p class="text-xs text-center text-gray-500 mt-2">Scan for verification</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
            <div class="flex items-center gap-2">
              <!-- Logo placeholder -->
              <div style="width: 24px; height: 24px; background-color: #f0f0f0; border-radius: 50%;"></div>
              <p class="text-xs text-gray-600">Powered by Tranzbook Technologies</p>
            </div>
            <p class="text-xs text-gray-500">Booking Reference: ${trip.id}</p>
          </div>
        </div>
      `;
    }

    // Generate PDF
    generatePDF(() => document.getElementById(pdfElementId), {
      method: "open",
      filename: `${trip.company}-Ticket-${trip.id}.pdf`,
      page: {
        format: "a5",
        orientation: "landscape",
      },
    });
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Journeys</h1>
        <p className="text-gray-600">View and manage your bus bookings</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 text-sm font-medium capitalize whitespace-nowrap
              ${activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
              }`}
            onClick={() => setActiveTab(tab as 'upcoming' | 'completed' | 'cancelled')}
          >
            {tab} Journeys
          </button>
        ))}
      </div>

      {isPageLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your journeys...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-200 rounded-lg shadow-sm bg-white">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Bus className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            No {activeTab} journeys found
          </h2>
          {activeTab === 'upcoming' ? (
            <>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                You don&apos;t have any upcoming journeys. Discover convenient and affordable transport options for your next trip.
              </p>
              <Link href="/search">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Book a Journey
                </button>
              </Link>
            </>
          ) : activeTab === 'completed' ? (
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              You haven&apos;t completed any journeys yet. Once you travel with us, your trip history will appear here.
            </p>
          ) : (
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              You don&apos;t have any cancelled bookings. If you need to cancel a journey, you can do so from your upcoming journeys.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium ${
                    trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                    trip.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {trip.status === 'upcoming' ? 'Upcoming' : 
                     trip.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </span>
                  
                  {/* Download Ticket Icon Button */}
                  <button 
                    onClick={() => handleDownloadTicket(trip)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                    title="Download Ticket"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {currencySymbols[trip.currency] || ''}{trip.totalAmount.toFixed(2)} {trip.currency}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">{trip.company}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">Route</p>
                    <p className="text-gray-600">{trip.route}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">Date</p>
                    <p className="text-gray-600">{formatDate(trip.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">Departure Time</p>
                    <p className="text-gray-600">{trip.tripDetails.departureTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">Seat{trip.seatNumbers.length > 1 ? 's' : ''}</p>
                    <p className="text-gray-600">
                      {trip.seatNumbers.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Link 
                  href={`/journey-details/${trip.id}`}
                  className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors text-center font-medium"
                >
                  View Details
                </Link>
                
                {trip.status === 'upcoming' && (
                  <button
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100 transition-colors font-medium"
                    onClick={() => handleCancelTrip(trip.id)}
                  >
                    Cancel Journey
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MyJourneys;