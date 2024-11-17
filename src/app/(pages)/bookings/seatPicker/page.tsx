"use client";
import React, { useEffect, useState } from "react";
import BusDetails from "../(components)/busDetails";
import SeatSelection from "../(components)/seatSelection";
import Ticket from "../(components)/ticket";
// import { useSearchParams } from "next/navigation";
import { BusDetailsSkeleton } from "../(components)/Skeletons/busDetailsSkeleton";
import { SeatSelectionSkeleton } from "../(components)/Skeletons/seatSelectionSkeleton";
import { CircularProgress } from "@mui/material";

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

const Page: React.FC = () => {
  // const params=useSearchParams()
  // const tripId= params.get('tripid')
  const [currency, setCurrency] = useState<string>("GHS"); //use currency based on the user's loc from the db
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooked, setBooked] = useState<boolean>(false);
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [busImage, setBusImage] = useState<string>(
    "default-logo-url"
  ); // State for bus image
  const tripId = "2b4a4bde-ce78-4714-a2c8-d3d7af0c41c4";
  const apiUrl = `/api/GET/getTripById?id=${tripId}`;

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
    return (
      <main className='flex-1 border-t border-b bg-white dark:bg-slate-700 min-h-screen flex flex-col items-center w-full relative overflow-hidden'>
        <div className='flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse'>
          <section className='min-h-screen border-r max-sm:border-t sm:max-md:border-t border-gray-200'>
            <BusDetailsSkeleton />
          </section>
          <section
            className={`bg-white flex flex-col items-center ${
              isBooked ? "justify-center" : ""
            } p-5 w-full rounded-lg overflow-auto`}>
            {isBooked === true ? (
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

  const handleClearSeats = () => {
    setSelectedSeats([]);
  };

  const handleSelectAllSeats = () => {
    setSelectedSeats(
      Array.from(
        { length: busCapacity - 1 },
        (_, i) =>
          `${(i + 1)
            .toString()
            .padStart((busCapacity - 1).toString().length, "0")}`
      )
    );
  };

  const currentDate: Date = new Date();
  const totalCost: number = busFare * selectedSeats.length;

  const handleBooking = async () => {
    // use the try catch block with the trip with valid details
    // comment out the try block for testing without making a POST
    try {
      // please add the isBooked boolean to the prisma schema/db to eventually check the
      // availability of the seats;
      const bookingData = {
        userId: "userId", //please with a valid userId or it wont work
        tripId: tripId,
        seatNumber: 1, //should be a string[] but the schema.prisma says Int so I'll leave this to you
      };
      const response = await fetch("/api/POST/Booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
        // store in the db and reflect it in /bookings/manage/tickets
      });
      if (response.ok) {
        alert("Booking successful");
        // replace with <Toaster/>
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      console.error(error);
    }
    setBooked((prev) => !prev);
  };

  return (
    <main className='flex-1 border-t border-b bg-white dark:bg- min-h-screen flex flex-col items-center w-full relative overflow-hidden'>
      <div className='flex flex-row w-full max-sm:gap-5 min-h-screen max-sm:flex-col-reverse sm:max-md:flex-col-reverse '>
        <section className='min-h-screen max-sm:min-h-fit border-r max-sm:border-t sm:max-md:border-t border-gray-200 custom-scrollbar overflow-y-auto'>
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
            currentDate={currentDate}
          />
        </section>
        <section className='flex flex-col items-center md:justify-start md:min-h-screen lg:px-20 md:px-0 w-full rounded-lg overflow-hidden max-sm:w-screen max-sm:p-0 md:mx-1 '>
          {isBooked === false ? (
            <div className=' max-sm:w-full flex flex-col items-center md:min-h-screen lg:min-h-screen  p-10 sm:max-md:p-5 max-sm:p-5 max-[320px]:p-1 md:'>
              {/* <h2 className='text-md mb-3 md:py-5 text-black'>
                Passenger seats available
              </h2> */}
              <SeatSelection
                busCapacity={busCapacity}
                selectedSeats={selectedSeats}
                handleSeatSelection={handleSeatSelection}
                handleClearSeats={handleClearSeats}
                handleSelectAllSeats={handleSelectAllSeats}
              />
            </div>
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
              tripDuration={route.duration}
              totalCost={totalCost}
              currentDate={currentDate}
              selectedSeats={selectedSeats}
              isBooked={isBooked}
            />
          )}
        </section>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #b7ebf8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #ffffff;
        }
      `}</style>
    </main>
  );
};

export default Page;
