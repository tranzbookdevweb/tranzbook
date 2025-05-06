'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bus, User, Settings, LogOut } from 'lucide-react';

interface Trip {
  id: string;
  tripId: string;
  company: string;
  route: string;
  date: string;
  price: number;
  currency: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  // Add more currency symbols as needed
};

const MyJourneys: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Trips', href: '/my-journeys', icon: Bus, active: true },
    { name: 'Passengers', href: '/passengers', icon: User, active: false },
    { name: 'Settings', href: '/settings', icon: Settings, active: false },
    { name: 'Sign Out', href: '/api/auth/signout', icon: LogOut, active: false },
  ];

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
        setError('Failed to load your trips. Please try again later.');
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
    if (confirm('Are you sure you want to cancel this trip?')) {
      try {
        const response = await fetch('/api/GET/getUserTrips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: id }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to cancel trip');
        }
        
        // Update the trips array with the cancelled trip
        setTrips(trips.map(trip => 
          trip.id === id ? { ...trip, status: 'cancelled' } : trip
        ));
      } catch (error) {
        console.error('Error cancelling trip:', error);
        alert(error instanceof Error ? error.message : 'Failed to cancel trip. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar - now part of flex layout, not fixed */}
      <aside
        className={`bg-white shadow-md w-full md:w-64 flex-shrink-0 
          ${isSidebarOpen ? 'block' : 'hidden'} md:block`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">Bus Booking</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                item.active ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Journeys</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab as 'upcoming' | 'completed' | 'cancelled')}
            >
              {tab}
            </button>
          ))}
        </div>

        {isPageLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Loading your trips...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-100 rounded-lg shadow-sm bg-white">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Bus className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              No {activeTab} journeys found
            </h2>
            {activeTab === 'upcoming' ? (
              <>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  You don&apos;t have any upcoming bus trips. Discover convenient and affordable transport options for your next journey.
                </p>
                <Link href="/">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    Book a Trip
                  </button>
                </Link>
              </>
            ) : activeTab === 'completed' ? (
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                You haven&apos;t completed any bus journeys yet. Once you travel with us, your trip history will appear here.
              </p>
            ) : (
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                You don&apos;t have any cancelled bookings. If you need to cancel a trip, you can do so from your upcoming journeys.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">{trip.company}</h2>
                  <span className={`text-xs px-2 py-1 rounded ${
                    trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                    trip.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">{trip.route}</p>
                <p className="text-gray-600 mb-2">{new Date(trip.date).toLocaleString()}</p>
                <p className="text-gray-800 font-medium mb-3">
                  {currencySymbols[trip.currency] || trip.currency}{trip.price}
                </p>
                {trip.status === 'upcoming' && (
                  <button
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelTrip(trip.id);
                    }}
                  >
                    Cancel Trip
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyJourneys;