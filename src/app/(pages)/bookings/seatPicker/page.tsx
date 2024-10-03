"use client";
import React, { useEffect, useState } from "react";
import BusDetails from "../(components)/busDetails";
import SeatSelection from "../(components)/seatSelection";
import Ticket from "../(components)/ticket";

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
  tripDuration: number;
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

const Page: React.FC = () => {
  const [currency, setCurrency] = useState<string>("GHS");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false);
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [busImage, setBusImage] = useState<string>("default-logo-url"); // State for bus image

  const tripId = "2b4a4bde-ce78-4714-a2c8-d3d7af0c41c4"; // Example trip ID; this can be dynamic based on routing
  const apiUrl = `http://localhost:3000/api/GET/getTripById?id=${tripId}`;

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: Trip = await response.json();
        setTripData(data);
        
        // Set the bus image after trip data is fetched
        if (data.bus.imageUrl) {
          const imageUrl = `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/images/${data.bus.imageUrl}`;
          setBusImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();
  }, [apiUrl]);

  if (!tripData) {
    return <div>Loading...</div>;
  }

  const {
    date,
    price: busFare,
    departureTime: tripDepartureTime,
    bus,
    driver,
    branch,
    route,
  } = tripData;

  const busCompany = bus.company.name;
  const busNumber = bus.plateNumber;
  const busCapacity = bus.capacity;
  const tripArrivalTime = new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Assuming you have logic to calculate arrival time based on duration
  const busExtras = "Wi-Fi, AC";
  const busDriverID = `${driver.firstName} ${driver.lastName}`;
  const busRoute = { origin: route.startLocation.name, destination: route.endLocation.name };

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleClearSeats = () => {
    setSelectedSeats([]);
  };

  const currentDate: Date = new Date();
  const totalCost: number = busFare * selectedSeats.length;

  const handleBooking = () => {
    setBooked((prev) => !prev);
  };

  return (
    <main className="flex-1 border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden">
      <div className="flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse">
        
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
          tripDuration={route.tripDuration} // Assuming duration is available in route
          busFare={busFare}
          selectedSeats={selectedSeats}
          currency={currency}
          handleBooking={handleBooking}
          isBooked={isBooked}
          id={tripData.id}
          currentDate={currentDate}
        />
        <section className="bg-white flex flex-col items-center p-5 w-full rounded-lg overflow-auto">
          {isBooked === false ? (
            <>
              <h2 className="text-lg mb-3">Passenger seats available</h2>
              <SeatSelection
                busCapacity={busCapacity}
                selectedSeats={selectedSeats}
                handleSeatSelection={handleSeatSelection}
                handleClearSeats={handleClearSeats}
              />
            </>
          ) : (
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
              tripDuration={route.tripDuration} // Assuming duration is available in route
              totalCost={totalCost}
              currentDate={currentDate}
              selectedSeats={selectedSeats}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Page;
