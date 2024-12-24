import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Extract filters from query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., "Upcoming", "Past", "Cancelled"

    // Define the base filter conditions
    const filter: any = { userId: user.id };

    // Get current date and time
    const now = new Date();

    // Apply specific filters based on the status
    if (status === "Upcoming") {
      // Upcoming trips: trips with a date greater than or equal to today
      filter.trip = { date: { gte: now } };
      filter.status = "Pending"; // Optional: Ensure only pending trips are shown
    } else if (status === "Past") {
      // Past trips: trips with a date less than today (already taken)
      filter.trip = { date: { lt: now } };
      filter.status = "Completed"; // Optional: Ensure only completed trips are shown
    } else if (status === "Cancelled") {
      // Cancelled trips
      filter.status = "Cancelled";
    }

    // Fetch bookings with applied filters
    const bookings = await prisma.booking.findMany({
      where: filter,
      include: {
        trip: {
          include: {
            route: {
              include: {
                startCity: true,
                endCity: true,
              },
            },
            bus: true,
            driver: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings", error: error.message },
      { status: 500 }
    );
  }
}
