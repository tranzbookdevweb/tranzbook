'use client';
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
  bus: {
    id: string;
    plateNumber: string;
    capacity: number;
    busDescription: string;
    image: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    company: {
      logo: string
  }
  };
  route: {
    id: string;
    startCityId: string;
    endCityId: string;
    duration: number;
    distance: number;
    branchId: string;
    createdAt: string;
    updatedAt: string;
    startCity: {
      id: string;
      name: string;
    };
    endCity: {
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

const defaultlogo = 'path/to/default/logo'; // Replace with your actual default logo URL

const SearchResults = () => {
  const [results, setResults] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('cheapest'); // Default sort filter
  const [company, setCompany] = useState<string[]>([]);
  const [time, setTime] = useState<string[]>([]);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const fromLocation = searchParams.get("fromLocation") || "";
  const toLocation = searchParams.get("toLocation") || "";
  const date = searchParams.get("date") ;


  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/GET/getSearchByQuery?fromLocation=${fromLocation}&toLocation=${toLocation}&date=${date}&sort=${sort}&company=${company}&time=${time}`
      );
      if (!response.ok) throw new Error('Error fetching trips');
      const data: Trip[] = await response.json();
      setResults(data);
    } catch (err) {
      setError('Error fetching trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [fromLocation, toLocation, date, sort, company, time]);

  const handleSaveFilter = () => {
    fetchResults(); // Re-fetch results with the selected filters
  };
  if (loading) {
    return (
      <div className="grid grid-cols-3">
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

  return results.length > 0 ? (
    <div className="p-4">
      <div className='flex items-center justify-between w-full'>
      <div className="mb-4">
        <h2 className="text-sm text-gray-400">SELECT YOUR TRIP</h2>
        <h1 className="text-lg text-blue-500 font-bold">
          Available Trips: {results.length} results
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h2 className="text-sm font-semibold">Sort By:</h2>
        {["cheapest", "fastest", "earliest"].map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1 rounded-md text-sm ${
              sort === filter ? "bg-blue-500 text-white" : "bg-gray-200 text-blue-500"
            }`}
            onClick={() => setSort(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div></div>
    <div className="grid grid-cols-3 gap-4">
    <div className="grid max-lg:hidden grid-cols-1 items-start justify-center">
      <BookingFilterAccordion 
      // onSaveFilter={handleSaveFilter}
      onCompanyFilterChange={(value:any) => setCompany([value])}  
            onTimeFilterChange={(value:any) => setTime([value])}  
         />
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
                        className='w-48 rounded-full h-24 object-cover'
                        src={ 
                          trip.bus.company.logo
                          ? `https://kqvxondwjmttypsecwds.supabase.co/storage/v1/object/public/images/${trip.bus.image}`
                          : defaultlogo
                        }
                        alt="Company Logo"
                      />
                    </div>
                    <h2>
                      <PanoramaFishEyeSharp className="ic" />
                      {trip.route.startCity.name}
                    </h2>
                    <h3>
                      <AccessTimeSharp className="ic" /> {trip.departureTime} | Date:{" "}
                      {trip.date || date}
                    </h3>
                  </div>
                  <div className="sectionbottom">
                    <h2>
                      <LocationOnSharp className="ic" />
                      {trip.route.endCity.name}
                    </h2>
                    <h3>
                      <AccessTimeSharp className="ic" /> Duration: {trip.route.duration} mins | Distance:{" "}
                      {trip.route.distance} km
                    </h3>
                  </div>
                </div>
                <div className="rightloca flex flex-col items-center justify-between">
                  <div className="flex items-center text-center h-full py-5 justify-between flex-col text-[2vh]">
                  <h1 className='text-sm text-blue-600 font-semibold'>{trip.bus.busDescription}</h1>

                    <div>
                      <img
                        className="w-full rounded-full h-12 object-fill"
                        src={ 
                          trip.bus.image
                          ? `https://kqvxondwjmttypsecwds.supabase.co/storage/v1/object/public/${trip.bus.company.logo}`
                          : defaultlogo
                        }
                        alt="Bus Image"
                      />
                                        <h6 className="font-semibold text-center">GH₵{trip.price}</h6>

                    </div>
                    <div>
                    <Link
                      href={{
                        pathname: "/bookings/seatPicker",
                        query: { tripId: trip.id, date: date },
                      }}
                      className="bg-[#48A0FF] p-2 rounded-[0.4pc] text-white font-bold"
                    >
                      Book
                    </Link>
                  </div></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  </div>
  ) : (
    <NoBusFound />
  );
};

const SearchPage = () => {
  return (
    <div>
      <div className="relative w-full overflow-hidden">
        <FormBus />
      </div>
      <Suspense fallback={<Skeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
};

export default SearchPage;
