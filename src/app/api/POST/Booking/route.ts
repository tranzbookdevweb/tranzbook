import prisma from "@/app/lib/db"; // Prisma instance
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Helper function to generate a 6-character alphanumeric reference
function generateReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let reference = "";
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
}

export async function POST(req:NextRequest) {
  try {
    // Get the user session
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: User not logged in" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { tripId, seatNumber } = body;

    // Validate the input
    if (!tripId || !seatNumber) {
      return NextResponse.json(
        { error: "Missing required fields: tripId or seatNumber" },
        { status: 400 }
      );
    }

    // Check if the trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Ensure the seat is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tripId,
        seatNumber,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Seat is already booked" },
        { status: 409 }
      );
    }

    // Generate a unique 6-character reference
    let reference;
    let isUnique = false;
    do {
      reference = generateReference();
      const existingReference = await prisma.booking.findUnique({
        where: { reference },
      });
      if (!existingReference) {
        isUnique = true;
      }
    } while (!isUnique);

    // Create the booking with the generated reference
    const booking = await prisma.booking.create({
      data: {
        tripId,
        seatNumber,
        userId: user.id,
        reference, // Assign the generated reference
      },
    });

    // Respond with the booking details
    return NextResponse.json(
      { message: "Booking successful", booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during booking:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
