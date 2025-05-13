"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import BusDetails from "../_components/busDetails";
import SeatSelection from "../_components/seatSelection";
import Ticket from "../_components/ticket";
import { BusDetailsSkeleton } from "../_components/Skeletons/busDetailsSkeleton";
import { SeatSelectionSkeleton } from "../_components/Skeletons/seatSelectionSkeleton";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { BellElectric, PowerIcon, Wifi } from "lucide-react";
import {
  AcUnitOutlined,
  FamilyRestroom,
  FoodBank,
} from "@mui/icons-material";
import { useToast } from "@/components/ui/use-toast";

// Interfaces
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
  duration: number; // in minutes
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
  age: string;
  phoneNumber: string;
  kinName: string;
  kinContact: string;
}
interface Trip {
  id: string;
  date: string | null;
  price: number;
  departureTime: string; // HH:mm format
  bus: Bus;
  driver: Driver | null;
  route: Route;
  seatAvailability: SeatAvailability[];
}

const PageContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const dateParam = searchParams.get("date");
  const baseApiUrl = `/api/GET/getTripById?id=${tripId}${dateParam ? `&date=${dateParam}` : ''}`;
  const isFetching = useRef(false);
  
  // Get ticketQuantity parameter and convert to number
  const ticketQuantity = parseInt(searchParams.get("ticketQuantity") || "1", 10);
  const { toast } = useToast(); // Updated to destructure toast from useToast
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
  
  const fetchTripData = async () => {
    if (isFetching.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }
    isFetching.current = true;
    const apiUrl = `${baseApiUrl}&_t=${Date.now()}`; // Add cache-busting only during fetch
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

      // Set booked seats and remaining seats from seatAvailability for the specified date
      if (dateParam && data.seatAvailability.length > 0) {
        const normalizedDateParam = new Date(dateParam).toISOString().slice(0, 10); // YYYY-MM-DD
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
  }, [tripId, dateParam]); // Depend only on tripId and dateParam

  useEffect(() => {
    // Check if ticket limit has been reached
    setTicketLimitReached(selectedSeats.length >= ticketQuantity);
  }, [selectedSeats, ticketQuantity]);

  // Initialize passenger details when ticket quantity changes
  useEffect(() => {
    // Create an array of empty passenger details based on ticket quantity
    if (ticketQuantity > 0 && selectedSeats.length > 0) {
      const newPassengerDetails = Array(selectedSeats.length).fill({
        name: "",
        age: "",
        phoneNumber: "",
        kinName: "",
        kinContact: ""
      });
      setPassengerDetails(newPassengerDetails);
      setPassengerDetailsFilled(false);
    } else {
      setPassengerDetails([]);
    }
  }, [ticketQuantity, selectedSeats.length]);

  if (!tripData) {
    return (
      <main className='flex-1 border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden'>
        <div className='flex flex-row w-full min-h-screen max-sm:flex-col-reverse'>
          <section className='min-h-screen lg:w-72 border-r max-sm:border-t border-gray-200 custom-scrollbar overflow-y-auto'>
            <BusDetailsSkeleton />
          </section>
          <section
            className={`flex flex-col items-center p-5 w-full rounded-lg overflow-hidden ${
              isBooked ? "justify-center" : ""
            }`}>
            {isBooked ? (
              <CircularProgress />
            ) : (
              <SeatSelectionSkeleton />
            )}
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

  function calculateArrivalTime(
    departureTime: string,
    duration: number
  ): string {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes);
    departureDate.setMinutes(departureDate.getMinutes() + duration);
    const arrivalHours = departureDate
      .getHours()
      .toString()
      .padStart(2, "0");
    const arrivalMinutes = departureDate
      .getMinutes()
      .toString()
      .padStart(2, "0");
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
    // If seat is already selected, allow deselection
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
      return;
    }
    
    // If we're at the ticket quantity limit and trying to add more, show warning
    if (selectedSeats.length >= ticketQuantity) {
      toast({
        variant: "destructive",
        title: "Selection limit reached",
        description: `You can only select up to ${ticketQuantity} seat${ticketQuantity > 1 ? 's' : ''}.`
      });
      return;
    }
    
    // Otherwise add the seat
    setSelectedSeats((prev) => [...prev, seatId]);
  };

  const handleClearSeats = () => {
    setSelectedSeats([]);
  };

  const handleSelectAllSeats = () => {
    // If ticketQuantity is less than available seats, only select that many
    const availableSeats = Array.from(
      { length: bus.capacity },
      (_, i) => i + 1
    )
      .filter((seat) => !bookedSeats.includes(seat))
      .map((seat) =>
        seat.toString().padStart(bus.capacity.toString().length, "0")
      );
    
    // Take only up to ticketQuantity seats
    const seatsToSelect = availableSeats.slice(0, ticketQuantity);
    console.log(`Selecting ${seatsToSelect.length} of ${availableSeats.length} available seats (limit: ${ticketQuantity})`);
    setSelectedSeats(seatsToSelect);
  };

  const handleBooking = async () => {
    // Validate that correct number of seats are selected
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
    
    // Validate passenger details
    if (!passengerDetailsFilled || passengerDetails.length < selectedSeats.length) {
      toast({
        variant: "destructive",
        title: "Passenger details required",
        description: "Please fill in all passenger details before booking"
      });
      return;
    }
    
    // Check if any required fields are missing in passenger details
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
      setBookingReference(reference); // Store the reference in state
      
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
        await fetchTripData(); // Re-fetch to update seats
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
    <main className='flex-1 border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden'>
      <div className='flex flex-row w-full min-h-screen max-sm:flex-col-reverse'>
        <section className='min-h-screen lg:w-72 border-r max-sm:border-t border-gray-200 custom-scrollbar overflow-y-auto'>
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
        </section>
        <section className='flex flex-col items-center p-5 w-full rounded-lg overflow-hidden'>
          {isBooked ? (
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
              reference={bookingReference} // Pass the reference
              isBooked={isBooked}
              passengerDetails={passengerDetails} // Pass the passenger details to the Ticket component
            />
          ) : (
            <SeatSelection
              busDescription={bus.busDescription}
              tripId={tripData.id}
              busCapacity={bus.capacity}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              handleSeatSelection={handleSeatSelection}
              handleClearSeats={handleClearSeats}
              handleSelectAllSeats={handleSelectAllSeats}
              ticketQuantity={ticketQuantity} // Pass ticket quantity
              ticketLimitReached={ticketLimitReached} // Pass limit status
            />
          )}
        </section>
      </div>
    </main>
  );
};

const PageContent = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PageContainer />
  </Suspense>
);

export default PageContent;