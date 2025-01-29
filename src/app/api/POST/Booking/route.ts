import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Incoming Request:", req.method, req.url);

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

    // Create a new booking in the database using Prisma
    const booking = await prisma.booking.create({
      data: {
        reference,
        userId: user.id,
        tripId,
        seatNumber,
        status: "pending",
      },
    });

    console.log("Booking Created:", booking);

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Error during booking creation:", error);
    return NextResponse.json(
      { message: "Failed to create booking", error: error.message },
      { status: 500 }
    );
  }
}
