import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Incoming Request:", req.method, req.url);
    const { searchParams } = new URL(req.url);
    const currentDate = searchParams.get("currentDate");
    const bookedDate = currentDate ? new Date(currentDate) : new Date();

    // Get the current user using Kinde authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("Authenticated User:", user);

    // If no user is found, return an error
    if (!user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body to get the booking data
    const body = await req.json();
    console.log("Request Body:", body);

    const { reference, tripId, seatNumber } = body;

    // Ensure that all required fields are provided in the request
    if (!reference || !tripId || !seatNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the trip details
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { price: true, recurring: true }
    });

    if (!trip) {
      return NextResponse.json({ 
        error: 'Trip not found' 
      }, { status: 404 });
    }

    // Find or create the trip occurrence for the selected date
    let tripOccurrence = await prisma.tripOccurrence.findUnique({
      where: {
        tripId_occurrenceDate: {
          tripId: tripId,
          occurrenceDate: bookedDate
        }
      }
    });

    // If trip occurrence doesn't exist for this date, create it
    if (!tripOccurrence) {
      // Get bus capacity from the trip's associated bus
      const tripWithBus = await prisma.trip.findUnique({
        where: { id: tripId },
        include: { bus: true }
      });
      
      if (!tripWithBus || !tripWithBus.bus) {
        return NextResponse.json({ 
          error: 'Trip has no associated bus' 
        }, { status: 400 });
      }
      
      // Create the trip occurrence with full capacity
      tripOccurrence = await prisma.tripOccurrence.create({
        data: {
          tripId: tripId,
          occurrenceDate: bookedDate,
          availableSeats: tripWithBus.bus.capacity,
          bookedSeats: [],
          status: 'scheduled'
        }
      });
    }

    // Check if requested seats are available
    const requestedSeats = Array.isArray(seatNumber) ? seatNumber : [seatNumber];
    
    // Check if any requested seat is already booked
    const alreadyBookedSeats = requestedSeats.filter(seat => 
      tripOccurrence.bookedSeats.includes(seat)
    );
    
    if (alreadyBookedSeats.length > 0) {
      return NextResponse.json({ 
        error: `Seats ${alreadyBookedSeats.join(', ')} are already booked` 
      }, { status: 400 });
    }
    
    // Check if there are enough available seats
    if (requestedSeats.length > tripOccurrence.availableSeats) {
      return NextResponse.json({ 
        error: 'Not enough available seats' 
      }, { status: 400 });
    }

    // Update the trip occurrence with new booked seats
    const updatedBookedSeats = [...tripOccurrence.bookedSeats, ...requestedSeats];
    await prisma.tripOccurrence.update({
      where: { id: tripOccurrence.id },
      data: {
        availableSeats: tripOccurrence.availableSeats - requestedSeats.length,
        bookedSeats: updatedBookedSeats
      }
    });

    // Calculate total amount based on number of seats
    const totalAmount = trip.price * requestedSeats.length;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        reference,
        tripId,
        seatNumber: requestedSeats,
        status: "pending",
        date: bookedDate,
        userId: user.id || '',
        totalAmount
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking' 
    }, { status: 500 });
  }
}