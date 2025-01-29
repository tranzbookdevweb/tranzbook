import prisma from "@/app/lib/db"; // Adjust the import based on your actual file structure
import { NextResponse } from "next/server";

// GET trip by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Validate that ID is provided
  if (!id) {
    return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        bus: {
          include: {
            company: true, // Include the related BusCompany
          },
        },
        driver: true, // Include related driver data
        route: {
          include: {
            startCity: true, // Include start location
            endCity: true,   // Include end location
          },
        },
        bookings: {
          include: {
            user: true, // Include user data from bookings
          },
        },
      },
    });

    // Check if trip was found
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Return the trip details
    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the trip' }, { status: 500 });
  }
}
