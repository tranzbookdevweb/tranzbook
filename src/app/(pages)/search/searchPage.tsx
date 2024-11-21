'use client'
import { useState, useEffect, Suspense } from 'react';
import { PanoramaFishEyeSharp, AccessTimeSharp, LocationOnSharp } from '@mui/icons-material';
import Link from 'next/link';
import { BookingFilterAccordion } from '@/components/FilterComponent';
import FormBus from '@/components/FormBus';
import { Bus } from 'lucide-react';
import NoBusFound from '@/app/admin/components/NoBusFound';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@mui/material';

type Trip = {
  id: string;
  date: string | null;
  price: number;
  departureTime: string;
  busId: string;
  routeId: string;
  driverId: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  branch: {
    id: string;
    name: string;
    address: string;
    location: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    company: {
      logoUrl: string;
    };
  };
  bus: {
    id: string;
    plateNumber: string;
    capacity: number;
    busType: string;
    imageUrl: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
  };
  route: {
    id: string;
    startLocationId: string;
    endLocationId: string;
    duration: number;
    distance: number;
    branchId: string;
    createdAt: string;
    updatedAt: string;
    startLocation: {
      id: string;
      name: string;
    };
    endLocation: {
      id: string;
      name: string;
    };
  };
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    email: string;
    mobile: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
  };
};

const defaultLogoUrl = 'path/to/default/logo'; // Replace with your actual default logo URL

const SearchPage = () => {
  const [results, setResults] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const fromLocation = searchParams.get("fromLocation") || "";
  const toLocation = searchParams.get("toLocation") || "";
  const date = searchParams.get("date") || "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true); // Set loading state true before fetch
        const response = await fetch(`/api/GET/getSearchByQuery?fromLocation=${fromLocation}&toLocation=${toLocation}&date=${date}`);
        const data: Trip[] = await response.json();
        setResults(data);
      } catch (err) {
        setError('Error fetching trips');
      } finally {
        setLoading(false); // Ensure loading is turned off after fetch completes
      }
    };

    fetchResults();
  }, [fromLocation, toLocation, date]);

  if (loading) {
    return (
      <div className="grid grid-cols-3">
        {/* Skeleton loaders */}
        <div className="grid grid-cols-1">
          <div className="flex-col flex ml-5">
            <Skeleton width={100} height={20} />
            <Skeleton width={150} height={30} />
          </div>
        </div>
        <div className="grid grid-cols-1 col-span-2">
          <div className="value flex bg-white items-center p-[2vh] rounded-md mr-[2vw]">
            <Skeleton variant="text" width={60} />
            <div className="flex items-center space-x-4 max-md:flex-row">
              <Skeleton variant="rectangular" width={80} height={30} />
              <Skeleton variant="rectangular" width={80} height={30} />
              <Skeleton variant="rectangular" width={80} height={30} />
            </div>
          </div>
        </div>
        <div className="grid max-lg:hidden grid-cols-1 items-start justify-center">
          <Skeleton variant="rectangular" height={150} width="100%" />
        </div>
        <div className="grid grid-cols-1 col-span-2 max-lg:col-span-3 items-start justify-center">
          <div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="grid grid-cols-1 mb-5 w-full border border-gray-200 rounded-[1pc]">
                <div className="flex max-md:flex-col">
                  <div className="flex w-full p-[2vh] justify-between">
                    <div className="flex flex-col justify-between">
                      <div className="sectiontop">
                        <Skeleton variant="circular" width={96} height={96} />
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                      </div>
                      <div className="sectionbottom">
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                      </div>
                    </div>
                    <div className="rightloca flex flex-col items-center justify-between">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton width={100} height={20} />
                      <Skeleton width={80} height={30} />
                      <Skeleton variant="rectangular" width={100} height={30} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="relative w-full overflow-hidden">
        <FormBus />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {results.length > 0 ? (
          <div className="grid grid-cols-3">
            <div className="grid grid-cols-1">
              <div className="flex-col flex ml-5">
                <h2 className="font-bold text-gray-400 text-[11px]">SELECT YOUR TRIP</h2>
                <h1 className="font-bold text-[#48A0FF] text-[15px]">
                  Available Trips: {results.length} results
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 col-span-2">
              <div className="value flex bg-white items-center p-[2vh] rounded-md mr-[2vw]">
                <h2 className="mr-3 font-semibold">Sort By</h2>
                <div className="flex items-center space-x-4 max-md:flex-row">
                  <button
                    className="px-2 font-semibold rounded-[0.4pc]"
                    style={{
                      backgroundColor: "#48A0FF",
                      color: "#F2F4F7",
                    }}
                  >
                    Cheapest
                  </button>
                  <button
                    className="px-2 font-semibold rounded-[0.4pc]"
                    style={{
                      backgroundColor: "#F2F4F7",
                      color: "#48A0FF",
                    }}
                  >
                    Fastest
                  </button>
                  <button
                    className="px-2 font-semibold rounded-[0.4pc]"
                    style={{
                      backgroundColor: "#F2F4F7",
                      color: "#48A0FF",
                    }}
                  >
                    Earliest
                  </button>
                </div>
              </div>
            </div>
            <div className="grid max-lg:hidden grid-cols-1 items-start justify-center">
              <BookingFilterAccordion />
            </div>
            <div className="grid grid-cols-1 col-span-2 max-lg:col-span-3 items-start justify-center">
              <div>
                {results.map((trip) => (
                  <div
                    className="grid grid-cols-1 mb-5 w-full border border-gray-200 rounded-[1pc]"
                    key={trip.id}
                  >
                    <div className="flex max-md:flex-col">
                      <div className="flex w-full p-[2vh] justify-between">
                        <div className="flex flex-col justify-between">
                          <div className="sectiontop">
                            <div className="buspic">
                              <img
                                className='w-48 rounded-full h-24 object-fill'
                                src={ 
                                  trip.branch.company.logoUrl
                                  ? `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/images/${trip.bus.imageUrl}`
                                  : defaultLogoUrl
                                }
                                alt="Company Logo"
                              />
                            </div>
                            <h2>
                              <PanoramaFishEyeSharp className="ic" />
                              {trip.route.startLocation.name}
                            </h2>
                            <h3>
                              <AccessTimeSharp className="ic" /> {trip.departureTime} | Date:{" "}
                              {trip.date || "No date selected"}
                            </h3>
                          </div>
                          <div className="sectionbottom">
                            <h2>
                              <LocationOnSharp className="ic" />
                              {trip.route.endLocation.name}
                            </h2>
                            <h3>
                              <AccessTimeSharp className="ic" /> Duration: {trip.route.duration} mins | Distance:{" "}
                              {trip.route.distance} km
                            </h3>
                          </div>
                        </div>
                        <div className="rightloca flex flex-col items-center justify-between">
                          <div className="flex items-center flex-col text-[2vh]">
                            <div>
                              <img
                                className="w-full rounded-full h-8 object-fill"
                                src={ 
                                  trip.bus.imageUrl
                                  ? `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${trip.bus.imageUrl}`
                                  : defaultLogoUrl
                                }
                                alt="Bus Image"
                              />
                            </div>
                            <h2 className="font-semibold flex items-center text-[#48A0FF]">
                              <Bus /> {trip.bus.busType} | {trip.bus.plateNumber}
                            </h2>
                          </div>
                          <h6 className="font-semibold">GH₵{trip.price}</h6>
                          <div>
                            <Link
                              href={{
                                pathname: "/bookings/seatPicker",
                                query: { tripId: trip.id },
                              }}
                              className="bg-[#48A0FF] p-2 rounded-[0.4pc] text-white font-bold"
                            >
                              Book
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <NoBusFound />
        )}
      </Suspense>
    </div>
  );
};

export default SearchPage;
