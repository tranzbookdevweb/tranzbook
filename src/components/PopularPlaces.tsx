"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define the type for location items
interface LocationItem {
  id?: string;
  image: string;
  from: string;
  to: string;
}

// Custom arrow components
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

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
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);
        setIsLoading(false);
      }
    }

    fetchPopularRoutes();
  }, []);

  // Split locations into chunks of 9 for each slide
  const chunkArray = (array: LocationItem[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const locationChunks = chunkArray(locations, 9);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: locationChunks.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: locationChunks.length > 1,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Hide arrows on mobile for better UX
        }
      }
    ],
    customPaging: (i: number) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-blue-500 transition-colors duration-300"></div>
    ),
    dotsClass: "slick-dots custom-dots",
  };

  // Calculate the next day's date
  const nextDayDate = new Date();
  nextDayDate.setDate(nextDayDate.getDate() + 1);
  const formattedNextDayDate = nextDayDate.toISOString();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-white">
        <div className="animate-pulse text-gray-600">Loading popular destinations...</div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-white">
        <div className="text-gray-600">No popular routes available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-5 py-10 bg-white">
      {/* Title Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Top Destinations</h1>
      <p className="text-lg text-gray-600 mb-8">
        These destinations are popular among travelers like you
      </p>

      {error && <p className="text-red-500 mb-4">Could not load popular routes. Showing available destinations.</p>}
      
      {/* Carousel Section with 9-Grid Layout */}
      <div className="w-full max-w-7xl relative">
        {locationChunks.length > 1 ? (
          <Slider {...sliderSettings}>
            {locationChunks.map((chunk, slideIndex) => (
              <div key={slideIndex} className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {chunk.map((location, index) => (
                    <Link
                      key={`${slideIndex}-${index}`}
                      href={{
                        pathname: "/search",
                        query: {
                          fromLocation: location.from,
                          toLocation: location.to,
                          date: formattedNextDayDate,
                          returnDate: "",
                          ticketQuantity: 1,
                        },
                      }}
                      passHref
                    >
                      <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        {/* Background Image */}
                        <img
                          src={location.image}
                          alt={`${location.from} to ${location.to}`}
                          className="group-hover:scale-110 transform transition-transform object-cover h-full w-full duration-300"
                        />

                        {/* Text Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-3 md:p-4">
                          <h2 className="text-white text-lg md:text-xl font-bold flex items-center">
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
            ))}
          </Slider>
        ) : (
          // Single grid if there's only one page
          <div className="px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                      ticketQuantity: 1,
                    },
                  }}
                  passHref
                >
                  <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    {/* Background Image */}
                    <img
                      src={location.image}
                      alt={`${location.from} to ${location.to}`}
                      className="group-hover:scale-110 transform transition-transform object-cover h-full w-full duration-300"
                    />

                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-3 md:p-4">
                      <h2 className="text-white text-lg md:text-xl font-bold flex items-center">
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
        )}
      </div>

      {/* Custom CSS for dots */}
      <style jsx global>{`
        .custom-dots {
          bottom: -50px !important;
        }
        
        .custom-dots li {
          margin: 0 5px;
        }
        
        .custom-dots li div {
          transition: all 0.3s ease;
        }
        
        .custom-dots li.slick-active div {
          background-color: #48A0FF !important;
          transform: scale(1.2);
        }
        
        .slick-arrow:before {
          display: none;
        }
      `}</style>
    </div>
  );
}