import prisma from "@/app/lib/db"; // Ensure Prisma client is set up correctly
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// POST function to handle booking creation
export async function POST(req: NextRequest) {
  try {
    // Get the current user using Kinde authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // If no user is found, return an error
    if (!user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body to get the booking data
    const body = await req.json();
    const { reference, tripId, seatNumber } = body;

    // Ensure that all required fields are provided in the request
    if (!reference || !tripId || !seatNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new booking in the database using Prisma
    const booking = await prisma.booking.create({
      data: {
        reference, // Assuming reference is generated on the client-side
        userId: user.id, // Using the authenticated user's ID
        tripId,
        seatNumber,
        status: "Pending", // Explicitly set status to "Pending"
      },
    });

    // Return the created booking as a response
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Error during booking creation:", error);
    return NextResponse.json(
      { message: "Failed to create booking", error: error.message },
      { status: 500 }
    );
  }
}
