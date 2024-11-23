"use client";

import React, { useEffect, useState, Suspense } from "react";
import BusDetails from "../(components)/busDetails";
import SeatSelection from "../(components)/seatSelection";
import Ticket from "../(components)/ticket";
import { BusDetailsSkeleton } from "../(components)/Skeletons/busDetailsSkeleton";
import { SeatSelectionSkeleton } from "../(components)/Skeletons/seatSelectionSkeleton";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";

// Interfaces
interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  busType: string;
  imageUrl: string;
  company: {
    id: string;
    name: string;
  };
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
}

interface Route {
  id: string;
  startLocation: {
    id: string;
    name: string;
  };
  endLocation: {
    id: string;
    name: string;
  };
  duration: number;
  distance: number;
}

interface Trip {
  id: string;
  date: string;
  price: number;
  departureTime: string;
  bus: Bus;
  driver: Driver;
  branch: Branch;
  route: Route;
}

const PageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const apiUrl = `/api/GET/getTripById?id=${tripId}`;

  const [currency, setCurrency] = useState<string>("GHS");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false);
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [busImage, setBusImage] = useState<string>("default-logo-url");

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: Trip = await response.json();
        setTripData(data);

        if (data.bus.imageUrl) {
          const imageUrl = `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/images/${data.bus.imageUrl}`;
          setBusImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    if (tripId) fetchTripData();
  }, [apiUrl, tripId]);

  if (!tripData) {
    return (
      <main className="flex-1 border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden">
        <div className="flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse">
          <section className="min-h-screen lg:w-72 max-sm:min-h-fit sm:max-md:min-h-fit border-r max-sm:border-t sm:max-md:border-t border-gray-200 custom-scrollbar overflow-y-auto">
            <BusDetailsSkeleton />
          </section>
          <section
            className={`bg-white flex flex-col items-center md:justify-start md:min-h-screen lg:px-20 md:px-0 max-sm:w-screen max-sm:p-0 md:mx-1 ${
              isBooked ? "justify-center" : ""
            } p-5 w-full rounded-lg overflow-hidden`}
          >
            {isBooked ? (
              <CircularProgress />
            ) : (
              <div className="max-sm:w-full flex flex-col items-center md:min-h-screen lg:min-h-screen p-10 sm:max-md:p-5 max-sm:p-5 max-[320px]:p-1">
                <SeatSelectionSkeleton />
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  const {
    date,
    price: busFare,
    departureTime: tripDepartureTime,
    bus,
    driver,
    route,
  } = tripData;

  const busCompany = bus.company.name;
  const busNumber = bus.plateNumber;
  const busCapacity = bus.capacity;
  const tripArrivalTime = new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const busExtras = "Wi-Fi, AC";
  const busDriverID = `${driver.firstName} ${driver.lastName}`;
  const busRoute = {
    origin: route.startLocation.name,
    destination: route.endLocation.name,
  };

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleClearSeats = () => setSelectedSeats([]);
  const handleSelectAllSeats = () =>
    setSelectedSeats(
      Array.from(
        { length: busCapacity - 1 },
        (_, i) =>
          `${(i + 1).toString().padStart((busCapacity - 1).toString().length, "0")}`
      )
    );

  const totalCost = busFare * selectedSeats.length;

  const handleBooking = async () => {
    try {
      const bookingData = {
        userId: "userId",
        tripId,
        seatNumber: 1,
      };
      const response = await fetch("/api/POST/Booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Booking successful");
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      console.error(error);
    }
    setBooked(!isBooked);
  };

  return (
    <main className="flex-1 border-t border-b bg-white dark:bg- min-h-screen flex flex-col items-center w-full relative overflow-hidden">
      <div className="flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse">
        <section className="min-h-screen max-sm:min-h-fit border-r max-sm:border-t sm:max-md:border-t border-gray-200 custom-scrollbar overflow-y-auto">
          <BusDetails
            busImage={busImage}
            busNumber={busNumber}
            busCompany={busCompany}
            tripDepartureTime={tripDepartureTime}
            tripArrivalTime={tripArrivalTime}
            busExtras={busExtras}
            busDriverID={busDriverID}
            busCapacity={busCapacity}
            busType={bus.busType}
            busRoute={busRoute}
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
        <section className="flex flex-col items-center md:justify-start md:min-h-screen p-10 lg:px-20 md:p-5 w-full rounded-lg overflow-hidden max-sm:w-screen max-sm:p-2 md:mx-1">
          {isBooked ? (
            <Ticket
              ticketId={tripData.id}
              busNumber={busNumber}
              busCompany={busCompany}
              tripDepartureTime={tripDepartureTime}
              tripArrivalTime={tripArrivalTime}
              busRoute={busRoute}
              busFare={busFare}
              busType={bus.busType}
              currency={currency}
              tripDuration={route.duration}
              totalCost={totalCost}
              currentDate={new Date()}
              selectedSeats={selectedSeats}
              isBooked={isBooked}
            />
          ) : (
            <SeatSelection
              busCapacity={busCapacity}
              selectedSeats={selectedSeats}
              handleSeatSelection={handleSeatSelection}
              handleClearSeats={handleClearSeats}
              handleSelectAllSeats={handleSelectAllSeats}
            />
          )}
        </section>
      </div>
    </main>
  );
};

const Page: React.FC = () => (
  <Suspense fallback={<CircularProgress />}>
    <PageContent />
  </Suspense>
);

export default Page;
