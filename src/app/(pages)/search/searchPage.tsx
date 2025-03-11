'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { BookingFilterAccordion } from '@/components/FilterComponent';
import FormBus from '@/components/FormBus';
import { ArrowRight, Calendar, Clock, Filter, MapPin } from 'lucide-react';
import NoBusFound from '@/app/admin/components/NoBusFound';
import { useSearchParams } from 'next/navigation';
import { format, addMinutes, parse } from 'date-fns';

// Shadcn components
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SkeletonLoader from './SkeletonLoader';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type CompanyData = {
  id: string;
  name: string;
  email?: string;
  logo?: string;
};

type Trip = {
  id: string;
  date: string | null;
  price: number;
  departureTime: string;
  busId: string;
  routeId: string;
  driverId: string;
  currency: string;
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
      logo: string;
      name: string;
      id: string; // Added id field for company filtering
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

const defaultLogo = '/images/default-logo.png';

const SearchResults = () => {
  const [allResults, setAllResults] = useState<Trip[]>([]);
  const [filteredResults, setFilteredResults] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('cheapest');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableCompanies, setAvailableCompanies] = useState<CompanyData[]>([]);
  const resultsPerPage = 5;
  
  const searchParams = useSearchParams();
  const fromLocation = searchParams.get("fromLocation") || "";
  const toLocation = searchParams.get("toLocation") || "";
  const date = searchParams.get("date") || "";

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
  };

  // Calculate arrival time based on departure time and duration
  const calculateArrivalTime = (departureTime: string, durationInMinutes: number) => {
    try {
      const deptTime = parse(departureTime, 'HH:mm', new Date());
      const arrivalTime = addMinutes(deptTime, durationInMinutes);
      return format(arrivalTime, 'HH:mm');
    } catch (error) {
      return "N/A";
    }
  };

  // Determine time period based on departure time
  const getTimePeriod = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      // Fetch without company/time filters - we'll filter on the client side
      const response = await fetch(
        `/api/GET/getSearchByQuery?fromLocation=${fromLocation}&toLocation=${toLocation}&date=${date}&sort=${sort}`
      );
      if (!response.ok) throw new Error('Error fetching trips');
      const data: Trip[] = await response.json();
      
      setAllResults(data);
      
      // Extract unique companies from search results
      const companies = Array.from(
        new Map(
          data.map(trip => [
            trip.bus.company.id,
            {
              id: trip.bus.company.id, 
              name: trip.bus.company.name,
              logo: trip.bus.company.logo
            }
          ])
        ).values()
      );
      
      setAvailableCompanies(companies);
      
    } catch (err) {
      setError('Error fetching trips');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters client-side
  useEffect(() => {
    if (!allResults.length) return;
    
    let results = [...allResults];
    
    // Apply company filter
    if (selectedCompanies.length > 0) {
      results = results.filter(trip => 
        selectedCompanies.includes(trip.bus.company.id)
      );
    }
    
    // Apply time filter
    if (selectedTime) {
      results = results.filter(trip => 
        getTimePeriod(trip.departureTime) === selectedTime
      );
    }
    
    // Apply sorting
    if (sort === 'cheapest') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'fastest') {
      results.sort((a, b) => a.route.duration - b.route.duration);
    } else if (sort === 'earliest') {
      results.sort((a, b) => {
        const timeA = a.departureTime.split(':').map(Number);
        const timeB = b.departureTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
    }
    
    setFilteredResults(results);
    setTotalPages(Math.ceil(results.length / resultsPerPage));
    setPage(1); // Reset to first page when filters change
  }, [allResults, selectedCompanies, selectedTime, sort]);

  useEffect(() => {
    fetchResults();
  }, [fromLocation, toLocation, date, sort]);

  // Handle filters
  const handleCompanyFilterChange = (companies: string[]) => {
    setSelectedCompanies(companies);
  };
  
  const handleTimeFilterChange = (time: string) => {
    setSelectedTime(time);
  };

  // Get current page results
  const getCurrentPageResults = () => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return filteredResults.slice(startIndex, endIndex);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    
    try {
      return format(new Date(dateString), 'EEE, MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent className="flex flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i} className="hidden sm:block">
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem className="block sm:hidden">
            <span className="px-2 py-2 text-sm">
              {page} of {totalPages}
            </span>
          </PaginationItem>
          
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return filteredResults.length > 0 ? (
    <div className="h-full mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h2 className="text-lg text-gray-400 uppercase font-semibold">SELECT YOUR TRIP</h2>
          <h1 className="text-sm text-blue-600 font-medium">
            Available Trips: {filteredResults.length} results
          </h1>
        </div>
        
        <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" /> 
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-fit justify-center text-black bg-white">
              <BookingFilterAccordion 
                onCompanyFilterChange={handleCompanyFilterChange}  
                onTimeFilterChange={handleTimeFilterChange}
                companyData={availableCompanies}
              />
            </SheetContent>
          </Sheet>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 ml-auto md:ml-0">
            <span className="text-xs sm:text-sm font-medium">Sort:</span>
            <div className="flex flex-wrap gap-1">
              {["cheapest", "fastest", "earliest"].map((filter) => (
                <button
                  key={filter}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    sort === filter 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-blue-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setSort(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="hidden lg:block">
          <BookingFilterAccordion 
            onCompanyFilterChange={handleCompanyFilterChange}  
            onTimeFilterChange={handleTimeFilterChange}
            companyData={availableCompanies}
          />
        </div>
        
        <div className="col-span-1 lg:col-span-3">
          {getCurrentPageResults().map((trip) => (
            <Card key={trip.id} className="mb-4 overflow-hidden border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="rounded-full overflow-hidden bg-gray-100 flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              trip.bus.company.logo
                                ? `https://kqvxondwjmttypsecwds.supabase.co/storage/v1/object/public/${trip.bus.company.logo}`
                                : defaultLogo
                            }
                            alt={trip.bus.company.name || "Bus company"}
                          />
                        </div>
                        <div>
                          <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                            <Badge variant="outline" className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-50">
                              {trip.bus.busDescription}
                            </Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            {formatDate(trip.date || date)}
                          </div>
                        </div>
                      </div>

                      {/* Travel time display */}
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-base sm:text-lg font-bold">{trip.departureTime}</div>
                            <div className="text-xs sm:text-sm text-gray-600 truncate max-w-24 sm:max-w-32">{trip.route.startCity.name}</div>
                          </div>
                          
                          <div className="flex flex-col items-center px-1 sm:px-3">
                            <div className="text-xs text-gray-500 mb-1 hidden sm:block">{formatDuration(trip.route.duration)}</div>
                            <div className="flex items-center">
                              <div className="h-1 w-4 sm:w-8 bg-gray-300 rounded"></div>
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mx-1" />
                              <div className="h-1 w-4 sm:w-8 bg-gray-300 rounded"></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <span className="sm:hidden">{formatDuration(trip.route.duration)}</span>
                              <span className="hidden sm:inline">{trip.route.distance} km</span>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-base sm:text-lg font-bold">
                              {calculateArrivalTime(trip.departureTime, trip.route.duration)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 truncate max-w-24 sm:max-w-32">{trip.route.endCity.name}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1 text-green-600">
                          <Calendar className="w-3 h-3" />
                          <span>{trip.bus.capacity} seats left</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:gap-3 md:min-w-28 mt-3 md:mt-0">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {trip.currency} {trip.price}
                      </div>
                      <Link
                        href={{
                          pathname: "/bookings/seatPicker",
                          query: { tripId: trip.id, date: date },
                        }}
                        className="bg-blue-500 hover:bg-blue-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white text-sm sm:text-base font-medium transition-colors inline-block text-center min-w-20 sm:min-w-24"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {renderPagination()}
        </div>
      </div>
    </div>
  ) : (
    <NoBusFound />
  );
};

const SearchPage = () => {
  return (
    <div>
      <div className="w-full h-full">
        <FormBus />
      </div>
      <Suspense fallback={<div className="p-4"><SkeletonLoader /></div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
};

export default SearchPage;