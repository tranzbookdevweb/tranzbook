"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define the type for location items
interface LocationItem {
  id?: string;
  image: string;
  from: string;
  to: string;
}

export function PopularPlace() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularRoutes() {
      try {
        const response = await fetch('/api/GET/getPopRoutes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch routes');
        }
        
        const data = await response.json();
        setLocations(data.routes);
        setIsLoading(false);
      } catch (error: unknown) {
        console.error('Error fetching routes:', error);
        // Handle the error message appropriately based on type
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);
        setIsLoading(false);
      }
    }

    fetchPopularRoutes();
  }, []);

  // Calculate the next day's date
  const nextDayDate = new Date();
  nextDayDate.setDate(nextDayDate.getDate() + 1);
  const formattedNextDayDate = nextDayDate.toISOString(); // ISO 8601 format for date

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading popular destinations...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-5 py-10 bg-gray-50">
      {/* Title Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Top Destinations</h1>
      <p className="text-lg text-gray-600 mb-8">
        These destinations are popular among travelers like you
      </p>

      {/* Grid Section */}
      {error && <p className="text-red-500 mb-4">Could not load popular routes. Showing default destinations.</p>}
      
      <div className="grid px-10 grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {locations.map((location, index) => (
          <Link
            key={index}
            href={{
              pathname: "/search",
              query: {
                fromLocation: location.from,
                toLocation: location.to,
                date: formattedNextDayDate,
                returnDate: "",
                ticketQuantity: 1, // Default to 1 ticket
              },
            }}
            passHref
          >
            <div className="relative h-48 md:h-64 rounded-[2pc] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
              {/* Background Image */}
              <img
                src={location.image}
                alt={`${location.from} to ${location.to}`}
                className="group-hover:scale-110 transform transition-transform object-cover h-full w-full duration-300"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                <h2 className="text-white text-xl font-bold flex items-center">
                  {location.from}
                  <span className="ml-2 text-[#48A0FF] group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </h2>
                <p className="text-white text-sm">{location.to}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}