"use client";

import React, { useEffect, useState, Suspense } from "react";
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

// Interfaces
interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  busModel: string;
  image: string;
  company: { id: string; name: string };
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

interface Trip {
  id: string;
  date: string;
  price: number;
  departureTime: string; // HH:mm format
  bus: Bus;
  driver: Driver;
  route: Route;
}

type SeatsAvailable = Record<
  "availableSeats" | "totalSeats",
  number[]
> &
  Partial<Record<"bookedSeats", number[]>>;

const PageContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const apiUrl = `/api/GET/getTripById?id=${tripId}`;

  const [currency] = useState<string>("GHS");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false); // data.status
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [busImage, setBusImage] = useState<string>(
    "default-logo-url"
  );
  const [bookedSeats, setBookedSeats] = useState<SeatsAvailable["bookedSeats"]>([]);

  useEffect(() => {
    if (!tripId) return;

    const fetchTripData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: Trip = await response.json();
        setTripData(data);

        if (data.bus.image) {
          setBusImage(
            `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/images/${data.bus.image}`
          );
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(
          `/api/GET/getSeatsAvailable?tripId=${tripId}`
        );
        const data: SeatsAvailable = await response.json();
        setBookedSeats(data.bookedSeats ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookedSeats();
    fetchTripData();
  }, [apiUrl, tripId]);

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
    date,
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

  const tripArrivalTime = calculateArrivalTime(
    departureTime,
    route.duration
  );
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
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    try {
      // Function to generate a 6-digit random reference string
      const generateReference = (): string => {
        return Math.random().toString(36).substr(2, 6).toUpperCase(); // Generate 6 characters and make them uppercase
      };

      const reference = generateReference(); // Generate the reference

      // Function to parse selected seats to numbers
      const parseSeatsToNumbers = (seats: string[]): number[] => {
        return seats.map((seat: string) => parseInt(seat, 10)); // Convert each seat to a number
      };

      const seatNumbers = parseSeatsToNumbers(selectedSeats); // Parse the selected seats into numbers

      const bookingData = {
        reference, // Add the generated reference here
        tripId,
        seatNumber: seatNumbers, // Store the parsed seat numbers
        status: "Pending", //not necessary since it's a default value
      };

      // Send the booking request to the server
      const response = await fetch("/api/POST/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Booking successful");
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }

    setBooked(!isBooked);
  };

  return (
    <main className='flex-1 border-t border-b h-full bg-white dark:bg- min-h-screen flex flex-col items-center w-full relative overflow-hidden'>
      <div className='flex flex-row w-full min-h-screen max-sm:flex-col-reverse'>
        <section className='min-h-screen border-r border-gray-200 custom-scrollbar overflow-y-auto'>
          <BusDetails
            busImage={busImage}
            busNumber={bus?.plateNumber}
            busCompany={bus.company.name}
            tripDepartureTime={departureTime}
            tripArrivalTime={tripArrivalTime}
            busExtras={busExtras}
            busDriverID={`${driver?.firstName} ${driver?.lastName}`}
            busCapacity={bus.capacity}
            busModel={bus.busModel}
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
            currentDate={new Date()}
          />
        </section>
        <section className='flex flex-col items-center p-5 w-full rounded-lg overflow-hidden'>
          {isBooked ? (
            <Ticket
              ticketId={tripData.id}
              busNumber={bus.plateNumber}
              busCompany={bus.company.name}
              tripDepartureTime={departureTime}
              tripArrivalTime={tripArrivalTime}
              busRoute={{
                origin: route.startCity.name,
                destination: route.endCity.name,
              }}
              busFare={busFare}
              busModel={bus.busModel}
              currency={currency}
              tripDuration={route.duration}
              totalCost={busFare * selectedSeats.length}
              currentDate={new Date()}
              selectedSeats={selectedSeats}
              isBooked={isBooked}
            />
          ) : (
            <SeatSelection
              tripId={tripData.id}
              busCapacity={bus.capacity}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              handleSeatSelection={handleSeatSelection}
              handleClearSeats={() => setSelectedSeats([])}
              handleSelectAllSeats={() =>
                setSelectedSeats(
                  Array.from({ length: bus.capacity - 1 }, (_, i) =>
                    !bookedSeats?.includes(i + 2)
                      ? `${i + 1}`.padStart(
                          (bus.capacity - 1).toString().length,
                          "0"
                        )
                      : null
                  ).filter((seat) => seat !== null)
                )
              }
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
