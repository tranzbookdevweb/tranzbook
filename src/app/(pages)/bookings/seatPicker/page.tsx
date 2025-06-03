"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import BusDetails from "../_components/busDetails";
import SeatSelection from "../_components/seatSelection";
import Ticket from "../_components/ticket";
import { BusDetailsSkeleton } from "../_components/Skeletons/busDetailsSkeleton";
import { SeatSelectionSkeleton } from "../_components/Skeletons/seatSelectionSkeleton";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { BellElectric, PowerIcon, Wifi, Check, CreditCard, User, MapPin, ArrowLeft, Clock, Users, Route, Menu, X } from "lucide-react";
import {
  AcUnitOutlined,
  FamilyRestroom,
  FoodBank,
} from "@mui/icons-material";
import { useToast } from "@/components/ui/use-toast";

// Type definitions for better TypeScript support
type StepStatus = 'completed' | 'active' | 'pending';

interface StepStyles {
  circle: string;
  title: string;
  description: string;
  connector: string;
}

// Enhanced Progress Bar Component with mobile-first design
const BookingProgressBar: React.FC<{ currentStep?: number; isCompleted?: boolean }> = ({ 
  currentStep = 1, 
  isCompleted = false 
}) => {
  const steps = [
    {
      id: 1,
      title: "Select Seat",
      description: "Choose your preferred seat",
      shortTitle: "Seat",
      icon: <MapPin size={16} />
    },
    {
      id: 2,
      title: "Passenger Details",
      description: "Fill in passenger information",
      shortTitle: "Details",
      icon: <User size={16} />
    },
    {
      id: 3,
      title: "Complete Booking",
      description: "Finalize your reservation",
      shortTitle: "Complete",
      icon: <CreditCard size={16} />
    }
  ];

  const getStepStatus = (stepId: number): StepStatus => {
    if (isCompleted) return 'completed';
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const getStepStyles = (status: StepStatus): StepStyles => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 text-white shadow-lg shadow-green-200',
          title: 'text-green-700 font-semibold',
          description: 'text-green-600',
          connector: 'bg-gradient-to-r from-green-500 to-emerald-600'
        };
      case 'active':
        return {
          circle: 'bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100',
          title: 'text-blue-700 font-semibold',
          description: 'text-blue-600',
          connector: 'bg-gray-200'
        };
      case 'pending':
        return {
          circle: 'bg-white border-2 border-gray-300 text-gray-400 shadow-sm',
          title: 'text-gray-500',
          description: 'text-gray-400',
          connector: 'bg-gray-200'
        };
      default:
        return {
          circle: 'bg-white border-2 border-gray-300 text-gray-400 shadow-sm',
          title: 'text-gray-500',
          description: 'text-gray-400',
          connector: 'bg-gray-200'
        };
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="relative">
          {/* Mobile Progress Line */}
          <div className="absolute top-6 sm:top-12 left-0 w-full h-0.5 sm:h-1 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ 
                width: isCompleted ? '100%' : `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
              }}
            />
          </div>

          {/* Steps Container - Mobile Responsive */}
          <div className="relative flex justify-between items-start">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const styles = getStepStyles(status);
              
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                  {/* Step Circle - Responsive sizing */}
                  <div className={`
                    w-12 h-12 sm:w-16 md:w-20 lg:w-24 
                    sm:h-16 md:h-20 lg:h-24 
                    rounded-full border-2 flex items-center justify-center
                    transition-all duration-500 ease-out
                    ${styles.circle}
                  `}>
                    {status === 'completed' ? (
                      <Check size={18} className="text-white sm:w-6 sm:h-6" />
                    ) : (
                      <div className="text-current">
                        {step.icon}
                      </div>
                    )}
                  </div>

                  {/* Step Content - Mobile responsive text */}
                  <div className="mt-2 sm:mt-4 md:mt-6 text-center max-w-24 sm:max-w-32 md:max-w-40">
                    <h3 className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold transition-all duration-300 ${styles.title}`}>
                      {/* Show short title on mobile, full title on larger screens */}
                      <span className="sm:hidden">{step.shortTitle}</span>
                      <span className="hidden sm:inline">{step.title}</span>
                    </h3>
                    <p className={`text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed transition-all duration-300 ${styles.description} hidden sm:block`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Step Number Badge - Responsive sizing */}
                  <div className={`
                    absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 
                    w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 
                    rounded-full text-xs sm:text-sm font-bold
                    flex items-center justify-center transition-all duration-300 shadow-md
                    ${status === 'completed' 
                      ? 'bg-green-500 text-white border-2 border-white' 
                      : status === 'active' 
                        ? 'bg-blue-500 text-white border-2 border-white'
                        : 'bg-gray-300 text-gray-600 border-2 border-white'
                    }
                  `}>
                    {status === 'completed' ? <Check size={12} className="sm:w-4 sm:h-4" /> : step.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Progress Summary - Mobile responsive */}
        <div className="mt-6 sm:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Current Step</p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900">
                    {isCompleted ? '🎉 Completed!' : `${steps[currentStep - 1]?.shortTitle || steps[currentStep - 1]?.title}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Progress</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  {isCompleted ? '100%' : `${Math.round((currentStep / steps.length) * 100)}%`}
                </p>
              </div>
            </div>
            
            {/* Enhanced Progress Bar - Mobile responsive */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 sm:h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                style={{ width: isCompleted ? '100%' : `${(currentStep / steps.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interfaces (keeping your existing ones)
interface Bus {
  id: string;
  plateNumber: string | null;
  capacity: number;
  busDescription: string;
  image: string | null;
  company: { id: string; name: string; logo: string };
  airConditioning: boolean;
  chargingOutlets: boolean;
  wifi: boolean;
  restRoom: boolean;
  seatBelts: boolean;
  onboardFood: boolean;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

interface Route {
  id: string;
  startCity: { id: string; name: string };
  endCity: { id: string; name: string };
  duration: number;
  distance: number;
}

interface SeatAvailability {
  date: string;
  availableSeats: number;
  bookedSeats: number[];
  status: string;
}

interface PassengerDetail {
  name: string;
  phoneNumber: string;
  email?: string;
  kinName: string;
  kinContact: string;
  kinEmail?: string;
}

interface Trip {
  id: string;
  date: string | null;
  price: number;
  departureTime: string;
  bus: Bus;
  driver: Driver | null;
  route: Route;
  seatAvailability: SeatAvailability[];
}

// Enhanced Trip Info Header Component - Mobile Responsive
const TripInfoHeader: React.FC<{ tripData: Trip }> = ({ tripData }) => {
  const { route, departureTime, bus } = tripData;
  
  function calculateArrivalTime(departureTime: string, duration: number): string {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes);
    departureDate.setMinutes(departureDate.getMinutes() + duration);
    const arrivalHours = departureDate.getHours().toString().padStart(2, "0");
    const arrivalMinutes = departureDate.getMinutes().toString().padStart(2, "0");
    return `${arrivalHours}:${arrivalMinutes}`;
  }

  const arrivalTime = calculateArrivalTime(departureTime, route.duration);

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
          <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>
          
          {/* Mobile: Stack vertically, Desktop: Horizontal */}
          <div className="flex  items-start items-center  space-x-4 md:space-x-8 w-full sm:w-auto">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Route size={16} className="text-blue-600 sm:w-5 sm:h-5" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {route.startCity.name} → {route.endCity.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock size={16} className="text-green-600 sm:w-5 sm:h-5" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                {departureTime} - {arrivalTime}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Users size={16} className="text-purple-600 sm:w-5 sm:h-5" />
              <span className="font-medium text-gray-700 text-sm sm:text-base truncate max-w-32 sm:max-w-none">
                {bus.company.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const dateParam = searchParams.get("date");
  const baseApiUrl = `/api/GET/getTripById?id=${tripId}${dateParam ? `&date=${dateParam}` : ''}`;
  const isFetching = useRef(false);
  
  const ticketQuantity = parseInt(searchParams.get("ticketQuantity") || "1", 10);
  const { toast } = useToast();
  const [currency] = useState<string>("GHS");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false);
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [busImage, setBusImage] = useState<string>("default-logo-url");
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [remainingSeats, setRemainingSeats] = useState<number>(0);
  const currentDate = dateParam ? new Date(dateParam) : new Date();
  const [bookingReference, setBookingReference] = useState<string>("");
  const [ticketLimitReached, setTicketLimitReached] = useState<boolean>(false);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>([]);
  const [passengerDetailsFilled, setPassengerDetailsFilled] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  
  const getCurrentStep = (): number => {
    if (selectedSeats.length === 0) return 1;
    if (selectedSeats.length > 0 && !passengerDetailsFilled) return 2;
    if (selectedSeats.length > 0 && passengerDetailsFilled && !isBooked) return 3;
    return 3;
  };

  const fetchTripData = async () => {
    if (isFetching.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }
    isFetching.current = true;
    const apiUrl = `${baseApiUrl}&_t=${Date.now()}`;
    try {
      console.log("Fetching trip data with URL:", apiUrl);
      console.log("dateParam:", dateParam);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch trip data: ${response.statusText}`);
      const data: Trip = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));
      setTripData(data);

      if (data.bus.image) {
        setBusImage(
          `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/images/${data.bus.image}`
        );
      }

      if (dateParam && data.seatAvailability.length > 0) {
        const normalizedDateParam = new Date(dateParam).toISOString().slice(0, 10);
        const availability = data.seatAvailability.find(
          (sa) => new Date(sa.date).toISOString().slice(0, 10) === normalizedDateParam
        );
        console.log("Normalized dateParam:", normalizedDateParam);
        console.log("Found availability:", availability);
        setBookedSeats(availability?.bookedSeats || []);
        setRemainingSeats(availability?.availableSeats ?? data.bus.capacity);
      } else if (data.bus) {
        console.log("No seatAvailability found, assuming all seats available");
        setBookedSeats([]);
        setRemainingSeats(data.bus.capacity);
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trip data. Please try again.",
      });
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (!tripId || !dateParam) {
      console.log("Missing tripId or dateParam:", { tripId, dateParam });
      return;
    }
    fetchTripData();
  }, [tripId, dateParam]);

  useEffect(() => {
    setTicketLimitReached(selectedSeats.length >= ticketQuantity);
  }, [selectedSeats, ticketQuantity]);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      const newPassengerDetails = Array(selectedSeats.length).fill({
        name: "",
        phoneNumber: "",
        email: "",
        kinName: "",
        kinContact: "",
        kinEmail: "",
      });
      setPassengerDetails(newPassengerDetails as PassengerDetail[]);
      setPassengerDetailsFilled(false);
    } else {
      setPassengerDetails([]);
    }
  }, [selectedSeats.length]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const toggleButton = document.getElementById('mobile-sidebar-toggle');
      
      if (showSidebar && sidebar && !sidebar.contains(event.target as Node) 
          && toggleButton && !toggleButton.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSidebar]);

  if (!tripData) {
    return (
      <main className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
        <div className="animate-pulse">
          <div className="h-16 sm:h-24 md:h-32 bg-gray-200"></div>
          <div className="h-16 sm:h-20 bg-gray-100"></div>
        </div>
        <div className='flex flex-col lg:flex-row w-full min-h-screen'>
          <section className='min-h-96 lg:min-h-screen w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white shadow-lg'>
            <BusDetailsSkeleton />
          </section>
          <section className='flex flex-col items-center justify-center flex-1 bg-white p-8'>
         <SeatSelectionSkeleton/>
          </section>
        </div>
      </main>
    );
  }

  const {
    price: busFare,
    departureTime,
    bus,
    driver,
    route,
  } = tripData;

  function calculateArrivalTime(departureTime: string, duration: number): string {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes);
    departureDate.setMinutes(departureDate.getMinutes() + duration);
    const arrivalHours = departureDate.getHours().toString().padStart(2, "0");
    const arrivalMinutes = departureDate.getMinutes().toString().padStart(2, "0");
    return `${arrivalHours}:${arrivalMinutes}`;
  }

  const tripArrivalTime = calculateArrivalTime(departureTime, route.duration);
  const busExtras = [
    bus.wifi && { name: "Wi-Fi", icon: <Wifi size={12} /> },
    bus.airConditioning && {
      name: "AC",
      icon: <AcUnitOutlined className='text-[17px]' />,
    },
    bus.chargingOutlets && {
      name: "Charging Outlets",
      icon: <PowerIcon size={12} />,
    },
    bus.restRoom && {
      name: "Rest Room",
      icon: <FamilyRestroom className='text-[17px]' />,
    },
    bus.seatBelts && {
      name: "Seat Belts",
      icon: <BellElectric size={12} />,
    },
    bus.onboardFood && {
      name: "Onboard Food",
      icon: <FoodBank className='text-[17px]' />,
    },
  ].filter((extra) => extra !== false);

  const handleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
      return;
    }
    
    if (selectedSeats.length >= ticketQuantity) {
      toast({
        variant: "destructive",
        title: "Selection limit reached",
        description: `You can only select up to ${ticketQuantity} seat${ticketQuantity > 1 ? 's' : ''}.`
      });
      return;
    }
    
    setSelectedSeats((prev) => [...prev, seatId]);
  };

  const handleClearSeats = () => {
    setSelectedSeats([]);
  };

  const handleSelectAllSeats = () => {
    const availableSeats = Array.from(
      { length: bus.capacity },
      (_, i) => i + 1
    )
      .filter((seat) => !bookedSeats.includes(seat))
      .map((seat) =>
        seat.toString().padStart(bus.capacity.toString().length, "0")
      );
    
    const seatsToSelect = availableSeats.slice(0, ticketQuantity);
    console.log(`Selecting ${seatsToSelect.length} of ${availableSeats.length} available seats (limit: ${ticketQuantity})`);
    setSelectedSeats(seatsToSelect);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: "destructive",
        title: "No seats selected",
        description: "Please select at least one seat to book"
      });
      return;
    }
    
    if (selectedSeats.length > ticketQuantity) {
      toast({
        variant: "destructive",
        title: "Too many seats",
        description: `You can only book up to ${ticketQuantity} seat${ticketQuantity > 1 ? 's' : ''}`
      });
      return;
    }
    
    if (!passengerDetailsFilled || passengerDetails.length < selectedSeats.length) {
      toast({
        variant: "destructive",
        title: "Passenger details required",
        description: "Please fill in all passenger details before booking"
      });
      return;
    }
    
    const hasEmptyFields = passengerDetails.some(passenger => 
      !passenger.name || !passenger.phoneNumber || !passenger.kinName || !passenger.kinContact
    );
    
    if (hasEmptyFields) {
      toast({
        variant: "destructive",
        title: "Incomplete passenger details",
        description: "Please fill in all required passenger information"
      });
      return;
    }
    
    try {
      const generateReference = (): string => {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
      };

      const reference = generateReference();
      setBookingReference(reference);
      
      const seatNumbers = selectedSeats.map((seat) => parseInt(seat, 10));

      const bookingData = {
        reference,
        tripId,
        seatNumber: seatNumbers,
        passengerDetails: passengerDetails.slice(0, selectedSeats.length)
      };

      console.log("Sending booking request with data:", bookingData);
      const response = await fetch(
        `/api/POST/Booking?currentDate=${currentDate.toISOString()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your booking was successful",
          variant: "default"
        });
        setBooked(true);
        setShowSidebar(false); // Close sidebar on success
        await fetchTripData();
      } else {
        const errorData = await response.json();
        console.error("Booking failed with error:", errorData);
        toast({
          variant: "destructive",
          title: "Booking failed",
          description: errorData.error || "Unknown error occurred"
        });
      }
    } catch (error) {
      console.error("Error during booking:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Booking failed due to a network error. Please try again."
      });
    }
  };

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Trip Info Header */}
      <TripInfoHeader tripData={tripData} />
      
      {/* Enhanced Progress Bar */}
      <BookingProgressBar 
        currentStep={getCurrentStep()} 
        isCompleted={isBooked}
      />
      {/* Main Content Area */}
      <div className='max-w-6xl mx-auto  px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-5  gap-8 min-h-screen'>
          {/* Enhanced Sidebar */}
          <div className='lg:col-span-2 max-lg:hidden'>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-8">
              <BusDetails
                busImage={busImage}
                busCompanyLogo={bus?.company.logo}
                busNumber={bus?.plateNumber ?? "N/A"}
                busCompany={bus.company.name}
                tripDepartureTime={departureTime}
                tripArrivalTime={tripArrivalTime}
                busExtras={busExtras}
                busDriverID={driver ? `${driver.firstName} ${driver.lastName}` : "N/A"}
                busCapacity={bus.capacity}
                remainingSeats={remainingSeats}
                busDescription={bus.busDescription}
                busRoute={{
                  origin: route.startCity.name,
                  destination: route.endCity.name,
                }}
                tripDuration={route.duration}
                distance={route.distance}
                busFare={busFare}
                selectedSeats={selectedSeats}
                currency={currency}
                handleBooking={handleBooking}
                isBooked={isBooked}
                id={tripData.id}
                currentDate={currentDate}
                passengerDetails={passengerDetails}
                setPassengerDetails={setPassengerDetails}
                passengerDetailsFilled={passengerDetailsFilled}
                setPassengerDetailsFilled={setPassengerDetailsFilled}
              />
            </div>
          </div>
          
          {/* Enhanced Main Content */}
          <div className='lg:col-span-3 max-lg:overflow-hidden'>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
              {isBooked ? (
                <div className="p-8">
                  <Ticket
                    ticketId={tripData.id}
                    busNumber={bus?.plateNumber ?? ""}
                    busCompany={bus.company.name}
                    tripDepartureTime={departureTime}
                    tripArrivalTime={tripArrivalTime}
                    busRoute={{
                      origin: route.startCity.name,
                      destination: route.endCity.name,
                    }}
                    busFare={busFare}
                    busDescription={bus.busDescription}
                    currency={currency}
                    tripDuration={route.duration}
                    totalCost={busFare * selectedSeats.length}
                    currentDate={currentDate}
                    selectedSeats={selectedSeats}
                    reference={bookingReference}
                    isBooked={isBooked}
                    passengerDetails={passengerDetails}
                  />
                </div>
              ) : (
                <div className="p-8 ">
                  <SeatSelection
                    busDescription={bus.busDescription}
                    tripId={tripData.id}
                    busCapacity={bus.capacity}
                    bookedSeats={bookedSeats}
                    selectedSeats={selectedSeats}
                    handleSeatSelection={handleSeatSelection}
                    handleClearSeats={handleClearSeats}
                    handleSelectAllSeats={handleSelectAllSeats}
                    ticketQuantity={ticketQuantity}
                    ticketLimitReached={ticketLimitReached}
                  />
                </div>
              )}
            </div>
          </div>
           <div className='lg:col-span-2 lg:hidden'>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-8">
              <BusDetails
                busImage={busImage}
                busCompanyLogo={bus?.company.logo}
                busNumber={bus?.plateNumber ?? "N/A"}
                busCompany={bus.company.name}
                tripDepartureTime={departureTime}
                tripArrivalTime={tripArrivalTime}
                busExtras={busExtras}
                busDriverID={driver ? `${driver.firstName} ${driver.lastName}` : "N/A"}
                busCapacity={bus.capacity}
                remainingSeats={remainingSeats}
                busDescription={bus.busDescription}
                busRoute={{
                  origin: route.startCity.name,
                  destination: route.endCity.name,
                }}
                tripDuration={route.duration}
                distance={route.distance}
                busFare={busFare}
                selectedSeats={selectedSeats}
                currency={currency}
                handleBooking={handleBooking}
                isBooked={isBooked}
                id={tripData.id}
                currentDate={currentDate}
                passengerDetails={passengerDetails}
                setPassengerDetails={setPassengerDetails}
                passengerDetailsFilled={passengerDetailsFilled}
                setPassengerDetailsFilled={setPassengerDetailsFilled}
              />
            </div>
          </div>
          
        </div>
        
      </div>
    </main>
  );
};

const PageContent = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <CircularProgress size={60} className="text-blue-600" />
        <p className="mt-4 text-gray-600 font-medium">Loading booking page...</p>
      </div>
    </div>
  }>
    <PageContainer />
  </Suspense>
);

export default PageContent;