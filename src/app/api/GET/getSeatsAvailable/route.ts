import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");
    const date = searchParams.get("date");

    if (!tripId) {
      return NextResponse.json(
        { error: "Missing tripId" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Missing date" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(date);

    // Fetch trip with bus capacity and validate date for recurring/non-recurring trips
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        bus: {
          select: {
            capacity: true,
          },
        },
        recurring: true,
        daysOfWeek: true,
        date: true,
      },
    });

    if (!trip || !trip.bus) {
      return NextResponse.json(
        { error: "Trip or bus not found" },
        { status: 404 }
      );
    }

    // Validate if the date is valid for the trip
    const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay(); // 1=Monday, ..., 7=Sunday
    const isValidDate = !trip.recurring || 
                       (trip.recurring && trip.daysOfWeek.includes(dayOfWeek)) || 
                       (trip.date && new Date(trip.date).toDateString() === selectedDate.toDateString());

    if (!isValidDate) {
      return NextResponse.json(
        { error: "Selected date is not valid for this trip" },
        { status: 400 }
      );
    }

    const totalSeats = trip.bus.capacity;

    // Fetch trip occurrence for the specific date
    const tripOccurrence = await prisma.tripOccurrence.findUnique({
      where: {
        tripId_occurrenceDate: {
          tripId: tripId,
          occurrenceDate: selectedDate,
        },
      },
      select: {
        availableSeats: true,
        bookedSeats: true,
      },
    });

    // If no occurrence exists, return full capacity
    if (!tripOccurrence) {
      const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
      return NextResponse.json({
        availableSeats: allSeats,
        bookedSeats: [],
        totalSeats: totalSeats,
      });
    }

    // Calculate available seats from trip occurrence
    const bookedSeats = tripOccurrence.bookedSeats;
    const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
    const availableSeats = allSeats.filter(seat => !bookedSeats.includes(seat));

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