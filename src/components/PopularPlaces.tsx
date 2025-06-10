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
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 md:right-4 md:p-3"
  >
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 md:left-4 md:p-3"
  >
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  // Split locations into chunks for desktop only
  const chunkArray = (array: LocationItem[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const desktopChunks = chunkArray(locations, 9); // 3x3 grid on desktop

  // Mobile slider settings - one card at a time
  const mobileSliderSettings = {
    dots: false,
    infinite: locations.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: locations.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i: number) => (
      <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-blue-500 transition-colors duration-300"></div>
    ),
    dotsClass: "slick-dots custom-dots",
  };

  // Desktop slider settings - grid layout
  const desktopSliderSettings = {
    dots: true,
    infinite: locations.length > 9,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: locations.length > 9,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
      <div className="flex justify-center items-center min-h-[200px] bg-white px-4">
        <div className="animate-pulse text-gray-600 text-center text-sm md:text-base">
          Loading popular destinations...
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px] bg-white px-4">
        <div className="text-gray-600 text-center text-sm md:text-base">
          No popular routes available
        </div>
      </div>
    );
  }

  const MobileLocationCard = ({ location, index }: { location: LocationItem; index: number }) => (
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
      className="block px-4"
    >
      <div className="relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer mx-auto max-w-sm">
        {/* Background Image */}
        <img
          src={location.image}
          alt={`${location.from} to ${location.to}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-center">
            <h3 className="text-white font-bold text-xl mb-2">
              {location.from}
            </h3>
            <div className="flex items-center justify-center mb-3">
              <div className="text-[#48A0FF] group-hover:translate-x-2 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <p className="text-white/90 text-lg font-medium">
              {location.to}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  const DesktopLocationCard = ({ location, index }: { location: LocationItem; index: number }) => (
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
      className="block"
    >
      <div className="relative w-full h-[180px] lg:h-[200px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
        {/* Background Image */}
        <img
          src={location.image}
          alt={`${location.from} to ${location.to}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base lg:text-lg truncate">
                {location.from}
              </h3>
              <p className="text-white/90 text-sm truncate">
                {location.to}
              </p>
            </div>
            <div className="ml-2 text-[#48A0FF] group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Top Destinations
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            These destinations are popular among travelers like you
          </p>
        </div>

        {error && (
          <div className="text-center mb-6">
            <p className="text-red-500 text-sm md:text-base">
              Could not load popular routes. Showing available destinations.
            </p>
          </div>
        )}

        {/* Mobile Layout (up to md) - One card at a time */}
        <div className="block md:hidden">
          <Slider {...mobileSliderSettings}>
            {locations.map((location, index) => (
              <div key={`mobile-slide-${index}`}>
                <MobileLocationCard location={location} index={index} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Layout (md and up) - Grid layout */}
        <div className="hidden md:block">
          {locations.length > 9 ? (
            <Slider {...desktopSliderSettings}>
              {desktopChunks.map((chunk, slideIndex) => (
                <div key={slideIndex}>
                  <div className="grid grid-cols-3 gap-4 lg:gap-6 px-2">
                    {chunk.map((location, index) => (
                      <DesktopLocationCard key={`desktop-${slideIndex}-${index}`} location={location} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {locations.slice(0, 9).map((location, index) => (
                <DesktopLocationCard key={`desktop-single-${index}`} location={location} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        .custom-dots {
          bottom: -35px !important;
          text-align: center;
        }
        
        .custom-dots li {
          margin: 0 4px;
        }
        
        .custom-dots li div {
          transition: all 0.3s ease;
        }
        
        .custom-dots li.slick-active div {
          background-color: #48A0FF !important;
          transform: scale(1.3);
        }
        
        .slick-arrow:before {
          display: none;
        }

        @media (max-width: 768px) {
          .custom-dots {
            bottom: -30px !important;
          }
        }
        
        /* Ensure slider container has proper spacing */
        .slick-slider {
          margin-bottom: 50px;
        }
        
        .slick-list {
          overflow: hidden;
        }
        
        .slick-track {
          display: flex;
          align-items: center;
        }
        
        .slick-slide > div {
          height: 100%;
        }
      `}</style>
    </div>
  );
}