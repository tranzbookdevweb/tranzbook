'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CreditCard, Bus } from 'lucide-react';

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
                <div>
                  <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium ${
                    trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                    trip.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {trip.status === 'upcoming' ? 'Upcoming' : 
                     trip.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </span>
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