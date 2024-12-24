"use client";
import { useState, useEffect } from "react";

interface Booking {
  id: string;
  trip: {
    date: string;
    departureTime: string;
    route: {
      startCity: { name: string };
      endCity: { name: string };
    };
    bus: { plateNumber: string };
    driver: { firstName: string; lastName: string };
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<string>("Upcoming");

  useEffect(() => {
    fetch(`/api/GET/getBookingById?status=${status}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [status]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 border ${status === "Upcoming" ? "bg-gray-800 text-white" : "bg-white text-black"} `}
          onClick={() => setStatus("Upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 border ${status === "Past" ? "bg-gray-800 text-white" : "bg-white text-black"} `}
          onClick={() => setStatus("Past")}
        >
          Past
        </button>
        <button
          className={`px-4 py-2 border ${status === "Cancelled" ? "bg-gray-800 text-white" : "bg-white text-black"} `}
          onClick={() => setStatus("Cancelled")}
        >
          Cancelled
        </button>
      </div>
      {bookings.map((booking) => (
        <div key={booking.id} className="border p-4 mb-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{booking.trip.route.startCity.name} → {booking.trip.route.endCity.name}</p>
              <p className="text-gray-600">{new Date(booking.trip.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Time: {booking.trip.departureTime}</p>
              <p className="text-gray-600">Bus: {booking.trip.bus.plateNumber}</p>
              <p className="text-gray-600">Driver: {booking.trip.driver.firstName} {booking.trip.driver.lastName}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{booking.user.firstName} {booking.user.lastName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
