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
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { price: true }
    });

    if (!trip) {
      return NextResponse.json({ 
        error: 'Trip not found' 
      }, { status: 404 });
    }

    // Calculate total amount based on number of seats
    const totalAmount = trip.price * seatNumber.length;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        reference,
        tripId,
        seatNumber,
        status: "pending",
        date: bookedDate, // Use the passed or current date
        userId: user.id || '', // Ensure userId is provided
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