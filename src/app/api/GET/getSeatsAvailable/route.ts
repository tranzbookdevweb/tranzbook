import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// http://localhost:3000/bookings/seatPicker?tripId=a6623405-3742-45e0-86e4-45eb5b567e60&date=2024-12-30T00%3A00%3A00.000Z

// `/api/GET/getSeatsAvailable?id=a6623405-3742-45e0-86e4-45eb5b567e60&date=2024-12-30T00%3A00%3A00.000Z`
// no seats booked at tripId=15de2f28-cb53-4164-afcb-0c0b7e237d27

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId =
      searchParams.get("tripId") ;
    const date =
      searchParams.get("date") ||
       `2024-12-30T00%3A00%3A00.000Z`; 

    if (!tripId || !date) {
      return NextResponse.json(
        { error: "Missing tripId or date" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(date);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        bus: {
          select: {
            capacity: true,
          },
        },
      },
    });

    if (!trip || !trip.bus) {
      return NextResponse.json(
        { error: "Trip or bus not found" },
        { status: 404 }
      );
    }

    const totalSeats = trip.bus.capacity;

    const bookings = await prisma.booking.findMany({
      where: {
        tripId: tripId,
        status: "Pending",
      },
      select: {
        seatNumber: true,
      },
    });

    const bookedSeats = bookings.flatMap(
      (booking) => booking.seatNumber
    );
    const allSeats = Array.from(
      { length: totalSeats },
      (_, i) => i + 1
    );
    const availableSeats = allSeats.filter(
      (seat) => !bookedSeats.includes(seat)
    );

    return NextResponse.json({
      availableSeats: availableSeats,
      bookedSeats: bookedSeats,
      totalSeats: totalSeats,
    });
  } catch (error) {
    console.error("Error fetching available seats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
